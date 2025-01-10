import { useEffect, useState } from "react";
import API from "../services/api"

function MithraWiseCollectionTable() {
  const [data, setData] = useState(null);
  useEffect(()=>{
    const fetchData = async()=>{
        try {
            const result =await API.get('/api/charts/mithra-wise-collection-data')
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

  const { employeesList, totals } = data;
      const employeeNames = Object.keys(employeesList);
      const finalStatus = ['Collected','Not Collected'];
      console.log(employeeNames)

      // Function to avoid division by zero and calculate percentages
      const calculatePercentage = (numerator, denominator) => {
        return denominator === 0 ? 0 : Math.round((numerator / denominator) * 100);
        };

  return (
    <div>
        <table className="table-auto table-dark-border w-max mt-5 border-collapse">
  <thead>
    <tr className="text-left  ">
      <th className="border px-2 py-2 bg-green-300">Mithr Names</th>
      {finalStatus.map((status) => (
        <th key={status} className="border px-2 py-2 bg-green-300">
          {status}
        </th>
      ))}
      <th className="border px-2 py-2 bg-green-300">Total</th>
      <th className="border px-2 py-2 bg-green-300">Percentage</th>
    </tr>
  </thead>
  <tbody>
    {employeeNames.map((emp,index)=>(
      <tr key={index} className="text-sm">
        <td className="border px-2 py-2 font-bold">{emp}</td>
        {finalStatus.map((status)=>(
          <td key={status} className="border px-2 py-2 text-center"> {employeesList[emp].totals[status] || 0}</td>
        ))}
        <td className="border px-2 py-2 font-bold">{employeesList[emp].totalCount}</td>
        <td className="border px-2 py-2 text-center font-semibold">
        {calculatePercentage(employeesList[emp].totals["Collected"] || 0, employeesList[emp].totalCount || 0)} %
        </td>
      </tr>
    ))}
    <tr>
    <td className="border px-2 py-2 font-bold bg-green-300">Grand Total</td>
        {finalStatus.map((status)=>(
            <td className="border px-2 py-2 font-bold bg-green-300 text-center" key={status}>{totals[status]}</td>
        ))}
        <td className="border px-2 py-2 font-bold bg-green-300 text-center">{totals["totalCount"]}</td>
        <td className="border px-2 py-2 font-bold bg-green-300 text-center">{calculatePercentage(totals["Collected"], totals["totalCount"])} %
        </td>
    </tr>
  </tbody>
  </table>
    </div>
  )
}

export default MithraWiseCollectionTable
