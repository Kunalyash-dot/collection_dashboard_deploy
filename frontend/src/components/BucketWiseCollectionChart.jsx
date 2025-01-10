import React, { useEffect, useState } from 'react'
import API from '../services/api';

function BucketWiseCollectionChart() {
    const [selectedBucket, setSelectedBucket] = useState("B0"); // Set initial bucket to "B0"
    const [data, setData] = useState(null); // State to hold fetched data
    const [filteredData, setFilteredData] = useState(null); // Filtered data based on selected bucket
    useEffect(() => {
      
        // Fetch data when component mounts
        const fetchData = async () => {
          try {
            const response = await API.get("/api/charts/bucket-wise-collection"); 
            setData(response.data); 
          } catch (error) {
            console.error("Error fetching data", error);
          }
        };
    
        fetchData();
      }, []);
    
      useEffect(() => {
        // Filter data based on the selected bucket
        if (data && selectedBucket) {
          setFilteredData(data.buckets[selectedBucket] || null);
        }
      }, [selectedBucket, data]);
    
      if (!data) {
        return <div>Loading...</div>; // Show loading until data is fetched
      }
  return (
    <div className="p-2 md:p-5 flex gap-2 flex-col md:flex-row ">
      {/* Select Dropdown for Bucket */}
      <div className="mb-4 flex flex-row md:flex-col gap-3 justify-center md:justify-normal">
        <label htmlFor="bucket" className=" font-bold flex items-center">
          Select Bucket:
        </label>
        <select
          id="bucket"
          className="border px-3 py-2 w-36"
          value={selectedBucket}
          onChange={(e) => setSelectedBucket(e.target.value)}
        >
         
          {Object.keys(data.buckets).map((bucket) => (
            <option key={bucket} value={bucket} >
              {bucket}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
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
                const percentage =Math.round((collected/total)*100)

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
                  {Math.round(((filteredData.totals["Collected"] || 0)/(filteredData.totalCount || 0))*100)} %
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
      </div>
    </div>
  )
}

export default BucketWiseCollectionChart
