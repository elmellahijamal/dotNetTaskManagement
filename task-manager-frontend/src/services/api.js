import axios from "axios";


const API_URL = 'https://localhost:7133/api/';
//const token = localStorage.getItem('token');

const axiosInstance = axios.create({
    baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});




// Fetch all tasks
export const getTasks = async () => {
    try {
        const response = await axiosInstance.get('tasks');
        return response.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
};

// Create a new task
export const createTask = async (taskData) => {
    try {
        const response = await axiosInstance.post('tasks', taskData);
        return response.data;
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
};


export const updateTask = async (task) => {
    try {
        const response = await axiosInstance.put(`tasks/${task.id}`, task);
        return response;
    } catch (error) {
        console.error(`Error updating task with ID ${task.id}:`, error);
        throw error;
    }
};


// Delete a task
export const deleteTask = async (id) => {
    try {
        const response = await axiosInstance.delete(`tasks/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting task with ID ${id}:`, error);
        throw error;
    }
};
















/*export const getTasks = async () => {
    try {
        const response = await axiosInstance.get('tasks');
        return response.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
};*/

/*export const getUserTasks = async () => {
    const response = axiosInstance.get(`${API_URL}tasks`);
    return response.data;
}*/


/*const axiosInstance = axios.create({
    baseURL : API_URL,
    headers: {
        Authorization : `Bearer ${token}`
    }
});

export const getTasks = async () => {
    const response = await axiosInstance.get('tasks');
    return response.data;
};*/



/*export const getTasks = async () => {
    try{
        const response = await axios.get(`${API_URL}Tasks`)
        return response.data;
    } catch(error){
        console.error('Error fetching tasks:',error);
        throw error;
    }
}*/

/*export const getTaskById = async (id) => {
    try{
        const response = await axios.get(`${API_URL}tasks/${id}`)
        return response.data;
    } catch(error){
        console.error(`Error fetching task with ID ${id}`,error);
        throw error;
    }
};

export const createTasks = async (taskData) => {
    try {
        const response = await axiosInstance.post(`${API_URL}tasks`, taskData);
        return response.data;
    } catch (error) {
        console.error('Error creating task: ', error);
        throw error;
    }
};*/


/*export const updateTask = async (task) => {
    try {
        const response = await axiosInstance.put(`${API_URL}tasks/${task.id}`, task, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating task with ID ${task.id}:`, error);
        throw error; // Rethrow to handle it in the calling function
    }
};*/





/*// Delete task
export const deleteTask = async (id) => {
    try {
        const response = await axiosInstance.delete(`/tasks/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting task with ID ${id}: `, error);
        throw error;
    }
};
*/

/*export const loginUser = async (loginData) => {
    try {
        const response = await axios.post(`${API_URL}users/login`,loginData);
        return response.data;
    } catch (error) {
        console.error("Error logging in : ", error);
        throw error;
    }
}*/

/*export const loginUser = async (loginData) => {
    const response = await axios.post(`${API_URL}users/login`, loginData);
    return response.data; // Ensure you return the entire response object
};*/

export const loginUser = async (loginData) => {
    return await axios.post(`${API_URL}users/login`, loginData);
};


export const getUsers = async () => {
    const response = await axiosInstance.get(`${API_URL}users/`);
    return response.data;
  };
  
  export const deleteUser = async (id) => {
    try {
        const response = await axiosInstance.delete(`users/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};
  
  export const addUser = async (userData) => {
    const response = await axiosInstance.post(`${API_URL}users/register`, userData);
    return response.data;
  };
