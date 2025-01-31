import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CampaignList.css';

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [donatingCampaignId, setDonatingCampaignId] = useState(null);
  const [donationData, setDonationData] = useState({
    amount: '',
    user_id: '',
    date: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://127.0.0.1:5000/campaigns')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => setCampaigns(data))
    .catch(error => console.error('Error fetching campaigns:', error));
  }, []);

  const handleInputChange = (e, campaignId) => {
    const { name, value } = e.target;
    setDonationData(prevState => ({
      ...prevState,
      [name]: value,
      campaign_id: campaignId
    }));
  };

  const handleDonationSubmit = (e, campaignId) => {
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
        campaign_id: parseInt(campaignId),
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to create donation');
      }
      return response.json();
    })
    .then(data => {
      setCampaigns(prevCampaigns => prevCampaigns.map(campaign => 
        campaign.campaign_id === campaignId ? 
        { ...campaign, current_amount: campaign.current_amount + parseFloat(donationData.amount) } : 
        campaign
      ));
      setDonatingCampaignId(null); 
      setDonationData({
        amount: '',
        user_id: '',
        date: ''
      });
    })
    .catch(error => console.error('Error:', error));
  };

  const handleDonateClick = (campaignId) => {
    setDonatingCampaignId(campaignId);
  };

  return (
    <div>
      <h1>Campaigns</h1>
      <div className="campaigns">
        {campaigns.map(campaign => (
          <div key={campaign.campaign_id} className="campaign-card">
            <h2>{campaign.title}</h2>
            <p>{campaign.description}</p>
            <p>Goal: {campaign.goal_amount}</p>
            <p>Current Amount: {campaign.current_amount}</p>
            <p>Creator: {campaign.creator.username}</p>
            <button onClick={() => handleDonateClick(campaign.campaign_id)}>Donate</button>
            <Link to={`/campaigns/${campaign.campaign_id}`}><button>View More</button></Link>

            {donatingCampaignId === campaign.campaign_id && (
              <form onSubmit={(e) => handleDonationSubmit(e, campaign.campaign_id)}>
                <h3>Donate to this Campaign</h3>
                <label>
                  Amount:
                  <input 
                    type="number" 
                    name="amount" 
                    value={donationData.amount} 
                    onChange={(e) => handleInputChange(e, campaign.campaign_id)} 
                    required 
                  />
                </label>
                <label>
                  Date:
                  <input 
                    type="date" 
                    name="date" 
                    value={donationData.date} 
                    onChange={(e) => handleInputChange(e, campaign.campaign_id)} 
                    required 
                  />
                </label>
                <label>
                  User ID:
                  <input 
                    type="number" 
                    name="user_id" 
                    value={donationData.user_id} 
                    onChange={(e) => handleInputChange(e, campaign.campaign_id)} 
                    required 
                  />
                </label>
                <button type="submit">Donate</button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CampaignList;
