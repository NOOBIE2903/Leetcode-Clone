// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProblemListPage from './components/ProblemListPage';
import LoginPage from './components/Login';
import ProblemDetailPage from './components/ProblemDetailPage';
import ContestDetailPage from './components/ContestDetailPage';
import ContestListPage from './components/ContestListPage';
import ContestProblemsPage from './components/ContestProblemPage';
import ProfilePage from './components/ProfilePage';
import Navbar from './components/Navbar';
import ContestCreatePage from './components/ContestCreatePage';
import ProtectedRoute from './components/ProtectedRoute';
import LeaderboardPage from './components/LeaderboardPage';
import RegisterPage from './components/RegisterPage';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<ProblemListPage />} />
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route path="/contests" element={<ContestListPage />} />
          <Route path="/problems/:id" element={<ProblemDetailPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/contests/create" element={<ContestCreatePage />} />
            <Route path="/contests/:id" element={<ContestDetailPage />} />
            <Route path="/contests/:id/problems" element={<ContestProblemsPage />} />
            <Route path="/contests/:id/leaderboard" element={<LeaderboardPage />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default App;