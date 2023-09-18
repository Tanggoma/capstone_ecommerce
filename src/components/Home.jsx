import React from 'react'
import CarouselContainer from './CarouselContainer'
import AllProducts from './AllProducts'
import BrandCarousel from './BrandCorousel'
import Footer from './Footer'


const Home = () => {
    return (
        <>
            <CarouselContainer />
            <h2 className='text-center mt-5 mb-5 bg-dark bg-gradient bg-opacity-10 p-3'> All products</h2>
            <AllProducts />
            <h2 className='text-center mt-5 mb-5 bg-dark bg-gradient bg-opacity-10 p-3'> Our Featured Brands</h2>
            <BrandCarousel />
            <Footer />
        </>
    )
}

export default Home