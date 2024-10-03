import React, { useEffect, useState } from 'react';
import { createTask, getUsers } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AddTask.css';

const AddTask = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [status, setStatus] = useState('Pending');
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userData = await getUsers();
                setUsers(userData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newTask = {
                id: 0,
                title,
                description,
                assignedTo: parseInt(assignedTo),
                createdBy: currentUser?.id,
                status,
                createdAt: new Date().toISOString(),
            };
            await createTask(newTask);
            console.log('New task data:', newTask);
            navigate('/manage-tasks');
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const handleGoBack = () => {
        navigate('/manage-tasks');
    };

    return (
        <div className="add-task-container">
            <h2>Add New Task</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Description:</label>
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div>
                    <label>Assigned To:</label>
                    <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required>
                        <option value="" disabled>Select a user</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.id} - {user.username}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Status:</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="Pending">Pending</option>
                        <option value="OnProgress">On Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <button type="submit">Add Task</button>
                <button type="button" onClick={handleGoBack}>Back</button>
            </form>
        </div>
    );
};

export default AddTask;
