// CartContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { addProductToCart, fetchUserCart, fetchCartBySession, deleteProductFromCart, getDecodedSessionId, clearCartAfterPayment } from '../api';
import AuthContext from './AuthContext';


export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const { state } = useContext(AuthContext);

    // const [sessionId, setSessionId] = useState(Cookies.get('sessionId'));

    // LATEST BEFORE UPDATE
    useEffect(() => {
        const fetchSessionAndLoadCart = async () => {
            const token = await state.token;
            console.log('token cart context when fetch', token);

            // let sessionId = document.cookie.split(';').find(row => row.startsWith('sessionId=')).split('=')[1];
            const sessionId = await getDecodedSessionId();
            console.log('Decoded sessionId:', sessionId);

            // console.log(sessionId)
            // if (!sessionId) {
            //     try {
            //         let fetchedSessionId = await getSessionId(); // Using the function from the API module.
            //         Cookies.set('sessionId', fetchedSessionId);
            //         sessionId = fetchedSessionId;

            //     } catch (error) {
            //         console.error('Error fetching session ID:', error);
            //     }
            // }

            if (token) {
                loadUserCart(token);
            } else if (sessionId) {
                loadSessionCart(sessionId);
            }
        }

        fetchSessionAndLoadCart();
    }, [state.token]);



    //     useEffect(() => {



    //         // let sessionId = Cookies.get('sessionId');

    // async function handleSessionId(){

    //     try {
    //         const sessionId = await getSessionId()
    //     } catch (error) {
    //         console.log(error);
    //     }


    // }

    // const token = state.token;

    //         console.log(token)


    //         if (!sessionId) {
    //             sessionId = generateSessionId();
    //             Cookies.set('sessionId', sessionId);
    //         }

    //         if (token) {
    //             loadUserCart(token);
    //         } else if (sessionId) {
    //             loadSessionCart(sessionId);
    //         }
    //     }, []);


    //version 2
    // useEffect(() => {

    //     async function getSessionId() {
    //         try {
    //             const response = await fetch('http://localhost:3000/get-session-id');
    //             console.log(response)
    //             const data = await response.json();
    //             console.log(data);
    //             if (data.sessionId) {
    //                 Cookies.set('sessionId', data.sessionId);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching session ID:', error);
    //         }
    //     }

    //     const token = state.token;
    //     let sessionId = Cookies.get('sessionId');

    //     if (!sessionId) {
    //         getSessionId();  // If there's no session ID, fetch it
    //     }

    //     if (token) {
    //         loadUserCart(token);
    //     } else if (sessionId) {
    //         loadSessionCart(sessionId);
    //     }



    // }, []);

    //version 3
    // useEffect(() => {
    //     const fetchSessionAndLoadCart = async () => {
    //         const token = state.token;
    //         let sessionId = Cookies.get('sessionId');

    //         console.log(sessionId)

    //         if (!sessionId || sessionId == undefined) {
    //             try {
    //                 sessionId = await getSessionId(); // Using the function from the API module.
    //                 Cookies.set('sessionId', sessionId);
    //                 console.log("sessionId Session ID set:", sessionId);
    //             } catch (error) {
    //                 console.error('Error fetching session ID:', error);
    //             }
    //         }

    //         // else {
    //         //     console.log("Existing Session ID:", sessionId);
    //         // }

    //         if (token) {
    //             loadUserCart(token);
    //         } else if (sessionId) {
    //             loadSessionCart(sessionId);
    //         }
    //     }

    //     fetchSessionAndLoadCart();
    // }, []);


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
        // const newCartItem = {
        //     id: product.id,
        //     quantity: selectedQuantity
        // };

        const newCartItem = {
            product_id: product.id,
            quantity: selectedQuantity
        };

        const userId = user?.id;
        // const sessionId = Cookies.get('sessionId');

        const sessionId = await getDecodedSessionId();
        console.log('DEcodedsessionId', sessionId);

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
        // const sessionId = Cookies.get('sessionId');
        // console.log(Cookies.get());

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
        const token = state?.token; // or however you get the token from the AuthContext

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

    // CLEAR CART AFTER CLICKING payment
    // async function handleClearCart() {
    //     const userId = state?.user?.id;
    //     const sessionId = await getDecodedSessionId();

    //     try {
    //         const response = await clearCartForUser(userId, sessionId);
    //         if (response && response.message) {
    //             setCart([]); // Set the cart state to an empty array
    //         } else {
    //             console.error("Unexpected response from clearCartForUser:", response);
    //         }
    //     } catch (error) {
    //         console.error('Error clearing the cart:', error);
    //     }
    // }


    return (
        <CartContext.Provider value={{ cart, setCart, handleAddToCart, handleDeleteFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};
