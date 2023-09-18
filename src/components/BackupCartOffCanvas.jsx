import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { Button, Offcanvas, Stack } from 'react-bootstrap';
import { getProductDetail } from '../api';
import { RiDeleteBin6Line } from 'react-icons/Ri'


function CartOffCanvas({ show, onHide }) {

    const { cart, handleDeleteFromCart } = useContext(CartContext);

    console.log('cart', cart);

    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);



    useEffect(() => {
        async function fetchProductDetails() {
            //         try {
            //             console.log('cart', cart)
            //             const fetchedProducts = [];
            //             for (let item of cart) {
            //                 if (item && item.id) {
            //                     const productData = await getProductDetail(item.product_id);

            //                     fetchedProducts.push(productData);
            //                     setProducts(fetchedProducts);

            //                 } else {
            //                     console.warn("Found a cart item without a valid product ID:", item)
            //                 }
            //             }

            //             console.log('productDetail', products)
            //         } catch (err) {
            //             console.error("Error fetching data:", err);
            //             setError(err);
            //         }
            //     }

            //     fetchProductDetails();
            // }, [cart]);
            try {
                console.log('cart', cart);

                const promises = cart.map(async (item) => {
                    if (item && item.product_id) {
                        return await getProductDetail(item.product_id);
                    } else {
                        console.warn("Found a cart item without a valid product ID:", item);
                        return null;  // Return null for items without valid product IDs
                    }
                });

                const fetchedProducts = await Promise.all(promises);

                // Filter out any null values (from items without valid product IDs)
                const validProducts = fetchedProducts.filter(product => product !== null);

                setProducts(validProducts);

                console.log('productDetail', validProducts);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err);
            }
        }

        fetchProductDetails();
    }, [cart]);


    const removeItemFromCart = (productId) => {
        handleDeleteFromCart(productId);
        console.log(`Removed product with ID: ${productId}`);
    }

    return (
        <Offcanvas show={show} onHide={onHide} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Your cart items</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {/* {error && <p className="text-danger">Error: {error.message}</p>} */}
                {cart.length === 0 && <p className="mb-0">Your cart is empty.</p>}
                {cart && products.map(product => {

                    // const cartItem = cart.find(item => item.id === product.id);
                    const cartItem = cart.find(item => item.product_id === product.id);

                    const quantity = cartItem ? cartItem.quantity : 0;

                    return (

                        <Stack direction="horizontal" gap={3} className='d-flex align-items-center border-bottom pt-3 pb-3 mb-2' key={cart.id}>
                            <img
                                src={product.image_url}
                                style={{ width: '125px', height: '75px', objectFit: 'cover' }}></img>
                            <div className='me-auto'>
                                <div> {product.title} {" "} {quantity > 1 && <span className='text-muted' style={{ fontSize: '0.5rem' }}>x {quantity}</span>} </div>
                            </div>
                            <div className='text-muted' style={{ fontSize: '0.65rem' }}>${product.price} </div>
                            <div>${product.price * quantity} </div>
                            <RiDeleteBin6Line
                                onClick={() => removeItemFromCart(product.id)}
                                style={{ fontSize: '40px', color: 'red' }}>x</RiDeleteBin6Line>

                        </Stack>
                    );
                })}
            </Offcanvas.Body>
        </Offcanvas >
    );
}

export default CartOffCanvas;

