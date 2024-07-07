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

import { TopNavBar } from './components/common/TopNavBar';
import { PageLogin } from './components/login/PageLogin';
import { PageRegister } from './components/login/PageRegister';
import { PageForgotPassword } from './components/login/PageForgotPassword';
import { Admin } from './components/admin/Admin';
import { Header } from './components/common/Header';

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
        <Header />
        {isLoading && <LoadingSpinner isSuccess={isSuccess} successMessage={successMessage} />}
        <Routes>
          <Route path="/admin" element={<Admin startLoading={startLoading} stopLoading={stopLoading} />} />
          <Route path="/forgot-password" element={<PageForgotPassword startLoading={startLoading} stopLoading={stopLoading} />} />
          <Route path="/login" element={<PageLogin startLoading={startLoading} stopLoading={stopLoading} />} />
          <Route path="/register" element={<PageRegister startLoading={startLoading} stopLoading={stopLoading} />} />
          <Route path="/profile/:email" element={<Profile />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/error-not-found" element={<Page404 />} />
          <Route path="/forgot-password2" element={<ForgotPassword startLoading={startLoading} stopLoading={stopLoading} />} />
          <Route path="/add-project" element={<AddProject startLoading={startLoading} stopLoading={stopLoading} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
