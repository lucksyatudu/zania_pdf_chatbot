import React, { useState } from 'react';
import PdfUpload from './components/PdfUpload';
import QuestionBox from './components/QuestionBox';
import './styles.css';

function App() {
  const [isPdfUploaded, setIsPdfUploaded] = useState(false);

  return (
    <div className="App">
      <h1>PDF Question App</h1>
      {!isPdfUploaded ? (
        <PdfUpload onUpload={setIsPdfUploaded} />
      ) : (
        <QuestionBox />
      )}
    </div>
  );
}

export default App;
