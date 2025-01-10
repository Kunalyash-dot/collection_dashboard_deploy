import React, { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa6'
import API from '../services/api';
import { BsPencilSquare } from 'react-icons/bs';
import { MdDeleteForever } from 'react-icons/md';
import CreateDetails from './CreateDetails';
import UpdateDetails from './UpdateDetails';

function Details() {
  const [createDetails,setCreateDetails]=useState(false);
  const [selectedDetails,setSelectedDetails] = useState(null);
  const [details,setDetails] = useState([]);

  useEffect( ()=>{
    const fetchDetails =async ()=>{
      try {
        const response = await API.get('/api/details/getDetails')
        // console.log(response)
        setDetails(response.data.details);
        // console.log(response.data.details)
           
      } catch (error) {
        console.log(error)
      }
    }
    fetchDetails();
   
  },[]);

  const handleCreateDetails = () =>{
setCreateDetails(true)

  }
  const closeEdit = ()=>{
    setSelectedDetails(null);
    setCreateDetails(false)
  }

  const handleDelete =async(detail)=>{
    try {
      API.delete(`/api/details/deleteDetails/${detail._id}`).then((response)=>{
        console.log(response);
        // console.log(response.data);
        // setUpdateFlag((prevFlag) => !prevFlag);
      })
    } catch (error) {
      console.log(error)
    }

  }
  const handleEdit = (item)=>{
    setSelectedDetails(item);
  };

  return (
    <div>
      <div className='flex justify-between'>
      <h2 className="text-2xl font-semibold">Date & Descrption</h2>
      <button onClick={handleCreateDetails}>
                      <FaPlus className="w-5 h-5 cursor-pointer" />
                    </button>
      </div>
      <table className="mt-5 w-full table-auto border border-gray-300 text-left ">
      <thead>
              <tr className="text-left text-gray-700 ">
               <th className="border px-4 py-2">S.No</th>
               <th className="border px-4 py-2">Date</th>
               <th className="border px-4 py-2">Description</th>
               <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
          <tbody>
            {details.map((item,index)=>
            <tr key={index}>
              <td className="border px-4 py-2"> {index+1} </td>
              <td className="border px-4 py-2"> {item.updateDate} </td>
              <td className="border px-4 py-2"> {item.description} </td>
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
            </tr>
            )}
          </tbody>

      </table>
      {selectedDetails && <UpdateDetails detail={selectedDetails} onClose={closeEdit}  />}
      {createDetails && <CreateDetails onClose={closeEdit} /> }
    </div>
  )
}

export default Details
