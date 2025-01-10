import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CreationSidebar from "../components/CreationSidebar";
import { FaPlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import API from "../services/api";
import UpdateBranch from "../components/UpdateBranch";
import CreateBranch from "../components/CreateBranch";

function BranchCreation() {
  const [searchText, setSearchText] = useState("");
  const [branches, setBranches] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState(null);
  const [createBranch,setCreateBranch] = useState(false);
  const [updateFlag, setUpdateFlag] = useState(false);
  useEffect(() => {
    const fetchbranch = async () => {
      try {
        const res = await API.get("/api/branches/");
        // console.log(res);
        setBranches(res.data);
      } catch (error) {}
    };
    fetchbranch();
  }, [updateFlag]);

  const handleBranchUpdate = (updatedBranch) => {
    // Update the user list with the modified user data
    setBranches((prevUsers) =>
      prevUsers.map((branch) =>
        branch._id === updatedBranch._id ? updatedBranch : branch
      )
    );
    setUpdateFlag((prevFlag) => !prevFlag);
    setSelectedBranches(null); // Close the update form if needed
  };
  // console.log(branches)
  
    const columns = [
      {
        header: "S.No",
        accessor: "sno",
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
        header: "Action",
        accessor: "action",
      },
    ];

    const handleSearch = (e) => {
      setSearchText(e.target.value);
    };

    const handleDelete = async (user) => {
      try {
        const res = await API.delete(`/api/branches/${user._id}`)
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    };
    const handleEdit = (branch) => {
      setSelectedBranches(branch);
      
    };
  
    const closeEdit = ()=>{
      setSelectedBranches(null);
      setCreateBranch(false);
    }
    const handleCreateBranch = ()=>{
      setCreateBranch(true);
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
          {/* content  */}
          <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] ml-[14.5%] md:ml-[8.5%] lg:ml-[16.5%] xl:ml-[14.5%] bg-[#F7F8FA]  flex flex-col rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h1 className=" text-2xl font-semibold ">Branch Creation</h1>
              <div className="flex items-center gap-4">
                <form className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
                  <FaSearch className="w-5 h-5 " />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={handleSearch}
                    className="w-[200px] p-2 bg-transparent outline-none"
                  />
                </form>
                <button onClick={handleCreateBranch}>
                  <FaPlus className="w-5 h-5 cursor-pointer" onClick={handleCreateBranch} />
                </button>
              </div>
            </div>
            {/* table  */}

            <table className="mt-5 w-full table-auto border border-gray-300 text-left ">
              <thead>
                <tr className="text-left text-gray-700 ">
                  {columns.map((col) => (
                    <th key={col.accessor} className="border px-4 py-2">
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {branches.map((item, index) => (
                  <tr key={item._id}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{item.state}</td>
                    <td className="border px-4 py-2">{item.branchName}</td>

                    <td className="border px-4 py-2">
                      <div className="flex gap-4">
                        <button onClick={() => handleEdit(item)}>
                          <BsPencilSquare className="w-5 h-5 cursor-pointer text-blue-500 " />
                        </button>
                        <button onClick={() => handleDelete(item)}>
                          <MdDeleteForever className="w-6 h-6 text-red-700 cursor-pointer" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {selectedBranches && <UpdateBranch branch={selectedBranches} onClose={closeEdit} onBranchUpdate={handleBranchUpdate} />}
            {createBranch && <CreateBranch onClose={closeEdit} />}
          </div>
        </div>
      </div>
    );
  };


export default BranchCreation;
