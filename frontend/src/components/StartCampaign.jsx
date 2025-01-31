import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StartCampaign.css';

const StartCampaign = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://127.0.0.1:5000/campaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        goal_amount: parseFloat(goalAmount),
        start_date: startDate,
        end_date: endDate,
        user_id: parseInt(userId),
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      navigate('/campaigns');
    })
    .catch(error => console.error('Error:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Start a Fundraising Campaign</h1>
      <label>
        Title:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label>
        Description:
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </label>
      <label>
        Goal Amount:
        <input type="number" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} required />
      </label>
      <label>
        Start Date:
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
      </label>
      <label>
        End Date:
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
      </label>
      <label>
        User ID:
        <input type="number" value={userId} onChange={(e) => setUserId(e.target.value)} required />
      </label>
      <button type="submit">Create Campaign</button>
    </form>
  );
}

export default StartCampaign;
