import { useState, useEffect } from "react";
import API from "../services/api";
import Select from "react-select";

function CreateManager({ onClose }) {
  const [userName, setUserName] = useState("");
  const [state, setState] = useState("Tamil_Nadu");
  const [branchOptions, setBranchOptions] = useState([]); // Branches fetched from API
  const [employeeOptions, setEmployeeOptions] = useState([]); // Employees fetched from API
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  useEffect(() => {
    const fetchBranchesByState = async () => {
      try {
        // Fetch branches
        const res = await API.get("api/branches/statewise", {
          params: { state },
        });
        // console.log(res.data)
        const branchData = res.data.map((branch) => ({
          value: branch.branchName, // Use branch name
          label: branch.branchName,
        }));
        console.log(branchData);
        setBranchOptions(branchData);
        setSelectedBranches([]); // Reset selected branches
        setEmployeeOptions([]); // Reset employees
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchBranchesByState();
  }, [state]);

  useEffect(() => {
    const fetchEmployeesByBranches = async () => {
      try {
        if (selectedBranches.length === 0) {
          setEmployeeOptions([]);
          return;
        }
        // console.log(selectedBranches)
        const branchNames = selectedBranches.map((branch) => branch.value);
        console.log(branchNames)
        const res = await API.post("/api/managers/emplyessByBranches", {
          branchNames
        });
        console.log(res);
        const employeeData = res.data.map((emp) => ({
          value: emp.name,
          label: emp.name,
        }));
        setEmployeeOptions(employeeData);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployeesByBranches();
  }, [selectedBranches]);


  console.log(selectedEmployees)

  const handleCreate = async (e) => {
    e.preventDefault();

    const formData = {
      userName,
      state,
      branchNames: selectedBranches.map((b) => b.value),
      employeeNames: selectedEmployees.map((e) => e.value),
    };
    try {
      const res = API.post("/api/managers/create", formData);
      console.log(res.data);
      onClose();
    } catch (error) {
      console.log(error);
    } 
  };
  const handleCancel = () => {
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center min-h-screen ">
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center max-w-lg w-full">
        <h2 className="text-lg font-bold mb-4">Create Manager</h2>
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
                  onChange={(e) => setState(e.target.value)}
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
              onClick={handleCreate}
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
  );
}

export default CreateManager;
