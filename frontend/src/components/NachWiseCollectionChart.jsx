import { useEffect, useState } from "react";
import API from "../services/api";
import { useSelector } from "react-redux";

function NachWiseCollectionChart() {
  const { currentUser } = useSelector((state) => state.user);
  const [data, setData] = useState(null);
  const [considerForPresentationData, setConsiderForPresentationData] =
    useState(null);
  const [stateData, setStateData] = useState([]);

  const calculateStateTotal = (stateData) => {
    return Object.values(stateData).reduce(
      (sum, value) => sum + (typeof value === "number" ? value : 0),
      0
    );
  };
  useEffect(() => {
    // Fetch data when component mounts
    const fetchData = async () => {
      try {
        const response = await API.get("/api/charts/nach-wise-collection");
        setData(response.data);
        console.log(response);
        setConsiderForPresentationData(
          response.data.nach["Consider For Presentation"]
        );
        const formattedData = [
          {
            status: "Consider For Presentation",
            tamilNadu: calculateStateTotal(
              response.data.nach["Consider For Presentation"].states.Tamil_Nadu
            ),
            karnataka: calculateStateTotal(
              response.data.nach["Consider For Presentation"].states.Karnataka
            ),
            total: response.data.nach["Consider For Presentation"].totalCount,
          },
          {
            status: "Not to Consider for Presentation",
            tamilNadu: calculateStateTotal(
              response.data.nach["Not to Consider for Presentation"].states
                .Tamil_Nadu
            ),
            karnataka: calculateStateTotal(
              response.data.nach["Not to Consider for Presentation"].states
                .Karnataka
            ),
            total:
              response.data.nach["Not to Consider for Presentation"].totalCount,
          },
          {
            status: "Not to Consider -Consecutive Bounce",
            tamilNadu: calculateStateTotal(
              response.data.nach["Not to Consider -Consecutive Bounce"].states
                .Tamil_Nadu
            ),
            karnataka: calculateStateTotal(
              response.data.nach["Not to Consider -Consecutive Bounce"].states
                .Karnataka
            ),
            total:
              response.data.nach["Not to Consider -Consecutive Bounce"]
                .totalCount,
          },
          {
            status: "Grand Total",
            tamilNadu:
              calculateStateTotal(
                response.data.nach["Consider For Presentation"].states
                  .Tamil_Nadu
              ) +
              calculateStateTotal(
                response.data.nach["Not to Consider for Presentation"].states
                  .Tamil_Nadu
              ) +
              calculateStateTotal(
                response.data.nach["Not to Consider -Consecutive Bounce"].states
                  .Tamil_Nadu
              ),
            karnataka:
              calculateStateTotal(
                response.data.nach["Consider For Presentation"].states.Karnataka
              ) +
              calculateStateTotal(
                response.data.nach["Not to Consider for Presentation"].states
                  .Karnataka
              ) +
              calculateStateTotal(
                response.data.nach["Not to Consider -Consecutive Bounce"].states
                  .Karnataka
              ),
            total: response.data.totals.totalCount,
          },
        ];

        setStateData(formattedData);
        //  console.log(considerForPresentationData)
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);
  console.log(stateData);
  if (!data) {
    return <div>Loading...</div>; // Show a loading message while data is fetched
  }

  const nachStatus = ["Cleared", "Bounced"];
  const presentationReamrks = Object.keys(data.nach);
  console.log(presentationReamrks);
  const states = ["Tamil_Nadu", "Karnataka"];

  return (
    <div className="flex w-full gap-3 mt-2 flex-col md:flex-row">
      <div className="md:w-[48%]">
        <div>
        <h2 className="flex justify-center bg-red-100 font-semibold text-xl">Branch Wise Nach Status</h2>
        </div>
        <div className="overflow-auto">

        
        <table className="table-auto table-dark-border w-full mt-5 border-collapse">
          <thead>
            <tr className="text-left text-700">
              <th className="border px-2 py-2 bg-green-300">Branch Wise</th>
              {nachStatus.map((status) => (
                <th key={status} className="border px-2 py-2 bg-green-300">
                  {status}
                </th>
              ))}
              <th className="border px-2 py-2 bg-green-300">Total Accounts</th>
              <th className="border px-2 py-2 bg-green-300">Nach Percentage</th>
            </tr>
          </thead>
          <tbody>
            {considerForPresentationData ? (
              <>
                {Object.keys(considerForPresentationData.branches).map(
                  (branch) => {
                    const branchData =
                      considerForPresentationData.branches[branch];
                    const cleared = branchData["Cleared"] || 0;
                    const bounced = branchData["Bounced"] || 0;
                    const total = cleared + bounced;
                    const percentage = Math.round((cleared / total) * 100);
                    return (
                      <tr key={branch}>
                        <td className="border px-4 py-2 font-bold">{branch}</td>
                        <td className="border px-4 py-2 text-center">
                          {cleared}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {bounced}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {total}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {percentage} %
                        </td>
                      </tr>
                    );
                  }
                )}
                {/* Grand total row */}
                <tr>
                  <td className="border px-4 py-2 font-bold bg-green-300">
                    Grand Total
                  </td>
                  <td className="border px-4 py-2 text-center font-bold bg-green-300">
                    {considerForPresentationData.totals["Cleared"] || 0}
                  </td>
                  <td className="border px-4 py-2 text-center font-bold bg-green-300">
                    {considerForPresentationData.totals["Bounced"] || 0}
                  </td>
                  <td className="border px-4 py-2 text-center font-bold bg-green-300">
                    {considerForPresentationData.totalCount || 0}
                  </td>
                  <td className="border px-4 py-2 text-center font-bold bg-green-300">
                    {Math.round(
                      ((considerForPresentationData.totals["Bounced"] || 0) /
                        (considerForPresentationData.totalCount || 0)) *
                        100
                    )}{" "}
                    %
                  </td>
                </tr>
              </>
            ) : (
              <></>
            )}
          </tbody>
        </table>
        </div>
      </div>

      <div className="md:w-[49%]">
        {currentUser.role === "Admin"?(
          <><div>
            <div>
          <h2 className="flex justify-center bg-red-100 font-semibold text-xl">State Wise Nach Status</h2>
            </div>
            <div>

            <div className="overflow-auto">

            
          <table className="table-auto table-dark-border w-full mt-5 border-collapse">
            <thead>
              <tr className="text-left text-700">
                <th className="border px-2 py-2 bg-green-300">State Wise</th>
                {nachStatus.map((status) => (
                  <th key={status} className="border px-2 py-2 bg-green-300">
                    {status}
                  </th>
                ))}
                <th className="border px-2 py-2 bg-green-300">
                  Total Accounts
                </th>
                <th className="border px-2 py-2 bg-green-300">
                  Nach Percentage
                </th>
              </tr>
            </thead>
            <tbody>
              {considerForPresentationData ? (
                <>
                  {Object.keys(considerForPresentationData.states).map(
                    (state) => {
                      const stateData =
                        considerForPresentationData.states[state];
                      console.log(stateData);
                      const cleared = stateData["Cleared"] || 0;
                      const bounced = stateData["Bounced"] || 0;
                      const total = cleared + bounced;
                      const percentage = Math.round((cleared / total) * 100);
                      return (
                        <tr key={state}>
                          <td className="border px-4 py-2 font-bold">
                            {state}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {cleared}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {bounced}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {total}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {percentage} %
                          </td>
                        </tr>
                      );
                    }
                  )}
                  <tr>
                    <td className="border px-4 py-2 font-bold bg-green-300">
                      Grand Total
                    </td>
                    <td className="border px-4 py-2 text-center font-bold bg-green-300">
                      {considerForPresentationData.totals["Cleared"] || 0}
                    </td>
                    <td className="border px-4 py-2 text-center font-bold bg-green-300">
                      {considerForPresentationData.totals["Bounced"] || 0}
                    </td>
                    <td className="border px-4 py-2 text-center font-bold bg-green-300">
                      {considerForPresentationData.totalCount || 0}
                    </td>
                    <td className="border px-4 py-2 text-center font-bold bg-green-300">
                      {Math.round(
                        ((considerForPresentationData.totals["Bounced"] || 0) /
                          (considerForPresentationData.totalCount || 0)) *
                          100
                      )}{" "}
                      %
                    </td>
                  </tr>
                </>
              ) : (
                <></>
              )}
            </tbody>
          </table>
          </div>
          </div>
        </div>
        <div className="mt-4">
          <div>
          <h2 className="flex justify-center bg-red-100 font-semibold text-xl">Nach Status Total Account </h2>
          </div>
          <div className="overflow-auto ">

          
          <table className="table-auto table-dark-border w-max mt-5 border-collapse">
            <thead>
              <tr className="text-left">
                <th className="border px-2 py-2 bg-green-300">
                  NACH Presentation
                </th>
                {states.map((state) => (
                  <th key={state} className="border px-2 py-2 bg-green-300">
                    {state}
                  </th>
                ))}
                <th className="border px-2 py-2 bg-green-300">
                  Total Accounts
                </th>
              </tr>
            </thead>
            <tbody>
              {stateData.map((row, index) => (
                <tr key={index}>
                  <td
                    className={
                      row.status === "Grand Total"
                        ? "border px-2 py-2 font-bold bg-green-300"
                        : "border px-2 py-2 font-bold"
                    }
                  >
                    {row.status}
                  </td>
                  <td
                    className={
                      row.status === "Grand Total"
                        ? "border px-2 py-2 font-bold text-center bg-green-300"
                        : "border px-2 py-2 text-center"
                    }
                  >
                    {row.tamilNadu}
                  </td>
                  <td
                    className={
                      row.status === "Grand Total"
                        ? "border px-2 py-2 font-bold text-center bg-green-300"
                        : "border px-2 py-2 text-center"
                    }
                  >
                    {row.karnataka}
                  </td>
                  <td
                    className={
                      row.status === "Grand Total"
                        ? "border px-2 py-2 font-bold text-center bg-green-300"
                        : "border px-2 py-2 text-center"
                    }
                  >
                    {row.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
        </>):""}
        
      </div>
    </div>
  );
}

export default NachWiseCollectionChart;
