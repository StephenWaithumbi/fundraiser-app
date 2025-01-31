import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const Donate = () => {
  const { id } = useParams();
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:5000/donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: parseFloat(amount),
        date: new Date().toISOString(),
        user_id: 1,
        campaign_id: parseInt(id),
      }),
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Donate to Campaign</h1>
      <label>
        Amount:
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </label>
      <button type="submit">Donate</button>
    </form>
  );
}

export default Donate;
