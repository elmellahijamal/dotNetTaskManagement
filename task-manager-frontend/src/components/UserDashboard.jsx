import React, { useContext } from 'react';
import TaskList from './TaskList';
import { useAuth } from '../contexts/AuthContext';
import "./UserDashboard.css"

const UserDashboard = () => {
    const { currentUser } = useAuth();

    return (
      <div className="user-dashboard">
            <h2>Welcome, {currentUser?.username}!</h2>
            <TaskList />
        </div>
    );
};

export default UserDashboard;
