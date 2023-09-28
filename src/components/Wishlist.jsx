import React, { useState, useEffect } from 'react'
import { getWishListByUser, deleteWishlist } from '../api'
import { Card } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { GiHeartMinus } from 'react-icons/gi';
import { Container, Row } from 'react-bootstrap';

const Wishlist = () => {

    const [wishlistItems, setWishListItems] = useState([]);

    function isLoggedIn() {
        return !!localStorage.getItem('authToken');
    }

    useEffect(() => {
        const fetchWishList = async () => {

            try {
                if (isLoggedIn()) {
                    const data = await getWishListByUser();

                    setWishListItems(data);

                } else {
                    let wishlist = JSON.parse(localStorage.getItem('guestWishlist')) || [];

                    setWishListItems(wishlist);

                }

            } catch (error) {
                console.error(error);
            }
        }

        fetchWishList();

    }, [])

    function isLoggedIn() {
        return !!localStorage.getItem('authToken');
    }

    const handleDeleteWishlistGuest = (productId) => {

        const wishlist = JSON.parse(localStorage.getItem('guestWishlist')) || [];

        const updatedWishlist = wishlist.filter(item => item.id !== productId);

        localStorage.setItem('guestWishlist', JSON.stringify(updatedWishlist));
        setWishListItems(updatedWishlist);
    }

    const handleDeleteWishlistByUser = async (productId) => {


        if (isLoggedIn()) {


            try {

                const response = await deleteWishlist(productId);

                const updatedWishlist = wishlistItems.filter(item => item.product_id !== productId)


                setWishListItems(updatedWishlist)

            } catch (error) {
                console.log('error', error)
            }
        } else {
            console.log('user is not logged in')
        }
    }

    return (
        <div>

            <h2 className='mx-2 my-5 text-danger text-center' > Your Wishlist ({wishlistItems.length} {wishlistItems.length > 1 ? 'items' : 'item'})</h2>
            {!wishlistItems.length ? (<p className='text-center'>This wishlist is currently empty. </p>)
                :
                (
                    <Container fluid>
                        <Row>
                            {wishlistItems.map((item, index) => (

                                <Card key={item.id || item.wishlist?.id} style={{ margin: '10px 0', width: '30rem', boxShadow: '0 10px 20px rgba(0, 0, 0, .12), 0 4px 8px rgba(0, 0, 0, .06)' }}>
                                    <Card.Body >
                                        {item.product_id ?
                                            // logged wishlist
                                            <div className='position-relative'>
                                                <GiHeartMinus
                                                    onClick={() => item.product_id ? handleDeleteWishlistByUser(item.product_id) : handleDeleteWishlistGuest(item.id)}
                                                    className='position-absolute top-0 end-0'
                                                    style={{ fontSize: '30px', color: 'red' }}
                                                />
                                                <Link to={`/products/${item.product_id}`} style={{ textDecoration: 'none' }}>

                                                    <Card.Title>{item.product_title}</Card.Title>
                                                    <ListGroup variant="flush">
                                                        <ListGroup.Item>Brand : {item.product_brand}</ListGroup.Item>
                                                        <ListGroup.Item>Price: ${item.product_price}</ListGroup.Item>
                                                    </ListGroup>

                                                </Link>
                                            </div>

                                            :

                                            // guestwishlist

                                            <div className='position-relative'>
                                                <GiHeartMinus
                                                    onClick={() => handleDeleteWishlistGuest(item.id)}
                                                    className='heart-minus position-absolute top-0 end-0'
                                                />
                                                <Link to={`/products/${item.id}`} style={{ textDecoration: 'none' }}>
                                                    <Card.Title>{item.title}</Card.Title>
                                                    <ListGroup variant="flush">
                                                        <Card.Img src={item.image_url} alt={item.title} style={{ maxWidth: '100%', height: 'auto' }}></Card.Img>
                                                        <ListGroup.Item>Brand : {item.brand}</ListGroup.Item>
                                                        <ListGroup.Item>Price: ${item.price}</ListGroup.Item>
                                                    </ListGroup>

                                                </Link>
                                            </div>
                                        }
                                    </Card.Body>
                                </Card>


                            ))
                            }
                        </Row>
                    </Container>
                )
            }
        </div >
    )
}

export default Wishlist