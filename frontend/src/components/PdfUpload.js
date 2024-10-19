import React, { useState } from 'react';

const PdfUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a PDF file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (response.ok) {
        setStatus("PDF uploaded successfully.");
        onUpload(true);
      } else {
        setStatus(result.error);
      }
    } catch (error) {
      setStatus("Error uploading PDF.");
    }
  };

  return (
    <div>
      <h2>Upload PDF</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload PDF</button>
      <p>{status}</p>
    </div>
  );
};

export default PdfUpload;
