import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="bg-dark text-white mt-5">
            <Container fluid>
                <Row>
                    <Col md={3}>
                        <h5 className='mt-3 text-danger'>About Us</h5>
                        <ul className="list-unstyled">
                            <li>Company Information</li>
                            <li>Privacy Policy</li>
                            <li>Terms & Conditions</li>
                        </ul>
                    </Col>

                    <Col md={3}>
                        <h5 className='mt-3 text-danger'>Customer Service</h5>
                        <ul className="list-unstyled">

                            <li>Shipping</li>
                            <li>Returns</li>
                            <li>Current Promotions</li>
                            <li>Contact Us</li>
                            <li>Store Locator</li>
                        </ul>
                    </Col>
                    <Col md={3}>
                        <h5 className='mt-3 text-danger'>About project</h5>
                        <ul className="list-unstyled">
                            <li>Read Me</li>
                            <li>Database ERD</li>
                            <li>Github</li>
                        </ul>
                    </Col>
                    <Col md={3}>
                        <h5 className='mt-3 text-danger'>About me</h5>
                        <ul className="list-unstyled">
                            {/* <li>My Resume</li> */}
                            <li>Other Projects</li>
                            <li>LinkedIn</li>
                        </ul>
                    </Col>
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