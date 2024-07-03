import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import BrowserRouter, Routes, and Route
import { Login } from './components/login/login';
import { Register } from './components/login/register'; // Import Register component
import LoadingSpinner from './components/common/LoadingSpinner';
import { ForgotPassword } from './components/login/ForgotPassword';
import { AddProject } from './components/project/AddProject';
import { Comment } from './components/comment/Comment';
import { ProjectDetail } from './components/project/ProjectDetail';
import { Page404 } from './components/common/Page404';
import { Profile } from './components/profile/Profile';
function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const startLoading = () => {
    setIsLoading(true);
    setIsSuccess(false);
    setSuccessMessage('');
  };

  const stopLoading = (success = false, message = '') => {
    setIsLoading(false);
    if (success) {
      setIsSuccess(true);
      setSuccessMessage(message);
    }
  };
  return (
    <Router>
      <div className="App">
        {isLoading && <LoadingSpinner isSuccess={isSuccess} successMessage={successMessage} />}
        <Routes>
          <Route path="/profile/:email" element={<Profile />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/error-not-found" element={<Page404 />} />
          <Route path="/login" element={<Login startLoading={startLoading} stopLoading={stopLoading} />} />
          <Route path="/register" element={<Register startLoading={startLoading} stopLoading={stopLoading} />} />
          <Route path="/forgot-password" element={<ForgotPassword startLoading={startLoading} stopLoading={stopLoading} />} />
          <Route path="/add-project" element={<AddProject startLoading={startLoading} stopLoading={stopLoading} />} />
          {/* <Route path="/register" element={<Register />} /> 
          <Route path="/login" element={<Login />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
