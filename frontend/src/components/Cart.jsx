import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Cart.css';

function Cart() {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart } = location.state || { cart: [] };

    const handleCheckout = () => {
        alert("Checkout functionality is not implemented yet!");
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="cart-container">
            <h2>Your Cart</h2>
            {cart.length > 0 ? (
                <ul>
                    {cart.map((item, index) => (
                        <li key={index}>
                            <img 
                                src={item.volumeInfo.imageLinks?.thumbnail || 'placeholder.png'} 
                                alt={`${item.volumeInfo.title} cover`} 
                                className="cart-book-image"
                            />
                            <div>
                                <h3>{item.volumeInfo.title}</h3>
                                <p>{item.volumeInfo.authors?.join(', ')}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Your cart is empty.</p>
            )}
            <button onClick={handleCheckout} className="checkout-button">Checkout</button>
            <button onClick={handleGoBack} className="back-button">Go Back</button>
        </div>
    );
}

export default Cart;
