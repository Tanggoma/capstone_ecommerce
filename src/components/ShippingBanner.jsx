import React from 'react'
import { Container } from 'react-bootstrap';
import '../style/app.css'

const ShippingBanner = () => {
    return (
        <Container fluid className='bg-danger bg-gradient shadow-lg mb-3 p-2'>
            <h6 className='text-white text-center my-2 mx-5 fst-italic moving-banner'>  * Free Shipping on all orders $50+ * </h6>
        </Container>
    )
}

export default ShippingBanner


