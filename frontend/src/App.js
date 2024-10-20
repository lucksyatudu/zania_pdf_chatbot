import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [questions, setQuestions] = useState(''); // Text area for multiple questions
  const [answers, setAnswers] = useState({}); // To store answers in key-value format
  const [uploadMessage, setUploadMessage] = useState('');

  // Handle PDF file upload
  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  // Handle questions change (textarea)
  const handleQuestionsChange = (e) => {
    setQuestions(e.target.value);
  };

  // Upload PDF file to the backend
  const handleUpload = async () => {
    if (!pdfFile) {
      alert('Please select a PDF file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', pdfFile);

    try {
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadMessage(response.data.message);
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setUploadMessage('Failed to upload PDF');
    }
  };

  // Submit the questions and get answers from backend
  const handleAskQuestions = async () => {
    if (!questions.trim()) {
      alert('Please enter at least one question.');
      return;
    }

    // Split the input by new lines to create an array of questions
    const questionArray = questions.trim().split('\n').filter((q) => q.trim() !== '');

    if (questionArray.length === 0) {
      alert('Please enter valid questions.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/ask-questions', {
        questions: questionArray, // Send the array of questions to the backend
      });

      setAnswers(response.data); // Store the answers in state
    } catch (error) {
      console.error('Error fetching answers:', error);
    }
  };

  return (
    <div className="App">
      <h1>Document QA System</h1>

      <div>
        <label>Upload PDF Document:</label>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload PDF</button>
      </div>

      {uploadMessage && <p>{uploadMessage}</p>}

      <div>
        <label>Enter Questions (one per line):</label>
        <textarea
          rows="5"
          value={questions}
          onChange={handleQuestionsChange}
          placeholder="Enter multiple questions, one per line"
        />
        <button onClick={handleAskQuestions}>Ask Questions</button>
      </div>

      {Object.keys(answers).length > 0 && (
        <div>
          <h2>Answers:</h2>
          <ul>
            {Object.entries(answers).map(([question, answer], index) => (
              <li key={index}>
                <strong>{question}</strong>: {answer}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
