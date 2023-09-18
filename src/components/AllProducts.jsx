import React, { useEffect, useState, useContext } from 'react'
import ReactRating from 'react-rating-stars-component';
import { Link } from 'react-router-dom';

//Import React Bootstrap
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Container } from 'react-bootstrap';


//Import API call 
import { getAllProducts, getAllReviews } from '../api';

//Import Context
import { SearchContext } from '../context/searchContext';
import AuthContext from '../context/AuthContext';// update2

function AllProducts() {

    //state
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('default');

    //auth context
    const { state } = useContext(AuthContext); // update 2

    //search context and filter products from search term
    const { searchTerm } = useContext(SearchContext);
    const filteredProducts = products.filter(product =>

        product.title.toLowerCase().includes(searchTerm.toLowerCase())

    );

    useEffect(() => {

        async function fetchData() {
            try {
                const token = state.token; // update 2 

                const fetchedProducts = await getAllProducts(token); //update 2
                setProducts(fetchedProducts);


                const fetchedReviews = await getAllReviews();
                setReviews(fetchedReviews);

                setLoading(false)

            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error)
            }
        }

        fetchData();

    }, [state.token]); //orginally []

    function calculateAverageRating(productId) {
        const productReviews = reviews.filter(review => review.product_id === productId);
        const totalRating = productReviews.reduce((acc, review) => acc + review.rating, 0);
        return productReviews.length ? totalRating / productReviews.length : 0;
    }

    function getReviewCountForProduct(productId) {
        const productReviews = reviews.filter(review => review.product_id === productId);
        return productReviews.length;
    }

    //SORT
    let displayProducts = [...filteredProducts];
    if (sortOrder === 'low-high') {
        displayProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'high-low') {
        displayProducts.sort((a, b) => b.price - a.price);
    }



    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading products: {error.message}</p>;


    return (

        <>
            {<DropdownButton className='mb-5 mx-2' variant='dark' id="dropdown-item-button" title="Sort By">
                <Dropdown.Item onClick={() => setSortOrder('default')} as="button">All Products</Dropdown.Item>
                <Dropdown.Item onClick={() => setSortOrder('low-high')} as="button">Price: Low to High</Dropdown.Item>
                <Dropdown.Item onClick={() => setSortOrder('high-low')} as="button">Price: High to Low</Dropdown.Item>
            </DropdownButton>
            }

            <Row xs={2} md={5} className="g-4">

                {/* {products.map((product, idx) => { */}
                {/* {filteredProducts.map((product, idx) => { */}
                {displayProducts.map((product, idx) => {

                    const avgRating = calculateAverageRating(product.id);
                    const reviewCount = getReviewCountForProduct(product.id);
                    return (
                        <Col key={idx}>
                            <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Card id='card-container'>
                                    <Card.Img variant="top" src={product.image_url} />
                                    <Card.Body>
                                        <Card.Text>
                                            {product.brand}
                                        </Card.Text>
                                        <Card.Title> {product.title}</Card.Title>
                                        <ReactRating
                                            count={5}
                                            value={avgRating}
                                            size={15}
                                            activeColor="#ffd700"
                                        />
                                        <span className="ml-2">({reviewCount} reviews)</span>
                                        <Card.Text className='text-danger mt-4'>
                                            ${product.price}
                                        </Card.Text>

                                    </Card.Body>
                                </Card>
                            </Link>
                        </Col>
                    )
                })}
            </Row>
        </>
    );
}

export default AllProducts