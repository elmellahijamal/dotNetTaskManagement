import React from 'react'
import TaskList from './TaskList'
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>
        <h2>Welcome, {currentUser?.username}!</h2>
          <button className="admin-button" onClick={() => navigate('/manage-users')}>
              Manage Users
          </button>
          <button className="admin-button" onClick={() => navigate('/manage-tasks')}>
              Manage Tasks
          </button>
      </div>
  );
};

export default AdminDashboard