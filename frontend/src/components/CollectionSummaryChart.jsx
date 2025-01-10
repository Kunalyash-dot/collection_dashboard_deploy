import { useEffect, useState } from "react";
import API from "../services/api"

function CollectionSummaryChart() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(()=>{
        const fetchData = async()=>{
          setLoading(true); // Start loading
            setError(null);   // Clear any previous errors
       
            try {
                const result =await API.get('/api/charts/collection-summary')
                console.log(result.data)
                setData(result.data)
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch data' , error);
                setError(
                  error.response?.data?.message || // API provided error message
                  'Something went wrong. Please try again later.' // Fallback message
                  
              );
              setLoading(false);
            }
        };
        fetchData();
    },[]);
    if (loading) {
      return <div>Loading...</div>; // Show loading state
  }

  if (error) {
      return <div className="text-red-500">Error: {error}</div>; // Show error message
  }
      const { branches, totals } = data;
      const branchNames = Object.keys(branches);
  const collectionStatuses = [
    'Collection Done',
    'Pre Closure',
    'Tenure Close',
    'Excess Collection',
    'Advance Collection',
    'Death Case',
    'Collection Pending',
    'PAR A/C Partial Collection',
    'Regular A/C Partial Collection'
  ];
  
  return (
    <div>
    
    <table className="table-auto table-dark-border w-full mt-5 border-collapse">
      <thead>
        <tr className="text-left text-700 ">
          <th className="border px-2 py-2 bg-green-300">Collection Status</th>
          {branchNames.map((branch) => (
            <th key={branch} className="border px-2 py-2 bg-green-300">{branch}</th>
          ))}
          <th className="border px-2 py-2 bg-green-300">Total</th>
        </tr>
      </thead>
      <tbody>
        {collectionStatuses.map((status) => (
          <tr key={status} className='text-sm' >
            <td className={status==='Collection Pending'|| status === 'PAR A/C Partial Collection'|| status=== 'Regular A/C Partial Collection' ?'border px-2 py-2 font-bold text-red-400 ':'border px-2 py-2 font-bold '}> {status}</td>
            {branchNames.map((branch) => (
              <td key={branch} className={status==='Collection Pending'|| status === 'PAR A/C Partial Collection'|| status=== 'Regular A/C Partial Collection' ?'border px-2 py-2 font-bold text-red-400 text-center':'border px-2 py-2 text-center'}>
                {branches[branch][status] || 0} {/* Show 0 if no data for this status */}
              </td>
            ))}
            <td className={status==='Collection Pending'|| status === 'PAR A/C Partial Collection'|| status=== 'Regular A/C Partial Collection' ?'border px-2 py-2 font-bold text-red-400 text-center':'border px-2 py-2 font-bold text-center'}>{totals[status]}</td>
          </tr>
        ))}
        {/* Add row for branch totals */}
        <tr>
          <td className='border px-2 py-2 font-bold bg-green-300'>Grand Total</td>
          {branchNames.map((branch) => (
            <td key={branch} className='border px-2 py-2 text-center font-bold bg-green-300'>{branches[branch].total || 0}</td>
          ))}
          <td className='border px-2 py-2 text-center font-bold bg-green-300'>
            {Object.values(totals).reduce((sum, count) => sum + count, 0)}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  )
}

export default CollectionSummaryChart
