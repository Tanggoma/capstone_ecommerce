import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ReactRating from 'react-rating-stars-component';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { postReview } from '../api';

function WriteReviewModal({ show, handleClose, resetForm, onResetComplete }) {

    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');

    const params = useParams();
    const productId = params.id;

    const submitReview = async () => {

        await postReview(productId, rating, reviewText);

        localStorage.setItem(`reviewed_${productId}`, true); // prevent re-submit product reviews by the same user

        handleClose();

    }

    // clear form when close the modal(without submitting)
    useEffect(() => {
        if (resetForm) {
            setRating(null);
            setReviewText('');

            if (onResetComplete) {
                onResetComplete();
            }
        }
    }, [resetForm])


    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title> Please share your experience </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label> Overall rating </Form.Label>

                        <ReactRating
                            count={5}
                            value={rating}
                            size={15}
                            activeColor="#ffd700"
                            onChange={(newRating) => setRating(newRating)}
                        />
                    </Form.Group>
                    <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                    >
                        <Form.Label>Review </Form.Label>
                        <Form.Control as="textarea" rows={3} value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button type="submit" disabled={!rating || !reviewText} variant="primary" onClick={submitReview}>
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default WriteReviewModal;