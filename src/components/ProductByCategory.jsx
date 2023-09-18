import { useState, useEffect } from 'react'
import { getProductsByCategory, getAllProducts, getAllReviews } from '../api'
import { useParams, Link } from 'react-router-dom';
import { Col, Row, Card } from 'react-bootstrap';
import ReactRating from 'react-rating-stars-component';


const ProductByCategory = () => {

    const { id } = useParams();

    const [productByCat, setProductByCat] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {

        async function fetchedProductbyCategory() {

            try {

                const categoryData = await getProductsByCategory(id);

                setProductByCat(categoryData)

                const fetchedProducts = await getAllProducts();
                setProducts(fetchedProducts);

                const fetchedReviews = await getAllReviews();
                setReviews(fetchedReviews);

            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error)
            }

        }
        fetchedProductbyCategory();

    }, [id])

    function calculateAverageRating(productId) {
        const productReviews = reviews.filter(review => review.product_id === productId);
        const totalRating = productReviews.reduce((acc, review) => acc + review.rating, 0);
        return productReviews.length ? totalRating / productReviews.length : 0;
    }

    function getReviewCountForProduct(productId) {
        const productReviews = reviews.filter(review => review.product_id === productId);
        return productReviews.length;
    }


    return (
        <Row xs={2} md={5} className="g-4">

            {reviews.length > 0 && productByCat.map((product, idx) => {
                const avgRating = calculateAverageRating(product.id);
                const reviewCount = getReviewCountForProduct(product.id);
                const ratingValue = avgRating > 0 ? avgRating : null;
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
                                    {reviewCount > 0 &&
                                        <ReactRating
                                            count={5}
                                            value={ratingValue}
                                            size={15}
                                            activeColor="#ffd700"
                                        />}
                                    <span className="ml-2">{reviewCount > 0 ? `${reviewCount} reviews` : 'No reviews'}</span>


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
    );

}

export default ProductByCategory