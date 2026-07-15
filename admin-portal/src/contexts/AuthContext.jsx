import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    useEffect(() => {
        // Check for existing token on page load to keep user logged in
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                    setUser(null);
                } else {
                    setUser(decoded);
                }
            } catch (error) {
                console.error('Token decode error:', error);
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            // Adjust this URL if your backend login endpoint is different
            const response = await api.post('/auth/login', { email, password });
            
            // Assuming your backend returns { "token": "..." }
            const { token } = response.data; 

            if (token) {
                localStorage.setItem('token', token);
                const decoded = jwtDecode(token);
                setUser(decoded);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};