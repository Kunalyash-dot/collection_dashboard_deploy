import { useEffect, useState } from "react";
import API from "../services/api"

function BranchWiseCollectionChart() {
    const [data, setData] = useState(null);
    useEffect(()=>{
      
        const fetchData = async()=>{
            try {
                const result =await API.get('/api/charts/branch-wise-collection')
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
      const { branches, totals } = data;
      const branchNames = Object.keys(branches);
      const finalStatus = ['Collected','Not Collected'];
  return (
    <div>
        <table className="table-auto table-dark-border w-max mt-5 border-collapse">
  <thead>
    <tr className="text-left  ">
      <th className="border px-2 py-2 bg-green-300">Branches</th>
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
    {/* Sort branches by percentage in descending order */}
    {[...branchNames]
      .sort(
        (a, b) =>
          (branches[b].Collected / branches[b].total) -
          (branches[a].Collected / branches[a].total)
      )
      .map((branch) => {
        const percentage = Math.round(
          (branches[branch].Collected / branches[branch].total) * 100
        );

        // Determine percentage-wise color
        const percentageColor =
          percentage > 80
            ? "bg-green-200"
            : percentage >= 50
            ? "bg-yellow-200"
            : "bg-red-200";

        return (
          <tr key={branch} className="text-sm">
            <td className="border px-2 py-2 font-bold">{branch}</td>
            {finalStatus.map((status) => (
              <td
                key={status}
                className="border px-2 py-2 text-center"
              >
                {branches[branch][status] || 0}
              </td>
            ))}
            <td className="border px-2 py-2 font-bold">{branches[branch].total}</td>
            <td
              className={`border px-2 py-2 text-center font-bold ${percentageColor}`}
            >
              {`${percentage} %`}
            </td>
          </tr>
        );
      })}

    {/* Grand Total Row */}
    <tr>
      <td className="border px-2 py-2 font-bold bg-green-300">Grand Total</td>
      {finalStatus.map((status) => (
        <td
          key={status}
          className="border px-2 py-2 font-bold bg-green-300 text-center"
        >
          {totals[status]}
        </td>
      ))}
      <td className="border px-2 py-2 font-bold bg-green-300 text-center">
        {Object.values(totals).reduce((sum, count) => sum + count, 0)}
      </td>
      <td className="border px-2 py-2 bg-green-300 font-bold text-center">
        {`${Math.round(
          (totals.Collected /
            (totals.Collected + totals["Not Collected"])) *
            100
        )} %`}
      </td>
    </tr>
  </tbody>
</table>
      
    </div>
  )
}

export default BranchWiseCollectionChart
