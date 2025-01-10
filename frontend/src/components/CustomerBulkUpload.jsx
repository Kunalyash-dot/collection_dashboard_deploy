import React, { useState } from 'react'
import API from '../services/api';

function CustomerBulkUpload() {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const startPolling = () => {
    setUploading(true);

    // Start polling progress endpoint
    const interval = setInterval(async () => {
      try {
        const response = await API.get("/api/bulkUploads/bulkCreateCustomerProgress");
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
    }, 1500); // Poll every 1 second
  };
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
      };

      const handleUpload = async ()=>{
        if (!file) {
          alert('Please select a file');
          return;
        }
        const formData = new FormData();
        formData.append('file',file);
        startPolling();
        try {
          const response = await API.post('/api/bulkUploads/upload-customers',formData,{
            headers:{'Content-Type':'multipart/form-data'},
          });
          
          // window.location.href = 'http://localhost:4000/api/bulkUploads/upload-customers';
          // alert(response.data.message);
          setUploadStatus(response.data);
        } catch (e) {
          console.error(e.message);
          alert(e.Error);
        }
      }
  return (
    <div>
       <div className='flex mt-6'>
      <input type="file"  onChange={handleFileChange} />
      <button className='bg-blue-500 w-20 font-semibold rounded-md' onClick={handleUpload}>Upload</button>
      </div>
      {uploading && (
        <div>
          <p>Uploading: {progress.toFixed(2)}%</p>
          <progress value={progress} max="100"></progress>
        </div>
      )}
      {progress === 100 && <p>Upload Complete!</p>}
      {uploadStatus && (
        <div className='flex flex-col gap-2 pl-8'>
          <h2 className='font-semibold'>Upload Summary</h2>
          <p>Valid Records Uploaded: {uploadStatus.validRecordsCount}</p>
          <p>Duplicate Records Found: {uploadStatus.duplicateRecordsCount}</p>
          <a href={`http://localhost:4000/uploads/${uploadStatus.resultFilePath}`} download>
            Download Results
          </a>
          </div>
      )}
    

    </div>
  )
}

export default CustomerBulkUpload
