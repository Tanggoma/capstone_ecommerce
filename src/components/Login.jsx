import React, { useState, useContext } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/index';
import AuthContext from '../context/AuthContext';


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { token, user } = await loginUser({ username, password });
            localStorage.setItem('authToken', token);
            console.log('token', token)

            dispatch({
                type: 'LOGIN',
                token: token,
                user: user
            });

            // Redirect the user to the dashboard or any protected route
            navigate('/')
        } catch (error) {
            console.error("Error during login:", error.message);
            setError(error.message)
        }
    };


    return (
        <>
            <Container className="vh-100 mt-5" >
                <Row className="justify-content-md-center h-100">
                    <Col xs={12} md={6}>
                        <div className="p-4 border rounded">
                            <Form onSubmit={handleSubmit}>
                                <h1 className="text-center mb-4">Sign In</h1>

                                {error && <p className="text-danger text-md-center"> {error} </p>}

                                <Form.Group className="mb-3 mt-5" controlId="formBasicEmail">
                                    {/* <Form.Label>Email address</Form.Label> */}
                                    <Form.Control
                                        type="username"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    {/* <Form.Label>Password</Form.Label> */}
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Button id='signin-button' type="submit" className="w-100">
                                    Sign in
                                </Button>
                                <h5 className='text-md-center mt-4'>Do not have an account? Click here to <Link to="/signup" style={{ textDecoration: 'none', color: 'red' }}>Sign up</Link></h5>

                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Login;
