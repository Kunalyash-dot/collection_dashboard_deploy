import React, { useState } from 'react'
import API from '../services/api';

function BulkDeleteCustomer() {
     const [deleteFile,setDeleteFile]= useState(null);
      const [message, setMessage] = useState('');
    const [progress, setProgress] = useState(0);
      const [uploading, setUploading] = useState(false);


      const startPolling = () => {
        setUploading(true);
    
        
         // Start polling progress endpoint
  const interval = setInterval(async () => {
    try {
      const response = await API.get("/api/bulkUploads/bulkDeleteCustomerProgress");
      console.log("Polling in progress...");
      const data = response.data;

      setProgress(data.progress);
      console.log(`Progress: ${data.progress}%`);

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

  return interval; // Return the interval ID
      };

      const handleUpdateFileChange=(e)=>{
        setDeleteFile(e.target.files[0])
      }
      const handleDeleteUpload=async(e)=>{
        e.preventDefault(); // Prevent default form submission behavior, if applicable

  if (!deleteFile) {
    alert('Please select a file');
    return;
  }

  const formData = new FormData();
  formData.append('file', deleteFile);

  let pollingInterval; // Declare pollingInterval in the outer scope

  try {
    pollingInterval = startPolling(); // Start polling and assign the interval ID

    const response = await API.post('/api/bulkUploads/delete-customers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    setMessage(response.data.message);
  } catch (error) {
    console.error('Error uploading file:', error);
    setMessage('Bulk update failed');
    setUploading(false);

    if (pollingInterval) {
      clearInterval(pollingInterval); // Stop polling if the upload fails
    }
  }
      }
  return (
    <div>
      <div className='flex mt-6'>
      
      <input type="file" onChange={handleUpdateFileChange} />
      <button className='bg-blue-500 w-20 font-semibold rounded-md' onClick={handleDeleteUpload}>Upload</button>
      </div>
      {uploading && (
        <div>
          <p>Uploading: {progress.toFixed(2)}%</p>
          <progress value={progress} max="100"></progress>
        </div>
      )}
      {progress === 100 && <p>Delete Complete!</p>}
      {message && <p>{message}</p>}
    </div>
  )
}

export default BulkDeleteCustomer
