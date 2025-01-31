import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { id } = useParams();  // Get user ID from URL parameters
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    fetch('http://127.0.0.1:5000/check_auth', {
      method: 'GET',
      credentials: 'include',
    })    
      .then(response => {
        if (!response.ok) {
          throw new Error('Authentication check failed');
        }
        return response.json();
      })
      .then(authData => {
        if (authData.Authenticated) {
          fetch(`http://127.0.0.1:5000/users/${id}`, {
            method: 'GET',
            credentials: 'include',
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to fetch user data');
              }
              return response.json();
            })
            .then(data => {
              setUser(data);
              setCampaigns(data.campaigns || []);
              setDonations(data.donations || []);
            })
            .catch(error => setError(error.message));
        } else {
          setError('User not authenticated');
        }
      })
      .catch(error => setError(error.message));
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{user.username}'s Profile</h1>
      <p>Email: {user.email}</p>

      <h2>Your Campaigns</h2>
      <ul>
        {campaigns.map(campaign => (
          <li key={campaign.campaign_id}>{campaign.title}</li>
        ))}
      </ul>

      <h2>Your Donations</h2>
      <ul>
        {donations.map(donation => (
          <li key={donation.donation_id}>
            {donation.amount} to campaign {donation.campaign_id}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;
