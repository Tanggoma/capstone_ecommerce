import Carousel from 'react-bootstrap/Carousel';
import CarouselImage from './CarouselImage';

function CarouselContainer() {
    return (
        <Carousel>
            <Carousel.Item interval={1000}>
                <CarouselImage text="First slide" />
                <Carousel.Caption>
                    <h1>Scuba Commerce</h1>
                    <p className='text-uppercase fs-6'>For divers, by divers</p>
                </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item interval={1000}>
                <CarouselImage text="Second slide" />
                <Carousel.Caption >
                    {/* <h4 className='text-danger'>Trending Gear</h4> */}
                </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item interval={1000}>
                <CarouselImage text="Third slide" />
                <Carousel.Caption>
                    <h3>Find new gear to dive with stingray</h3>

                </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item interval={1000}>
                <CarouselImage text="Forth slide" />
                <Carousel.Caption>
                    <h3>Get a new gear for cave dive</h3>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item >
                <CarouselImage text="Fifth slide" />
                {/* <Carousel.Caption>
                    <h3>Fifth slide label</h3>
                    <p>
                        Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                    </p>
                </Carousel.Caption> */}
            </Carousel.Item>
        </Carousel>
    );
}

export default CarouselContainer;