import React from 'react'
import { Col, Container, Image, ProgressBar, Row } from 'react-bootstrap'
import screenshot from '/Scuba-commerce.png'

const Readme = () => {
    return (
        <div className='bg-light p-1'>
            <Container>
                <h2 className='text-center my-5 fw-bold'> </h2>
                <h5> <span className='text-danger fst-italic fs-4'> Scuba Commerce </span> is a fullstack dive shop e-commerce platform designed specifically for scuba diving enthusiasts. Dive in and discover a wide range of scuba diving equipment, read reviews, save product to wishlists and make informed decisions on your next underwater adventure!  </h5>
                <div className='d-flex justify-content-center my-5'>
                    <Image src={screenshot} style={{ width: '80%' }}></Image>
                </div>
                <Row>
                    <Col md={12} className='mb-5'>
                        <h5> Planning timeline: </h5>
                        <p className='text-secondary'> Aug21- Sep28 (38 days)</p>
                        <ProgressBar>
                            <ProgressBar variant="success" now={15} key={1} label={'Backend API ~ 4 days'} />
                            <ProgressBar variant="warning" now={50} key={2} label={'Frontend & components ~ 26 days'} />
                            <ProgressBar variant="danger" now={25} key={3} label={'Debuging~ 5 days'} />
                            <ProgressBar variant="primary" now={10} key={4} label={'Deployment~ 2 days'} />
                        </ProgressBar>
                    </Col>
                </Row>


                <Row>
                    <Col md={12} className='mb-5'>
                        <h5> Contributor (1): Tan </h5>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <h5 className='text-center'> Features:</h5>
                        <Col md={12} className='border p-2'>
                            <ul>
                                <li><span className='text-primary'>User Authentication </span> :
                                    <div> - Secure registration with condition on password. </div>
                                    <div> - Control username and email duplication using user database and login functionalities</div>
                                </li>
                                <li><span className='text-primary'>Product Display </span> : A wide range of diving equipment, divided into 7 product category or brand of the product with product detail information on single detail page. You can also sort by price, browse products by title, and filter products by brand and category. </li>
                                <li><span className='text-primary'>Cart System </span> :
                                    <div> - Add, edit cart ,remove items in cart. </div>
                                    <div> - Cart will be seperated to guest cart and user cart or logged-in user controlling by cart database.</div>
                                    <div> - Cart for each users will be persistent even when close the browser/ refresh page or log out and log back in.</div></li>
                                <li><span className='text-primary'>Wishlist </span> : Save products to view and purchase later for both guest and logged-in user</li>
                                <li><span className='text-primary'>Product Reviews </span> : Read product reviews from other divers or write your own but each product only allow 1 review from user or guest.</li>
                                <li><span className='text-primary'>Order History </span> : Logged-in users will be able to see their order history after purchase.</li>
                                <li><span className='text-primary'> Profile Update </span> : Logged-in users will be able to update their personal information, password and shipping address. </li>
                            </ul>
                        </Col>

                    </Col>
                    <Col md={6}>
                        <h5 className='text-center mb-5'> Tech Stack: </h5>

                        <Row>
                            <Col md={6} className='bg-light p-3 border'>
                                <h6> Backend: </h6>
                                <ul>
                                    <li><span className='text-primary'> Node.js</span> </li>
                                    <li><span className='text-primary'> Express.js </span> </li>
                                    <li><span className='text-primary'> PostgreSQL </span> </li>
                                    <li><span className='text-primary'> Express session </span> </li>
                                    <li><span className='text-primary'> Cookie parser and signature </span> </li>
                                    <li><span className='text-primary'> Bcrypt </span> </li>
                                    <li><span className='text-primary'> JWT decode and JSON web token </span> </li>
                                </ul>
                            </Col>
                            <Col md={6} className='bg-light p-3 border'>
                                <h6> Frontend: </h6>
                                <ul>
                                    <li><span className='text-primary'> Vite and React.js </span> : For building UI components. </li>
                                    <li><span className='text-primary'> React Router </span> : For handling route and navigation. </li>
                                    <li><span className='text-primary'> Bootstrap and React Bootstrap </span> : For responsive styling and layout.</li>
                                    <li><span className='text-primary'> Regex </span> : To control password condition</li>

                                </ul>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className='mb-5'>
                        <h5 className='text-center mt-5' > Future Improvement: </h5>
                        <Col className='bg-light p-2 border'>
                            <ul>
                                <li><span className='text-primary'> Payment integration with stripe API </span> </li>
                                <li><span className='text-primary'> Inventory control </span> controlling inventory after purchasing through database</li>
                                <li><span className='text-primary'> Guest to logged in user cart remains the same </span></li>
                                <li><span className='text-primary'> Create admin role for specific permission </span></li>

                            </ul>
                        </Col>
                    </Col>
                </Row>

            </Container>
        </div >
    )
}

export default Readme