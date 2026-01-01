import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import QuizCard from '../components/QuizCard';
import Button from '../components/Button';
import Card from '../components/Card';
import AccuracyPieChart from '../components/AccuracyPieChart';
import type { SavedQuizResult, Quiz, UserAnswer } from '../types';
import { useTheme } from '../contexts/ThemeContext'; // Import useTheme
import './Profile.css';

function Profile() {
  const auth = useAuth();
  const { theme } = useTheme(); // Use the theme hook
  const [editName, setEditName] = useState(auth.user?.name || '');
  const [activeTab, setActiveTab] = useState<'quizzes' | 'history' | 'analytics'>('quizzes');
  const navigate = useNavigate();

  if (!auth.user) {
    return <div className="profile-container">Please log in to view profile</div>;
  }

  const quizHistory = auth.user.quizzes || [];
  const createdQuizzes = auth.user.createdQuizzes || [];

  // Analytics Data
  const performanceData = quizHistory
    .slice(-10)
    .map((quiz: SavedQuizResult, index: number) => ({
      name: `Quiz ${index + 1}`,
      score: quiz.percentage,
      date: new Date(quiz.date).toLocaleDateString()
    }));

  const avgScore = quizHistory.length > 0
    ? quizHistory.reduce((sum: number, q: SavedQuizResult) => sum + q.percentage, 0) / quizHistory.length
    : 0;

  const totalQuestions = quizHistory.reduce((sum: number, q: SavedQuizResult) => sum + q.totalQuestions, 0);
  const totalCorrect = quizHistory.reduce((sum: number, q: SavedQuizResult) => sum + q.score, 0);



  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <div>
          <h1 className="profile-title">Profile</h1>
          <p className="profile-welcome">Welcome back, {auth.user.name}!</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="profile-stats">
        <Card>
          <div className="profile-stat-card">
            <div className="profile-stat-value profile-stat-value-created">
              {createdQuizzes.length}
            </div>
            <p className="profile-stat-label">Quizzes Created</p>
          </div>
        </Card>

        <Card>
          <div className="profile-stat-card">
            <div className="profile-stat-value profile-stat-value-taken">
              {quizHistory.length}
            </div>
            <p className="profile-stat-label">Quizzes Taken</p>
          </div>
        </Card>

        <Card>
          <div className="profile-stat-card">
            <div className="profile-stat-value profile-stat-value-avg">
              {avgScore.toFixed(0)}%
            </div>
            <p className="profile-stat-label">Average Score</p>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === 'quizzes' ? 'profile-tab-active' : ''}`}
          onClick={() => setActiveTab('quizzes')}
        >
          My Quizzes
        </button>
        <button
          className={`profile-tab ${activeTab === 'history' ? 'profile-tab-active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Quiz History
        </button>
        <button
          className={`profile-tab ${activeTab === 'analytics' ? 'profile-tab-active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'quizzes' && (
        <div>
          <div className="profile-section-header">
            <h3 className="profile-section-title">My Created Quizzes</h3>
            <div className="profile-section-actions">
              <Button onClick={() => navigate('/study')}>
                Generate with AI
              </Button>
              <Button onClick={() => navigate('/create-quiz')}>
                Create Manually
              </Button>
            </div>
          </div>
          
          {createdQuizzes.length === 0 ? (
            <Card>
              <p className="profile-no-data">
                You haven't created any quizzes yet. Create your first quiz using AI or manually!
              </p>
            </Card>
          ) : (
            <div className="profile-quizzes-grid">
              {createdQuizzes.map((quiz: Quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onDelete={auth.deleteCreatedQuiz}
                  onTakeQuiz={(id) => navigate(`/take-quiz/${id}`)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          <h3 className="profile-section-title">Quiz History</h3>
          
          {quizHistory.length === 0 ? (
            <Card>
              <p className="profile-no-data">
                No quiz attempts yet. Take a quiz to see your history!
              </p>
            </Card>
          ) : (
            <div className="profile-history-list">
              {quizHistory.sort((a: SavedQuizResult, b: SavedQuizResult) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((result: SavedQuizResult) => (
                <Card key={result.id}>
                  <div className="profile-history-item-header">
                    <div>
                      <h4 className="profile-history-item-title">{result.quizTitle}</h4>
                      <p className="profile-history-item-date">
                        {new Date(result.date).toLocaleDateString()} at{' '}
                        {new Date(result.date).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="profile-history-item-score">
                      <div className={`profile-history-item-score-value ${result.percentage >= 80 ? 'profile-history-item-score-value-high' : result.percentage >= 60 ? 'profile-history-item-score-value-medium' : 'profile-history-item-score-value-low'}`}>
                        {result.percentage.toFixed(0)}%
                      </div>
                      <p className="profile-history-item-score-details">
                        {result.score}/{result.totalQuestions} correct
                      </p>
                    </div>
                  </div>
                  
                  {/* Answer Breakdown */}
                  <div className="profile-history-item-breakdown">
                    <details>
                      <summary className="profile-history-item-details-summary">
                        View Details
                      </summary>
                      <div className="profile-history-item-details-content">
                        {result.answers.map((answer: UserAnswer, index: number) => (
                          <div 
                            key={answer.questionId}
                            className={`profile-history-item-answer ${answer.isCorrect ? 'profile-history-item-answer-correct' : 'profile-history-item-answer-incorrect'}`}
                          >
                            <p className="profile-history-item-answer-question">
                              <strong>Q{index + 1}:</strong> {answer.question}
                            </p>
                            <p className="profile-history-item-answer-status">
                              {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                  
                  <div className="profile-history-item-actions">
                    <Button 
                      variant="danger"
                      onClick={() => auth.deleteQuiz(result.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div>
          <h3 className="profile-section-title">Performance Analytics</h3>
          
          {quizHistory.length === 0 ? (
            <Card>
              <p className="profile-no-data">
                No data yet. Take some quizzes to see your analytics!
              </p>
            </Card>
          ) : (
            <div className="profile-analytics-grid">
              {/* Line Chart */}
              <Card title="Performance Over Time">
                <div className="profile-chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" stroke={theme === 'dark' ? '#e5e5e5' : '#333'} />
                      <YAxis domain={[0, 100]} stroke={theme === 'dark' ? '#e5e5e5' : '#333'} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: theme === 'dark' ? '#333' : '#fff', 
                          borderColor: theme === 'dark' ? '#555' : '#ccc', 
                          color: theme === 'dark' ? '#e5e5e5' : '#333' 
                        }} 
                        itemStyle={{ color: theme === 'dark' ? '#e5e5e5' : '#333' }} 
                      />
                      <Legend wrapperStyle={{ color: theme === 'dark' ? '#e5e5e5' : '#333' }} />
                      <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Pie Chart */}
              <Card title="Overall Accuracy">
                <div className="profile-chart-container">
                  <AccuracyPieChart 
                    totalCorrect={totalCorrect} 
                    totalQuestions={totalQuestions}
                    theme={theme}
                  />
                </div>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Edit Profile Section */}
      <Card title="Edit Profile" className="profile-edit-card">
        <div className="profile-edit-form">
          <div className="profile-edit-group">
            <label className="profile-edit-label">Name</label>
            <input 
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Your name"
              className="profile-edit-input"
            />
          </div>
          <div className="profile-edit-group">
            <label className="profile-edit-label">Email</label>
            <input 
              type="email"
              value={auth.user.email}
              disabled
              className="profile-edit-input profile-edit-input-disabled"
            />
          </div>
          <Button onClick={() => auth.updateProfile({ name: editName })}>
            Update Name
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Profile;