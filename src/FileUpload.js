import React, { useState } from 'react';
// import Data from './Data.js';
// <Data data_key="key1" data_value="value"/>


const FileUploadButton = () => {
  const [uploadStatus, setUploadStatus] = useState('');
  const [jsonString, setJsonString] = useState('{}');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    // You can perform further operations with the uploaded file here
    console.log('Selected file:', file);
    
    // Update the upload status
    setUploadStatus('uploaded');
    setJsonString(file.name)
  };

  return (
    <div>
      <input
        type="file"
        id="fileInput"
        onChange={handleFileUpload}
      />
      
      {uploadStatus === 'uploaded' && <p>{jsonString}</p>}
    </div>
  );
};

export default FileUploadButton;