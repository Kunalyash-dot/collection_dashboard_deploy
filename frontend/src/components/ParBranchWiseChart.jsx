import { useEffect, useState } from "react";
import API from "../services/api"

function ParBranchWiseChart() {
    const [data, setData] = useState(null);
    useEffect(()=>{
        const fetchData = async()=>{
            try {
                const result =await API.get('/api/charts/par-branch-wise-data')
                console.log(result.data)
                setData(result.data)
            } catch (error) {
                console.error('Failed to fetch data' , error);
            }
        };
        fetchData();
    },[]);
    if (!data) {
        return <div>Loading...</div>;
      }

const {branches,totals} = data.par;
const branchNames = Object.keys(branches);
const parRemarks = Object.keys(totals);


  return (
    <div>
      <table className="table-auto table-dark-border w-full mt-5 border-collapse">
      <thead>
        <tr className="text-left text-black-700 ">
          <th className="border px-2 py-2 bg-green-300">Branches</th>
          {parRemarks.map((remark) => (
            <th key={remark} className="border px-2 py-2 bg-green-300">{remark}</th>
          ))}
          <th className="border px-2 py-2 bg-green-300">Total</th>
        </tr>
      </thead>
      <tbody>
        {branchNames.map((branch)=>(
            <tr key={branch}>
                <td className="border px-2 py-2 font-bold">{branch}</td>
                {parRemarks.map((remark)=>(
                    
                    <td key={remark} className={remark ==='Not Collected'?"border px-2 py-2 font-bold text-red-400 text-center":remark ==='Partially Collected'?"border px-2 py-2 font-bold text-red-400 text-center":"border px-2 py-2 text-center"}>{branches[branch][remark] || 0}</td>
                    
                ))}
                <td className="border px-2 py-2 text-center font-bold">
                {Object.values(branches[branch]).reduce((sum, val) => sum + (val || 0), 0)}
              </td>
                </tr>
                
        ))}
        <tr>
            <td className='border px-2 py-2 font-bold bg-green-300'>Totals</td>
            {parRemarks.map((remark) => (
              <td key={remark} className='border px-2 py-2 text-center font-bold bg-green-300'>
                {totals[remark] || 0}
              </td>
            ))}
            <td className="border px-2 py-2 text-center font-bold bg-green-300">
              {data.par.totalCount}
            </td>
          </tr>
      </tbody>
      </table>
    </div>
  )
}

export default ParBranchWiseChart

