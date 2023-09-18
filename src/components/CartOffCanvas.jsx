import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { Button, Offcanvas, Stack } from 'react-bootstrap';
import { getProductDetail } from '../api';
import { RiDeleteBin6Line } from 'react-icons/Ri';
import { useNavigate } from 'react-router-dom';

function CartOffCanvas({ show, onHide }) {
    const { cart, handleDeleteFromCart } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);

    const navigate = useNavigate();

    //group cart by product ID (in case multiple selection per items are made)
    // const groupedCartItems = cart.reduce((acc, curr) => {
    //     if (!acc[curr.product_id]) {
    //         acc[curr.product_id] = { ...curr, quantity: 0 };
    //     }
    //     acc[curr.product_id].quantity += curr.quantity;
    //     return acc;
    // }, {});

    const groupedCartItems = cart.reduce((acc, curr) => {
        if (!acc[curr.product_id]) {
            acc[curr.product_id] = { ...curr };
            if (curr.quantity) {
                acc[curr.product_id].quantity = 0;
            } else if (curr.cart_quantity) {
                acc[curr.product_id].cart_quantity = 0;
            }
        }

        if (curr.quantity) {
            acc[curr.product_id].quantity += curr.quantity;
        } else if (curr.cart_quantity) {
            acc[curr.product_id].cart_quantity += curr.cart_quantity;
        }

        return acc;
    }, {});


    // console.log('groupedCartItems', groupedCartItems)

    //convert to array 
    const groupedCartArray = Object.values(groupedCartItems);
    // console.log('groupedCartArray', groupedCartArray)

    useEffect(() => {
        async function fetchProductDetails() {
            try {
                const promises = cart.map(async (item) => {
                    if (item && item.product_id) {
                        return await getProductDetail(item.product_id);
                    } else {
                        console.warn("Found a cart item without a valid product ID:", item);
                        return null;
                    }
                });

                const fetchedProducts = await Promise.all(promises);
                const validProducts = fetchedProducts.filter(product => product !== null);
                setProducts(validProducts);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err);
            }
        }
        fetchProductDetails();
    }, [cart]);

    useEffect(() => {
        const newTotal = groupedCartArray.reduce((acc, cartItem) => {
            const product = products.find(prod => prod.id === cartItem.product_id);
            if (product) {
                return acc + (product.price * (cartItem.quantity || cartItem.cart_quantity));
            }
            return acc;
        }, 0);
        setTotalAmount(newTotal);
    }, [cart, products]);


    const removeItemFromCart = (productId) => {
        handleDeleteFromCart(productId);
    }

    const handleCheckOut = () => {
        console.log('checkout')
        navigate('/checkout')
    }
    const handleCartNone = () => {
        navigate('/')
    }



    return (
        <Offcanvas show={show} onHide={onHide} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Your cart</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {cart.length === 0 && <p className="mb-0">Your cart is empty.</p>}
                {groupedCartArray.map((cartItem, index) => {
                    const product = products.find(prod => prod.id === cartItem.product_id);
                    if (!product) return null;

                    return (
                        <Stack
                            direction="horizontal"
                            gap={3}
                            className='d-flex align-items-center border-bottom pt-3 pb-3 mb-2'
                            key={`${product.id}-${index}`}
                        >
                            <img
                                src={product.image_url}
                                style={{ width: '125px', height: '75px', objectFit: 'cover' }}
                            />
                            <div className='me-auto'>
                                <div>
                                    {product.title}
                                    {(cartItem.quantity || cartItem.cart_quantity) > 1 && (
                                        <span className='text-muted' style={{ fontSize: '0.5rem' }}>
                                            x {(cartItem.quantity || cartItem.cart_quantity)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className='text-muted' style={{ fontSize: '0.65rem' }}>
                                ${product.price}
                            </div>
                            <div>
                                ${product.price * (cartItem.quantity || cartItem.cart_quantity)}
                            </div>
                            <RiDeleteBin6Line
                                onClick={() => removeItemFromCart(product.id)}
                                style={{ fontSize: '40px', color: 'red' }}
                            >
                                x
                            </RiDeleteBin6Line>
                        </Stack>
                    );
                })}

                {cart.length === 0 ? null : (<div className='mt-5 mb-5'> Total Amount: ${totalAmount.toFixed(2)} </div>)}

                <div className='d-flex justify-content-end'>

                    {cart.length === 0 ?
                        (
                            <Button className='bg-danger mt-5' onClick={handleCartNone}> Continue Shopping </Button>
                        ) :
                        (
                            <Button className='bg-danger' onClick={handleCheckOut}> Check Out </Button>
                        )}
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
}

export default CartOffCanvas;
