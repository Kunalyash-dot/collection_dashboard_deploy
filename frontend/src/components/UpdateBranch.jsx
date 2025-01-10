import React, { useState } from 'react'
import API from '../services/api';

function UpdateBranch({branch,onClose,onBranchUpdate}) {
    const [formData, setFormData] = useState({
        state: branch.state,
        branchName: branch.branchName ,
      });
console.log(formData)
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        })); }

        const handleUpdateBranch =async (e)=>{
            e.preventDefault();
            try {
                await API.put(`/api/branches/${branch._id}`,formData);
                onClose();
                if(onBranchUpdate){
                  onBranchUpdate({...branch,...formData})
                }

            } catch (error) {
                console.log(error)
            }
        }
        const handleCancel = ()=>{
            onClose()
        }

  return (

    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded shadow-lg text-center">
      <h2 className="text-lg font-bold mb-4">Update Branch </h2>
      <div className="flex gap-4">
        <div className="mb-4 ">
          <label
            htmlFor="name"
            className=" text-sm font-medium text-gray-700 mb-2 items-start flex"
          >
            State :
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Enter name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="branchName"
            className=" text-sm font-medium text-gray-700 mb-2 items-start flex"
          >
            Branch :
          </label>
          <input
            type="text"
            id="branchName"
            name="branchName"
            value={formData.branchName}
            onChange={handleChange}
            placeholder="Enter mobile"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <button
          onClick={handleUpdateBranch}
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
    </div>
  </div>
  )
}

export default UpdateBranch
