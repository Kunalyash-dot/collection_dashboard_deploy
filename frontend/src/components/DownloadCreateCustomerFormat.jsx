import React from 'react'
import API from '../services/api';

function DownloadCreateCustomerFormat() {
    const handleExport =async ()=>{
      try {
        const response = await API.get('/api/bulkUploads/create-customer-sample', {
          responseType: 'blob', // Ensures the response is treated as a file (e.g., Excel, CSV)
        });
    
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
    
        // Provide a filename for the downloaded file
        link.setAttribute('download', 'customers_export.xlsx'); 
        document.body.appendChild(link);
        link.click();
    
        // Clean up the URL object
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error exporting customers:', error);
        alert('Failed to export customers. Please try again.');
      }
        
      }
  return (
    <div className='flex gap-6'>
         <h2 className='text-2xl font-semibold'>Download Create Customer Format</h2>

       <button className='bg-blue-500 w-24 font-semibold rounded-md' onClick={handleExport}>Download </button>
    </div>
  )
}

export default DownloadCreateCustomerFormat
