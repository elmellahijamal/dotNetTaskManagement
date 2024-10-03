// AuthContext.js
/*import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    
    const login = (role) => {
        //setIsAuthenticated(true);
        setUserRole(role);
        setIsLoggedIn(true);
    };

    const logout = () => {
        //setIsAuthenticated(false);
        setUserRole(null);
        setIsLoggedIn(false);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn , userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
*/

/*import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    
    useEffect(() => {
        // Retrieve the role from localStorage when the app initializes
        const storedRole = localStorage.getItem('userRole');
        if (storedRole) {
            setUserRole(storedRole);
            setIsLoggedIn(true);
        }
    }, []);

    const login = (role) => {
        setUserRole(role);
        setIsLoggedIn(true);
        // Store the role in localStorage
        localStorage.setItem('userRole', role);
    };

    const logout = () => {
        setUserRole(null);
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
*/

import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(null);
    const [username, setUsername] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [currentUser, setCurrentUser] = useState(null);

    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken["nameid"];
                const username = decodedToken["unique_name"];
                const role = decodedToken["role"];

                setCurrentUser({
                    id: userId,
                    username,
                    role
                });
                setIsLoggedIn(true);

                localStorage.setItem('userRole', role);
                localStorage.setItem('username', username);
                localStorage.setItem('userId', userId);
            } catch (error) {
                console.error('Invalid token:', error);
            }
        }
    }, []);

    const login = (role, username, userId) => {
        setCurrentUser({ role, username, id: userId });
        setIsLoggedIn(true);

        localStorage.setItem('userRole', role);
        localStorage.setItem('username', username);
        localStorage.setItem('userId', userId);
    };

    const logout = () => {
        setCurrentUser(null);
        setIsLoggedIn(false);
        localStorage.clear();
    };


    
    /*useEffect(() => {
        const storedRole = localStorage.getItem('userRole');
        const storedUsername = localStorage.getItem('username'); // Get stored username
        if (storedRole) {
            setUserRole(storedRole);
            setIsLoggedIn(true);
        }
        if (storedUsername) { // Check if username exists and set it
            setUsername(storedUsername);
        }
    }, []);*/

    /*const login = (role, username, user) => {
        setUserRole(role);
        setUsername(username); // Set username on login
        setIsLoggedIn(true);
        setCurrentUser(user);
        // Store the role and username in localStorage
        localStorage.setItem('userRole', role);
        localStorage.setItem('username', username); // Ensure username is stored
    };*/

    /*const logout = (user) => {
        setUserRole(null);
        setUsername(null); // Clear username on logout
        setIsLoggedIn(false);
        setCurrentUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('username'); // Clear username from local storage
    };*/

    /*const login = (role, username, userId) => {
        setCurrentUser({ role, username, id: userId });
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.clear(); // Clear the local storage
    };*/

    
    return (
        <AuthContext.Provider value={{ isLoggedIn, userRole, username, login, logout , currentUser}}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    return useContext(AuthContext);
};

