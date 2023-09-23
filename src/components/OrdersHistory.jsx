import React, { useEffect, useState, useContext } from 'react'
import { getOrderHistory, getAllProducts } from '../api'
import AuthContext from '../context/AuthContext';
import { Card } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

const OrdersHistory = () => {

    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { state } = useContext(AuthContext);
    // const token = state.token;

    useEffect(() => {
        async function getOrderHistoryForUser() {

            try {
                const orderData = await getOrderHistory()

                const orderItems = orderData[0].items


                setTimeout(() => {
                    setIsLoading(false)
                    setOrders(orderItems)
                }, 1000);

                const fetchedProducts = await getAllProducts()
                setProducts(fetchedProducts);


            } catch (error) {

                setError(error)
            }
        }

        getOrderHistoryForUser();

    }, [])

    const groupByOrderDate = (orderItems) => {
        return orderItems.reduce((acc, item) => {

            if (!acc[item.order_date]) {
                acc[item.order_date] = [];
            }
            acc[item.order_date].push(item);
            return acc;
        }, {});
    };

    const groupedOrders = groupByOrderDate(orders);

    return (

        <>
            <h4 className='text-center text-secondary my-5 bg-light p-3'>Orders History</h4>

            {isLoading ? (

                <div className="d-flex justify-content-center my-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : error ?
                (<p className='text-center'> No order history for this user</p>)
                : (

                    Object.entries(groupedOrders).map(([date, items]) => (
                        <Card key={date} className="mt-3">
                            <h4 className='mx-4 my-4 text-primary'>Purchase Date: {new Date(date).toISOString().split('T')[0]}</h4>
                            <Card.Body>
                                {items.map((item, idx) => {
                                    const product = products.find(prod => prod.id === item.product_id);
                                    if (product) {
                                        return (
                                            <Container key={idx}>
                                                <Card className='my-2'>
                                                    <Card.Body>
                                                        <Row className='d-flex justify-content-between'>
                                                            <Col xs={6} md={4}>
                                                                <Image src={product.image_url} thumbnail style={{ width: '150px', height: 'auto' }} />
                                                            </Col>
                                                            <Col xs={6} md={4}>
                                                                <h5>{product.title}</h5>
                                                                <p>Qty: {item.quantity}</p>
                                                            </Col>
                                                            <Col xs={6} md={4}>
                                                                <p className='mx-5'>${parseFloat(item.price * item.quantity).toFixed(2)}</p>
                                                            </Col>
                                                        </Row>
                                                    </Card.Body>
                                                </Card>
                                            </Container>
                                        );
                                    }
                                    return null;
                                })}
                            </Card.Body>
                        </Card>
                    )))}

        </>
    )
}

export default OrdersHistory