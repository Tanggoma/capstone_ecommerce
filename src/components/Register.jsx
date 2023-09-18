import React from 'react'
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { registerUser } from '../api/index'
import AuthContext from '../context/AuthContext';

const Register = () => {


    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [zipcode, setZipCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const userData = {
        username: username,
        email: email,
        password: password,
        first_name: firstName,
        last_name: lastName,
        address_city: city,
        address_street: street,
        address_zipcode: zipcode,
        phone_number: phoneNumber
    };

    const { dispatch } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await registerUser(userData);

            if (result) {
                dispatch({
                    type: 'LOGIN',
                    token: result.token,
                    user: result.user
                })
            }
        }
        catch (error) {

            console.error('Registration failed.');
            // Handle failure, like showing an error message to the user
        }
    }


    return (
        <>
            <Container className="vh-100 mt-5" >
                <Row className="justify-content-md-center h-100">
                    <Col xs={12} md={6}>
                        <div className="p-4 border rounded">
                            <Form onSubmit={handleSubmit}>
                                <h1 className="text-center mb-4">Sign Up</h1>
                                <p className='text-center text-danger'> Create a new Scuba Commerce account </p>
                                <Form.Group className="mb-4" controlId="username">

                                    <Form.Control
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-4" controlId="email">

                                    <Form.Control
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="password">

                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="first_name">

                                    <Form.Control
                                        type="text"
                                        placeholder="First Name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-4" controlId="last_name">

                                    <Form.Control
                                        type="text"
                                        placeholder="Last Name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-4" controlId="street">

                                    <Form.Control
                                        type="text"
                                        placeholder="Address Street"
                                        value={street}
                                        onChange={(e) => setStreet(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-4" controlId="city">

                                    <Form.Control
                                        type="text"
                                        placeholder="Address City"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-4" controlId="zipcode">

                                    <Form.Control
                                        type="text"
                                        placeholder="Zip code"
                                        value={zipcode}
                                        onChange={(e) => setZipCode(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-4" controlId="phone_nuumber">

                                    <Form.Control
                                        type="text"
                                        placeholder="Phone Number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Button variant="danger" type="submit" className="w-100">
                                    Sign Up
                                </Button>
                                {/* <h4>Do not have an account? Click here to <Link to="/signup">Sign up</Link></h4> */}

                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Register