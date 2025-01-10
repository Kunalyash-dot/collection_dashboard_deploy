import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CreationSidebar from "../components/CreationSidebar";
import { FaSearch, FaPlus } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";
import API from '../services/api'
import UpdateUser from "../components/UpdateUser";
import CreateUser from "../components/CreateUser";

function UserCreation() {
  const [createUser,setCreateUser] =useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
const [users,setUsers]=useState([]);  
const [filteredUsers, setFilteredUsers] = useState([]); // Processed users
  const [searchText, setSearchText] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterState, setFilterState] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [updateFlag, setUpdateFlag] = useState(false);
  useEffect( ()=>{
    const fetchUsers =async ()=>{
      try {
        const response = await API.get('/api/users/')
        // console.log(response)
        setUsers(response.data);
        setFilteredUsers(response.data)
        
      } catch (error) {
        console.log(error)
      }
    }
   fetchUsers();
   
  },[updateFlag]);

 

  const handleSearch = (e)=>{
    setSearchText(e.target.value);
  }
 
  const handleUserUpdate = (updatedUser) => {
    // Update the user list with the modified user data
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === updatedUser._id ? updatedUser : user
      )
    );
    setUpdateFlag((prevFlag) => !prevFlag);
    setSelectedUser(null); // Close the update form if needed
  };
  const columns = [
    {
      header:"S.No",
      accessor:"sno"
    },
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Mobile",
      accessor: "mobile",
    },
    {
      header: "State",
      accessor: "state",
    },
    {
      header: "Branch",
      accessor: "branch",
    },
    {
      header: "Role",
      accessor: "role",
    },
    {
      header: "Action",
      accessor: "action",
    },
  ];
  const handleDelete =async(user)=>{
    try {
      API.delete(`/api/users/${user._id}`).then((response)=>{
        // console.log(response);
        // console.log(response.data);
        setUpdateFlag((prevFlag) => !prevFlag);
      })
    } catch (error) {
      console.log(error)
    }

  }
  const handleEdit = (user)=>{
    setSelectedUser(user);
  };
  const closeEdit = ()=>{
    setSelectedUser(null);
    setCreateUser(false)
  }
  const handleCreateUser = ()=>{
    setCreateUser(true);
  }
  useEffect(() => {
    let updatedUsers = [...users];

    // Search
    if (searchText) {
      updatedUsers = updatedUsers.filter((user) =>
        user.name.toLowerCase().includes(searchText.toLowerCase()) || user.mobile.includes(searchText)||user.state.toLowerCase().includes(searchText.toLowerCase())||user.branchName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by Role
    if (filterRole) {
      updatedUsers = updatedUsers.filter((user) => user.role === filterRole);
    }

    // Filter by State
    if (filterState) {
      updatedUsers = updatedUsers.filter((user) => user.state === filterState);
    }

    // Sort
    if (sortField) {
      updatedUsers.sort((a, b) => {
        const compareA = a[sortField];
        const compareB = b[sortField];

        if (typeof compareA === "string" && typeof compareB === "string") {
          return sortOrder === "asc"
            ? compareA.localeCompare(compareB)
            : compareB.localeCompare(compareA);
        }
        return sortOrder === "asc" ? compareA - compareB : compareB - compareA;
      });
    }

    setFilteredUsers(updatedUsers);
  }, [searchText, filterRole, filterState, sortField, sortOrder, users]);


 // Highlight matched text helper function
 const highlightText = (text, searchTerm) => {
  if (!searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, "gi"); // Case-insensitive match
  const parts = text.split(regex);

  return parts.map((part, index) =>
    part.toLowerCase() === searchTerm.toLowerCase() ? (
      <span key={index} className="bg-yellow-300 font-bold">
        {part}
      </span>
    ) : (
      part
    )
  );
};


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
        {/* content  */}

        <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] ml-[14.5%] md:ml-[8.5%] lg:ml-[16.5%] xl:ml-[14.5%] bg-[#F7F8FA]  flex flex-col rounded-lg p-4 " >
          {/* Heading & search */}
          <div className="flex items-center justify-between ">
            <h1 className=" text-2xl font-semibold ">User Creation</h1>
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
              {/* Filters */}
              <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} style={{ marginLeft: "10px", padding: "8px" }}>
        <option value="">Filter by Role</option>
        <option value="Admin">Admin</option>
        <option value="Manager">Manager</option>
        <option value="Employee">Employee</option>
      </select>

      <select value={filterState} onChange={(e) => setFilterState(e.target.value)} style={{ marginLeft: "10px", padding: "8px" }}>
        <option value="">Filter by State</option>
        <option value="Tamil_Nadu">Tamil_Nadu</option>
        <option value="Karnataka">Karnataka</option>
      
      </select>

      {/* Sort */}
      <button
        onClick={() => {
          setSortField("name");
          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        }}
        style={{ marginLeft: "10px", padding: "8px", cursor: "pointer" }}
      >
        Sort by Name {sortField === "name" && (sortOrder === "asc" ? "▲" : "▼")}
      </button>
              <button onClick={handleCreateUser}>
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
              {filteredUsers.map((item,index) => <tr key={item._id}>
              <td className="border px-4 py-2">{index+1}</td>
                <td className="border px-4 py-2">{highlightText(item.name,searchText) }</td>
                <td className="border px-4 py-2">{highlightText(item.mobile,searchText) }</td>
                <td className="border px-4 py-2">{highlightText(item.state,searchText)}</td>
                <td className="border px-4 py-2">{highlightText(item.branchName,searchText) }</td>
                <td className="border px-4 py-2">{item.role}</td>
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
              </tr> )}
             
            </tbody>
          </table>
          {selectedUser && <UpdateUser user={selectedUser} onClose={closeEdit}  onUserUpdate={handleUserUpdate}/>}
          {createUser && <CreateUser onClose={closeEdit} />}

        </div>
      </div>
    </div>
  );
}

export default UserCreation;
