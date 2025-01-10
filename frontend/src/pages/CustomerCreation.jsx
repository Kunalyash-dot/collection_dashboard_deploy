import React, { useEffect, useState,useMemo} from 'react'
import Navbar from '../components/Navbar'

// import CreationSidebar from '../components/CreationSidebar'
import { FaPlus } from 'react-icons/fa6'
import { FaSearch } from 'react-icons/fa'
import API from '../services/api'
import { BsPencilSquare } from 'react-icons/bs'
import { MdDeleteForever } from 'react-icons/md'
import UpdateCustomer from '../components/UpdateCustomer';
import { FaMapMarkerAlt } from "react-icons/fa";

function CustomerCreation() {
    const [searchText,setSearchText]= useState("")
    const [customers,setCustomers]= useState([]);
    
    const [selectedCustomer,setSelectedCustomer]= useState(null)
     const [updateFlag, setUpdateFlag] = useState(false);
     const [loading,setLoading] = useState(false);
    
    const handleCustomer = ()=>{

    }
    const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 50;


    const handleCustomerUpdate =(UpdtaedCustomer) =>{
      setCustomers((prevCustomers)=>
      prevCustomers.map((customer)=>
      customer._id === UpdtaedCustomer._id ? UpdtaedCustomer:customer));
      setUpdateFlag((prevFlag) => !prevFlag);
      setSelectedCustomer(null)
    }
    const handleSearch = (e)=>{
        setSearchText(e.target.value)
    };
    const closeEdit = ()=>{
      setSelectedCustomer(null);
      // setCreateCustomer(false)
    };

    const handleDelete =async(customer)=>{
      try {
        API.delete(`/api/customers/${customer._id}`).then((res)=>{
          console.log(res.data)
          setUpdateFlag((prevFlag) => !prevFlag);
        })
      } catch (error) {
        console.log(error)
      }
    }
    const handleEdit= (customer)=>{
      setSelectedCustomer(customer);
    }

    useEffect(()=>{
      const fetchCustomer =async ()=>{
        try {
          setLoading(true);
          const res =await API.get('/api/customers/')
          console.log(res.data)
          setCustomers(res.data);
         
          setLoading(false);
        } catch (error) {
          console.error("Error fetching customers:", error);
          alert("Failed to load customers. Please try again.");
        }
      }
      fetchCustomer();
    },[updateFlag])
    const columns = [
        {
            header:'S.No',
            accessor:"sno"
        },
        {
            header:'State',
            accessor:"state"
        },
        {
            header:'Branch',
            accessor:"branch"
        },
        {
            header:'CBS Number',
            accessor:"accountNumber"
        },
        {
            header:'Name',
            accessor:"name"
        },
        {
            header:'Mobile',
            accessor:"mobile"
        },
        {
            header:'DB Date',
            accessor:"dbDate"
        },
        {
            header:'Loan Amount',
            accessor:"loanAmount"
        },
        {
            header:'Tenure',
            accessor:"tenure"
        },
        {
            header:'Mithra Name',
            accessor:"mithraName"
        },
        {
            header:'Nach Presentation',
            accessor:"nachPresentation"
        },
        {
            header:'Nach Presentation Status',
            accessor:"nachPresentationstatus"
        },
        {
            header:'Collection Count',
            accessor:"collectionCount"
        },
        {
            header:'Bal Outstanding',
            accessor:"balOutstanding"
        },
        {
            header:'RPA Bal',
            accessor:"rpaBal"
        },
        {
            header:'Bucket',
            accessor:"bucket"
        },
        {
            header:'No Of Days',
            accessor:"noOfDays"
        },
        {
            header:'PAR Status',
            accessor:"parStatus"
        },
        {
            header:'EMI Amount',
            accessor:"emiAmt"
        },
        {
            header:'Total Due',
            accessor:"totalDue"
        },{
          header:'Collection Status',
          accessor:"collectionStatus"
      },
      {
          header:'Final Status',
          accessor:"finalStatus"
      },
        {
            header:'Collected Amount',
            accessor:"collectedAmount"
        },
        {
            header:'Yet To Collect',
            accessor:"yetToCollect"
        },
        {
          header:"PAR Collection Status",
          accessor:"parCollectionStatus"
        },
        
        {
            header:'Address',
            accessor:"address"
        },
        {
            header:'Pincode',
            accessor:"pincode"
        },{
          header:"Map",
          accessor:"map"
        }
        ,
        {
          header:"Action",
          accessor:"action"
        }
    ];
    
    // useEffect(()=>{
    //   let updtaedCustomer = [...customers]

    //   // console.log(searchText)
    //   if(searchText){
    //     updtaedCustomer = updtaedCustomer.filter((customer)=>customer.name.toLowerCase().includes(searchText.toLowerCase()) || customer.state.toLowerCase().includes(searchText.toLowerCase())|| customer.branch.branchName.toLowerCase().includes(searchText.toLowerCase())|| customer.employee.name.toLowerCase().includes(searchText.toLowerCase())|| customer.collectionStatus.toLowerCase().includes(searchText.toLowerCase())|| customer.finalStatus.toLowerCase().includes(searchText.toLowerCase())|| customer.accountNumber.includes(searchText)|| customer.mobileNumber.includes(searchText) );
    //   }
        
      
    //   setFilteredCustomers(updtaedCustomer)
    // },[searchText,customers])

    const filteredCustomers = useMemo(() => {
      if (!searchText) return customers;
      return customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.state.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.branch.branchName.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.employee.name.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.collectionStatus.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.finalStatus.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.accountNumber.includes(searchText) ||
        customer.mobileNumber.includes(searchText)
      );
    }, [searchText, customers]);

    const paginatedCustomers = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filteredCustomers.slice(startIndex, endIndex);
    }, [currentPage, filteredCustomers]);
    
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    
  return (
    <div className="flex flex-col h-screen ">
        <div className="fixed top-0 left-0 right-0 z-10 ">
          <Navbar />
        </div>

        <div className="flex flow-row  m-1 pt-[75px] ">
          {/* sidebar */}
          {/* <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4  bg-gray-400 fixed h-svh rounded-lg ">
            <CreationSidebar />
          </div> */}

          {/* content  */}
          {/* <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] ml-[14.5%] md:ml-[8.5%] lg:ml-[16.5%] xl:ml-[14.5%] bg-[#F7F8FA]  flex flex-col rounded-lg p-4 "> */}
          <div className='w-full flex flex-col rounded-lg p-4  '>
          <div className="flex items-center justify-between fixed w-screen pr-14 ">
          <h1 className=" text-2xl font-semibold ">Customer Creation</h1>
          <div className="flex items-center gap-4  ">
            <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
                <FaSearch className="w-5 h-5 "  />
                                <input
                                  type="text"
                                  placeholder="Search..."
                                  value={searchText}
                        onChange={handleSearch}
                                  className="w-[200px] p-2 bg-transparent outline-none"
                                />
            </div>
           
                  <div>
                  <button onClick={handleCustomer}>
                            <FaPlus className="w-5 h-5 cursor-pointer" />
                          </button>
                  </div>
                          
            </div>
          </div>
         
          <table className="mt-14 w-full table-auto border border-gray-300 text-left bg-[#F7F8FA]   ">
            <thead >
              <tr className="text-left text-gray-700  ">
                {columns.map((col) => (
                  <th key={col.accessor} className="border px-4 py-2">{col.header}</th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              
              {paginatedCustomers.map((item,index)=><tr key={item._id} className='text-sm'>
              <td className='border px-4 py-2'>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className='border px-4 py-2'>{item.state}</td>
                    <td className='border px-4 py-2'>{item.branch.branchName}</td>
                    <td className='border px-4 py-2'>{item.accountNumber}</td>
                    <td className='border px-4 py-2'>{item.name}</td>
                    <td className='border px-4 py-2'>{item.mobileNumber}</td>
                    <td className='border px-4 py-2'>{item.dbDate}</td>
                    <td className='border px-4 py-2'>{item.loanAmount}</td>
                    <td className='border px-4 py-2'>{item.tenure}</td>
                    <td className='border px-4 py-2'>{item.employee.name}</td>
                    <td className='border px-4 py-2'>{item.nachPresentation}</td>
                    <td className='border px-4 py-2'>{item.nachPresentationStatus}</td>
                    <td className='border px-4 py-2'>{item.collectionCount}</td>
                    <td className='border px-4 py-2'>{item.balanceOutstanding}</td>
                    <td className='border px-4 py-2'>{item.rpaBalance}</td>
                    <td className='border px-4 py-2'>{item.bucket}</td>
                    <td className='border px-4 py-2'>{item.noOfDays}</td>
                    <td className='border px-4 py-2'>{item.parStatus}</td>
                    <td className='border px-4 py-2'>{item.emiAmount}</td>
                    <td className='border px-4 py-2'>{item.totalDue}</td>
                    <td className='border px-4 py-2'>{item.collectionStatus}</td>
                    <td className='border px-4 py-2'>{item.finalStatus}</td>
                    <td className='border px-4 py-2'>{item.collectedAmount}</td>
                    <td className='border px-4 py-2'>{item.yetToCollect}</td>
                    <td className='border px-4 py-2'>{item.parCollectionStatus}</td>
                    <td className='border px-4 py-2'>{item.address}</td>
                    <td className='border px-4 py-2'>{item.pincode}</td>
                    <td className='border px-4 py-2'>
                      <button onClick={() =>
                    window.open(
                      `https://www.google.com/maps?q=${item.latitude},${item.longitude}`,
                      '_blank'
                    )
                  }><FaMapMarkerAlt className="w-5 h-5 cursor-pointer text-green-500 " /></button>
                    </td>
                    <td className="border px-4 py-2">
                                      <div className="flex gap-4">
                                        <button  onClick={()=>handleEdit(item)} aria-label="Edit Customer">
                                        <BsPencilSquare className="w-5 h-5 cursor-pointer text-blue-500 "  />
                                        </button>
                                        <button onClick={()=>handleDelete(item)}aria-label="delete Customer">
                                        <MdDeleteForever  className="w-6 h-6 text-red-700 cursor-pointer" />
                                        </button>
                                      </div>
                                    </td>
                   
                   
              </tr>)}
            </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
                        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Prev</button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
                    </div>
         {selectedCustomer && < UpdateCustomer customer={selectedCustomer} onClose={closeEdit} onCustomerUpdate={handleCustomerUpdate} />} 
         {loading && <p className='m-auto p-10 font-semibold text-lg '>Loading....</p> }
            </div>

          </div>
          </div>
  )
}

export default CustomerCreation
