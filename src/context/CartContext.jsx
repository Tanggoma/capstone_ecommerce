// CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { addProductToCart, fetchUserCart, fetchCartBySession, deleteProductFromCart, getDecodedSessionId, clearCartAfterPayment, updateCartQty } from '../api';
import AuthContext from './AuthContext';


export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const { state } = useContext(AuthContext);

    // LATEST BEFORE UPDATE
    useEffect(() => {
        const fetchSessionAndLoadCart = async () => {
            const token = await state.token;
            console.log('token cart context when fetch', token);

            const sessionId = await getDecodedSessionId();
            console.log('Decoded sessionId:', sessionId);

            if (token) {
                loadUserCart(token);
            } else if (sessionId) {
                loadSessionCart(sessionId);
            }
        }

        fetchSessionAndLoadCart();
    }, [state.token]);

    const loadUserCart = async (token) => {
        try {
            const userCart = await fetchUserCart(token);
            setCart(userCart);
        } catch (error) {
            console.error('Error loading user cart:', error);
        }
    };

    const loadSessionCart = async (sessionId) => {
        try {
            const sessionCart = await fetchCartBySession(sessionId);
            setCart(sessionCart);
        } catch (error) {
            console.error('Error loading cart by session:', error);
        }
    };

    async function handleAddToCart(product, selectedQuantity, user) {

        const newCartItem = {
            product_id: product.id,
            quantity: selectedQuantity
        };

        const userId = user?.id;

        const sessionId = await getDecodedSessionId();
        // console.log('DEcodedsessionId', sessionId);

        try {
            const response = await addProductToCart(product.id, selectedQuantity, userId, sessionId);

            console.log(response)
            if (response && response.message) {
                const existingItemIndex = cart.findIndex(item => item.product_id === product.id);


                if (existingItemIndex !== -1) {
                    const updatedCart = [...cart];
                    updatedCart[existingItemIndex].quantity += selectedQuantity;

                    setCart(updatedCart);
                } else {
                    setCart(prevCart => [...prevCart, newCartItem]);
                }
            } else {
                console.error("Unexpected response from addToCart:", response);
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    }

    // REMOVE FROM CART 
    async function handleDeleteFromCart(productId) {
        const userId = state?.user?.id;

        const sessionId = await getDecodedSessionId();
        console.log('DecodedsessionId', sessionId);


        try {
            const response = await deleteProductFromCart(userId, productId, sessionId);
            if (response && response.message) {
                const updatedCart = cart.filter(item => item.product_id !== productId);
                setCart(updatedCart);
            } else {
                console.error("Unexpected response from deleteProductFromCart:", response);
            }
        } catch (error) {
            console.error('Error deleting product from cart:', error);
        }
    }

    // Empty the cart after payment
    async function clearCart() {
        console.log('Initiating clear cart function');
        const userId = state?.user?.id;
        const sessionId = await getDecodedSessionId();
        const token = state?.token;

        console.log(`Clear cart with userId: ${userId}, sessionId: ${sessionId}, token: ${token}`);

        try {
            const response = await clearCartAfterPayment(userId, sessionId, token);
            if (response && response.message) {
                setCart([]); // Set the cart state to an empty array
            } else {
                console.error("Unexpected response from clearCartAfterPayment:", response);
            }
        } catch (error) {
            console.error('Error clearing the cart after payment:', error);
        }
    }

    //Update Cart Quantity
    async function handleUpdateCart(productId, newQuantity) {

        const userId = state?.user?.id;
        const token = state?.token;
        const sessionId = await getDecodedSessionId();

        try {
            await updateCartQty(userId, productId, newQuantity, sessionId, token);

            const updatedCart = cart.map(item => {
                if (item.product_id === productId) {
                    return { ...item, quantity: newQuantity }
                }
                return item;
            });

            setCart(updatedCart);
        }

        catch (error) {
            console.error('Error updating quantity in cart:', error);
        }
    }

    return (
        <CartContext.Provider value={{ cart, setCart, handleAddToCart, handleDeleteFromCart, clearCart, handleUpdateCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};
