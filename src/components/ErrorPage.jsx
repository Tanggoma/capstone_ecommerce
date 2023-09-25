import React from 'react'
import { Button, Col, Container, Image, Row } from 'react-bootstrap'
import image from '/problemdiver.jpeg'
import { useNavigate } from 'react-router-dom'

const ErrorPage = () => {

    const navigate = useNavigate();

    return (
        <div className='bg-light p-5'>
            <Container>
                <Row className='d-flex align-items-center'>
                    <Col md={6}>
                        <h1 className='text-danger text-center' style={{ fontSize: '6rem' }}> OOPS! </h1>
                        <p className='text-center'> We can't seem to find the page you're looking for.</p>
                        <p className='fw-bold text-center'> Error Code: <span className='text-danger'>404</span></p>
                        <div className='d-flex justify-content-center'>
                            <Button variant='danger' onClick={() => navigate('/')}> Back to Home Page </Button>
                        </div>
                    </Col>

                    <Col md={6} className='d-flex align-items-center'>
                        <Image src={image}></Image>
                    </Col>

                </Row>
            </Container>
        </div>
    )
}

export default ErrorPage