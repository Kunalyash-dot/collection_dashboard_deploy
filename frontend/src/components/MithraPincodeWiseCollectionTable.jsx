import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useSelector } from "react-redux";

function MithraPincodeWiseCollectionTable() {
    // const [data, setData] = useState([]);
    const [branches, setBranches] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [pincodeData, setPincodeData] = useState([]);
   
    const {currentUser}=useSelector((state)=>state.user);
    // const [tableData, setTableData] = useState([]);
    // Fetch available branches only once on initial load
    console.log(currentUser.role)
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        let fetchedBranches = [];

        if (currentUser.role === "StateHead") {
          const response = await API.get('/api/branches/');
          fetchedBranches = response.data.filter(
            (branch) => branch.state === currentUser.state
          );
        } else if (currentUser.role === "Manager") {
          try {
            // console.log("running")
            const response = await API.get(`/api/managers/managerData/${currentUser._id}`);
          console.log(response);
           // Map the manager's branches to a consistent format
        fetchedBranches = response.data.branches.map(branch => ({
          id: branch._id,
          branchName: branch.branchName,
        }));
          } catch (error) {
            console.log(error)
          }
          
        } else if (currentUser.role === "Admin") {
          const response = await API.get('/api/branches/');
          fetchedBranches = response.data;
        }
  
        setBranches(fetchedBranches); // Update state with fetched branches
      } catch (error) {
        console.error('Error fetching branches', error);
      }
    };
    fetchBranches();
  }, [currentUser]); 

// console.log(branches);
 // Fetch employees based on selected branch, runs only when selectedBranch changes
 useEffect(() => {
    if (selectedBranch) {
      const fetchEmployees = async () => {
        try {
          const response = await API.get(`/api/users/branch`,{
            params: {branchName: selectedBranch },
          }); // Adjust your API endpoint accordingly
          setEmployees(response.data);
        console.log(response.data)
        } catch (error) {
          console.error('Error fetching employees', error);
        }
      };
      fetchEmployees();
    } else {
      setEmployees([]); // Reset employees when branch is unselected
    }
  }, [selectedBranch]);

  useEffect(() => {
    // Fetch data from the backend
    if (selectedBranch && selectedEmployee) {
    const fetchData = async () => {
      try {
        const response = await API.get("/api/charts/mithra-pincode-wise-collection-data",{
            params: { branchName: selectedBranch, employeeName: selectedEmployee }});
        console.log(response.data)
        const dataObject = response.data;

          // Normalize nested data into an array
          const dataArray = [];
          for (const branch in dataObject) {
            for (const employee in dataObject[branch]) {
              for (const pincode in dataObject[branch][employee]) {
                dataArray.push({
                  branch,
                  employee,
                  pincode,
                  ...dataObject[branch][employee][pincode],
                });
              }
            }
          }

          setPincodeData(dataArray);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
}else{
    setPincodeData([]);
}
  }, [selectedBranch, selectedEmployee]);

// console.log(setPincodeData);
  const handleBranchChange = (branch) => {
    setSelectedBranch(branch);
    setSelectedEmployee("");
    // console.log(selectedBranch)
   
    // const branchData = data.find((item) => item.branch === branch);
    // setEmployees(branchData ? branchData.employees : []);
    // setTableData([]);
  };

  const handleEmployeeChange = (employeeName) => {
    setSelectedEmployee(employeeName);
  
  };

 
  return (
    <div className="mt-4">
    
    <div className="flex  gap-4 justify-center md:justify-normal">
    <div className="mb-4 flex flex-col md:flex-row gap-2 justify-center  md:justify-normal">
      <label className=" font-bold flex items-center ">
        Branch:
        </label>
        <select
          value={selectedBranch}
           className="border px-3 py-2 w-max"
          onChange={(e) => handleBranchChange(e.target.value)}
        >
          <option value="">Select Branch</option>
          {branches.map((branch,index) => (
            <option key={index} value={branch.branchName}>
              {branch.branchName}
            </option>
          ))}
        </select>
      
    </div>
    <div className="mb-4 flex flex-col md:flex-row gap-2 justify-center md:justify-normal">
      <label className=" font-bold flex items-center ">
        Employee:
        </label>
        <select
          value={selectedEmployee}
          className="border px-3 py-2 w-max"
          onChange={(e) => handleEmployeeChange(e.target.value)}
          disabled={!selectedBranch}
        >
          <option value="">Select Employee</option>
          {employees.map((emp,index) => (
            <option key={index} value={emp.name} >
              {emp.name}
            </option>
          ))}
        </select>
     
    </div>
    </div>
  {/* Data Table */}
  <div className='overflow-auto'>
  {pincodeData && pincodeData.length > 0 && (
        <table className="table-auto table-dark-border w-max  border-collapse">
          <thead>
            <tr className="text-left">
              <th className="border px-2 py-2 bg-green-300">Branch</th>
              <th className="border px-2 py-2 bg-green-300">Employee</th>
              <th className="border px-2 py-2 bg-green-300">Pincode</th>
              <th className="border px-2 py-2 bg-green-300">Collected</th>
              <th className="border px-2 py-2 bg-green-300">Not Collected</th>
              <th className="border px-2 py-2 bg-green-300">Total</th>
            </tr>
          </thead>
          <tbody>
            {pincodeData.map((row, index) => (
              <tr key={index} className="text-sm">
                <td className="border px-2 py-2 font-bold">{selectedBranch}</td>
                <td className="border px-2 py-2 font-bold">{selectedEmployee}</td>
                <td className="border px-2 py-2 font-bold">{row.pincode}</td>
                <td className="border px-2 py-2 font-bold">{row.collected}</td>
                <td className="border px-2 py-2 font-bold">{row.notCollected}</td>
                <td className="border px-2 py-2 font-bold">{row.collected + row.notCollected}</td>
              </tr>
            ))}{/* Total Row */}
            <tr>
              <td colSpan="3" className="border px-2 py-2 font-bold bg-green-300">
                Total
              </td>
              <td className="border px-2 py-2 font-bold bg-green-300 text-center">
                {pincodeData.reduce((sum, row) => sum + row.collected, 0)}
              </td>
              <td className="border px-2 py-2 font-bold bg-green-300 text-center">
                {pincodeData.reduce((sum, row) => sum + row.notCollected, 0)}
              </td>
              <td className="border px-2 py-2 font-bold bg-green-300 text-center">
                {pincodeData.reduce(
                  (sum, row) => sum + (row.collected + row.notCollected),
                  0
                )}
              </td>
            </tr>
          </tbody>
        </table>
        
      )}
      </div>
  </div>
  );
}

export default MithraPincodeWiseCollectionTable;
