import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { FaSearch } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { MdViewAgenda } from "react-icons/md";
import ViewCustomer from "../components/ViewCustomer";

function DataTable() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterFinalStatus, setFilterFinalStatus] = useState("");
  const [filterMithraName, setFilterMithraName] = useState("");
  const [filterEmiCount, setFilterEmiCount] = useState("");
  const [filterBucket, setFilterBucket] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [branches, setBranches] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [emiCount, setEmiCount] = useState([]);
  const [buckets, setBuckets] = useState([]);
   const [selectedCustomer,setSelectedCustomer]=useState(null);

  const itemsPerPage = 50;
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setError(null);
        setLoading(true);
        const customerData = await API.get("/api/customers/");
        console.log(customerData.data);
        setCustomers(customerData.data);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching customers:", error);
        setError(error.response.data.message);
        // alert("Failed to load customers. Please try again.");
      }
    };
    const fetchBranchName = async () => {
      try {
        let fetchedBranches = [];

        if (currentUser.role === "StateHead") {
          const response = await API.get("/api/branches/");
          fetchedBranches = response.data.filter(
            (branch) => branch.state === currentUser.state
          );
        } else if (currentUser.role === "Manager") {
          const response = await API.get(
            `/api/managers/managerData/${currentUser._id}`
          );
          console.log(response.data.branches);
          // Map the manager's branches to a consistent format
          fetchedBranches = response.data.branches.map((branch) => ({
            id: branch._id,
            branchName: branch.branchName,
          }));
        } else if (currentUser.role === "Admin") {
          const response = await API.get("/api/branches/");
          fetchedBranches = response.data;
        }
        // console.log(fetchedBranches)
        setBranches(fetchedBranches);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchEmiCount = async () => {
      try {
        const result = await API.get("/api/charts/collection-emi-wise");
        const { emiCounts } = result.data;
        const noOfEmi = Object.keys(emiCounts);
        console.log(noOfEmi);
        setEmiCount(noOfEmi);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchBucketOrder = async () => {
      try {
        const response = await API.get("/api/charts/bucket-wise-collection");
        // setData(response.data);
        const { buckets } = response.data;
        // console.log(buckets);
        const bucketOrder = Object.keys(buckets);
        console.log(bucketOrder);
        setBuckets(bucketOrder);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchCustomer();
    fetchBranchName();
    fetchEmiCount();
    fetchBucketOrder();
  }, [currentUser]);
  const closeEdit = ()=>{
 
    setSelectedCustomer(null)
  }
  const handleView = (customer)=>{
    setSelectedCustomer(customer)
 }
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };
  useEffect(() => {
    const fetchEmployees = async () => {
      if (filterBranch) {
        try {
          const response = await API.get(`/api/users/branch`, {
            params: { branchName: filterBranch },
          });
          setEmployees(response.data);
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching employees", error);
        }
      } else {
        setEmployees([]); // Reset employees
      }
    };

    fetchEmployees();

    if (!filterBranch) {
      setFilterMithraName(""); // Reset Mithra filter when branch filter is cleared
    }
  }, [filterBranch]);

  const columns =[
    {
      header: "S.No",
      accessor: "sno",
      className: "p-0.5",
    },
    {
      header: "State",
      accessor: "state",
      className: "p-0.5 hidden md:table-cell",
    },
    {
      header: "Branch",
      accessor: "branch",
      className: "p-0.5",
    },
    {
      header: "CBS Number",
      accessor: "accountNumber",
      className: "p-0.5 hidden md:table-cell",
    },
    {
      header: "Name",
      accessor: "name",
      className: "p-0.5",
    },
    // {
    //     header:'Mobile',
    //     accessor:"mobile",
    //     className:"p-0.5 sm-hidden md-block"
    // },
    // {
    //     header:'DB Date',
    //     accessor:"dbDate"
    // },
    // {
    //     header:'Loan Amount',
    //     accessor:"loanAmount"
    // },
    // {
    //     header:'Tenure',
    //     accessor:"tenure"
    // },
    {
      header: "Mithra Name",
      accessor: "mithraName",
      className: "p-0.5",
    },
    //   {
    //       header:'Nach Presentation',
    //       accessor:"nachPresentation"
    //   },
    //   {
    //       header:'Nach Presentation Status',
    //       accessor:"nachPresentationstatus"
    //   },
    {
      header: "EMI_Count",
      accessor: "collectionCount",
      className: "p-0.5 hidden md:table-cell",
    },
    //   {
    //       header:'Bal Outstanding',
    //       accessor:"balOutstanding"
    //   },
    //   {
    //       header:'RPA Bal',
    //       accessor:"rpaBal"
    //   },
    {
      header: "Bucket",
      accessor: "bucket",
      className: "p-0.5 hidden md:table-cell",
    },
    //   {
    //       header:'No Of Days',
    //       accessor:"noOfDays"
    //   },
    //   {
    //       header:'PAR Status',
    //       accessor:"parStatus"
    //   },
    //   {
    //       header:'EMI Amount',
    //       accessor:"emiAmt"
    //   },
    //   {
    //       header:'Total Due',
    //       accessor:"totalDue"
    // },
    {
      header: "Collection Status",
      accessor: "collectionStatus",
      className: "p-0.5",
    },
    // {
    //     header:'Final Status',
    //     accessor:"finalStatus"
    // },
    //   {
    //       header:'Collected Amount',
    //       accessor:"collectedAmount"
    //   },
    //   {
    //       header:'Yet To Collect',
    //       accessor:"yetToCollect"
    //   },
    //   {
    //     header:"PAR Collection Status",
    //     accessor:"parCollectionStatus"
    //   },

    //   {
    //       header:'Address',
    //       accessor:"address"
    //   },
    {
      header: "Pincode",
      accessor: "pincode",
      className: "p-0.5",
    },
    {
      header: "Map",
      accessor: "map",
      className: "p-0.5",
    },{
      header:"Details",
     accessor:"details",
     className:"p-0.5"
   }
  ];
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      return (
        (!searchText ||
          customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
          customer.state.toLowerCase().includes(searchText.toLowerCase()) ||
          customer.branch.branchName
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          customer.employee.name
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          customer.collectionStatus
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          customer.finalStatus
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          customer.accountNumber.includes(searchText) ||
          customer.mobileNumber.includes(searchText) ||
          (customer.pincode &&
            customer.pincode.toString().includes(searchText))) &&
        (!filterBranch || customer.branch.branchName === filterBranch) &&
        (!filterFinalStatus || customer.finalStatus === filterFinalStatus) &&
        (!filterMithraName || customer.employee.name === filterMithraName) &&
        (!filterEmiCount ||
          customer.collectionCount.toString() === filterEmiCount) &&
        (!filterBucket || customer.bucket.toString() === filterBucket)
      );
    });
  }, [
    searchText,
    filterBranch,
    filterFinalStatus,
    filterMithraName,
    filterEmiCount,
    filterBucket,
    customers,
  ]);

  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCustomers.slice(startIndex, endIndex);
  }, [currentPage, filteredCustomers, itemsPerPage]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  return (
    <div className="flex flex-col h-full overflow-hidden ">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      {/* content  */}
      <div className="flex flex-col mt-[75px] h-full">
        {/* Search Bar */}
        <div className="flex flex-row md:justify-evenly justify-center px-4 mb-4   flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs rounded-full  md:max-w-64 ring-[1.5px] ring-gray-300 px-2">
            <FaSearch className="w-5 h-5" />

            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={handleSearch}
              className=" p-1 md:p-2 bg-transparent outline-none"
            />
          </div>
{/* Clear Filters Button */}
<button
    onClick={() => {
      setSearchText("");
      setFilterBranch("");
      setFilterMithraName("");
      setFilterFinalStatus("");
      setFilterEmiCount("");
      setFilterBucket("");
    }}
    className="p-1 md:p-2 rounded bg-red-500 text-white hover:bg-red-600"
  >
    Clear Filters
  </button>
          {/* Filter Dropdowns */}
<div className="flex flex-row overflow-auto gap-1  lg:gap-2">
          <div>
            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="border p-1 md:p-2 rounded"
            >
              <option value="">All Branches</option>
              {/* Add your branches dynamically */}
              {branches.map((branch, index) => (
                <option key={index} value={branch.branchName}>
                  {branch.branchName}
                </option>
              ))}
            </select>
          </div>
          <div>

            <select
              value={filterMithraName}
              onChange={(e) => setFilterMithraName(e.target.value)}
              className="border p-1 md:p-2 rounded"
              disabled={!filterBranch}
            >
              <option value="">All Mithras</option>
              {/* Add your Mithras dynamically */}
              {employees.map((employe, index) => (
                <option key={index} value={employe.name}>
                  {employe.name}
                </option>
              ))}
            </select>
            </div>
            <div >
            <select
              value={filterFinalStatus}
              onChange={(e) => setFilterFinalStatus(e.target.value)}
              className="border p-1 md:p-2 rounded"
            >
              <option value="">All Final Status</option>
              <option value="Collected">Collected</option>
              <option value="Not Collected">Not Collected</option>
            </select>
</div>
<div>
            <select
              value={filterEmiCount}
              onChange={(e) => setFilterEmiCount(e.target.value)}
              className="border p-1 md:p-2 rounded"
            >
              <option value="">All EMI Counts</option>
              {emiCount.map((count, index) => (
                <option key={index} value={count}>
                  EMI-{count}
                </option>
              ))}
            </select>
</div>
<div>
            <select
              value={filterBucket}
              onChange={(e) => setFilterBucket(e.target.value)}
              className="border p-1 md:p-2 rounded"
            >
              <option value="">All Buckets</option>
              {buckets.map((bucket, index) => (
                <option key={index} value={bucket}>
                  {bucket}
                </option>
              ))}
            </select>
          </div>
          </div>
        </div>
        {/* Table with Horizontal Scroll */}
        <div className="overflow-auto h-full p-0.5">
          <table className=" min-w-full   table-auto table-dark-border bg-[#F7F8FA]  ">
            <thead>
              <tr className="text-left bg-gray-200 ">
                {columns.map((col) => (
                  <th key={col.accessor} className={col.className}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedCustomers.map((item, index) => (
                <tr
                  key={item._id}
                  className={`text-sm ${
                    item.finalStatus === "Collected"
                      ? "bg-green-100"
                      : item.finalStatus === "Not Collected"
                      ? "bg-red-100"
                      : ""
                  }`}
                >
                  <td className=" text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className=" p-0.5 hidden md:table-cell ">{item.state}</td>
                  <td className="text-center ">
                    {/* {item.branch.branchName === "Mandya"
                      ? "Man"
                      : item.branch.branchName === "Shivamogga"
                      ? "Shiv"
                      : item.branch.branchName === "Hassan"
                      ? "Has"
                      : item.branch.branchName === "Namakkal"
                      ? "Nam"
                      : item.branch.branchName === "Kulithalai"
                      ? "Kuli"
                      : item.branch.branchName === "Kallakurichi"
                      ? "Kal"
                      : item.branch.branchName === "Neo_TN"
                      ? "Neo_TN"
                      : item.branch.branchName === "Viluppuram"
                      ? "Vilu"
                      : item.branch.branchName === "Erode"
                      ? "Erode"
                      : item.branch.branchName === "Thiruvannamalai"
                      ? "Thiru"
                      : item.branch.branchName} */}
                      {item.branch.branchName}
                  </td>
                  <td className=" hidden md:table-cell ">
                    {item.accountNumber}
                  </td>
                  <td className="text-left">{item.name}</td>
                  {/* <td className='border px-2 py-2'>{item.mobileNumber}</td> */}
                  {/* <td className='border px-2 py-2'>{item.dbDate}</td>
                    <td className='border px-2 py-2'>{item.loanAmount}</td>
                    <td className='border px-2 py-2'>{item.tenure}</td> */}
                  <td className="">{item.employee.name}</td>
                  {/* <td className='border px-2 py-2'>{item.nachPresentation}</td>
                    <td className='border px-2 py-2'>{item.nachPresentationStatus}</td> */}
                  {/* <td className='text-center'>{item.balanceOutstanding}</td> */}
                  {/* <td className='text-center'>{item.rpaBalance}</td> */}
                  <td className="hidden md:table-cell">
                    EMI-{item.collectionCount}
                  </td>
                  <td className="hidden md:table-cell">{item.bucket}</td>
                  {/* <td className='text-center'>{item.noOfDays}</td> */}
                  {/* <td className='text-center'>{item.parStatus}</td>
                    <td className='text-center'>{item.emiAmount}</td>
                    <td className='text-center'>{item.totalDue}</td> */}
                  <td className="text-center">{item.collectionStatus}</td>
                  {/* <td className='text-center'>{item.finalStatus}</td>
                    <td className='text-center'>{item.collectedAmount}</td>
                    <td className='text-center'>{item.yetToCollect}</td>
                    <td className='text-center'>{item.parCollectionStatus}</td>
                    <td className='text-center'>{item.address}</td>  */}
                  <td className="text-center">{item.pincode}</td>
                  <td className="text-center">
                    <button
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps?q=${item.latitude},${item.longitude}`,
                          "_blank"
                        )
                      }
                    >
                      <FaMapMarkerAlt className="w-4 h-4 cursor-pointer text-blue-500 flex items-center  " />
                    </button>
                  </td>
                   <td className=' text-center' >
                                         <button onClick={()=>handleView(item)}><MdViewAgenda className="w-4 h-4 cursor-pointer text-green-500 flex items-center  " /></button> </td>         
                </tr>
              ))}
            </tbody>
          </table>
          {error ? (
            <p className="flex justify-center font-semibold text-red-700">
              {error}
            </p>
          ) : (
            ""
          )}
          </div>
          <div className="w-full bg-white py-2 flex justify-evenly items-center border-t ">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
          {selectedCustomer && < ViewCustomer selectedCustomerData={selectedCustomer} onClose={closeEdit}  />} 
          {loading && (
            <p className="m-auto p-10 font-semibold text-lg ">Loading....</p>
          )}
        
      </div>
    </div>
  );
}

export default DataTable;
