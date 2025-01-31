import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:5000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email }),
      credentials: 'include',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Sign-up failed. Please try again.');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      setError(''); // Clear any previous errors
      setSuccess('User created successfully');
      setTimeout(() => {
        setSuccess('');
        navigate('/'); // Redirect to home page after showing success message
      }, 2000); // Display success message for 2 seconds
    })
    .catch(error => setError(error.message));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignUp;