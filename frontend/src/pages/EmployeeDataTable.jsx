import React, { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import API from '../services/api';
import { FaSearch } from 'react-icons/fa'
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdViewAgenda } from "react-icons/md";
import ViewCustomer from '../components/ViewCustomer';
import { useSelector } from 'react-redux';

function EmployeeDataTable() {
    const [customers,setCustomers]= useState([]);
    const [loading,setLoading] = useState(false);
    const [searchText,setSearchText]= useState("")
     const [currentPage, setCurrentPage] = useState(1);
     const [error,setError]= useState(null);
     const [selectedCustomer,setSelectedCustomer]=useState(null);
     const [emiCount, setEmiCount] = useState([]);
        const [buckets, setBuckets] = useState([]);
        const [filterEmiCount, setFilterEmiCount] = useState("");
       const [filterBucket, setFilterBucket] = useState("");

    const itemsPerPage = 50;
    const { currentUser } = useSelector((state) => state.user);
    useEffect(()=>{
     const fetchCustomer =async ()=>{
       try {
         setError(null)
         setLoading(true);
         const res =await API.get('/api/customers/')
         console.log(res.data)
         const notCollectedData = res.data.filter(item=>item.finalStatus === "Not Collected");
         console.log(notCollectedData)
         setCustomers(notCollectedData);
        
         setLoading(false);
       } catch (error) {
         console.log("Error fetching customers:", error);
         setError(error.response.data.message)
         // alert("Failed to load customers. Please try again.");
       }
     }
     const fetchEmiCount = async () => {
      try {
        const result = await API.get("/api/charts/mithra-emi-data");
        
        const noOfEmi = Object.keys(result.data);
        console.log(noOfEmi);
        setEmiCount(noOfEmi);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchBucket = async () => {
      try {
        const response = await API.get("/api/charts/mithra-bucket-data");
        // setData(response.data);
        
        
        // console.log(buckets);
        const bucket = Object.keys(response.data);
        console.log(bucket);
        setBuckets(bucket);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
     fetchCustomer();
     fetchEmiCount();
     fetchBucket();
   },
   
   [currentUser])
   const handleSearch = (e)=>{
     setSearchText(e.target.value)
 };
 const closeEdit = ()=>{
 
    setSelectedCustomer(null)
  }
   const columns = [
     {
         header:'S.No',
         accessor:"sno",
         className:"p-0.5"
     },
    
     {
         header:'Name',
         accessor:"name",
         className:"p-0.5"
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
    
   //   {
   //       header:'Nach Presentation',
   //       accessor:"nachPresentation"
   //   },
   //   {
   //       header:'Nach Presentation Status',
   //       accessor:"nachPresentationstatus"
   //   },
     {
         header:'EMI_Count',
         accessor:"collectionCount",
         className:"p-0.5"
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
         header:'Bucket',
         accessor:"bucket",
         className:"p-0.5"
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
   //   },{
   //     header:'Collection Status',
   //     accessor:"collectionStatus"
   // },
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
         header:'Pincode',
         accessor:"pincode",
         className:"p-0.5"
     },{
       header:"Map",
       accessor:"map",
       className:"p-0.5"
     },{
        header:"Details",
       accessor:"details",
       className:"p-0.5"
     }
 ];
 const handleView = (customer)=>{
    setSelectedCustomer(customer)
 }
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
       
        (!filterEmiCount ||
          customer.collectionCount.toString() === filterEmiCount) &&
          (!filterBucket || customer.bucket.toString() === filterBucket)
      );
    });
     }, [searchText, customers,filterEmiCount,filterBucket]);
 
     const paginatedCustomers = useMemo(() => {
       const startIndex = (currentPage - 1) * itemsPerPage;
       const endIndex = startIndex + itemsPerPage;
       return filteredCustomers.slice(startIndex, endIndex);
     }, [currentPage, filteredCustomers]);
     
     const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  return (
    <div className="flex flex-col h-full overflow-hidden ">
    <div className="fixed top-0 left-0 right-0 z-50">
      <Navbar />
    </div>
    {/* content  */}
    <div>
      
    </div>
     <div className="flex flex-col mt-[75px] h-full md:w-[50%] item-center" >
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
          <table className=" w-max   table-auto table-dark-border bg-[#F7F8FA]  ">
            <thead >
              <tr className="text-left  ">
                {columns.map((col) => (
                  <th key={col.accessor} className={col.className}>{col.header}</th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              
              {paginatedCustomers.map((item,index)=><tr key={item._id} className={`text-sm `}>
                

                
              <td className=' text-center'>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                   
                    <td className='text-left'>{item.name}</td>
                    {/* <td className='border px-2 py-2'>{item.mobileNumber}</td> */}
                    {/* <td className='border px-2 py-2'>{item.dbDate}</td>
                    <td className='border px-2 py-2'>{item.loanAmount}</td>
                    <td className='border px-2 py-2'>{item.tenure}</td> */}
                    {/* <td className='hidden md:block'>{item.employee.name}</td> */}
                    {/* <td className='border px-2 py-2'>{item.nachPresentation}</td>
                    <td className='border px-2 py-2'>{item.nachPresentationStatus}</td> */}
                    {/* <td className='text-center'>{item.balanceOutstanding}</td> */}
                    {/* <td className='text-center'>{item.rpaBalance}</td> */}
                    <td className='text-center '>{item.collectionCount}</td>
                    <td className='text-center'>{item.bucket}</td>
                    {/* <td className='text-center'>{item.noOfDays}</td> */}
                    {/* <td className='text-center'>{item.parStatus}</td>
                    <td className='text-center'>{item.emiAmount}</td>
                    <td className='text-center'>{item.totalDue}</td>
                    <td className='text-center'>{item.collectionStatus}</td>
                    <td className='text-center'>{item.finalStatus}</td>
                    <td className='text-center'>{item.collectedAmount}</td>
                    <td className='text-center'>{item.yetToCollect}</td>
                    <td className='text-center'>{item.parCollectionStatus}</td>
                    <td className='text-center'>{item.address}</td> */}
                    <td className='text-center'>{item.pincode}</td>
                    <td className='text-center'>
                      <button onClick={() =>
                    window.open(
                      `https://www.google.com/maps?q=${item.latitude},${item.longitude}`,
                      '_blank'
                    )
                  }><FaMapMarkerAlt className="w-4 h-4 cursor-pointer text-blue-500 flex items-center  " /></button>
                    </td>  
                    <td className=' text-center' >
                       <button onClick={()=>handleView(item)}><MdViewAgenda className="w-4 h-4 cursor-pointer text-green-500 flex items-center  " /></button> </td>            
                  </tr>)}
            </tbody>
            </table>
            {error ? <p className='flex justify-center font-semibold text-red-700'>{error}</p>:""}
            
         {selectedCustomer && < ViewCustomer selectedCustomerData={selectedCustomer} onClose={closeEdit}  />} 
         {loading && <p className='m-auto p-10 font-semibold text-lg '>Loading....</p> }
            </div>
            <div className="w-full bg-white py-2 flex justify-evenly items-center border-t  " >
                        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Prev</button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
                    </div>
          </div>
    </div>
  )
}

export default EmployeeDataTable
