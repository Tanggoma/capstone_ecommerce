import { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Stack, Image } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';

import { CartContext } from '../context/CartContext';
import { getProductDetail, postOrderHistory } from '../api';
import { RiDeleteBin6Line } from 'react-icons/ri';

const CheckOut = () => {

    //Context
    const { cart, handleDeleteFromCart, clearCart, handleUpdateCart } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantityOverLimit, setQuantityOverLimit] = useState(false);


    // Modal to edit cart quantity
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //Calculate Total 

    const subTotal = parseFloat(totalAmount.toFixed(2))
    const shipping = (totalAmount > 50) ? 0 : 5

    const taxAmount = subTotal * 0.08;
    const tax = parseFloat(taxAmount.toFixed(2));
    const totalAmountWithTaxAndShipping = subTotal + shipping + tax;
    const total = parseFloat(totalAmountWithTaxAndShipping.toFixed(2));

    //Navigate
    const navigate = useNavigate();

    //HandleSignIn and SignUp
    const handleSignIn = () => {
        navigate('/login')
    }

    const handleRegister = () => {
        navigate('/signup')
    }

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

    //convert to array 
    const groupedCartArray = Object.values(groupedCartItems);
    console.log('groupedCartArray', groupedCartArray)
    console.log('cart', cart)

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

    const handlePayment = async () => {

        // console.log('clicked')
        try {
            await postOrderHistory(groupedCartArray, products)
            await clearCart();

            navigate('/payment');
        } catch (error) {
            console.error('Error clearing cart:', error);

        }
    }

    const handleDecrement = () => {

        if (selectedProduct && (selectedProduct.quantity || selectedProduct.cart_quantity) <= 10) {
            setQuantityOverLimit(false)
        }

        if (selectedProduct && (selectedProduct.quantity || selectedProduct.cart_quantity) > 1) {
            setSelectedProduct(prevState => {
                return {
                    ...prevState,
                    quantity: (prevState.quantity - 1 || prevState.cart_quantity - 1)
                }
            })
        }

    }

    const handleIncrement = () => {

        if (selectedProduct && (selectedProduct.quantity || selectedProduct.cart_quantity) === 10) {
            setQuantityOverLimit(true)
        } else {
            setQuantityOverLimit(false)
        }

        if (selectedProduct && (selectedProduct.quantity || selectedProduct.cart_quantity) < 10) {
            setSelectedProduct(prevState => {
                return {
                    ...prevState,
                    quantity: (prevState.quantity + 1 || prevState.cart_quantity + 1)
                }
            })
        }
    }

    const handleUpdate = () => {

        console.log('update')

        console.log('selectProduct', selectedProduct)

        console.log('Product ID', selectedProduct.product_id)

        console.log('Quantity', selectedProduct.quantity)

        if (selectedProduct) {
            handleUpdateCart(selectedProduct.product_id, selectedProduct.quantity);
            handleClose();
        }
    }

    return (
        <Container>
            <Row className="my-4">
                <Col>
                    <h4>Shopping bag</h4>
                </Col>
            </Row>

            <Row>
                <Col md={8}>
                    <Card className="mb-4">
                        <Card.Body className='bg-light'>
                            <h5 className='font-weight-bold text-secondary'>My Account</h5>
                            <hr />
                            <p>Already have an account with us?</p>
                            <Button variant="danger" className="mb-2" onClick={handleSignIn}>Sign In</Button>
                            <span className='text-secondary mx-3'> or </span>
                            <Button variant="link text-danger" onClick={handleRegister}>Create a new Scuba Commerce account</Button>
                        </Card.Body>
                    </Card>

                    <Card className="mb-4">
                        <Card.Body className='bg-light'>
                            <h5 className='font-weight-bold text-secondary'>Shipping Method</h5>
                            <hr />
                            <p>{`Standard:  $5 (3-10 business days)`}</p>
                            <p>Free shipping on all orders $50+</p>
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Body className='bg-light'>
                            <h5 className='font-weight-bold text-secondary'> Item Summary</h5>
                            <hr />


                            {/* ORDER ITEM */}

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
                                                    <span className='text-muted mx-5' style={{ fontSize: '1.1rem' }}>
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
                                        <Button variant='light' onClick={() => { handleShow(); setSelectedProduct(cartItem); }}> Edit </Button>

                                        {/* Modal */}
                                        <Modal
                                            show={show}
                                            onHide={() => { handleClose(); setSelectedProduct(null); }}
                                            backdrop="static"
                                            keyboard={false}
                                            size="lg"
                                            aria-labelledby="contained-modal-title-vcenter"
                                            centered
                                        >
                                            <Modal.Header closeButton className="bg-light">
                                                {/* <Modal.Title className="font-weight-bold text-secondary text-center">Update Quantity</Modal.Title> */}
                                                <Modal.Title className="font-weight-bold mb-2">
                                                    {selectedProduct ? products.find(p => p.id === selectedProduct.product_id).title : ''}
                                                </Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <Container className='text-center'>
                                                    <Row className="mb-3 justify-content-center">
                                                        <Col md={12}>
                                                            <Image
                                                                src={selectedProduct ? products.find(p => p.id === selectedProduct.product_id).image_url : ''}
                                                                style={{ width: '300px', height: '300px' }}
                                                                fluid
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Container>

                                                <Row className="align-items-center my-5">
                                                    <Col md={5} className="text-center">
                                                        <div> Quantity: </div>
                                                    </Col>
                                                    <Col md={1} className="text-center">
                                                        <Button onClick={() => handleDecrement()}> -</Button>
                                                    </Col>
                                                    <Col md={1}>
                                                        <div className="text-center font-weight-bold">
                                                            {selectedProduct ? (selectedProduct.quantity || selectedProduct.cart_quantity) : ''}
                                                        </div>
                                                    </Col>
                                                    <Col md={1} className="text-center">
                                                        <Button onClick={() => handleIncrement()}> + </Button>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    {quantityOverLimit ? <p className='text-danger text-center'> * Quantity over Limit * </p> : null}
                                                </Row>

                                            </Modal.Body>

                                            <Modal.Footer>
                                                <Button
                                                    variant="danger"
                                                    onClick={handleUpdate}>Update</Button>
                                                <Button variant="primary" onClick={handleClose}>
                                                    Close
                                                </Button>

                                            </Modal.Footer>
                                        </Modal>

                                        <RiDeleteBin6Line
                                            onClick={() => removeItemFromCart(product.id)}
                                            className='deleteIcon'
                                        >
                                            x
                                        </RiDeleteBin6Line>
                                    </Stack>

                                )
                            })}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right Side */}

                <Col md={4}>
                    <Card className="mb-4 bg-light">
                        <Card.Body>
                            <h5 className='font-weight-bold text-secondary'>Order Summary</h5>
                            <hr />
                            <p className="d-flex justify-content-between">Subtotal(Round): <span>${subTotal} </span></p>

                            {cart.length === 0 ? (<p className="d-flex justify-content-between">Shipping: <span> $0 </span></p>)
                                :
                                <p className="d-flex justify-content-between">Shipping: <span>{subTotal > 50 ? 'FREE' : `$${5}`}</span></p>
                            }
                            <p className="d-flex justify-content-between">Estimated Tax: <span>${tax}</span> </p>
                            <hr />

                            {cart.length === 0 ? (<h5 className="d-flex justify-content-between">Total: <span>$0</span></h5>) :

                                <h5 className="d-flex justify-content-between">Total: <span>${total} </span></h5>

                            }
                            <hr />
                            <p className='text-primary text-center'> {subTotal > 50 ? ' * Your order qualifies for free shipping *' : null}</p>

                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Enter promo code</Form.Label>
                                    <Form.Control type="text" placeholder="Promo code" />
                                </Form.Group>

                                <Button onClick={handlePayment} variant="primary" block >Continue to Checkout</Button>

                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>


        </Container>
    )
}

export default CheckOut;
