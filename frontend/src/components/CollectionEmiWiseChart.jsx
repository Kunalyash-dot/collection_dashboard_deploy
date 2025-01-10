import React, { useEffect, useState } from 'react'
import API from '../services/api';

function CollectionEmiWiseChart() {
    const [data,setData] = useState(null);
         const [selectedEmi, setSelectedEmi] = useState("1");
         const [filteredData, setFilteredData] = useState(null);

         
         useEffect(()=>{
            const fetchData = async()=>{
                try {
                    const result =await API.get('/api/charts/collection-emi-wise')
                    console.log(result.data)
                    setData(result.data)
                } catch (error) {
                    console.log(error)
                    // alert("Error in fetching the data.")
                }
            };
            fetchData();
        },[])
         useEffect(() => {
                    // Filter data based on the selected bucket
                    if (data && selectedEmi) {
                      setFilteredData(data.emiCounts[selectedEmi] || null);
                    }
                  }, [selectedEmi, data]);
                  if (!data) {
                    return <div>Loading...</div>; // Show a loading message while data is fetched
                  }
                  const { emiCounts} = data;
      const noOfEmi = Object.keys(emiCounts);
      const collectionStatus = ['Collected','Not Collected'];
       // Function to avoid division by zero and calculate percentages
    const calculatePercentage = (numerator, denominator) => {
        return denominator === 0 ? 0 : Math.round((numerator / denominator) * 100);
    };
  return (
    <div className='flex mt-4 w-full flex-col md:flex-row gap-4'>
    <div className='md:w-[40%]'>
      <div>
        <h2 className='flex justify-center bg-red-100 font-semibold text-xl'>EMI Wise Collection Status</h2>
      </div>
      <div className='overflow-auto'>
      
      <table className="table-auto table-dark-border w-max mt-5 border-collapse">
      <thead>
    <tr className="text-left  ">
      <th className="border px-2 py-2 bg-green-300">EMI's</th>
      {collectionStatus.map((status) => (
        <th key={status} className="border px-2 py-2 bg-green-300">
          {status}
        </th>
      ))}
      <th className="border px-2 py-2 bg-green-300">Total</th>
      <th className="border px-2 py-2 bg-green-300">Percentage</th>
    </tr>
  </thead>
  <tbody>
    {noOfEmi.map((emi)=>(
        <tr key={emi} className='text-sm'>
            <td className='border px-2 py-2 font-bold'>EMI-{emi}</td> 
            {collectionStatus.map((status)=>(
                <td className="border px-2 py-2 text-center" key={status}>{emiCounts[emi].totals[status] || 0}</td>
            ))}
            <td className="border px-2 py-2 text-center font-semibold">{data.emiCounts[emi].totalCount}</td>
            <td className="border px-2 py-2 text-center font-semibold">{calculatePercentage(emiCounts[emi].totals["Collected"] || 0, data.emiCounts[emi].totalCount)} %</td>
        </tr>
    ))}
    <tr>
        <td className="border px-2 py-2 font-bold bg-green-300">Grand Total</td>
        {collectionStatus.map((status)=>(
            <td className="border px-2 py-2 font-bold bg-green-300 text-center" key={status}>{data.totals[status]}</td>
        ))}
        <td className="border px-2 py-2 font-bold bg-green-300 text-center">{data.totals["totalCount"]}</td>
        <td className="border px-2 py-2 font-bold bg-green-300 text-center">{calculatePercentage(data.totals["Collected"], data.totals["totalCount"])} %
        </td>

    </tr>
  </tbody>
  </table>
  </div>
  </div>
  <div className=' md:w-[60%]'>
    <div>
<h2 className='flex justify-center bg-red-100 font-semibold  text-xl'>EMI Wise Collection Status With Branch</h2>
    </div>
<div className=" p-2 md:p-5 flex gap-1 flex-col md:flex-row ">
    <div className="mb-4 flex flex-row md:flex-col gap-2 justify-center md:justify-normal">
    <label htmlFor="emi" className=" font-bold flex items-center ">
          Select EMI:
        </label>
        <select
          id="emi"
          className="border px-3 py-2 w-max"
          value={selectedEmi}
          onChange={(e) => setSelectedEmi(e.target.value)}
        >
          <option value="">Select Bucket</option>
          {Object.keys(data.emiCounts).map((emi) => (
            <option key={emi} value={emi}>
             EMI-{emi}
            </option>
          ))}
        </select>
    </div>
    <div className='overflow-auto'>

    
    <table className="table-auto table-dark-border w-max  border-collapse">
        <thead>
          <tr  className="text-left">
            <th className="border px-2 py-2 bg-green-300">Branch Name</th>
            <th className="border px-2 py-2 bg-green-300">Collected</th>
            <th className="border px-2 py-2 bg-green-300">Not Collected</th>
            <th className="border px-2 py-2 bg-green-300">Grand Total</th>
            <th className="border px-2 py-2 bg-green-300">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {filteredData ? (
            <>
              {/* Branch-wise data */}
              {Object.keys(filteredData.branches).map((branch) => {
                const branchData = filteredData.branches[branch];
                const collected = branchData["Collected"] || 0;
                const notCollected = branchData["Not Collected"] || 0;
                const total = collected + notCollected;
                const percentage =calculatePercentage(collected, total);

                return (
                  <tr key={branch} className="text-sm">
                    <td className="border px-2 py-2 font-bold">{branch}</td>
                    <td className="border px-2 py-2 text-center">{collected}</td>
                    <td className="border px-2 py-2 text-center">{notCollected}</td>
                    <td className="border px-2 py-2 text-center">{total}</td>
                    <td className="border px-2 py-2 text-center">{percentage} %</td>
                  </tr>
                );
              })}

              {/* Grand total row */}
              <tr>
                <td className="border px-2 py-2 font-bold bg-green-300">Grand Total</td>
                <td className="border px-2 py-2 font-bold bg-green-300 text-center">
                  {filteredData.totals["Collected"] || 0}
                </td>
                <td className="border px-2 py-2 font-bold bg-green-300 text-center">
                  {filteredData.totals["Not Collected"] || 0}
                </td>
                <td className="border px-2 py-2 font-bold bg-green-300 text-center">
                  {filteredData.totalCount || 0}
                </td>
                <td className="border px-2 py-2 font-bold bg-green-300 text-center">
                {calculatePercentage(filteredData.totals["Collected"], filteredData.totalCount)} %
                </td>
              </tr>
            </>
          ) : (
            <tr>
              <td colSpan="4" className="border px-4 py-2 text-center">
                Select a bucket to display data.
              </td>
            </tr>
          )}
        </tbody>
        </table>
        </div></div></div>
    </div>
  )
}

export default CollectionEmiWiseChart
