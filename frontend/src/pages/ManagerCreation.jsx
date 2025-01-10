import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import CreationSidebar from '../components/CreationSidebar';
import { FaPlus } from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';
import API from '../services/api';
import CreateManager from '../components/CreateManager';
import { BsPencilSquare } from 'react-icons/bs';
import { MdDeleteForever } from 'react-icons/md';
import UpdateManager from '../components/UpdateManager';

function ManagerCreation() {
  const [searchText, setSearchText] = useState("");
  const [managers,setManagers]=useState([]); 
   const [createManager,setCreateManager] =useState(false);
   const [selectedManager,setSelectedManager] = useState(null);
    const [updateFlag, setUpdateFlag] = useState(false);
// console.log(managers)
  useEffect( ()=>{
    const fetchManagers =async ()=>{
      try {
        const response = await API.get('/api/managers/')
        console.log(response)
        console.log(response.data)
        setManagers(response.data.managerData);
        
      } catch (error) {
        console.log(error)
      }
    }
   fetchManagers();
   
  },[updateFlag]);

const handleSearch = ()=>{}
const handleCreateManager = ()=>{
setCreateManager(true);
}
const closeEdit = ()=>{
 
  setCreateManager(false)
  setSelectedManager(null)
}
const columns = [
  {
    header:"S.No",
    accessor:"sno"
  },
  {
    header: "Manager Name",
    accessor: "managerName",
  },
  {
    header: "State",
    accessor: "state",
  },
  {
    header: "Branches",
    accessor: "branches",
  },
  {
    header: "Employees",
    accessor: "employees",
  },
  {
    header: "Action",
    accessor: "action",
  },
];

const handleEdit = (manager)=>{
  setSelectedManager(manager)
}

const handleManagerUpdate = (updatedManger)=>{
  setManagers((prevManagers)=>
  prevManagers.map((manager)=>manager._id === updatedManger._id ? updatedManger : manager));
  setUpdateFlag((prevFlag)=> !prevFlag);
  setSelectedManager(null);
}

const handleDelete = async (manager)=>{
  try {
    API.delete(`/api/managers/deleteManager/${manager._id}`).then((response)=>{
      setUpdateFlag((prevFlag) => !prevFlag);
    })
  } catch (error) {
    console.log(error)
  }
}
  return (
    <div className="flex flex-col h-screen ">
    <div className="fixed top-0 left-0 right-0 z-10 ">
      <Navbar />
    </div>

    <div className="flex flow-row  m-1 pt-[75px]">
      {/* sidebar */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4  bg-gray-400 fixed h-full rounded-lg">
        <CreationSidebar />
      </div>

      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] ml-[14.5%] md:ml-[8.5%] lg:ml-[16.5%] xl:ml-[14.5%] bg-[#F7F8FA]  flex flex-col rounded-lg p-4 " >
          {/* Heading & search */}
          <div className="flex items-center justify-between ">
            <h1 className=" text-2xl font-semibold ">Manager Allocation</h1>
             <div className="flex items-center gap-4">
                          <form
                           
                            className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2"
                          >
                            <FaSearch className="w-5 h-5 "  />
                            <input
                              type="text"
                              placeholder="Search..."
                              value={searchText}
                    onChange={handleSearch}
                              className="w-[200px] p-2 bg-transparent outline-none"
                            />
                          </form>
                          
                 
                          <button onClick={handleCreateManager}>
                            <FaPlus className="w-5 h-5 cursor-pointer" />
                          </button>
                        
                      </div>

            </div>
             {/* table  */}
 <table className="mt-5 w-full table-auto border border-gray-300 text-left ">
            <thead>
              <tr className="text-left text-gray-700 ">
                {columns.map((col) => (
                  <th key={col.accessor} className="border px-4 py-2">{col.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {managers.map((item,index)=><tr key={item._id}>
                    <td className="border px-4 py-2">{index+1}</td>
                    <td className="border px-4 py-2">{item.user.name}</td>
                    <td className="border px-4 py-2">{item.state}</td>
                    <td className="border px-4 py-2"> {item.branches.map((branch,i)=>(<span key={i}>{branch.branchName}{i<item.branches.length - 1 ?',':''}</span>))}</td>
                    <td className="border px-4 py-2">{item.employees.map((employee, i) => (
          <span key={i}>
            {employee.name}
            {i < item.employees.length - 1 ? ', ' : ''}
          </span>
        ))}</td>
        <td className="border px-4 py-2">
                          <div className="flex gap-4">
                            <button  onClick={()=>handleEdit(item)}>
                            <BsPencilSquare className="w-5 h-5 cursor-pointer text-blue-500 "  />
                            </button>
                            <button onClick={()=>handleDelete(item)}>
                            <MdDeleteForever  className="w-6 h-6 text-red-700 cursor-pointer" />
                            </button>
                          </div>
                        </td>
              </tr>)}
              </tbody>
              </table>
              {selectedManager && <UpdateManager selectedManagerData={selectedManager} onClose={closeEdit} onManagerUpdate={handleManagerUpdate} />}
              {createManager && <CreateManager onClose={closeEdit} />}
            </div>
      </div>
    </div>
      
      
  )
}

export default ManagerCreation;
