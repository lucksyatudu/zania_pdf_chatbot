import React, { useState } from 'react';

const App = () => {
    const [file, setFile] = useState(null);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        if (!file) {
            console.error("No file selected");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                console.log(result.message);
                alert("File uploaded successfully");
            } else {
                console.error(result.detail);
                alert(result.detail);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleAskQuestion = async (event) => {
        event.preventDefault();
        if (!question) {
            console.error("No question provided");
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/ask-question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question }),
            });

            const result = await response.json();
            if (response.ok) {
                setAnswer(result.answer);
            } else {
                console.error(result.detail);
                alert(result.detail);
            }
        } catch (error) {
            console.error('Error asking question:', error);
        }
    };

    return (
        <div>
            <h1>PDF Upload and Question Answering App</h1>
            <form onSubmit={handleUpload}>
                <input type="file" onChange={handleFileChange} accept="application/pdf" />
                <button type="submit">Upload PDF</button>
            </form>

            <form onSubmit={handleAskQuestion}>
                <input 
                    type="text" 
                    placeholder="Ask a question based on the document" 
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)} 
                />
                <button type="submit">Ask Question</button>
            </form>

            {answer && (
                <div>
                    <h3>Answer:</h3>
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
};

export default App;
