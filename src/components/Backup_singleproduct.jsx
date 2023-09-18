// Pending wishlist function  

import React, { useState, useEffect, useRef, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { getProductDetail, getReviewsByProductId } from '../api';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Col, Container, Row } from 'react-bootstrap';
import ReactRating from 'react-rating-stars-component';
import { FiHeart } from 'react-icons/Fi'
import Cookies from 'js-cookie';
//context

import AuthContext from '../context/AuthContext';
import { useCart } from '../context/CartContext'; //import cart context

import { addProductToCart } from '../api';

// import AddToCart from './AddToCart';



//offcanvas
import Alert from 'react-bootstrap/Alert';
import Offcanvas from 'react-bootstrap/Offcanvas';
import CartOffCanvas from './CartOffCanvas';


const Singleproduct = () => {

    const { id } = useParams();

    const [product, setProduct] = useState(null)
    const [error, setError] = useState(null);
    const [selectedQuantity, setSelectedQuantity] = useState(0)
    const [reviews, setReviews] = useState([]);

    //offcanvas hook
    const [show, setShow] = useState(false);

    //cart context
    // const [cart, setCart] = useCart();

    // New Cart Context 
    const { cart, handleAddToCart } = useCart();
    const { state } = useContext(AuthContext);

    const token = state.token; // update 2 

    // navigate
    const navigate = useNavigate();

    useEffect(() => {

        async function fetchedProductDetail() {

            try {


                const productData = await getProductDetail(id, token);
                // console.log(productData)
                setProduct(productData)

                const reviewsData = await getReviewsByProductId(id);
                // console.log(reviewsData)
                setReviews(reviewsData);

            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error)
            }

        }

        // if (token) { // Ensure we have a token before trying to fetch product details
        //     fetchedProductDetail();
        // }
        fetchedProductDetail();

    }, [id, token]) //orginally [id]

    function calculateAverageRating() {

        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        return reviews.length ? totalRating / reviews.length : 0;
    }



    const handleQuantity = (action) => {
        if (action === 'increment') {
            if (selectedQuantity < product.available_units) {
                setSelectedQuantity(prevQuantity => prevQuantity + 1);
            } else {
                alert('over limit');
            }
        } else if (action === 'decrement') {
            if (selectedQuantity > 0) {
                setSelectedQuantity(prevQuantity => prevQuantity - 1);
            } else {
                alert('Minimum limit reached');
            }
        }
    }

    //off canvas 
    // function handleAddToCart() {

    //     const newCartItem = {
    //         id: product.id,
    //         title: product.title,
    //         quantity: selectedQuantity
    //     };

    //     setCart(prevCart => [...prevCart, newCartItem]);

    //     setShow(true);




    // }

    //VERSION 1 
    // async function handleAddToCart() {
    //     const newCartItem = {
    //         id: product.id,
    //         quantity: selectedQuantity
    //     };

    //     const userId = state.user?.id;
    //     const sessionId = Cookies.get('sessionId');

    //     try {
    //         const response = await addProductToCart(product.id, selectedQuantity, userId, sessionId);

    //         if (response && response.message) {
    //             // Update the cart context/state with the new cart item
    //             setCart(prevCart => [...prevCart, newCartItem]);
    //             setShow(true);

    //         } else {
    //             // Handle the case where the response might not be as expected
    //             console.error("Unexpected response from addToCart:", response);
    //             alert('Failed to add the item to the cart.');
    //         }
    //     } catch (error) {
    //         console.error('Error adding product to cart:', error);
    //         alert('Failed to add the item to the cart.');
    //     }
    // }

    // VERSION 2 BEFORE REFACTOR
    // async function handleAddToCart() {
    //     const newCartItem = {
    //         id: product.id,
    //         quantity: selectedQuantity
    //     };

    //     const userId = state.user?.id;
    //     const sessionId = Cookies.get('sessionId');

    //     try {
    //         const response = await addProductToCart(product.id, selectedQuantity, userId, sessionId);

    //         if (response && response.message) {
    //             // Check if product is already in the cart
    //             const existingItemIndex = cart.findIndex(item => item.id === product.id);

    //             if (existingItemIndex !== -1) {
    //                 // Product exists, update its quantity
    //                 const updatedCart = [...cart];
    //                 updatedCart[existingItemIndex].quantity += selectedQuantity;
    //                 setCart(updatedCart);
    //             } else {
    //                 // Product does not exist, add new item
    //                 setCart(prevCart => [...prevCart, newCartItem]);
    //             }

    //             setShow(true);
    //         } else {
    //             console.error("Unexpected response from addToCart:", response);
    //             alert('Failed to add the item to the cart.');
    //         }
    //     } catch (error) {
    //         console.error('Error adding product to cart:', error);
    //         alert('Failed to add the item to the cart.');
    //     }
    // }

    const addProductToCart = () => {
        handleAddToCart(product, selectedQuantity, state.user);
        setShow(true);
    };

    const handleCloseAndRedirect = () => {

        setShow(false); // Close the offcanvas
        navigate('/') // Redirect to the home page
    }



    if (error) return <p>Error loading product: {error.message}</p>;
    if (!product) return <p>Product not found</p>;

    const avgRating = calculateAverageRating();
    const ratingValue = avgRating > 0 ? avgRating : 0;

    // const handleAddToCart = () => {
    //     console.log('add to cart')
    // }




    return (
        <>
            <Container>
                <Card style={{ width: '100%' }}>
                    <Row >
                        <Col md={8} style={{ borderRight: '1px solid #e0e0e0' }}>
                            <div className="d-flex align-items-center justify-content-center h-100">
                                <Card.Img src={product.image_url} alt={product.title} style={{ width: '70%' }} />
                            </div>
                        </Col>

                        <Col md={4}>
                            <Card.Body>
                                <Card.Text>
                                    Brand: {product.brand}
                                </Card.Text>

                                <div className="heart-icon-container">
                                    <FiHeart style={{ width: "2rem", height: "2rem" }} />
                                </div>

                                <Card.Title className='mb-5 font-weight-bold'>{product.title}</Card.Title>
                                {/* 
                            {avgRating > 0 ? <ReactRating
                                count={5}
                                value={avgRating}
                                size={15}
                                activeColor="#ffd700"
                                readOnly
                            /> :

                                <ReactRating
                                    count={5}
                                    value={0}
                                    size={15}
                                    activeColor="#ffd700"
                                    readOnly
                                />

                            } */}

                                {reviews.length > 0 && <ReactRating
                                    count={5}

                                    value={ratingValue}

                                    size={15}
                                    activeColor="#ffd700"
                                    readOnly
                                />}

                                <span className="ml-2 text-primary">{reviews.length > 0 ? `${reviews.length} reviews` : 'No reviews'}</span>

                                <Card.Text>
                                    {product.description}
                                </Card.Text>
                                <Card.Text className='mt-5 mb-3'>
                                    Price: ${product.price}
                                </Card.Text>
                                <Container>
                                    <Button variant="primary" onClick={() => handleQuantity('decrement')}>-</Button>
                                    <span className='pl-4'> {selectedQuantity} </span>
                                    <Button variant="primary" onClick={() => handleQuantity('increment')}>+</Button>
                                    <br />
                                    {/* <Button variant="danger" className='mt-5' onClick={handleAddToCart} aria-controls="offcanvasRight">Add to Cart</Button> Version2 */}
                                    <Button variant="danger" className='mt-5' onClick={addProductToCart} aria-controls="offcanvasRight">Add to Cart</Button>

                                    {/* <AddToCart product={product} selectedQuantity={selectedQuantity} userId={state.user?.id} setShow={setShow} /> */}



                                    {/* Offcanvas UI directly in the component */}
                                    {/* <Offcanvas show={show} onHide={handleCloseAndRedirect} placement="end">
                                        <Offcanvas.Header closeButton>
                                            <Offcanvas.Title>Your cart items</Offcanvas.Title>
                                        </Offcanvas.Header>
                                        <Offcanvas.Body>
                                            <p className="mb-0">Items </p>
                                           
                                        </Offcanvas.Body>
                                    </Offcanvas> */}

                                    {/* <CartOffCanvas show={show} onHide={() => setShow(false)} /> */}
                                    <CartOffCanvas show={show} onHide={handleCloseAndRedirect} />
                                </Container>

                            </Card.Body>

                        </Col>

                    </Row>
                </Card>
            </Container >


        </>
    );


}


export default Singleproduct