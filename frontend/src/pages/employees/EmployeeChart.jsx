import React from "react";
import ForMithraPincodeWiseCollectionChart from "../../components/ForMithraPincodeWiseCollectionChart";
import Navbar from "../../components/Navbar";
import ForMithraEmiWiseColeectionChart from "../../components/ForMithraEmiWiseColeectionChart";

function EmployeeChart() {
  return (
    <div className="flex flex-col h-screen p-3">
      <div className="fixed top-0 left-0 right-0 z-10 ">
        <Navbar />
      </div>
      {/* charts  */}
      <div className="m-1 pt-[75px] w-full flex flex-col gap-2 md:flex-row justify-between">
        <div className="md:w-[45%]">
          <div>
            <h2 className="flex justify-center bg-red-100 font-semibold text-xl">
              Mithra Pincode Wise Collection Data
            </h2>
          </div>
          <div className="overflow-auto flex md:justify-center ">
            <ForMithraPincodeWiseCollectionChart />
          </div>
        </div>
        <div className="md:w-[45%]">
          <div>
            <h2 className="flex justify-center bg-red-100 font-semibold text-xl">
              Mithra EMI Wise Collection Data
            </h2>
          </div>
          <div className="overflow-auto flex md:justify-center ">
            <ForMithraEmiWiseColeectionChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeChart;
