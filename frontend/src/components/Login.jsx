// import React, { useState } from 'react';
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';

// function Login() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const navigate = useNavigate(); // Use useNavigate for programmatic navigation

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post('http://localhost:5000/login', { email, password });
//             console.log(response.data);
//             document.cookie = `token=${response.data.token}; path=/`;

//             // Store user ID and role in local storage (or context)
//             localStorage.setItem('userId', response.data.userId); // Assuming userId is returned
//             const { role } = response.data; // Assuming role is returned in the login response

//             // Navigate based on user role
//             if (role === 'admin') {
//                 navigate('/admin'); // Navigate to admin module
//             } else {
//                 navigate('/user'); // Navigate to user module
//             }
//         } catch (err) {
//             setError('Invalid email or password');
//         }
//     };

//     return (
//         <div className="form-container">
//             <h2>Login</h2>
//             <form onSubmit={handleLogin}>
//                 <input
//                     type="email"
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                 />
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                 />
//                 {error && <p className="error">{error}</p>}
//                 <button type="submit">Login</button>
//                 <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
//             </form>
//         </div>
//     );
// }

// export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { email, password });
            
            // Store token and user role
            const { token, role } = response.data; // Destructure token and role from response

            // Save the token in a cookie
            document.cookie = `token=${token}; path=/`;

            // Store user email in local storage for future use
            localStorage.setItem('userEmail', email); // Store the entered email

            // Navigate based on user role
            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/user');
            }
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="error">{error}</p>}
                <button type="submit">Login</button>
                <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
            </form>
        </div>
    );
}

export default Login;
