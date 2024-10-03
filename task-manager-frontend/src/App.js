import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import AddTask from './components/AddTask';
import EditTask from './components/EditTask';
import PrivateRoute from './utils/PrivateRoute';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import { jwtDecode } from 'jwt-decode';
import Navbar from './components/Navbar';
import ManageUsers from './components/ManageUsers';
import ManageTasks from './components/ManageTasks';
import AddUser from './components/AddUser';

function App() {

  const token = localStorage.getItem('token');
    let userRole = null;

    if (token) {
        const decodedToken = jwtDecode(token);
        userRole = decodedToken.role; // Get user role from token
    }

    return (
    <Router>
      <Navbar userRole={userRole} /> {/* Pass the user role */}
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route element={<PrivateRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/manage-users" element={<ManageUsers />} />
                <Route path="/manage-tasks" element={<ManageTasks />} />
                <Route path="/add-task" element={<AddTask />} />
                <Route path="/add-user" element={<AddUser />} />
          {/*<Route path="/tasks" element={<TaskList />} />*/}
          {/*<Route path="/tasks/add" element={<AddTask />} />*/}
          <Route path="/tasks/edit/:id" element={<EditTask />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;