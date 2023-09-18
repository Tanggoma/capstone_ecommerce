// AddToCart.js
import React from 'react';
import Button from 'react-bootstrap/Button';
import { useCart } from '../context/CartContext';
import Cookies from 'js-cookie';
import { addProductToCart } from '../api';

function AddToCart({ product, selectedQuantity, userId, setShow }) {
    const [cart, setCart] = useCart();

    async function handleAddToCart() {
        const newCartItem = {
            id: product.id,
            quantity: selectedQuantity
        };

        const sessionId = Cookies.get('sessionId');

        try {
            const response = await addProductToCart(product.id, selectedQuantity, userId, sessionId);

            if (response && response.message) {
                const existingItemIndex = cart.findIndex(item => item.id === product.id);

                if (existingItemIndex !== -1) {
                    const updatedCart = [...cart];
                    updatedCart[existingItemIndex].quantity += selectedQuantity;
                    setCart(updatedCart);
                } else {
                    setCart(prevCart => [...prevCart, newCartItem]);
                }

                setShow(true);
            } else {
                console.error("Unexpected response from addToCart:", response);
                alert('Failed to add the item to the cart.');
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
            alert('Failed to add the item to the cart.');
        }
    }

    return (
        <Button variant="danger" onClick={handleAddToCart}>Add to Cart</Button>
    );
}

export default AddToCart;
