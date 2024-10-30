import React from 'react';
import { AzureOpenAI } from "openai";

function GenerateDataButton ({ textData, setJsonData }) {

  async function generateResult() {
    // template variables
    const instruction = await (await fetch('/instruction.txt')).text();
    const sampleInput = await (await fetch('/sample.txt')).text();
    const sampleOutput = await (await fetch('/sample.json')).text();
    
    // check if file is loaded
    if (textData === "") {
      setJsonData("Please Select a File")

    } else {
      setJsonData("Processing File...");

      // establish connection to Azure OpenAI
      const client = new AzureOpenAI({ 
        endpoint: "<api-endpoint>", 
        apiKey: "<api-key>", 
        deployment: "gpt-4-32k", 
        apiVersion: "2024-06-01", 
        dangerouslyAllowBrowser: true 
      });

      // request OpenAI response with message history
      const messages = [
        { role: "system", content: instruction },
        { role: "user", content: sampleInput },
        { role: "assistant", content: sampleOutput },
        { role: "user", content: textData },
      ];
      try {
        const result = await client.chat.completions.create({ messages: messages, model: "gpt-4-32k", max_tokens: 8000 });
        setJsonData(result.choices[0].message.content);
      } catch (error) {
        setJsonData(error);
      }
    }
  }
  
  return (
    <button onClick={generateResult}>Generate Result</button>
  );
};

export default GenerateDataButton;
