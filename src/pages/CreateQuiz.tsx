import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import type { NewQuiz, QuizQuestion } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import './CreateQuiz.css';

function CreateQuiz() {
  const [quizData, setQuizData] = useState<NewQuiz>({
    title: '',
    description: '',
    questions: []
  });
  
  const [currentQuestion, setCurrentQuestion] = useState<Omit<QuizQuestion, 'id'>>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });
  
  const auth = useAuth();
  const navigate = useNavigate();

  const handleAddQuestion = () => {
    if (!currentQuestion.question.trim()) {
      toast.error('Please enter a question');
      return;
    }
    
    if (currentQuestion.options.some(opt => !opt.trim())) {
      toast.error('Please fill all options');
      return;
    }
    
    setQuizData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { ...currentQuestion, id: Date.now() }
      ]
    }));
    
    // Reset current question
    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    });
  };

  const handleCreateQuiz = () => {
    if (!quizData.title.trim()) {
      toast.error('Please enter a quiz title');
      return;
    }
    
    if (!quizData.description.trim()) {
      toast.error('Please enter a quiz description');
      return;
    }
    
    if (quizData.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }
    
    auth.addCreatedQuiz(quizData);
    toast.success('Quiz created successfully!');
    navigate('/profile');
  };

  return (
    <div className="create-quiz-container">
      <h1 className="create-quiz-title">
        Create New Quiz
      </h1>

      <Card title="Quiz Details" className="create-quiz-card">
        <div className="create-quiz-form">
          <div>
            <label className="create-quiz-label">Title</label>
            <input
              type="text"
              className="create-quiz-input"
              value={quizData.title}
              onChange={(e) => setQuizData({...quizData, title: e.target.value})}
              placeholder="Enter quiz title"
            />
            </div>
          </div>
          
          <div>
            <label className="create-quiz-label">Description</label>
            <textarea
              className="create-quiz-textarea"
              rows={3}
              value={quizData.description}
              onChange={(e) => setQuizData({...quizData, description: e.target.value})}
              placeholder="Enter quiz description"
            />
          </div>
      </Card>

      <Card title="Add Question" className="create-quiz-card">
        <div className="create-quiz-form">
          <div>
            <label className="create-quiz-label">Question</label>
            <input
              type="text"
              className="create-quiz-input"
              value={currentQuestion.question}
              onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
              placeholder="Enter question"
            />
          </div>

          <div className="create-quiz-options">
            <label className="create-quiz-label">Options</label>
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="create-quiz-option">
                <input
                  type="text"
                  className="create-quiz-input"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...currentQuestion.options];
                    newOptions[index] = e.target.value;
                    setCurrentQuestion({...currentQuestion, options: newOptions});
                  }}
                  placeholder={`Option ${index + 1}`}
                />
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={currentQuestion.correctAnswer === index}
                  onChange={() => setCurrentQuestion({...currentQuestion, correctAnswer: index})}
                  className="create-quiz-radio"
                />
              </div>
            ))}
          </div>
          <Button onClick={handleAddQuestion}>Add Question</Button>
        </div>
      </Card>

      <Card title="Questions Preview" className="create-quiz-card">
        {quizData.questions.length === 0 ? (
          <p className="create-quiz-preview-no-questions">
            No questions added yet
          </p>
        ) : (
          <ul className="create-quiz-preview-list">
            {quizData.questions.map((q, index) => (
              <li 
                key={index} 
                className="create-quiz-preview-list-item"
              >
                <p className="create-quiz-question">
                  {index + 1}. {q.question}
                </p>
                <ul className="create-quiz-options-list">
                  {q.options.map((opt, optIndex) => (
                    <li 
                      key={optIndex}
                      className={optIndex === q.correctAnswer ? 'create-quiz-option-list-item-correct' : ''}
                    >
                      {optIndex + 1}. {opt} {optIndex === q.correctAnswer && '✓'}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <div className="create-quiz-actions">
        <Button 
          variant="secondary" 
          onClick={() => navigate('/profile')}
        >
          Cancel
        </Button>
                  <Button 
                    onClick={handleCreateQuiz}
                    disabled={quizData.questions.length === 0}
                  >
                    Create Quiz ({quizData.questions.length} questions)
                  </Button>     
                   </div>
    </div>
  );
}

export default CreateQuiz;