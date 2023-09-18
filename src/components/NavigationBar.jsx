import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { VscAccount } from 'react-icons/vsc'
import { FiHeart } from 'react-icons/Fi'
import { useState } from 'react';
import { BiSearch } from 'react-icons/Bi'
import { BsCart } from 'react-icons/Bs'
import { useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { SearchContext } from '../context/searchContext';
import { useNavigate } from 'react-router-dom';

//import cart context
import { useCart } from '../context/CartContext';

import CartOffCanvas from './CartOffCanvas';

function NavigationBar() {

    const [showSearchBox, setShowSearchBox] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isAccountCanvasVisible, setIsAccountCanvasVisible] = useState(false);
    const [isCartVisible, setIsCartVisible] = useState(false);
    // const [searchTerm, setSearchTerm] = useState([])

    //cart context
    const { cart } = useCart();
    // console.log('cart', cart)
    const totalQuantity = cart.reduce((acc, item) => acc + (item.cart_quantity || item.quantity), 0);
    // console.log(totalQuantity)

    //auth context
    const { state } = useContext(AuthContext);

    //search context
    const { setSearchTerm } = useContext(SearchContext);

    const handleShowCart = () => {
        setIsCartVisible(true);
    };

    const handleHideCart = () => {
        setIsCartVisible(false);
    };

    useEffect(() => {
        const getAllcategories = async () => {

            try {
                const response = await fetch('http://localhost:3000/api/categories')

                const categories = await response.json();

                setCategories(categories);

                // console.log(categories);
                // /api/category
            } catch (error) {
                console.log(error)
            }
        }

        getAllcategories();
    }, []);

    const handleShowAccountCanvas = () => {
        setIsAccountCanvasVisible(true);
    };

    const handleHideAccountCanvas = () => {
        setIsAccountCanvasVisible(false);
    };

    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        dispatch({
            type: 'LOGOUT'
        });

        console.log('logout')
        navigate('/');
    }

    const handleMyprofile = () => {
        navigate('/profile');
    }

    return (
        <div className='text-white'>

            <Navbar sticky="top" className="bg-dark shadow-sm mb-3" expand="lg" >

                <Container fluid style={{ display: 'flex', justifyContent: 'space-between' }}>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {/* <Nav.Link id='nav-item' href="/login"><VscAccount style={{ width: "2rem", height: "2rem" }} /> My Account  </Nav.Link> */}

                        {
                            state.user ? (
                                <>
                                    <Nav.Link id='nav-item' onClick={handleShowAccountCanvas}>
                                        <VscAccount style={{ width: "2rem", height: "2rem" }} /> My Account
                                    </Nav.Link>
                                    <span style={{ marginLeft: "1rem" }}>Hello, {state.user.username}!</span>
                                </>
                            ) : (
                                <Link id='nav-item' style={{ color: "white", textDecoration: "none" }} to="/login">
                                    <VscAccount id='nav-item' style={{ width: "2rem", height: "2rem", color: 'white' }} /> My Account
                                </Link>
                            )
                        }

                    </div>

                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                        <Navbar.Brand as={Link} to="/">

                            <img src="/logo1.jpg" alt="Logo" style={{ width: "120px" }} />

                        </Navbar.Brand>
                    </div>


                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {
                            showSearchBox && (
                                <Form className="d-flex">
                                    <Form.Control
                                        type="search"
                                        placeholder="Search"
                                        className="me-2"
                                        aria-label="Search"
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />

                                </Form>
                            )
                        }
                        <Button variant="outline" onClick={() => setShowSearchBox(!showSearchBox)}>
                            <BiSearch id='nav-item' style={{ width: "2rem", height: "2rem", color: 'white' }} />
                        </Button>

                        <Nav.Link id='nav-item'>
                            <Link id='nav-item' to="/wishlist">
                                <FiHeart id='nav-item' style={{ width: "2rem", height: "2rem", color: 'white' }} />
                            </Link>

                        </Nav.Link>

                        <Button
                            onClick={handleShowCart}
                            style={{ position: "relative" }}
                            variant="outline"
                            className="rounded-circle"

                        >
                            <BsCart id='nav-item' style={{ width: "2rem", height: "2rem", color: 'white' }} />

                            <div
                                className="rounded-circle bg-light d-flex justify-content-center align-items-center"
                                style={{
                                    color: "black",
                                    width: "1.4rem",
                                    height: "1.4rem",
                                    position: "absolute",
                                    bottom: 0,
                                    right: 0,
                                    transform: "translate(25%, 25%)",
                                }}
                            >
                                {totalQuantity}
                            </div>


                        </Button>
                        <CartOffCanvas show={isCartVisible} onHide={handleHideCart} />
                    </div>

                </Container>
            </Navbar >

            <Container fluid className="bg-light shadow-sm mb-3">

                <Nav style={{ display: 'flex', justifyContent: 'center' }}
                    activeKey="/home"
                // onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
                >
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {categories.map(category => (
                            <Nav.Item className='container-cat' key={category.id}>
                                <Link to={`/categories/${category.id}`} className='container-cat-link nav-link'>
                                    {category.name}
                                </Link>
                            </Nav.Item>
                        ))}
                    </div>
                </Nav>


            </Container>
            <Offcanvas show={isAccountCanvasVisible} onHide={handleHideAccountCanvas}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className='text-danger font-weight-bold'> My account</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column align-items-start">
                        {/* <Link to="/account">My account</Link> */}
                        <Button
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                marginBottom: 20,
                                fontSize: 'inherit',
                                color: 'inherit',
                                cursor: 'pointer',
                                outline: 'none'
                            }}
                            onClick={handleMyprofile}>

                            My Profile </Button>
                        <Button
                            onClick={handleLogout}
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                marginBottom: 20,
                                fontSize: 'inherit',
                                color: 'inherit',
                                cursor: 'pointer',
                                outline: 'none'
                            }}
                        > Logout</Button>
                        {/* <Link to="/profile">Log out</Link> */}
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>


        </div>
    );
}

export default NavigationBar;

