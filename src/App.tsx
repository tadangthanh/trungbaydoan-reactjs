import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import BrowserRouter, Routes, and Route
import LoadingSpinner from './components/common/LoadingSpinner';
import { AddProject } from './components/project/AddProject';
import { ProjectDetail } from './components/project/ProjectDetail';
import { Page404 } from './components/common/Page404';
import { Profile } from './components/profile/Profile';

import { PageLogin } from './components/login/PageLogin';
import { PageRegister } from './components/login/PageRegister';
import { PageForgotPassword } from './components/login/PageForgotPassword';
import { Admin } from './components/admin/Admin';
import { Header } from './components/common/Header';
import { HomePage } from './components/project/HomePage';

function App() {

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/forgot-password" element={<PageForgotPassword />} />
          <Route path="/login" element={<PageLogin />} />
          <Route path="/register" element={<PageRegister />} />
          <Route path="/profile/:email" element={<Profile />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/error-not-found" element={<Page404 />} />
          <Route path="/add-project" element={<AddProject />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
