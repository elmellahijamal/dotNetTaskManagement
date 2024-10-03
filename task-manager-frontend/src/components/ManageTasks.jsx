import React, { useState } from 'react';
import TaskList from './TaskList';
import AddTask from './AddTask';
import EditTask from './EditTask';
import { useNavigate } from 'react-router-dom';

const ManageTasks = () => {
    const [showAddTask, setShowAddTask] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const navigate = useNavigate();


    /*// Show AddTask form
    const handleAddTask = () => {
        setShowAddTask(true);
    };

    // Close AddTask form
    const handleTaskAdded = () => {
        setShowAddTask(false);
    };*/

    const handleAddTask = () => {
        navigate('/add-task');
    };

    const handleEditTask = (task) => {
        setSelectedTask(task);
        setIsEditing(true);
    };

    const handleTaskUpdated = () => {
        setIsEditing(false);
        setSelectedTask(null);
    };

    return (
        <div>
            <h1>Manage Tasks</h1>
            <button className="add-button" onClick={handleAddTask}>Add New Task</button>
            <TaskList onEditTask={handleEditTask} />
            {/*showAddTask && <AddTask onTaskAdded={handleTaskAdded} />*/}
            {/*<button onClick={handleAddTask}>Add Task</button>*/}
            {isEditing && selectedTask && (
                <EditTask
                    task={selectedTask}
                    onClose={handleTaskUpdated}
                    onTaskUpdated={handleTaskUpdated}
                />
            )}
        </div>
    );
};

export default ManageTasks;
