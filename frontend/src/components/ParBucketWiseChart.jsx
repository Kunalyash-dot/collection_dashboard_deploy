import React, { useEffect, useState } from 'react'
import API from '../services/api';

function ParBucketWiseChart() {
    const [data,setData] = useState(null);
    useEffect(()=>{
        const fetchData = async()=>{
            try {
                const result =await API.get('/api/charts/par-bucket-wise-data')
                console.log(result.data)
                setData(result.data)
            } catch (error) {
                console.error('Failed to fetch data' , error);
            }
        };
        fetchData();
    },[])

    if (!data) {
        return <div>Loading...</div>; // Show a loading message while data is fetched
      }
      const { buckets,totals } = data;
      const bucketNames = Object.keys(buckets);
      // Remove 'totalCount' from totals
const { totalCount, ...filteredTotals } = totals;
const parStatus = Object.keys(filteredTotals);
   
  return (
    <div className='flex flex-col  w-full'>
      <table className="table-auto table-dark-border w-full mt-5 border-collapse">
      <thead>
    <tr className="text-left  ">
      <th className="border px-2 py-2 bg-green-300">Buckets</th>
      {parStatus.map((status) => (
        <th key={status} className="border px-2 py-2 bg-green-300">
          {status}
        </th>
      ))}
      <th className="border px-2 py-2 bg-green-300">Total</th>
     
    </tr>
  </thead>
  <tbody>
    {bucketNames.map((bucket)=>(
        <tr key={bucket} className='text-sm'>
            <td className='border px-2 py-2 font-bold'>{bucket}</td>
            {parStatus.map((status)=>(
                <td  className={status ==='Not Collected'?"border px-2 py-2 font-bold text-red-400 text-center":status ==='Partially Collected'?"border px-2 py-2 font-bold text-red-400 text-center":"border px-2 py-2 text-center"}key={status} 
                >{buckets[bucket].totals[status] || 0}</td>
            ))}
            <td className="border px-2 py-2 text-center font-semibold">{data.buckets[bucket].totalCount}</td>
            
        </tr>
    ))}
    <tr>
        <td className="border px-2 py-2 font-bold bg-green-300">Grand Total</td>
        {parStatus.map((status)=>(
            <td className="border px-2 py-2 font-bold bg-green-300 text-center" key={status}>{data.totals[status]}</td>
        ))}
        <td className="border px-2 py-2 font-bold bg-green-300 text-center">{data.totals["totalCount"]}</td>
       

    </tr>
  </tbody>
  </table></div>
  )
}

export default ParBucketWiseChart
