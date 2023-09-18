import React, { useEffect, useState, useContext } from 'react';
import { fetchCartBySessionId, fetchUserCart } from '../api';
import AuthContext from '../context/AuthContext';
import Cookies from 'js-cookie';
import { Offcanvas } from 'react-bootstrap';


function CartComponent() {
    const { state } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);
    const sessionId = Cookies.get('sessionId');

    useEffect(() => {
        async function getCartItems() {
            try {
                let items = [];

                if (state.token) { // if token exists, fetch user's cart
                    items = await fetchUserCart(state.token);
                } else { // otherwise, fetch cart by session ID
                    const sessionId = Cookies.get('sessionId');
                    items = await fetchCartBySessionId(sessionId);
                }

                setCartItems(items);

            } catch (error) {
                setError(error.message);
                console.error("Error fetching cart:", error);
            }
        }

        getCartItems();
    }, [state.token, sessionId]);  // token is a dependency; if it changes, you might want to re-fetch the cart

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {cartItems.map(item => (
                <div key={item.id}>
                    {item.name} - {item.price}
                </div>
            ))}
        </div>
    );
}

export default CartComponent;
