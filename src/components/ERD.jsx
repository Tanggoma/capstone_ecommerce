import React from 'react'
import image from '/Capstone_ERD.png'
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import { Image } from 'react-bootstrap';

const ERD = () => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleZoom = () => setShow(true);

    return (
        <div className='bg-light p-3'>
            <h4 className='text-center my-5 text-primary'>Entity-Relationship Diagram (ERD) </h4>
            <div className='d-flex align-item-center justify-content-center'>
                <img className='erd' src={image} style={{ width: '50%' }} alt="Entity Relationship Diagram" onClick={handleZoom} />
            </div>
            <p className='mx-5  mt-5'>
                1. <span className='text-danger fw-bold'> Categories: </span> Contains product types. Each item has a unique identifier (id) and a name, such as 'Regulator' or 'Mask'.
            </p>
            <p className='mx-5'>
                2.<span className='text-danger fw-bold'> Users:</span>  Contains user details, including credentials (username, email, password) and personal details (names, address, phone number). The 'id' field, acting as a primary key, facilitates links to other tables.
            </p>
            <p className='mx-5'>
                3. <span className='text-danger fw-bold'>  Products: </span> Stores diving equipment details. Each product has attributes like title, brand, price, and availability. Each product is linked to a category through 'category_id'. The 'id' field in this table is a key link for other tables like carts and reviews.
            </p>
            <p className='mx-5'>
                4.<span className='text-danger fw-bold'>  Carts: </span>Represents the shopping cart for users. It connects products through 'product_id' and users through 'user_id', capturing the desired quantity.
            </p>
            <p className='mx-5'>
                5. <span className='text-danger fw-bold'> Wishlist: </span> Maintains links to users and products through 'user_id' and 'product_id', respectively.
            </p>
            <p className='mx-5'>
                6. <span className='text-danger fw-bold'>  Reviews: </span> Each review is tied to a product via 'product_id' and a user through 'user_id'.
            </p>
            <p className='mx-5'>
                7. <span className='text-danger fw-bold'> Orders: </span>  Logs completed transactions, each associated with a user through 'user_id'. The total amount of the order is also stored.
            </p>
            <p className='mx-5'>
                8. <span className='text-danger fw-bold'> Order_items:</span> Breaks down the items within an order. It establishes connections to products via 'product_id' and to orders through 'order_id', detailing quantity and price for each item.

            </p>


            <Modal centered show={show} onHide={handleClose} animation={false} size='xl' >
                <Modal.Body className="d-flex justify-content-center align-items-center">

                    <Image fluid src={image} style={{ maxWidth: '100%' }} alt="Entity Relationship Diagram" />
                </Modal.Body>
            </Modal>

        </div>
    )
}

export default ERD