import React from 'react'
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { registerUser } from '../api/index'
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
    const [message, setMessage] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

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

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const regex = /^(?=.*[A-Z])(?=.*[0-9])\S{6,}$/;

        if (!regex.test(password)) {
            setErrorMsg("Password must be at least 6 characters long, contain at least one capital letter and one number, and have no spaces.");

            setTimeout(() => {
                setErrorMsg("");
            }, 6000);

            return;
        }

        try {
            const result = await registerUser(userData);

            console.log(result);

            if (result && result.token) {
                setMessage("Thank you for signing up! Please log in to enjoy shopping.")

                setTimeout(() => {
                    setMessage("");
                    navigate('/login');
                }, 4000);

            }

        }
        catch (error) {

            // console.log(error)
            console.error('Registration failed.', error.message);

            setErrorMsg(error.message);

            setTimeout(() => {
                setErrorMsg("");  // Clear the message after 6 seconds
            }, 6000);
        }
    }


    return (
        <>
            {message && <Alert className='mx-3 text-center' variant='info'> {`**${message}`} </Alert>}
            {errorMsg && <Alert className='mx-3 text-center' variant='danger'> {`**${errorMsg}`} </Alert>}
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
                                        type="number"
                                        placeholder="Zip code"
                                        value={zipcode}
                                        onChange={(e) => setZipCode(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-4" controlId="phone_nuumber">

                                    <Form.Control
                                        type="number"
                                        placeholder="Phone Number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Button variant="danger" type="submit" className="w-100">
                                    Sign Up
                                </Button>


                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Register