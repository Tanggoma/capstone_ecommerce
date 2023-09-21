import React, { useEffect, useState, useContext } from 'react'
import { getOrderHistory, getAllProducts } from '../api'
import AuthContext from '../context/AuthContext';
import { Card } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

const OrdersHistory = () => {

    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);

    const { state } = useContext(AuthContext);
    const token = state.token;

    useEffect(() => {
        async function getOrderHistoryForUser() {

            try {
                const orderData = await getOrderHistory()
                console.log(orderData);
                setOrders(orderData)

                const fetchedProducts = await getAllProducts(token)
                setProducts(fetchedProducts);
                console.log(products)


            } catch (error) {
                console.log(error)
            }
        }

        getOrderHistoryForUser();

    }, [])

    const getProductDetails = (productId) => {

        return products.find(product => product.id === productId)

    }

    return (
        <>
            <h4 className='text-center text-secondary my-5 bg-light p-3'>Orders History</h4>
            {orders && orders.map((order, idx) => (
                <Card key={idx} className="mt-3">
                    <h4 className='mx-4 my-4 text-primary'>Purchase Date: {new Date(order.order_date).toISOString().split('T')[0]}</h4>

                    <Card.Body>
                        {order.items.map((item, itemIdx) => (
                            <React.Fragment key={itemIdx}>
                                {products.filter(product => product.id === item.product_id)
                                    .map((product, prodIdx) => (
                                        <Container key={prodIdx}>
                                            <Card className='my-2'>
                                                <Card.Body>
                                                    <Row className='d-flex justify-content-md-betweens'>
                                                        <Col xs={6} md={4} className='d-flex justify-content-center flex-column'>
                                                            <Image src={product.image_url} thumbnail style={{ width: '150px', height: 'auto' }}></Image>
                                                        </Col>
                                                        <Col xs={6} md={4} className='d-flex justify-content-center flex-column'>
                                                            <h5>{product.title || item.product_id}</h5>
                                                            <p>Qty: {item.quantity}</p>
                                                        </Col>
                                                        <Col xs={6} md={4} className='d-flex justify-content-center flex-column'>
                                                            <p className='mx-5'>${item.price}</p>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>

                                        </Container>
                                    ))}
                            </React.Fragment>
                        ))}
                        <hr />
                        <h5 className='text-end font-weight-bold text-danger'>Total Amount: ${order.total_amount}</h5>

                    </Card.Body>
                </Card>
            ))}
        </>
    )
}

export default OrdersHistory