import React, { useState, useEffect } from 'react';
import { updateTask, getUsers } from '../services/api';
import './EditTask.css';

const EditTask = ({ task, onClose, onTaskUpdated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Pending');
    const [assignedTo, setAssignedTo] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userList = await getUsers();
                setUsers(userList);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (task) {
            setTitle(task.title || '');
            setDescription(task.description || '');
            setStatus(task.status || 'Pending');
            setAssignedTo(task.assignedTo || '');
        }
    }, [task]);

    const handleUpdate = async (event) => {
        event.preventDefault();

        const taskToUpdate = {
            id: task.id,
            title,
            description,
            assignedTo: assignedTo || task.assignedTo,
            status,
        };

        try {
            const response = await updateTask(taskToUpdate);
            if (response.data) {
                onTaskUpdated(response.data);
            }
            onClose();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    return (
        <div className="edit-task-modal">
            <button className="close-button" onClick={onClose}>✖</button>
            <h2>Edit Task</h2>
            <form onSubmit={handleUpdate}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task Title"
                    className="task-input"
                    required
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Task Description"
                    className="task-textarea"
                    required
                />
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="task-select"
                    required
                >
                    <option value="Pending">Pending</option>
                    <option value="OnProgress">On Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                
                <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="task-select"
                    required
                >
                    <option value="">Assign to User</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.username} (ID: {user.id})
                        </option>
                    ))}
                </select>
                <button className="update-button" type="submit">Update Task</button>
            </form>
        </div>
    );
};

export default EditTask;
