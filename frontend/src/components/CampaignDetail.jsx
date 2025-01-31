import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CampaignDetail.css';

const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updateData, setUpdateData] = useState({
    title: '',
    description: '',
    goal_amount: ''
  });
  const [donationData, setDonationData] = useState({
    amount: '',
    user_id: '',
    date: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/campaigns/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setCampaign(data);
      setUpdateData({
        title: data.title,
        description: data.description,
        goal_amount: data.goal_amount
      });
    })
    .catch(error => console.error('Error fetching campaign details:', error));
  }, [id]);

  const handleDonateClick = () => {
    setIsEditing(false);
  };

  const handleUpdateClick = () => {
    setIsEditing(true);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:5000/campaigns/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update campaign');
      }
      return response.json();
    })
    .then(data => {
      setCampaign(data);
      setIsEditing(false);
    })
    .catch(error => console.error('Error updating campaign:', error));
  };

  const handleDeleteClick = () => {
    fetch(`http://127.0.0.1:5000/campaigns/${id}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete campaign');
      }
      navigate('/campaigns');
    })
    .catch(error => console.error('Error deleting campaign:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDonationChange = (e) => {
    const { name, value } = e.target;
    setDonationData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDonationSubmit = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:5000/donations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: parseFloat(donationData.amount),
        date: donationData.date,
        user_id: parseInt(donationData.user_id),
        campaign_id: parseInt(id),
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to create donation');
      }
      return response.json();
    })
    .then(data => {
      setCampaign(prevState => ({
        ...prevState,
        current_amount: prevState.current_amount + parseFloat(donationData.amount)
      }));
      setDonationData({
        amount: '',
        user_id: '',
        date: ''
      });
    })
    .catch(error => console.error('Error:', error));
  };

  if (!campaign) {
    return <div>Loading...</div>;
  }

  return (
    <div className="campaign-detail">
      <h1>{campaign.title}</h1>
      <p>{campaign.description}</p>
      <div className="campaign-stats">
        <p>Goal: {campaign.goal_amount}</p>
        <p>Current Amount: {campaign.current_amount}</p>
      </div>
      <p>Start Date: {new Date(campaign.start_date).toLocaleDateString()}</p>
      <p>End Date: {new Date(campaign.end_date).toLocaleDateString()}</p>
      <button onClick={handleDonateClick}>Donate</button>
      <button onClick={handleUpdateClick}>Update</button>
      <button onClick={handleDeleteClick}>Delete</button>

      {isEditing && (
        <form onSubmit={handleUpdateSubmit}>
          <h2>Edit Campaign</h2>
          <label>
            Title:
            <input type="text" name="title" value={updateData.title} onChange={handleInputChange} required />
          </label>
          <label>
            Description:
            <textarea name="description" value={updateData.description} onChange={handleInputChange} required />
          </label>
          <label>
            Goal Amount:
            <input type="number" name="goal_amount" value={updateData.goal_amount} onChange={handleInputChange} required />
          </label>
          <button type="submit">Save Changes</button>
        </form>
      )}

      <form onSubmit={handleDonationSubmit}>
        <h2>Donate this Campaign</h2>
        <label>
          Amount:
          <input type="number" name="amount" value={donationData.amount} onChange={handleDonationChange} required />
        </label>
        <label>
          Date:
          <input type="date" name="date" value={donationData.date} onChange={handleDonationChange} required />
        </label>
        <label>
          User ID:
          <input type="number" name="user_id" value={donationData.user_id} onChange={handleDonationChange} required />
        </label>
        <button type="submit">Donate</button>
      </form>
    </div>
  );
}

export default CampaignDetail;
