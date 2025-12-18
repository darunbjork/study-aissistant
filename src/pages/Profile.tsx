import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Profile() {
  const auth = useAuth();
  const [editName, setEditName] = useState(auth.user?.name || '');

  if (!auth.user) {
    return <div>Please log in to view profile</div>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>Welcome, {auth.user.name}</p>
      <p>Email: {auth.user.email}</p>

      <div>
        <h3>Edit Profile</h3>
        <input 
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          placeholder="Your name"
        />
        <button onClick={() => auth.updateProfile({ name: editName })}>
          Update Name
        </button>
      </div>

      <div>
        <h3>My Quizzes</h3>
        {auth.user.quizzes.length === 0 ? (
          <p>No quizzes yet</p>
        ) : (
          <ul>
            {auth.user.quizzes.map(quiz => (
              <li key={quiz.id}>
                {quiz.title} - {quiz.date}
                <button onClick={() => auth.deleteQuiz(quiz.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Profile;