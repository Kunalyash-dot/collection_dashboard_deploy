
import Branch from "../models/branch.model.js";
import Customer from "../models/customer.model.js";
import Manager from "../models/manager.model.js";
import User from "../models/user.model.js";

export const createCustomer = async (req, res) => {
  try {
    const {
      customerName,
      mobileNumber,
      state,
      branchName,
      employeeName,
      accountNumber,
      loanAmount,
      emiAmount,
      tenure,
      address,
      pincode,
      dbDate,
      collectionCount,
      balanceOutstanding,
      rpaBalance,
      bucket,
      noOfDays,
      parStatus,
      totalDue,
      collectionStatus,
      finalStatus,
      collectedAmount,
      yetToCollect,
      nachPresentation,
      nachPresentationStatus,
    } = req.body;

    // console.log(req.body);
    const branchdata = await Branch.findOne({ branchName });
    // console.log(branchdata._id)
    // console.log(branchdata)
    if (!branchdata)
      return res.status(404).json({ error: "Branch user not found! " });

    const employee = await User.findOne({
      name: employeeName,
      role: "Employee",
    });
    if (!employee)
      return res.status(404).json({ error: "Employee user not found! " });
  
    const customer = new Customer({
      name: customerName,
      mobileNumber,
      state,
      branch: branchdata._id,
      employee: employee._id,
      accountNumber,
      loanAmount,
      emiAmount,
      tenure,
      address,
      pincode,
      dbDate,
      collectionCount,
      balanceOutstanding,
      rpaBalance,
      bucket,
      noOfDays,
      parStatus,
      totalDue,
      collectionStatus,
      finalStatus,
      collectedAmount,
      yetToCollect,
      nachPresentation,
      nachPresentationStatus,
    });
    // console.log(customer)
    const savedCustomer = await customer.save();
    res.status(200).json(savedCustomer);
  } catch (error) {
    console.log(error)
    if (error.code === 11000) {
      res.status(400).json({ error: `Loan Account Number already exists` });
    } else {
      res.status(500).json({ error: "Error creating Customer.", error });
    }
  }
};

export const employeeWiseCustomerData = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const customers = await Customer.find({ employee: employeeId });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching employee customer data" });
  }
};

export const managerWiseCustomerData = async (req, res) => {
  const { managerId } = req.params;
  try {
    const manager = await Manager.findById(managerId).populate(
      "employees",
      "_id"
    );
    console.log(`Manager : ${manager}`);
    if (!manager) {
      return res.status(400).json({ error: "Manager not found" });
    }
    const employeeIds = manager.employees.map((emp) => emp._id);
    console.log(`employeeIds : ${employeeIds}`);
    const customers = await Customer.find({ employee: { $in: employeeIds } });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching manager customer data" });
  }
};

export const stateWiseCustomerData = async (req, res) => {
  const { state } = req.params;
  try {
    const customers = await Customer.find({ state });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching state head customers." });
  }
};

export const fetchCustomer =async (req,res)=>{
  try {
   const { role, id } = req.user; // Extract user role and ID from the token
    let matchFilter = {}; // Initialize the match filter

    if (role === "StateHead") {
      // Restrict data to the user's state
      const user = await User.findById(id);
      if (!user || !user.state) {
        return res.status(403).json({ error: "State not assigned to user." });
      }
      matchFilter.state = user.state;
    } else if (role === "Manager") {
      // Restrict data to branches managed by the user
      const manager = await Manager.findOne({ user: id }).populate("branches");
      if (!manager || !manager.branches.length) {
        return res.status(403).json({ error: "No branches assigned to manager." });
      }
      const branchIds = manager.branches.map((branch) => branch._id);
      matchFilter.branch = { $in: branchIds };
    } else if (role === "Employee") {
      // Restrict data to the specific employee
      matchFilter.employee = id;
    } else if (role !== "Admin") {
      // Deny access if the role is not recognized
      return res.status(403).json({ error: "Access denied." });
    }

    // Fetch customers with filters and populate references
    const customers = await Customer.find(matchFilter)
      .populate("branch", "branchName")
      .populate("employee", "name");

    res.status(200).json(customers);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching customers data." });
  }
}

export const deleteCustomer =async (req,res)=>{
try {
  const customerId = req.params.id;
  await Customer.findByIdAndDelete(customerId);
  res.status(200).json({message:'Customer deleted successfully!'})
} catch (error) {
  res.status(500).json({error:'Error deleting Customer'}) 
}
}

export const updateCustomer = async (req,res)=>{
  const {
    customerName,
    mobileNumber,
    state,
    branchName,
    employeeName,
    accountNumber,
    loanAmount,
    emiAmount,
    tenure,
    address,
    pincode,
    dbDate,
    collectionCount,
    balanceOutstanding,
    rpaBalance,
    bucket,
    noOfDays,
    parStatus,
    totalDue,
    collectionStatus,
    finalStatus,
    collectedAmount,
    yetToCollect,
    nachPresentation,
    nachPresentationStatus,
  } = req.body;

  try {
    const customerId = req.params.customerId;
    console.log(customerId);
    const branchdata = await Branch.findOne({ branchName });
    // console.log(branchdata._id)
    // console.log(branchdata)
    if (!branchdata)
      return res.status(404).json({ error: "Branch user not found! " });

    const employee = await User.findOne({
      name: employeeName,
      role: "Employee",
    });
    if (!employee)
      return res.status(404).json({ error: "Employee user not found! " });
  
    const newChangedCustomer = {
      name: customerName,
      mobileNumber,
      state,
      branch: branchdata._id,
      employee: employee._id,
      accountNumber,
      loanAmount,
      emiAmount,
      tenure,
      address,
      pincode,
      dbDate,
      collectionCount,
      balanceOutstanding,
      rpaBalance,
      bucket,
      noOfDays,
      parStatus,
      totalDue,
      collectionStatus,
      finalStatus,
      collectedAmount,
      yetToCollect,
      nachPresentation,
      nachPresentationStatus,
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(customerId,newChangedCustomer,{new:true});
    res.status(200).json(updatedCustomer)

  } catch (error) {
    res.status(500).json({error:'Error updating Customer'})
  }

}