import  { useEffect, useState } from "react";
import API from "../services/api";

function UpdateUser({ user, onClose,onUserUpdate }) {
  const [branches, setBranches] = useState([]);
console.log(user)
  useEffect(() => {
    fetchBranches(user.state);
  }, [user.state]);

  const [formData, setFormData] = useState({
    name: user.name,
    mobile: user.mobile,
    role: user.role,
    state: user.state,
    branch: user.branchName,
    password:user.password
  });

  const fetchBranches = async (state) => {
    try {
      const res = await API.get("api/branches/statewise", {
        params: { state },
      });
      console.log(res);
      setBranches(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdate =async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/users/${user._id}`,formData);
      // alert('User Updated Successfully!')
      onClose()
      if (onUserUpdate) {
        onUserUpdate({ ...user, ...formData });
      }
    } catch (error) {
      console.log(error)
    }


  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If state changes, fetch corresponding branches
    if (name === "state") {
      fetchBranches(value);
      setFormData((prev) => ({
        ...prev,
        branch: "", // Reset branch when state changes
      }));
    }
  };
  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center min-h-screen ">
      <div className="bg-white p-6 rounded shadow-lg text-center max-w-lg w-full">
        <h2 className="text-lg font-bold mb-4">Update User</h2>
        <div className="flex justify-center gap-4">
          <form className="flex flex-col">
            <div className="flex gap-4">
              <div className="mb-4 ">
                <label
                  htmlFor="name"
                  className=" text-sm font-medium text-gray-700 mb-2 items-start flex"
                >
                  Name :
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="mobile"
                  className=" text-sm font-medium text-gray-700 mb-2 items-start flex"
                >
                  Mobile Number :
                </label>
                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>


            <div className='flex gap-4 w-full'>
          <div className="mb-4 w-[50%]">
              <label
                htmlFor="role"
                className=" text-sm font-medium text-gray-700 mb-2 items-start flex"
              >
                Role :
              </label>
              <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="StateHead">StateHead</option>
                  <option value="Manager">Manager</option>
                  <option value="Employee">Employee</option>
                </select>
              
            </div>
            <div className="mb-4 ">
              <label
                htmlFor="password"
                className=" text-sm font-medium text-gray-700 mb-2 items-start flex"
              >
                Password :
              </label>
              <input
                type="text"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>



            <div className="flex gap-4 w-full">
              <div className="mb-4 w-[50%] ">
                <label
                  htmlFor="state"
                  className=" text-sm font-medium text-gray-700 mb-2 items-start flex"
                >
                  State :
                </label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select State</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil_Nadu">Tamil_Nadu</option>
                </select>
              </div>
              <div className="mb-4 w-[50%]">
                <label
                  htmlFor="branch"
                  className=" text-sm font-medium text-gray-700 mb-2 items-start flex"
                >
                  Branch :
                </label>
                <select
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch._id} value={branch.branchName}>
                      {branch.branchName}
                    </option>
                  ))}
                </select>
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
  );
}

export default UpdateUser;
