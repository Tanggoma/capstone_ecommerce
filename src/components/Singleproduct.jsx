import React, { useState, useEffect, useRef, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { getProductDetail, getReviewsByProductId, addProductToWishList, getWishListByUser } from '../api';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Col, Container, Row } from 'react-bootstrap';
import ReactRating from 'react-rating-stars-component';
import { FiHeart } from 'react-icons/fi'
import { Modal } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import ReviewsDetails from './ReviewsDetails';
//context
import AuthContext from '../context/AuthContext';
import { useCart } from '../context/CartContext'; //import cart context

import { addProductToCart } from '../api';

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
    const [showModal, setShowModal] = useState(false);
    const [inWishlist, setInWishlist] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [alreadyInWishlist, setAlreadyInWishlist] = useState(false);

    //offcanvas hook
    const [show, setShow] = useState(false);

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
                const reviewsData = await getReviewsByProductId(id);

                setTimeout(() => {
                    setIsLoading(false)
                    setProduct(productData)
                    setReviews(reviewsData);
                }, 200);


                if (isLoggedIn()) {
                    const data = await getWishListByUser();

                    if (data.some(item => item.product_id === parseInt(id))) setAlreadyInWishlist(true)

                } else {
                    let guestWishlist = JSON.parse(localStorage.getItem('guestWishlist')) || [];
                    if (guestWishlist.some(item => item.id === parseInt(id))) {
                        setAlreadyInWishlist(true);
                    }

                }


            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error)
            }

        }
        fetchedProductDetail();

    }, [id, token])

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

    const addProductToCart = () => {
        handleAddToCart(product, selectedQuantity, state.user);
        setShow(true);
    };

    const handleCloseAndRedirect = () => {

        setShow(false); // Close the offcanvas
        navigate('/') // Redirect to the home page
    }


    const avgRating = calculateAverageRating();
    const ratingValue = avgRating > 0 ? avgRating : 0;

    if (error) return <p>Error loading product: {error.message}</p>;


    function isLoggedIn() {
        return !!localStorage.getItem('authToken');
    }

    const handleAddToWishlist = async () => {

        let wishlist_item = {
            availableUnits: product.available_units,
            brand: product.brand,
            categoryId: product.category_id,
            description: product.description,
            id: product.id,
            image_url: product.image_url,
            price: product.price,
            title: product.title,
        };

        try {
            // console.log("handleAddToWishlist function called");
            if (isLoggedIn()) {
                // console.log("User is logged in");

                const response = await addProductToWishList(product.id);

                if (response && response.message === 'Product added to wishlist!') {
                    setInWishlist(true);
                    // alert('Product added to wishlist!');
                }

            } else {

                // console.log("User is NOT logged in");
                let wishlist = JSON.parse(localStorage.getItem('guestWishlist')) || [];

                if (wishlist.some(item => item.id === wishlist_item.id)) {
                    setAlreadyInWishlist(true)
                    alert('Product is already in the wishlist!');
                    return;
                }

                wishlist.push(wishlist_item);
                localStorage.setItem('guestWishlist', JSON.stringify(wishlist));
                setInWishlist(true);
                // alert('Product added to wishlist!');
            }

        } catch (error) {
            console.error('Error adding product to wishlist:', error.message);
            alert('Failed to add product to wishlist. Please try again.');
        }
    };

    return (
        <>

            {isLoading ? (

                <div className="d-flex justify-content-center my-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) :
                (
                    <>
                        <Container>
                            <Card style={{ width: '100%' }}>
                                <Row >
                                    <Col md={8} style={{ borderRight: '1px solid #e0e0e0' }}>
                                        <div className="d-flex align-items-center justify-content-center h-100">
                                            <Card.Img
                                                id='single-img'
                                                src={product.image_url}
                                                alt={product.title}
                                                style={{ width: '70%' }}
                                                onClick={() => setShowModal(true)}
                                            // onMouseLeave={() => setShowModal(false)}

                                            />
                                            <Modal show={showModal} onHide={() => setShowModal(false)} size='lg'>
                                                <Modal.Body>
                                                    <img src={product.image_url} alt="Zoomed Description" className="img-fluid" />
                                                </Modal.Body>
                                            </Modal>
                                        </div>
                                    </Col>

                                    <Col md={4}>
                                        <Card.Body>
                                            <Card.Text>
                                                Brand: {product.brand}
                                            </Card.Text>

                                            <div className="heart-icon-container" onClick={handleAddToWishlist}>
                                                <FiHeart style={{ width: "2rem", height: "2rem", color: inWishlist || alreadyInWishlist ? 'red' : 'black' }} />
                                            </div>

                                            <Card.Title className='mb-5 font-weight-bold'>{product.title}</Card.Title>

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

                                                <Button variant="danger" className='mt-5' onClick={addProductToCart} aria-controls="offcanvasRight">Add to Cart</Button>

                                                <CartOffCanvas show={show} onHide={handleCloseAndRedirect} />
                                            </Container>

                                        </Card.Body>

                                    </Col>

                                </Row>
                            </Card>
                        </Container >
                        <ReviewsDetails reviews={reviews} ratingValue={ratingValue} />
                    </>)}
        </>
    );


}


export default Singleproduct