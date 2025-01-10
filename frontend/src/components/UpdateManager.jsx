import React, { useEffect, useState } from 'react'
import API from '../services/api';
import Select from "react-select";

function UpdateManager({selectedManagerData,onClose,onManagerUpdate}) {

  console.log(selectedManagerData)
  const [manager, setManager] = useState(null);
    const [userName, setUserName] = useState("");
  const [state, setState] = useState("Tamil_Nadu");
  const [branchOptions, setBranchOptions] = useState([]); // Branches fetched from API
  const [employeeOptions, setEmployeeOptions] = useState([]); // Employees fetched from API
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  useEffect(() => {
    const fetchManagerDetails = async () => {
      try {
        
        const res = await API.get(`/api/managers/selectedManager/${selectedManagerData._id}`);
        console.log(res.data)
        const managerData = res.data;
       
        setManager(managerData)
        console.log(managerData)
        setUserName(managerData.user.name);
        setState(managerData.state);

        // Set pre-selected branches
        const preSelectedBranches =await managerData.branches.map((branch) => ({
          value: branch.branchName,
          label: branch.branchName,
        }));
        
        setSelectedBranches(preSelectedBranches);
        console.log(preSelectedBranches)
        console.log(selectedBranches)
        fetchBranchesByState(managerData.state, preSelectedBranches);
      } catch (error) {
        console.error("Error fetching manager details:", error);
      }

    };
    fetchManagerDetails();
  }, [selectedManagerData._id]);

  useEffect(() => {
    if (selectedBranches.length > 0 && manager) {
      fetchEmployeesByBranches(selectedBranches); // Fetch employees when branches and manager are set
    }
  }, [selectedBranches, manager]); // Trigger this effect when selectedBranches or manager changes
  
 
   
        const fetchBranchesByState = async (selectedState, preSelectedBranches = []) => {
          try {
            // Fetch branches
            console.log("mved")
            const res = await API.get("api/branches/statewise", {
              params: { state:selectedState },
            });
            // console.log(res.data)
            const branchData = res.data.map((branch) => ({
              value: branch.branchName, // Use branch name
              label: branch.branchName,
            }));
            console.log(preSelectedBranches);
            setBranchOptions(branchData);
            // setSelectedBranches([]); // Reset selected branches
            // setEmployeeOptions([]); // Reset employees
            console.log(branchData)
            if (preSelectedBranches.length > 0) {
                fetchEmployeesByBranches(preSelectedBranches);
              }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
        
    
   
        const fetchEmployeesByBranches = async (branches) => {
            
          try {
            // console.log(selectedBranches)
            // console.log(branches)
            // if (selectedBranches.length === 0) {
            //   setEmployeeOptions([]);
            //   return;
            // }
            console.log(branches)
            const branchNames = branches.map((branch) => branch.value);
            console.log(branchNames)
            const res = await API.post("/api/managers/emplyessByBranches", {
              branchNames
            });
            console.log(res.data);
            const employeeData = res.data.map((emp) => ({
              value: emp.name,
              label: emp.name,
            }));
            console.log(employeeData)
            setEmployeeOptions(employeeData);
            console.log(manager)
            const managerEmployeeNames = manager.employees.map((employee)=>employee.name)
             // Pre-select employees if they exist
       const preSelectedEmployees = employeeData.filter((emp) =>
        managerEmployeeNames.includes(emp.value)
      );
      console.log(preSelectedEmployees)
    setSelectedEmployees(preSelectedEmployees);
   
          } catch (error) {
            console.error("Error fetching employees:", error);
          }
        };
    
      const handleUpdate =async (e)=>{
        e.preventDefault()
        try {
          const formData = {
            userName:selectedManagerData.user.name,
            state:selectedManagerData.state,
            branchNames: selectedBranches.map((branch) => branch.value),
            employeeNames: selectedEmployees.map((emp) => emp.value),
          };
    console.log(formData)
    console.log(manager._id)
          const res = await API.put(`/api/managers/updateManager/${manager._id}`, formData);
          console.log("Manager updated:", res.data);
          onManagerUpdate(res.data);
          onClose();
        } catch (error) {
          console.error("Error updating manager:", error);
        }
      }
      const handleCancel = ()=>{
        onClose()
      }
    
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center min-h-screen ">
      <div className="bg-white p-6 rounded shadow-lg text-center max-w-2xl w-full">
        <h2 className="text-lg font-bold mb-4">Update User</h2>
        <div className="flex justify-center gap-4">
          <form className="flex flex-col">
            <div className="flex gap-4">
              <div className="mb-4 ">
                <label className=" text-sm font-medium text-gray-700 mb-2 items-start flex">
                  Manager Name :
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter Manager name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-4 ">
                <label className=" text-sm font-medium text-gray-700 mb-2 items-start flex">
                  State :
                </label>
                <select
                  type="text"
                  value={state}
                  
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Tamil_Nadu">Tamil_Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mb-4 ">
                <label className=" text-sm font-medium text-gray-700 mb-2 items-start flex">
                  Branches :
                </label>
                <Select
                 
                  options={branchOptions}
                  isMulti
                  value={selectedBranches}
                  
                  onChange={setSelectedBranches}
                  placeholder="Select Branches"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-4 ">
                <label className=" text-sm font-medium text-gray-700 mb-2 items-start flex">
                  Employees :
                </label>
                <Select
                  options={employeeOptions}
                  value={selectedEmployees}
                  isMulti
                  onChange={setSelectedEmployees}
                  placeholder='Select Employees..'
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />               
              </div>
            </div>
            <div className="flex w-full justify-center gap-6">
            <button
              type="submit"
              onClick={handleUpdate}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
            >
              Update
            </button>
            <button
            
              onClick={handleCancel}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            </div>
          </form>
        </div>
    </div>
    </div>
  )
}

export default UpdateManager
