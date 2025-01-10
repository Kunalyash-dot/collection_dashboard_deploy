import React from 'react'
import { AiFillCloseSquare } from "react-icons/ai";

function ViewCustomer({selectedCustomerData,onClose}) {
    console.log(selectedCustomerData)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center  min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-lg w-full mt-16 overflow-auto max-h-[80vh] relative ">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black focus:outline-none"
          aria-label="Close"
        >
          <AiFillCloseSquare className='w-8 h-8 text-red-900' />
        </button>
      <h2 className='bg-green-300 w-36 border rounded-lg font-semibold  m-auto'>Customer Data</h2>
      <div className='flex flex-col items-start'>
        <h3 className='font-semibold'>State : <span className='font-normal'>{selectedCustomerData.state}</span></h3>
        <h3 className='font-semibold'>Branch : <span className='font-normal'>{selectedCustomerData.branch.branchName}</span></h3>
        <h3 className='font-semibold'>CBS Number  : <span className='font-normal'>{selectedCustomerData.accountNumber}</span></h3>
        <h3 className='font-semibold'>Name  : <span className='font-normal'>{selectedCustomerData.name}</span></h3>
        <h3 className='font-semibold'>DB Date  : <span className='font-normal'>{selectedCustomerData.dbDate}</span></h3>
        <h3 className='font-semibold'>Mobile Number  : <span className='font-normal'>{selectedCustomerData.mobileNumber}</span></h3>
        <h3 className='font-semibold'>Mithra Name  : <span className='font-normal'>{selectedCustomerData.employee.name}</span></h3>
        <h3 className='font-semibold'>Loan Amount  : <span className='font-normal'>{selectedCustomerData.loanAmount}</span></h3>
        <h3 className='font-semibold'>Tenure  : <span className='font-normal'>{selectedCustomerData.tenure}</span></h3>
        <h3 className='font-semibold'>Nach Presentation  : <span className='font-normal'>{selectedCustomerData.nachPresentation}</span></h3>
        <h3 className='font-semibold'>Nach Presentation Status  : <span className='font-normal'>{selectedCustomerData.nachPresentationStatus}</span></h3>
        <h3 className='font-semibold'>PAR Status  : <span className='font-normal'>{selectedCustomerData.parStatus}</span></h3>
        <h3 className='font-semibold'>Bucket  : <span className='font-normal'>{selectedCustomerData.bucket}</span></h3>
        <h3 className='font-semibold'>Balance Outstanding  : <span className='font-normal'>{selectedCustomerData.balanceOutstanding}</span></h3>
        <h3 className='font-semibold'>RPA Balance : <span className='font-normal'>{selectedCustomerData.rpaBalance}</span></h3>
        <h3 className='font-semibold'>Collection Status : <span className='font-normal'>{selectedCustomerData.collectionStatus}</span></h3>

        <h3 className='font-semibold'>EMI Amount : <span className='font-normal'>{selectedCustomerData.emiAmount}</span></h3>
        <h3 className='font-semibold bg-yellow-300'>Total Due : <span className='font-normal'>{selectedCustomerData.totalDue}</span></h3>
        <h3 className='font-semibold bg-green-300'>Collected Amount : <span className='font-normal'>{selectedCustomerData.collectedAmount}</span></h3>
        <h3 className='font-semibold bg-red-300'>Yet To Collect : <span className='font-normal'>{selectedCustomerData.yetToCollect}</span></h3>
        <h3 className='font-semibold'>Address :</h3> <p className='font-normal text-left'>{selectedCustomerData.address}</p>
        <h3 className='font-semibold'>Pincode : <span className='font-normal'>{selectedCustomerData.pincode}</span></h3>
        

      </div>

    </div>
    </div>
  )
}

export default ViewCustomer
