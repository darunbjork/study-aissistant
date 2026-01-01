import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { Quiz, UserAnswer } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import './TakeQuiz.css';

function QuizPlayer({ quiz }: { quiz: Quiz }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(() =>
    new Array(quiz.questions.length).fill(-1)
  );
  const [showResults, setShowResults] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  
  const auth = useAuth();
  const navigate = useNavigate();
  const currentQ = quiz.questions[currentQuestion];

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const answers: UserAnswer[] = quiz.questions.map((question, index) => ({
      questionId: Date.now() + index, // Use index for unique ID as question doesn't have id
      question: question.question,
      selectedAnswer: selectedAnswers[index],
      correctAnswer: question.correctAnswer,
      isCorrect: selectedAnswers[index] === question.correctAnswer
    }));

    const correctCount = answers.filter(a => a.isCorrect).length;
    const percentage = (correctCount / quiz.questions.length) * 100;

    setUserAnswers(answers);
    setShowResults(true);

    // Save quiz result
    auth.saveQuizResult({
      quizId: quiz.id,
      quizTitle: quiz.title,
      score: correctCount,
      totalQuestions: quiz.questions.length,
      percentage,
      answers
    });
  };

  if (showResults) {
    const score = userAnswers.filter(a => a.isCorrect).length;
    const percentage = (score / quiz.questions.length) * 100;

    return (
      <div className="quiz-player-container">
        <Card title="Quiz Results">
          <div className="quiz-results-card">
            <div className={`quiz-results-score ${percentage >= 80 ? 'quiz-results-score-high' : percentage >= 60 ? 'quiz-results-score-medium' : 'quiz-results-score-low'}`}>
              {percentage.toFixed(0)}%
            </div>
            <p className="quiz-results-score-details">
              {score}/{quiz.questions.length} Correct
            </p>
            <p className="quiz-results-feedback">
              {percentage >= 80 && 'Excellent work! 🎉'}
              {percentage >= 60 && percentage < 80 && 'Good job! Keep practicing! 👍'}
              {percentage < 60 && 'Keep studying and try again! 📚'}
            </p>
            
            <div className="quiz-results-actions">
              <Button onClick={() => navigate('/profile')}>
                Back to Profile
              </Button>
              <Button variant="secondary" onClick={() => window.location.reload()}>
                Retry Quiz
              </Button>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="quiz-results-detailed">
            <h3 className="quiz-results-detailed-title">Detailed Results</h3>
            {userAnswers.map((answer, index) => (
              <div 
                key={answer.questionId}
                className={`quiz-results-answer-card ${answer.isCorrect ? 'quiz-results-answer-card-correct' : 'quiz-results-answer-card-incorrect'}`}
              >
                <div className="quiz-results-answer-header">
                  <span className={`quiz-results-answer-icon ${answer.isCorrect ? 'quiz-results-answer-icon-correct' : 'quiz-results-answer-icon-incorrect'}`}>
                    {answer.isCorrect ? '✓' : '✗'}
                  </span>
                  <p className="quiz-results-answer-question">
                    Q{index + 1}: {answer.question}
                  </p>
                </div>

                <div className="quiz-results-answer-details">
                  <p className="quiz-results-user-answer">
                    <strong>Your answer:</strong>{' '}
                    {answer.selectedAnswer !== -1 
                      ? quiz.questions[index].options[answer.selectedAnswer]
                      : 'No answer selected'}
                  </p>
                  {!answer.isCorrect && (
                    <p className="quiz-results-correct-answer">
                      <strong>Correct answer:</strong>{' '}
                      {quiz.questions[index].options[answer.correctAnswer]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="quiz-player-container">
      <Card>
        <div className="quiz-player-header">
          <h1 className="quiz-player-title">
            {quiz.title}
          </h1>
          <p className="quiz-player-description">
            {quiz.description}
          </p>
          
          {/* Progress Bar */}
          <div className="quiz-player-progress">
            <div className="quiz-player-progress-text">
              <span>
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
              <span>
                Answered: {selectedAnswers.filter(a => a !== -1).length}/{quiz.questions.length}
              </span>
            </div>
            
            {/* Question Navigation Dots */}
            <div className="quiz-player-dots">
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  className={`quiz-player-dot ${index === currentQuestion ? 'quiz-player-dot-active' : ''} ${selectedAnswers[index] !== -1 ? 'quiz-player-dot-answered' : ''}`}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="quiz-player-question-container">
          <h2 className="quiz-player-question">
            {currentQ.question}
          </h2>
          
          {/* Options */}
          <div className="quiz-player-options">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                className={`quiz-player-option ${selectedAnswers[currentQuestion] === index ? 'quiz-player-option-selected' : ''}`}
                onClick={() => handleAnswerSelect(index)}
              >
                <div className="quiz-player-option-icon-container">
                  <div className={`quiz-player-option-icon ${selectedAnswers[currentQuestion] === index ? 'quiz-player-option-icon-selected' : ''}`}>
                    ✓
                  </div>
                  <span className="quiz-player-option-text">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="quiz-player-navigation">
          <Button
            variant="secondary"
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(prev => prev - 1)}
          >
            ← Previous
          </Button>
          
          {currentQuestion < quiz.questions.length - 1 ? (
            <Button
              disabled={selectedAnswers[currentQuestion] === -1}
              onClick={() => setCurrentQuestion(prev => prev + 1)}
            >
              Next →
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

  const quiz = auth.user?.createdQuizzes?.find((q: Quiz) => q.id === parseInt(quizId || ''));

  if (!quiz) {
    return (
      <div className="quiz-not-found-container">
        <Card>
          <p className="quiz-not-found-text">
            Quiz not found
          </p>
          <div className="quiz-not-found-actions">
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return <QuizPlayer quiz={quiz} key={quiz.id} />;
}

export default TakeQuiz;