import React, { useState } from 'react';

import * as pdfjsLib from "pdfjs-dist/webpack";

pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js';

function FileUploadButton ({ setData }) {
  const [uploadStatus, setUploadStatus] = useState('');
  const [jsonString, setJsonString] = useState('{}');

  async function handleFileUpload(event) {
    const file = event.target.files[0]
    const reader = new FileReader();
    var headerIndex = 7;
    var footerIndex = 3;
    var pageArray = new Array();
    
    reader.onload = async function() {
      try {
        const pdf = await pdfjsLib.getDocument(reader.result).promise;
        for (var i = 1; i <= pdf.numPages; i++) {
          let phraseArray = new Array();
          
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          for (const element of textContent.items) {
            if (!/^\s*$/.test(element.str)) {
              phraseArray.push({ str: element.str, x: parseInt(element.transform[4]), y: parseInt(element.transform[5]), height: element.height });
            }
          }
          const isSameLine = (a, b) => !(Math.abs(b.y - a.y) > (a.height + b.height) / 4);
          phraseArray.sort((a, b) => isSameLine(a, b) ? a.x - b.x: b.y - a.y);
          
          let lineArray = new Array();
          let currentLine = phraseArray[0].str;
          for (let i = 1; i < phraseArray.length; i++) {
            if (isSameLine(phraseArray[i-1], phraseArray[i])) {
              currentLine = currentLine + " | " + phraseArray[i].str;
            } else {
              lineArray.push(currentLine);
              currentLine = phraseArray[i].str;
            }
          }
          lineArray.push(currentLine);
          pageArray.push(lineArray);

          
        }

        var pdfContent = pageArray[0].slice(0, headerIndex).join('\n') + '\n';
        console.log(pageArray);
        for (const lineArray of pageArray) {
          pdfContent += lineArray.slice(headerIndex, lineArray.length - footerIndex).join('\n');
          pdfContent += '\n';
        }
        pdfContent += pageArray[0].slice(pageArray[0].length - footerIndex, pageArray[0].length).join('\n');
    
        setData(pdfContent);

      } catch (error) {
        console.log(error);
      }
    }
    reader.readAsArrayBuffer(file);
    
  }

  return (
    <div>
      <input
        type="file"
        id="fileInput"
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default FileUploadButton;