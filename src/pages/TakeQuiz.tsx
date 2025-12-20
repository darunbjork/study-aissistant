import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { type Quiz } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';

function QuizPlayer({ quiz }: { quiz: Quiz }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(() =>
    new Array(quiz.questions.length).fill(-1)
  );
  const [score, setScore] = useState<number | null>(null);
  const navigate = useNavigate();


    const currentQ = quiz.questions[currentQuestion];

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const correctAnswers = quiz.questions.reduce((acc, question, index) => {
      return acc + (selectedAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
    setScore(correctAnswers);
  };

  if (score !== null) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card title="Quiz Results">
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#4f46e5',
              marginBottom: '16px'
            }}>
              {score}/{quiz.questions.length}
            </div>
            <p style={{
              color: '#666',
              marginBottom: '24px'
            }}>
              You got {score} out of {quiz.questions.length} questions correct!
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Button onClick={() => navigate('/profile')}>
                Back to Profile
              </Button>
              <Button variant="secondary" onClick={() => window.location.reload()}>
                Retry Quiz
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>
            {quiz.title}
          </h1>
          <p style={{ color: '#666', marginBottom: '16px' }}>
            {quiz.description}
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '14px', color: '#888' }}>
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: index === currentQuestion
                      ? '#4f46e5'
                      : selectedAnswers[index] !== -1
                      ? '#10b981'
                      : '#e5e7eb',
                    color: index === currentQuestion ? 'white' : selectedAnswers[index] !== -1 ? 'white' : '#666'
                  }}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>
            {currentQ.question}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                style={{
                  padding: '16px',
                  textAlign: 'left',
                  border: selectedAnswers[currentQuestion] === index
                    ? '2px solid #4f46e5'
                    : '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: selectedAnswers[currentQuestion] === index
                    ? '#eef2ff'
                    : 'white',
                  cursor: 'pointer'
                }}
                onClick={() => handleAnswerSelect(index)}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: selectedAnswers[currentQuestion] === index
                      ? '1px solid #4f46e5'
                      : '1px solid #888',
                    backgroundColor: selectedAnswers[currentQuestion] === index
                      ? '#4f46e5'
                      : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px',
                    color: selectedAnswers[currentQuestion] === index ? 'white' : 'transparent'
                  }}>
                    ✓
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="secondary"
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(prev => prev - 1)}
          >
            Previous
          </Button>
          
          {currentQuestion < quiz.questions.length - 1 ? (
            <Button
              disabled={selectedAnswers[currentQuestion] === -1}
              onClick={() => setCurrentQuestion(prev => prev + 1)}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="success"
              disabled={selectedAnswers.some(answer => answer === -1)}
              onClick={handleSubmit}
            >
              Submit Quiz
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function TakeQuiz() {
  const { quizId } = useParams<{ quizId: string }>();
  const auth = useAuth();

  const quiz = useMemo(() => 
    auth.user?.createdQuizzes?.find(q => q.id === parseInt(quizId || ''))
  , [quizId, auth.user?.createdQuizzes]);

  if (!quiz) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card>
          <p style={{ textAlign: 'center', padding: '32px 0' }}>
            Quiz not found
          </p>
        </Card>
      </div>
    );
  }

  return <QuizPlayer quiz={quiz} key={quiz.id} />;
}

export default TakeQuiz;