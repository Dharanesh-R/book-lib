import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import BookLibrary from './components/BookLibrary';
import './App.css'
import Cart from './components/Cart';
import Admin from './components/Admin';
import User from './components/User';

function App() {
    const handleLogin = () => {
        // Redirect to the book library after login
        window.location.href = '/books';
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login onLogin={handleLogin} />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/books" element={<BookLibrary />} />
                <Route path="/cart" element={<Cart/> } />
                <Route path="/admin" element={<Admin/> } />
                <Route path="/user" element={<User/> } />
            </Routes>
        </Router>
    );
}

export default App;
