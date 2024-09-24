import Data from './Data.js';
import FileUploadButton from './FileUpload.js';
import { useState } from 'react';

function App() {
  const [data, setData] = useState('');

  return (
    <div>
      <header>
        <FileUploadButton setData={setData}/>
      </header>
      <body>
        <p>{data}</p>
        {/* <Data data_key="key1" data_value="value"/> */}
      </body>
    </div>
  );
}

export default App;
