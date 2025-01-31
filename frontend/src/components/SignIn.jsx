import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Invalid username or password');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      setError('');  // Clear error message on successful login
      setWelcomeMessage(`Welcome ${username}!`);
      localStorage.setItem('userId', data.user_id);  // Store user ID in local storage
      setTimeout(() => {
        setWelcomeMessage('');
        navigate('/');  // Redirect to home page after showing welcome message
      }, 2000);  // Display welcome message for 2 seconds
    })
    .catch(error => setError(error.message));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign In</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {welcomeMessage && <p style={{ color: 'green' }}>{welcomeMessage}</p>}
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      <button type="submit">Sign In</button>
    </form>
  );
}

export default SignIn;
