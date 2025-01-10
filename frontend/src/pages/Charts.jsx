import React from 'react'
import Navbar from '../components/Navbar'
import CollectionSummaryChart from '../components/CollectionSummaryChart'
import BranchWiseCollectionChart from '../components/BranchWiseCollectionChart'
import BucketWiseCollectionChart from '../components/BucketWiseCollectionChart'
import NachWiseCollectionChart from '../components/NachWiseCollectionChart'
import BucketWiseNachChart from '../components/BucketWiseNachChart'
import CollectionEmiWiseChart from '../components/CollectionEmiWiseChart'
import NachEmiWiseChart from '../components/NachEmiWiseChart'
import ParBranchWiseChart from '../components/ParBranchWiseChart'
import ParBucketWiseChart from '../components/ParBucketWiseChart'
import MithraPincodeWiseCollectionTable from '../components/MithraPincodeWiseCollectionTable'
import MithraWiseCollectionTable from '../components/MithraWiseCollectionTable'

function Charts() {
  return (
    <div className="flex flex-col h-screen p-3">
    <div className="fixed top-0 left-0 right-0 z-10 ">
      <Navbar />
    </div>
    {/* charts  */}
    <div className='m-1 pt-[75px] w-full flex flex-col gap-2'>
    <div>
    <h2 className='flex justify-center bg-red-100 font-semibold text-xl'>Collection Summary</h2>
    <div className='overflow-auto '>
            <CollectionSummaryChart />
        </div>
    </div> 
        <div className='flex mt-6 w-full flex-col gap-4 md:flex-row justify-between'>
        <div className='md:w-[39%]'>
          <div>
        <h2 className='flex justify-center bg-red-100 font-semibold text-xl'>Branch Wise Collection Status</h2> 
          </div>
            <div className='overflow-auto w-screen'>
            <BranchWiseCollectionChart />
            </div> 
        </div>
        <div className='md:w-[59%]'>
          <div>
           <h2 className='flex justify-center bg-red-100 font-semibold text-xl'>Branch Wise Collection Status with Bucket</h2> 
          </div>
          <div>
            <BucketWiseCollectionChart />
          </div>
        </div>
        </div>
        <div>
          <CollectionEmiWiseChart />
        </div>
        <div>
          <h1 className='flex justify-center h-10 items-center font-semibold bg-yellow-100'>
            Nach Wise Detailed Table
          </h1>
            
            <NachWiseCollectionChart />
        </div>
        <div>
          <BucketWiseNachChart />
        </div>
        <div>
          <NachEmiWiseChart />
        </div>

        <div>
        <h1 className='flex justify-center h-10 items-center font-semibold bg-yellow-100 mb-3'>
            PAR Table
          </h1>
          <div>
          <h2 className='flex justify-center bg-red-100 font-semibold text-xl'>Branch Wise PAR Status</h2> 
          <div className='overflow-auto'>

          <ParBranchWiseChart />
          </div>
          </div>
          <div>
          <h2 className='flex justify-center bg-red-100 font-semibold text-xl mt-3'>Bucket Wise PAR Status</h2> 
          <div className='overflow-auto'>
          <ParBucketWiseChart />
          </div>
          </div>
        </div>

        <div className='flex flex-col md:flex-row w-full gap-4 mb-10'>
    <div className='md:w-[49%]'>
    <h2 className='flex justify-center bg-red-100 font-semibold text-xl mt-3'>Mithra Wise Collection Status</h2> 
        <div className='overflow-auto'>
          <MithraWiseCollectionTable />
          </div>
    </div>
    <div className='md:w-[49%]'>
    <h2 className='flex justify-center bg-red-100 font-semibold text-xl mt-3'>Branch Employee and Pincode Wise</h2> 
        <div >
        <MithraPincodeWiseCollectionTable />
          </div>
    </div>
        


          
        </div>
    </div>
    </div>
  )
}

export default Charts
