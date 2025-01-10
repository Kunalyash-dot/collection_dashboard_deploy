import React, { useEffect, useState } from 'react'
import API from '../services/api';

function UpdateCustomer({customer,onClose,onCustomerUpdate}) {
  const [branches,setBranches] = useState([]);
  const [employee,setEmployee] = useState([]);
  console.log(customer);
useEffect(() => {
    fetchBranches(customer.state);
    fetcheEmployee (customer.branch.branchName);
    console.log(customer.state)
  }, [customer.state,customer.branchName]);

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
  const fetcheEmployee = async(branch)=>{
    try {
      const res = await API.get(`api/users/branch?branchName=${branch}`,{
       
      });
      console.log(res.data)
      setEmployee(res.data);

    } catch (error) {
      console.log(error);
    }

  }
  const [formData,setFormData]= useState({
    customerName:customer.name,
      mobileNumber:customer.mobileNumber,
      state:customer.state,
      branchName:customer.branch.branchName,
      employeeName:customer.employee.name,
      accountNumber:customer.accountNumber,
      loanAmount:customer.loanAmount,
      emiAmount:customer.emiAmount,
      tenure:customer.tenure,
      address:customer.address,
      pincode:customer.pincode,
      dbDate:customer.dbDate,
      collectionCount:customer.collectionCount,
      balanceOutstanding:customer.balanceOutstanding,
      rpaBalance:customer.rpaBalance,
      bucket:customer.bucket,
      noOfDays:customer.noOfDays,
      parStatus:customer.parStatus,
      totalDue:customer.totalDue,
      collectionStatus:customer.collectionStatus,
      finalStatus:customer.finalStatus,
      collectedAmount:customer.collectedAmount,
      yetToCollect:customer.yetToCollect,
      nachPresentation:customer.nachPresentation,
      nachPresentationStatus:customer.nachPresentationStatus,

  })
// console.log(formData)
const handleCancel = ()=>{
 
  onClose();
}
const handleUpdate = async (e)=>{
  e.preventDefault();
  try {
    await API.put(`/api/customers/update/${customer._id}`,formData);
  onClose();
  if(onCustomerUpdate){
    onCustomerUpdate({...customer,...formData})
  }
  } catch (error) {
   console.log(error) 
  }
  
}
const handleChange = (e)=>{
  const {name,value} = e.target;
  setFormData((prev)=>({
    ...prev,[name]:value,
  }));

  if (name === "state") {
    fetchBranches(value);
    setFormData((prev) => ({
      ...prev,
      branchName: "", // Reset branch when state changes
    }));
  }

  if(name === 'branchName'){
    fetcheEmployee(value);
    setFormData((prev)=>({
      ...prev,
      employeeName:"",
    }))

  }

}
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center min-h-screen ">
      <div className="bg-white p-6 rounded shadow-lg text-center max-w-3xl w-full">
      <h2 className="text-lg font-bold mb-4">Update Customer</h2>
      <div className="flex justify-center gap-4">
        <form className="flex flex-col" >
          <div className="flex w-full gap-4">
          <div className="mb-4 w-1/3">
            <label  className=" text-sm font-medium 
            text-gray-700 mb-2 items-start flex">State</label>
            <select 
            id='state' name='state' value={formData.state} 
            onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">

<option value="">Select State</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil_Nadu">Tamil_Nadu</option>
            </select>
          </div>
          <div className="mb-4">
            <label  className=" text-sm font-medium text-gray-700 mb-2 items-start flex">Branch Name</label>
            <select id='branch' onChange={handleChange} name='branchName' value={formData.branchName} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch._id} value={branch.branchName}>
                      {branch.branchName}
                    </option>
                  ))}
            </select>
          </div>
          <div className="mb-4">
            <label  className=" text-sm font-medium text-gray-700 mb-2 items-start flex">Employee Name</label>
            <select id='employee' onChange={handleChange} name='employeeName' 
            value={formData.employeeName} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select Mithra</option>
              {employee.map((emp)=>(
                <option key={emp._id} value={emp.name}>{emp.name}</option>
              ))}
            </select>
          </div>
          
          </div>
          <div className='flex gap-4'>
          <div className="mb-4">
            <label  className=" text-sm font-medium text-gray-700 mb-2 items-start flex">CBS Number :</label>
            <input type='text' onChange={handleChange} name='accountNumber' id='accountNumber' value={formData.accountNumber} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div className="mb-4">
            <label  className=" text-sm font-medium text-gray-700 mb-2 items-start flex">Customer Name :</label>
            <input type='text' onChange={handleChange} name='customerName' value={formData.customerName} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div className="mb-4">
            <label  className=" text-sm font-medium text-gray-700 mb-2 items-start flex">Mobile Number :</label>
            <input type='text' onChange={handleChange} name='mobileNumber' value={formData.mobileNumber}  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          </div>
          <div className='flex gap-4'>
          <div className="mb-4">
            <label  className=" text-sm font-medium text-gray-700 mb-2 items-start flex">Collection Status :</label>
            <input type='text' onChange={handleChange} value={formData.collectionStatus} name='collectionStatus' className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div className="mb-4">
            <label  className=" text-sm font-medium text-gray-700 mb-2 items-start flex">Collected Amount :</label>
            <input type='text' onChange={handleChange} name='collectedAmount' value={formData.collectedAmount}  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div className="mb-4">
            <label  className=" text-sm font-medium text-gray-700 mb-2 items-start flex">Yet To Collect :</label>
            <input type='text' onChange={handleChange} name='yetToCollect' value={formData.yetToCollect}  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          </div>
          <div className='flex gap-4 w-full '>
          <div className="mb-4 w-2/3">
            <label  className=" text-sm font-medium text-gray-700 mb-2 items-start flex">Address :</label>
            <input type='text' onChange={handleChange} name='address' value={formData.address}  className=" w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div className="mb-4">
            <label  className=" text-sm font-medium text-gray-700 mb-2 items-start flex">Pincode :</label>
            <input type='text' onChange={handleChange} name='pincode' value={formData.pincode} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
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

export default UpdateCustomer
