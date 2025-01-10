import React, { useEffect, useState } from 'react'
import API from '../services/api';

function CreateDetails({onClose}) {
    const [formData,setFormData] = useState({
        updateDate: "",
        description: "",
      })
      const handleChange = (e)=>{
        const { name, value } = e.target;
        setFormData({...formData,[name]:value})
        console.log(formData)
      }
    
      const handleCreate = (e)=>{
        e.preventDefault();
    
        try {
          const res=API.post('/api/details/createDetails',formData)
          console.log(res);
          onClose()
          
        } catch (error) {
          console.log(error)
        }
      }
      const handleCancel = ()=>{
        onClose()
      }
    
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center min-h-screen ">
    <div className="bg-white p-6 rounded-2xl shadow-lg text-center max-w-lg w-full">
      <h2 className="text-lg font-bold mb-4">Create Details</h2>
      <div className="flex justify-center gap-4">
        <form className="flex flex-col">
          <div className="flex gap-4">
            <div className="mb-4 ">
              <label
                htmlFor="name"
                className=" text-sm font-medium text-gray-700 mb-2 items-start flex"
              >
                Date :
              </label>
              <input
                type="text"
                id="updateDate"
                name="updateDate"
                value={formData.updateDate}
                onChange={handleChange}
                placeholder="Enter date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
               
                className=" text-sm font-medium text-gray-700 mb-2 items-start flex"
                
              >
                Description :
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
         
           
     
          <div className="flex w-full justify-center gap-6">
          <button
            type="submit"
            onClick={handleCreate}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500"
          >
            Create
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
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

export default CreateDetails
