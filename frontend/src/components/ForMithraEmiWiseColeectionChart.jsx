import React, { useEffect, useState } from 'react'
import API from '../services/api';

function ForMithraEmiWiseColeectionChart() {
    const [data, setData] = useState(null);
    useEffect(()=>{
        const fetchData = async()=>{
            try {
                const result =await API.get('/api/charts/mithra-emi-chart')
                console.log(result.data)
                setData(result.data)
            } catch (error) {
                console.error('Failed to fetch data' , error);
            }
        };
        fetchData();
    },[]);
    if (!data) {
        return <div>Loading...</div>; // Show a loading message while data is fetched
      }
       // Calculate percentage
  const calculatePercentage = (collected, total) => {
    if (total === 0) return "0%";
    return `${Math.round((collected / total) * 100)}%`;
  };

   // Transform data into a table-friendly format
   const tableData = Object.keys(data).map((emi) => {
    const { statuses, totalCount } = data[emi];
    const collected = statuses["Collected"] || 0;
    const notCollected = statuses["Not Collected"] || 0;

    return {
      emi,
      collected,
      notCollected,
      total: totalCount,
      percentage: calculatePercentage(collected, totalCount),
    };
  });

  console.log(tableData)
  const grandTotals = tableData.reduce(
    (totals, row) => {
      totals.collected += row.collected;
      totals.notCollected += row.notCollected;
      totals.total += row.total;
      return totals;
    },
    { collected: 0, notCollected: 0, total: 0 }
  );
  

  // Calculate overall collection percentage
  const overallPercentage =
    grandTotals.total > 0
      ? Math.round((grandTotals.collected / grandTotals.total) * 100) + "%"
      : "0%";
 
  return (
    <div>
    <table className="table-auto table-dark-border w-max mt-5 border-collapse">
      <thead>
        <tr className="text-left  ">
          <th className="border px-2 py-2 bg-green-300">EMI</th>
          <th className="border px-2 py-2 bg-green-300">Collected</th>
          <th className="border px-2 py-2 bg-green-300">Not Collected</th>
          <th className="border px-2 py-2 bg-green-300">Total</th>
          <th className="border px-2 py-2 bg-green-300">Percentage</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row) => (
          <tr key={row.pincode} className="text-sm">
            <td className="border px-2 py-2 font-bold">EMI-{row.emi}</td>
            <td className="border px-2 py-2 text-center">{row.collected}</td>
            <td className="border px-2 py-2 text-center">{row.notCollected}</td>
            <td className="border px-2 py-2 text-center">{row.total}</td>
            <td className="border px-2 py-2 text-center">{row.percentage}</td>
          </tr>
        ))}
         {/* Grand total row */}
         <tr >
            <td className="border px-2 py-2 font-bold bg-green-300">Grand Total</td>
            <td  className="border px-2 py-2 font-bold bg-green-300 text-center">{grandTotals.collected}</td>
            <td  className="border px-2 py-2 font-bold bg-green-300 text-center">{grandTotals.notCollected}</td>
            <td  className="border px-2 py-2 font-bold bg-green-300 text-center">{grandTotals.total}</td>
            <td  className="border px-2 py-2 font-bold bg-green-300 text-center">{overallPercentage}</td>
          </tr>
      </tbody>
    </table>
  </div>
  )
}

export default ForMithraEmiWiseColeectionChart
