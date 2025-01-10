import React, { useState } from 'react'
import API from '../services/api';

function BulkUpdateCustomer() {
    const [updateFile,setUpdateFile]= useState(null);
  const [message, setMessage] = useState('');
const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);


  
  const startPolling = () => {
    setUploading(true);

    // Start polling progress endpoint
    const interval = setInterval(async () => {
      try {
        const response = await API.get("/api/bulkUploads/bulkUpdateCustomerProgress");
        // console.log(response);
        const data = response.data;
        // console.log(data)

        setProgress(data.progress);

        // Stop polling when progress reaches 100%
        if (data.progress >= 100) {
          clearInterval(interval);
          setUploading(false);
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
        clearInterval(interval);
        setUploading(false);
      }
    }, 1000); // Poll every 1 second
  };

  const handleUpdateFileChange=(e)=>{
    setUpdateFile(e.target.files[0])
  }
  const handleUpdateUpload=async(e)=>{
    if (!updateFile) {
      alert('Please select a file');
      return;
    }
    const formData = new FormData();
    formData.append('file', updateFile);
    startPolling();
    try {
      const response = await API.post('/api/bulkUploads/update-customers',formData,{
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setMessage(response.data.message);
      // window.location.href = `http://localhost:4000/uploads/${response.data.resultFilePath}`;
    } catch (error) {
      console.error('Error uploading file:', error);
        setMessage('Bulk update failed');
    }
  }
   
  return (
    <div>
      <div className='flex mt-6'>
      
      <input type="file" onChange={handleUpdateFileChange} />
      <button className='bg-blue-500 w-20 font-semibold rounded-md' onClick={handleUpdateUpload}>Upload</button>
      </div>
      {uploading && (
        <div>
          <p>Uploading: {progress.toFixed(2)}%</p>
          <progress value={progress} max="100"></progress>
        </div>
      )}
      {progress === 100 && <p>Upload Complete!</p>}
      {message && <p>{message}</p>}
    
    </div>
  )
}

export default BulkUpdateCustomer;
