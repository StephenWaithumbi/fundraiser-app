import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CampaignList from './components/CampaignList';
import CampaignDetail from './components/CampaignDetail';
import StartCampaign from './components/StartCampaign';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Profile from './components/Profile';
import Donate from './components/Donate';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campaigns" element={<CampaignList />} />
          <Route path="/campaigns/:id" element={<CampaignDetail />} />
          <Route path="/start-campaign" element={<StartCampaign />} />
          {/* <Route path="/signup" element={<SignUp />} /> */}
          {/* <Route path="/signin" element={<SignIn />} /> */}
          {/* <Route path="/profile/:id" element={<Profile />} />  */}
          <Route path="/donate/:id" element={<Donate />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
