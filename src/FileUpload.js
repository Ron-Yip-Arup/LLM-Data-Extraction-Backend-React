import React from 'react';

import * as pdfjsLib from "pdfjs-dist/webpack";

pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js';

function FileUploadButton ({ setTextData }) {

  async function handleFileUpload(event) {
    // template variables
    const headerIndex = 7;
    const footerIndex = 3;

    const file = event.target.files[0]
    const reader = new FileReader();
    var pageArray = new Array();
    
    reader.onload = async function() {
      try {
        // load pdf and text contents of each page
        const pdf = await pdfjsLib.getDocument(reader.result).promise;
        for (var i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          // append all text elements into phraseArray
          let phraseArray = new Array();
          for (const element of textContent.items) {
            if (!/^\s*$/.test(element.str)) {
              phraseArray.push({ str: element.str, x: parseInt(element.transform[4]), y: parseInt(element.transform[5]), height: element.height });
            }
          }
          // sort text elements
          const isSameLine = (a, b) => !(Math.abs(b.y - a.y) > (a.height + b.height) / 4);
          phraseArray.sort((a, b) => isSameLine(a, b) ? a.x - b.x: b.y - a.y);
          
          // concat text elements of each line and append to lineArray
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
          // append lines of current page to pageArray
          pageArray.push(lineArray);
          
        }

        // append header to pdfContent
        var pdfContent = pageArray[0].slice(0, headerIndex).join('\n') + '\n';
        // append content to pdfContent
        for (const lineArray of pageArray) {
          pdfContent += lineArray.slice(headerIndex, lineArray.length - footerIndex).join('\n');
          pdfContent += '\n';
        }
        // append footer to pdfContent
        pdfContent += pageArray[0].slice(pageArray[0].length - footerIndex, pageArray[0].length).join('\n');
    
        setTextData(pdfContent);

      } catch (error) {
        console.log(error);
      }
    }
    reader.readAsArrayBuffer(file);
  }

  return (
    <input type="file" onChange={handleFileUpload} />
  );
};

export default FileUploadButton;