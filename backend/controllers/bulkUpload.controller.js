import xlsx from "xlsx";
import Customer from "../models/customer.model.js";
import Branch from "../models/branch.model.js";
import User from "../models/user.model.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let uploadProgress = 0; // Global variable to track progress

export const uploadCustomer = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Parse the uploaded Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const customers = [];
    uploadProgress = 0; // Reset progress
    for (let i = 0; i < sheetData.length; i++) {
      const row = sheetData[i];
      // console.log(row)
      const branch = await Branch.findOne({ branchName: row["Branch"] });
      const employee = await User.findOne({
        name: row["Employee"],
        role: "Employee",
      });
      if (!branch) {
        console.log(`Branch "${row["Branch"]}" not found.Skipping the row`);
        continue;
      }
      if (!employee) {
        console.log(
          `Employee "${row["Employee"]}" not found. Skipping the row`
        );
        continue;
      }
      const newCustomer = {
        name: row["Name"],
        mobileNumber: row["Mobile"],
        accountNumber: row["Account Number"],
        loanAmount: row["Loan Amount"],
        emiAmount: row["EMI Amount"],
        tenure: row["Tenure"],
        address: row["Address"],
        pincode: row["Pincode"],
        state: row["State"],
        dbDate: row["DB Date"],
        collectionCount: row["Collection Count"],
        balanceOutstanding: row["Balance Outstanding"],
        rpaBalance: row["RPA Balance"],
        bucket: row["Bucket"],
        noOfDays: row["No Of Days"],
        parStatus: row["Par Status"],
        totalDue: row["Total Due"],
        collectionStatus: row["Collection Status"],
        finalStatus: row["Final Status"],
        collectedAmount: row["Collected Amount"],
        yetToCollect: row["Yet To Collect"],
        nachPresentation: row["NACH Presentation"],
        nachPresentationStatus: row["NACH Presentation Status"],
        parCollectionStatus:row["PAR Collection Status"],
        latitude:row["Latitude"],
        longitude:row["Longitude"],
        branch: branch._id, // You need to resolve branch ID here
        employee: employee._id, // Resolve employee ID
      };
      customers.push(newCustomer);
       // Update progress
       uploadProgress = ((i + 1) / sheetData.length) * 100;
    }
    const validRecords = [];
    const duplicateRecords = [];
    // console.log(customers)

    for (const record of customers) {
      // console.log(record)
      const existingCustomer = await Customer.findOne({
        accountNumber: record.accountNumber,
      });
      // console.log(existingCustomer);
      if (existingCustomer) {
        duplicateRecords.push({
          ...record,
          error: `Duplicate CBS number: ${record.accountNumber}`,
        });
      } else {
        validRecords.push(record);
      }
    }
    // Insert data into the database
    if (validRecords.length > 0) {
      await Customer.insertMany(validRecords);
      uploadProgress = 100; // Set to 100% when complete
    }

    const resultFilePath = path.join(
      __dirname,
      "../uploads",
      `uploads_result_${Date.now()}.xlsx`
    );
    const resultData = [
      ...validRecords.map((record) => ({
        ...record,
        status: "Uploaded Successfully ",
      })),
      ...duplicateRecords,
    ];

    const resultSheet = xlsx.utils.json_to_sheet(resultData);
    const resultWorkbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(resultWorkbook, resultSheet, "Result");
    xlsx.writeFile(resultWorkbook, resultFilePath);

    res.status(200).json({
      message: "Bulk upload completed",
      validRecordsCount: validRecords.length,
      duplicateRecordsCount: duplicateRecords.length,
      resultFilePath,
    });
  } catch (error) {
    console.error("Error during bulk upload:", error);
    res.status(500).json({ error });
  } finally {
    // Clean up uploaded file
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
};

export const getProgress = (req, res) => {
  res.status(200).json({ progress: uploadProgress });
};

export const exportCustomers = async (req, res) => {
  try {
    //Fetch customer data
    const customers = await Customer.find()
      .populate("branch", "branchName")
      .populate("employee", "name")
      .lean();
    // console.log(customers)
    const formattedData = customers.map((customer) => ({
      Id: customer._id.toString(),

      State: customer.state,
      Branch: customer.branch?.branchName || "N/A",
      Account_Number: customer.accountNumber,
      Name: customer.name,
      DB_Date: customer.dbDate,
      Mobile: customer.mobileNumber,
      Employee: customer.employee?.name || "N/A",
      Loan_Amount: customer.loanAmount,
      Tenure: customer.tenure,
      NACH_Presentation: customer.nachPresentation,
      NACH_Presentation_Status: customer.nachPresentationStatus,
      Collection_Count: customer.collectionCount,
      Balance_Outstanding: customer.balanceOutstanding,
      RPA_Balance: customer.rpaBalance,
      Bucket: customer.bucket,
      NO_OF_Days: customer.noOfDays,
      Par_Status: customer.parStatus,
      EMI_Amount: customer.emiAmount,
      Total_Due: customer.totalDue,
      Collection_Status: customer.collectionStatus,
      Final_Status: customer.finalStatus,
      Collected_Amount: customer.collectedAmount,
      Yet_To_Collect: customer.yetToCollect,
      PAR_Collection_Status:customer.parCollectionStatus,
      Address: customer.address,
      Pincode: customer.pincode,
      Latitude: customer.latitude,
      Longitude :customer.longitude
    }));

    // Convert data to Excel format
    const customerSheet = xlsx.utils.json_to_sheet(formattedData);
    const customerWorkbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(customerWorkbook, customerSheet, "Customers");

    // save the excel file

    const filePath = path.join(
      __dirname,
      "../uploads",
      `customer_data_${Date.now()}.xlsx`
    );
    xlsx.writeFile(customerWorkbook, filePath);

    res.download(filePath, "customer_data.xlsx", (err) => {
      if (err) {
        console.error("File download error:", err);
        res.status(500).send("Error downloading file");
      }
    });
  } catch (error) {
    console.error("Error exporting customer data:", error);
    res.status(500).json({ error: "Error exporting customer data" });
  }
};

  let updateProgress = 0;
  export const bulkUpdateCustomers = async (req, res) => {
    try {
      console.log("working")
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      // Parse the uploaded Excel file
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      const updateResults = [];
      const totalRecords = sheetData.length;
      let completed = 0; // Counter for completed updates
      updateProgress = 0; // Reset progress


      await Promise.all(
        sheetData.map(async (record) => {
          const { id, ...updateData } = record;
          if (!id) {
            updateResults.push({ ...record, error: "ID is required for update" });
            completed++;
            updateProgress = (completed / totalRecords) * 100;
            return;
          }
        

          const customer = await Customer.findById(id);
          if (!customer) {
            updateResults.push({
              ...record,
              error: `Customer with ID ${id} not found`,
            });
            completed++;
            updateProgress = (completed / totalRecords) * 100;
            return;
          }
          // Merge update data into the customer object
          Object.assign(customer, updateData);
          
          // Save the updated customer
          await customer.save();
          completed++;
          updateProgress = (completed / totalRecords) * 100;
          
          updateResults.push({ ...record, status: "Updated successfully" });
          // Update progress
          
        })
      );
      const resultFilePath = path.join(
        __dirname,
        "../uploads",
        `update_result_${Date.now()}.xlsx`
      );

      const resultSheet = xlsx.utils.json_to_sheet(updateResults);
      const resultWorkbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(resultWorkbook, resultSheet, "Results");
      xlsx.writeFile(resultWorkbook, resultFilePath);
      res.status(200).json({ message: "Bulk upload completed", resultFilePath });
    } catch (error) {
      console.error("Bulk update error:", error);
      res.status(500).json({ error: "Bulk update failed" });
    }
  };

export const getUpdateProgress = (req, res) => {
  res.status(200).json({ progress: updateProgress });
};

let deleteProgress = 0;

export const bulkDeleteCustomers = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Parse the uploaded Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const deleteResults = [];
    const totalRecords = sheetData.length;
    let completed = 0;
   deleteProgress = 0;

    await Promise.all(
      sheetData.map(async (record) => {
        const { id } = record; // Assuming the ID column is named 'id'

        if (!id) {
          deleteResults.push({ ...record, error: "ID is required for deletion" });
          completed++;
          deleteProgress = (completed / totalRecords) * 100;
          return;
        }

        const customer = await Customer.findById(id);

        if (!customer) {
          deleteResults.push({
            ...record,
            error: `Customer with ID ${id} not found`,
          });
          completed++;
          deleteProgress = (completed / totalRecords) * 100;
          return;
        }

        // Delete the customer
        await Customer.findByIdAndDelete(id);

        completed++;
        deleteProgress = (completed / totalRecords) * 100;

        deleteResults.push({ id, status: "Deleted successfully" });
      })
    );

    // Save results to a file
    const resultFilePath = path.join(
      __dirname,
      "../uploads",
      `delete_results_${Date.now()}.xlsx`
    );

    const resultSheet = xlsx.utils.json_to_sheet(deleteResults);
    const resultWorkbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(resultWorkbook, resultSheet, "Results");
    xlsx.writeFile(resultWorkbook, resultFilePath);

    res.status(200).json({
      message: "Bulk delete completed",
      resultFilePath,
      
    });
  } catch (error) {
    console.error("Bulk delete error:", error);
    res.status(500).json({ error: "Bulk delete failed" });
  }
};

export const getDeleteProgress = (req, res) => {
  res.status(200).json({ progress: deleteProgress });
};

export const downloadSampleCustomerFile = async (req, res) => {
  try {
    // Fetch branches and employees dynamically
    const branchesByState = {};
    const employeesByBranch = {};

    const allBranches = await Branch.find();
    const allEmployees = await User.find({ role: "Employee" });

    // Organize branches by state
    for (const branch of allBranches) {
      if (!branchesByState[branch.state]) {
        branchesByState[branch.state] = [];
      }
      branchesByState[branch.state].push(branch.branchName);
    }

    // Organize employees by branch
    for (const employee of allEmployees) {
      if (!employeesByBranch[employee.branchName]) {
        employeesByBranch[employee.branchName] = [];
      }
      employeesByBranch[employee.branchName].push(employee.name);
    }

    // Define the sample data structure
    const sampleData = [
      {
        State: "",
        Branch: "",
        Employee: "",
        "Account Number": "",
        Name: "",
        "DB Date": "",
        Mobile: "",
        "Loan Amount": "",
        Tenure: "",

        "NACH Presentation": "",
        "NACH Presentation Status": "",
        "Collection Count": "",
        "Balance Outstanding": "",
        "RPA Balance": "",
        Bucket: "",
        "No Of Days": "",
        "Par Status": "",
        "PAR Collection Status":"",
        "EMI Amount": "",
        "Total Due": "",
        "Collection Status": "",
        "Final Status": "",
        "Collected Amount": "",
        "Yet To Collect": "",

        Address: "",
        Pincode: "",
        Latitude:"",
        Longitude:""
      },
    ];

    // Create workbook
    const workbook = xlsx.utils.book_new();

    // Create main worksheet
    const worksheet = xlsx.utils.json_to_sheet(sampleData);

    // Add predefined lists for dropdowns in a separate sheet
    const dropdownData = [
      ["State", "Branch", "Employee"],
      ...Object.entries(branchesByState).flatMap(([state, branches]) =>
        branches.map((branch) => [
          state,
          branch,
          ...(employeesByBranch[branch] || []),
        ])
      ),
    ];
    const dropdownSheet = xlsx.utils.aoa_to_sheet(dropdownData);

    // Add worksheets to workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sample");
    xlsx.utils.book_append_sheet(workbook, dropdownSheet, "Dropdowns");

    // Generate file path and save the file
    const filePath = path.join(
      __dirname,
      "../uploads",
      "Sample_Customer_Upload.xlsx"
    );
    xlsx.writeFile(workbook, filePath);

    // Send the file as response
    res.download(filePath, "Sample_Customer_Upload.xlsx", (err) => {
      if (err) {
        console.error("Error sending the file:", err);
        res.status(500).send("Could not download the file.");
      } else {
        // Clean up the generated file after sending
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });
  } catch (error) {
    console.error("Error generating sample file:", error);
    res.status(500).json({ error: "Error generating sample file" });
  }
};
