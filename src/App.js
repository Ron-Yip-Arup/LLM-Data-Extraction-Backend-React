import FileUploadButton from './FileUpload.js';
import GenerateDataButton from './GenerateData.js';
import { useState } from 'react';

function App() {
  const [textData, setTextData] = useState('');
  const [jsonData, setJsonData] = useState('');
  
  return (
    <div>
      <header>
        <FileUploadButton setTextData={setTextData}/>
        <GenerateDataButton textData={textData} setJsonData={setJsonData}/>
      </header>
      <body>
        <p>{jsonData}</p>
      </body>
    </div>
  );
}

export default App;
