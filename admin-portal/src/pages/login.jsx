import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Login = () => {
    // State to hold user input
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    
    // State to handle UI feedback (errors and loading spinner)
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Hooks for navigation and accessing the global auth state
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // Update state when user types
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');      // Clear previous errors
        setLoading(true);  // Disable button while processing

        try {
            // Call the login function from AuthContext
            const success = await login(credentials.email, credentials.password);
            
            if (success) {
                // Redirect to the Dashboard on success
                navigate('/dashboard');
            } else {
                setError('Invalid email or password.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Server error. Please try again later.');
        } finally {
            setLoading(false); // Re-enable button
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.headerContainer}>
                    <img 
                        src="/logo.jpeg" 
                        alt="Logo" 
                        style={styles.logo}
                    />
                    <div>
                        <h2 style={styles.title}>Admin Portal</h2>
                        <p style={styles.subtitle}>Colombo International Bookfair</p>
                    </div>
                </div>
                
                {/* Error Message Display */}
                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            style={styles.input}
                            required
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            style={styles.input}
                            required
                            placeholder="Enter password"
                        />
                    </div>

                    <button 
                        type="submit" 
                        style={loading ? styles.buttonDisabled : styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Internal CSS styles for a clean look without external files
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
        fontFamily: 'Arial, sans-serif',
    },
    card: {
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        textAlign: 'center',
    },
    headerContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '25px',
    },
    logo: {
        height: '50px',
        width: 'auto',
        objectFit: 'contain',
    },
    title: {
        margin: '0 0 5px 0',
        color: '#333',
    },
    subtitle: {
        margin: '0 0 25px 0',
        color: '#666',
        fontSize: '14px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    inputGroup: {
        textAlign: 'left',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '14px',
        color: '#333',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: '12px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '16px',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background 0.3s',
        fontWeight: 'bold',
    },
    buttonDisabled: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#cccccc',
        color: '#666666',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'not-allowed',
        fontWeight: 'bold',
    },
    error: {
        backgroundColor: '#ffebee',
        color: '#c62828',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '20px',
        fontSize: '14px',
        border: '1px solid #ef9a9a'
    }
};

export default Login;