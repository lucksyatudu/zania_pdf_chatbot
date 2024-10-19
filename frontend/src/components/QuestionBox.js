import React, { useState } from 'react';

const QuestionBox = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleQuestionSubmit = async () => {
    if (!question.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/ask', {
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
        setAnswer(result.error);
      }
    } catch (error) {
      setAnswer("Error fetching answer.");
    }
  };

  return (
    <div>
      <h2>Ask a Question</h2>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question based on the PDF..."
      />
      <button onClick={handleQuestionSubmit}>Get Answer</button>
      <div>
        <h3>Answer:</h3>
        <textarea value={answer} readOnly rows="4" />
      </div>
    </div>
  );
};

export default QuestionBox;
