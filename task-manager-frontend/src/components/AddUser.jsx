import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../services/api';
import './adduser.css'; 

const AddUser = () => {
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'User' });
    const navigate = useNavigate();

    const handleAddUser = async () => {
        try {
            await addUser(newUser);
            navigate('/manage-users');
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    return (
        <div className="add-user-container">
            <h2 className="add-user-title">Add User</h2>
            <input
                type="text"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="add-user-input"
            />
            <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="add-user-input"
            />
            <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="add-user-select"
            >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
            </select>
            <button onClick={handleAddUser} className="add-user-button">Add User</button>
        </div>
    );
};

export default AddUser;
