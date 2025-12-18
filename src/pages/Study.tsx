import { useState } from 'react';
import type { QuizQuestion } from '../types'; // Import the new interface

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

function Study() {
  const [studyNote, setStudyNote] = useState('');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]); // New state for parsed questions
  const [loading, setLoading] = useState(false);
  const [rawAiResponse, setRawAiResponse] = useState(''); // Store raw response for debugging if needed

  // Function to parse the AI's response into structured questions
  const parseQuizText = (text: string): QuizQuestion[] => {
    const questions: QuizQuestion[] = [];
    const questionBlocks = text.split(/(Q\d+:)/).filter(Boolean);

    for (let i = 0; i < questionBlocks.length; i += 2) {
      if (questionBlocks[i].startsWith('Q')) {
        const questionText = questionBlocks[i + 1].split('\n').filter(line => line.trim() !== '')[0].trim();
        const options: { [key: string]: string } = {};
        let correctAnswer = '';

        const optionsAndCorrect = questionBlocks[i + 1].split('\n').slice(1);
        for (const line of optionsAndCorrect) {
          if (line.startsWith('A) ') || line.startsWith('B) ') || line.startsWith('C) ') || line.startsWith('D) ')) {
            const optionKey = line.substring(0, 1);
            const optionText = line.substring(3).trim();
            options[optionKey] = optionText;
          } else if (line.startsWith('Correct: ')) {
            correctAnswer = line.substring('Correct: '.length).trim();
          }
        }

        questions.push({
          question: questionText,
          options,
          correctAnswer,
        });
      }
    }
    return questions;
  };

  const handleAsk = async () => {
    if (!studyNote.trim()) return;

    setLoading(true);
    setQuizQuestions([]); // Clear previous questions
    setRawAiResponse('');

    const detailedPrompt = `
    Based on the following study note, generate multiple-choice questions in the exact format shown below.
    Ensure each question has four options (A, B, C, D) and specify the correct answer.

    Study Note:
    """
    ${studyNote}
    """

    AI Raw Response Format Example:
    Q1: Which version of React introduced Hooks?
    A) 15.0
    B) 16.3
    C) 16.8
    D) 18.2
    Correct: C

    Q2: What are the two values returned by the useState hook?
    A) The current state and a function to update it
    B) The previous state and a new state
    C) An object and a class
    D) A mounting function and an unmounting function
    Correct: A

    Q3: When does a useEffect hook run if it has an empty dependency array []?
    A) After every single render
    B) Only once, when the component mounts
    C) Only when the component is about to unmount
    D) Every time the state changes
    Correct: B
    `;

    try {
      const requestBody = {
        contents: [
          {
            parts: [
              { text: detailedPrompt }
            ]
          }
        ]
      };

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;
      setRawAiResponse(aiResponse); // Store raw response
      setQuizQuestions(parseQuizText(aiResponse)); // Parse and set questions
    } catch (error) {
      console.error('AI Error:', error);
      setRawAiResponse('Sorry, I encountered an error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Study with AI</h2>
      <div>
        <textarea 
          value={studyNote}
          onChange={(e) => setStudyNote(e.target.value)}
          placeholder="Paste your study note here to generate questions..."
          rows={4}
          style={{ width: '100%', padding: '0.5rem' }}
        />
        <button onClick={handleAsk} disabled={loading}>
          {loading ? 'Thinking...' : 'Ask AI'}
        </button>
      </div>
      {quizQuestions.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Generated Questions:</h3>
          {quizQuestions.map((q, index) => (
            <div key={index} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '0.5rem', backgroundColor: 'white' }}>
              <p><strong>Q{index + 1}: {q.question}</strong></p>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {Object.entries(q.options).map(([key, value]) => (
                  <li key={key} style={{ marginBottom: '0.5rem' }}>
                    <strong>{key})</strong> {value}
                  </li>
                ))}
              </ul>
              <p style={{ fontWeight: 'bold', color: 'green' }}>Correct: {q.correctAnswer}</p>
            </div>
          ))}
        </div>
      )}

      {loading && <p>Generating questions...</p>}

      {rawAiResponse && quizQuestions.length === 0 && !loading && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Raw AI Response (Error/Unparsed):</h3>
          <pre style={{
            padding: '1rem',
            backgroundColor: '#ffe0e0',
            borderRadius: '0.5rem',
            color: 'red',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {rawAiResponse}
          </pre>
          <p style={{ color: 'red' }}>Could not parse AI response into quiz questions. Please check the raw response for formatting issues.</p>
        </div>
      )}
    </div>
  );
}

export default Study;