import React, { useEffect, useState } from 'react';
import { getTasks, deleteTask } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './TaskList.css';
import Modal from './Modal';
import EditTask from './EditTask';
import imgPending from '../assets/pending.png';
import imgOnProgress from '../assets/onprogress.png';
import imgCompleted from '../assets/completed.webp';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const { currentUser } = useAuth();

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const data = await getTasks();
            //console.log(data);
            setTasks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteTask(id);
            setTasks((prevTasks) => prevTasks.filter(task => task.id !== id));
            console.log(`task ${id} deleted`);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleEdit = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleTaskUpdated = (updatedTask) => {
        console.log('Updated task received:', updatedTask);
        setTasks(prevTasks => 
            prevTasks.map(task => 
                task.id === updatedTask.id ? updatedTask : task
            )
        );
        setIsModalOpen(false);
    };
    
    useEffect(() => {
        fetchTasks();
    }, []);
    
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
        fetchTasks();
    };

    if (loading) return <div className="loading">Loading tasks...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="task-list">
            <h2>Task List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>AssignedTo</th>
                        <th>CreatedBy</th>
                        <th>Status</th>
                        {currentUser?.role === 'Admin' && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task.id}>
                            <td>{task.title}</td>
                            <td>{task.description}</td>
                            <td>{task.assignedToUsername?.trim() || 'Unknown'}</td>
                            <td>{task.createdByUsername?.trim() || 'Unknown'}</td>
                            <td>
                                {task.status === 'Pending' && <img src={imgPending} alt="Pending" />}
                                {task.status === 'OnProgress' && <img src={imgOnProgress} alt="On Progress" />}
                                {task.status === 'Completed' && <img src={imgCompleted} alt="Completed" />}
                                <span>{task.status}</span>
                            </td>
                            {currentUser?.role === 'Admin' && (
                                <td>
                                    <button className="edit-button" onClick={() => handleEdit(task)}>Edit</button>
                                    <button className="delete-button" onClick={() => handleDelete(task.id)}>Delete</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {selectedTask && (
                    <EditTask
                        task={selectedTask}
                        onClose={closeModal}
                        onTaskUpdated={handleTaskUpdated}
                    />
                )}
            </Modal>
        </div>
    );
};

export default TaskList;
