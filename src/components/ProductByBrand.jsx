import { useState, useEffect } from 'react'
import { getAllProducts, getAllReviews } from '../api'
import { useParams, Link } from 'react-router-dom';
import { Col, Row, Card } from 'react-bootstrap';
import ReactRating from 'react-rating-stars-component';

const ProductByBrand = () => {

    const { brand } = useParams();

    const [productByBrand, setProductByBrand] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [products, setProducts] = useState([]);

    async function getProductsByBrand(brand) {
        const allProducts = await getAllProducts();
        return allProducts.filter(product => product.brand.toLowerCase() === brand.toLowerCase());
    }

    useEffect(() => {

        async function fetchedProductbyBrand() {

            try {

                const fetchedProducts = await getAllProducts();
                setProducts(fetchedProducts);

                const fetchedProductsByBrand = await getProductsByBrand(brand);
                setProductByBrand(fetchedProductsByBrand)

                const fetchedReviews = await getAllReviews();
                setReviews(fetchedReviews);

            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error)
            }

        }
        fetchedProductbyBrand();

    }, [brand])

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
        <>
            {productByBrand.length === 0 && <h4 className='text-center my-5 text-primary'> We are importing more products from this brand. They are on the way! </h4>}

            <Row xs={2} md={5} className="g-4">
                {reviews.length > 0 && productByBrand.map((product, idx) => {
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
        </>
    );

}

export default ProductByBrand;