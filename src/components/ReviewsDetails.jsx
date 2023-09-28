import { Accordion, Card, ButtonGroup, Button, Badge, Form, Col, Row, ProgressBar, InputGroup } from 'react-bootstrap';
import ReactRating from 'react-rating-stars-component';
import { useState } from 'react';
import WriteReviewModal from './WriteReviewModal';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { HiSearch } from 'react-icons/hi'

function ReviewsDetails({ reviews, ratingValue }) {

    const [show, setShow] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [shouldResetForm, setShouldResetForm] = useState(false);
    const [showWriteReviewBtn, setShowWriteReviewBtn] = useState(true);

    const params = useParams();
    const productId = params.id;

    useEffect(() => {
        if (localStorage.getItem(`reviewed_${productId}`)) {
            setShowWriteReviewBtn(false);
        }
    }, [productId]);

    const handleClose = () => {

        setShow(false);
        setShouldResetForm(true);

    };

    const handleShow = () => setShow(true);

    const handleFeedBack = () => {
        alert('Thank you for your feedback')
    }

    const handleFlagReview = () => {
        alert('We have sent notification to the team to investigate the review')
    }

    const onResetComplete = () => {
        setShouldResetForm(false);
    }

    // Calculate count for each rating showing in progress bar
    const countRatings = Array(5).fill(0)

    reviews.forEach(review => {

        if (review.rating >= 1 && review.rating <= 5) {
            countRatings[review.rating - 1]++;
        }
        // console.log(countRatings);
        return countRatings

    })

    const filteredReviews = reviews.filter(review =>
        review.text.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <Accordion defaultActiveKey="0" className='mt-5'>
            <Accordion.Item eventKey="0">

                <Accordion.Header>Product Reviews ({reviews.length}) </Accordion.Header>

                {/* Subheader for searchbar and filter reviews */}

                {reviews.length === 0 ?
                    (
                        <>
                            <Accordion.Body> No Review </Accordion.Body>
                            <Button className='my-3 mx-3' onClick={handleShow}> Be the first to review this item</Button>
                        </>
                    )
                    :

                    (ratingValue &&

                        <Accordion.Body>

                            <Row >
                                <Col md={4}>
                                    {[5, 4, 3, 2, 1].map((rating, index) => (
                                        <div key={rating} className='my-2 d-flex align-items-center justify-content-start'>
                                            <span className='mr-2'>{rating}</span>
                                            <ProgressBar
                                                variant="info"
                                                max={reviews.length}
                                                now={countRatings[rating - 1]}
                                                className='mx-2'
                                                style={{ flexGrow: 1 }}
                                            />
                                            <span className='ml-2'>{countRatings[rating - 1]}</span>
                                        </div>
                                    ))}
                                </Col>


                                <Col md={4} className='d-flex justify-items-center'>
                                    <p className='mx-2'> Average Rating: </p>

                                    <ReactRating
                                        count={5}
                                        value={ratingValue}
                                        size={15}
                                        activeColor="#ffd700"
                                        readOnly

                                    />

                                    <span className='mx-3'>({ratingValue.toFixed(2)})</span>
                                </Col>
                                <Col md={4} >
                                    {showWriteReviewBtn && <Button onClick={handleShow}> Write Review </Button>}
                                </Col>
                            </Row>

                        </Accordion.Body>)

                }

                {reviews.length !== 0 && <Accordion.Body>
                    <Form className="d-flex">
                        <InputGroup>
                            <InputGroup.Text>
                                <HiSearch />
                            </InputGroup.Text>
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                    </Form>
                </Accordion.Body>
                }

                {/* Write Review Form in Modal */}
                <WriteReviewModal show={show} setShow={setShow} handleClose={handleClose} handleShow={handleShow} resetForm={shouldResetForm} onResetComplete={onResetComplete} />

                {filteredReviews.length > 0 && filteredReviews.map((review, index) => (
                    <Accordion.Body key={review.review_id}>
                        <Card>
                            <Card.Body>
                                <div className='d-flex align-items-center justify-content-between'>
                                    <ReactRating
                                        count={5}
                                        value={review.rating}
                                        size={15}
                                        activeColor="#ffd700"
                                        readOnly
                                    />
                                    <Badge bg="secondary">{new Date(review.created_at).toLocaleDateString()}</Badge>
                                </div>
                                <Card.Title className='fw-bolder mt-3'>{review.text}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted fst-italic">By {review.username}</Card.Subtitle>

                                <div className="mt-3">
                                    <span>Was this review helpful to you?</span>
                                    <ButtonGroup className="mx-3">
                                        <Button onClick={handleFeedBack} variant="outline-primary">Helpful</Button>
                                        <Button onClick={handleFeedBack} variant="outline-danger">Not Helpful</Button>
                                    </ButtonGroup>
                                    <Button onClick={handleFlagReview} variant="link" className="ml-3">Flag this review</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Accordion.Body>
                ))}

            </Accordion.Item>
        </Accordion>
    );
}

export default ReviewsDetails;


