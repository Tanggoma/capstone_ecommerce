import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Footer = () => {

    const navigate = useNavigate();

    const handleClickERD = () => {
        navigate('/ERD')
    }
    return (
        <footer className="bg-dark text-white mt-5">
            <Container fluid>
                <Row>
                    <Col md={4}>
                        <h5 className='mt-4 text-danger'>About Us</h5>
                        <ul className="list-unstyled">
                            <li >Company Information</li>
                            <li >Privacy Policy</li>
                            <li >Terms & Conditions</li>
                        </ul>
                    </Col>

                    <Col md={4} className='mx-auto'>
                        <h5 className='mt-4 text-danger'>Customer Service</h5>
                        <ul className="list-unstyled">

                            <li>Shipping</li>
                            <li>Returns</li>
                            <li>Current Promotions</li>
                            <li>Contact Us</li>
                            <li>Store Locator</li>
                        </ul>
                    </Col>
                    <Col md={4} className='mx-auto'>
                        <h5 className='mt-4 text-danger'>About project</h5>
                        <ul className="list-unstyled">
                            <li className='text-warning footer-hover'>Read Me</li>
                            <li className='text-warning footer-hover' onClick={handleClickERD}>Database ERD</li>
                            <li className='text-warning footer-hover' onClick={() => window.open("https://github.com/Tanggoma/capstone_ecommerce", "_blank")}>
                                Github
                            </li>
                        </ul>
                    </Col>
                    {/* <Col md={3}>
                        <h5 className='mt-3 text-danger'>About me</h5>
                        <ul className="list-unstyled">
                            <li className='text-warning'>Other Projects</li>
                            <li className='text-warning'>LinkedIn</li>
                        </ul>
                    </Col> */}
                </Row>
                <Row>
                    <Col className="text-center py-3">
                        &copy; {new Date().getFullYear()} tanggoma
                        <br />All Rights Reserved.
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer