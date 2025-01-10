import React from "react";
import Navbar from "../components/Navbar";
import CreationSidebar from "../components/CreationSidebar";
import CustomerBulkUpload from "../components/CustomerBulkUpload";
import DownloadCustomer from "../components/DownloadCustomer";
import BulkUpdateCustomer from "../components/BulkUpdateCustomer";
import DownloadCreateCustomerFormat from "../components/DownloadCreateCustomerFormat";
import Details from "../components/Details";
import BulkDeleteCustomer from "../components/BulkDeleteCustomer";

function BulkUpload() {
  return (
    <div className="flex flex-col h-screen ">
      <div className="fixed top-0 left-0 right-0 z-10 ">
        <Navbar />
      </div>

      <div className="flex flow-row  m-1 pt-[75px]">
        {/* sidebar */}
        <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4  bg-gray-400 fixed h-full rounded-lg">
          <CreationSidebar />
        </div>
        {/* content  */}

        <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] ml-[14.5%] md:ml-[8.5%] lg:ml-[16.5%] xl:ml-[14.5%] bg-[#F7F8FA]  flex flex-col rounded-lg p-4 ">
          <h1 className=" text-2xl font-semibold m-auto">Customer Creation</h1>
          <div className="m-4">
            <DownloadCreateCustomerFormat />
            <hr className="mt-5 bg-black  border-dashed" />
          </div>
          <div className="m-4">
            <h2 className="text-2xl font-semibold">Create Bulk Customer</h2>
            <CustomerBulkUpload />
            <hr className="mt-5 bg-black  border-dashed" />
          </div>
          <div className="m-4">
            <DownloadCustomer />
            <hr className="mt-5 bg-black  border-dashed" />
          </div>
          <div className="m-4">
            <h2 className="text-2xl font-semibold">Update Bulk Customer</h2>
            <BulkUpdateCustomer />
            <hr className="mt-5 bg-black  border-dashed" />
          </div>
          <div className="m-4">
            <h2 className="text-2xl font-semibold">Delete Bulk Customer</h2>
            <BulkDeleteCustomer />
            <hr className="mt-5 bg-black  border-dashed" />
          </div>
          <div className="m-4">
            
            <Details />
            <hr className="mt-5 bg-black  border-dashed" />
          </div>

        </div>
      </div>
    </div>
  );
}

export default BulkUpload;
