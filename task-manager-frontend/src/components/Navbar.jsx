import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Navbar.css";
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { userRole, isLoggedIn, logout, login, currentUser } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isLoggedIn) return null;

    return (
        <nav>
            <ul>
                <div className="nav-left">
                    {currentUser?.role === "Admin" && (
                        <>
                            <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>
                            <li><Link to="/manage-tasks">Manage Tasks</Link></li>
                            <li><Link to="/manage-users">Manage Users</Link></li>
                        </>
                    )}
                    {currentUser?.role === "User" && (
                        <li><Link to="/user-dashboard">User Dashboard</Link></li>
                    )}
                </div>
                <div className="nav-right">
                    <li><button className="logoutBtn" onClick={handleLogout}>Logout</button></li>
                </div>
            </ul>
        </nav>
    );
};

export default Navbar;
