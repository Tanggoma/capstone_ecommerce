import React, { useRef } from 'react';
import { Carousel, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function BrandCarousel() {

    const carouselRef = useRef(null);

    const imagesPerSlide = 5;

    const images = [
        "https://www.diversdirect.com/_next/image?url=https%3A%2F%2Fcdn11.bigcommerce.com%2Fs-hwgrldcncv%2Fimages%2Fstencil%2F200w%2Fk%2Faqualung_lores_1669669722__60164.original.jpg&w=96&q=75",
        "https://www.diversdirect.com/_next/image?url=https%3A%2F%2Fcdn11.bigcommerce.com%2Fs-hwgrldcncv%2Fimages%2Fstencil%2F200w%2Fs%2Fbare-300c_1631038741__59778.original.png&w=96&q=75",
        "https://www.diversdirect.com/_next/image?url=https%3A%2F%2Fcdn11.bigcommerce.com%2Fs-hwgrldcncv%2Fimages%2Fstencil%2F200w%2Fr%2Fcressi_1631039855__76626.original.png&w=96&q=75",
        "https://www.diversdirect.com/_next/image?url=https%3A%2F%2Fcdn11.bigcommerce.com%2Fs-hwgrldcncv%2Fimages%2Fstencil%2F200w%2Fx%2Fmares_1631041908__82537.original.png&w=96&q=75",
        "https://www.diversdirect.com/_next/image?url=https%3A%2F%2Fcdn11.bigcommerce.com%2Fs-hwgrldcncv%2Fimages%2Fstencil%2F200w%2Fz%2Flogo_suunto_1631041826__16973.original.png&w=96&q=75",
        "https://www.diversdirect.com/_next/image?url=https%3A%2F%2Fcdn11.bigcommerce.com%2Fs-hwgrldcncv%2Fimages%2Fstencil%2F200w%2Fb%2Ftusa_logo_czarne_1631046045__10448.original.png&w=96&q=75",
        "https://www.diversdirect.com/_next/image?url=https%3A%2F%2Fcdn11.bigcommerce.com%2Fs-hwgrldcncv%2Fimages%2Fstencil%2F200w%2Fa%2Fevo_1631040345__70132.original.png&w=96&q=75",
        "https://www.diversdirect.com/_next/image?url=https%3A%2F%2Fcdn11.bigcommerce.com%2Fs-hwgrldcncv%2Fimages%2Fstencil%2F200w%2Fu%2Fgarmin_1631040888__02563.original.jpg&w=96&q=75",
        "https://www.diversdirect.com/_next/image?url=https%3A%2F%2Fcdn11.bigcommerce.com%2Fs-hwgrldcncv%2Fimages%2Fstencil%2F200w%2Fw%2Ffourthelement_1631040766__10827.original.png&w=96&q=75",
        // "https://www.diversdirect.com/_next/image?url=https%3A%2F%2Fcdn11.bigcommerce.com%2Fs-hwgrldcncv%2Fimages%2Fstencil%2F200w%2Fv%2Fatomic_logo_blk_1631038436__12371.original.png&w=96&q=75",
        "https://www.diversdirect.com/_next/image?url=https%3A%2F%2Fcdn11.bigcommerce.com%2Fs-hwgrldcncv%2Fimages%2Fstencil%2F200w%2Fh%2Fzeagle_logo_1631046780__78886.original.png&w=96&q=75"
    ];

    const brandNames = [
        "Aqua Lung", "Bare", "Cressi", "Mares", "Suunto",
        "Tusa", "Evo", "Garmin", "Fourth Element", "Zeagle"
    ]

    const groupedImages = [];
    for (let i = 0; i < images.length; i += imagesPerSlide) {
        groupedImages.push(images.slice(i, i + imagesPerSlide));
    }

    return (
        <div>
            <div className="carousel-container">
                <div
                    className="carousel-arrow carousel-arrow-left"
                    onClick={() => carouselRef.current.prev()}
                >←</div>

                <Carousel className='non-animate' controls={false} interval={null} indicators={false} ref={carouselRef}  >

                    {groupedImages.map((group, groupIdx) => (
                        <Carousel.Item key={groupIdx}>
                            <Row>
                                {group.map((image, imgIdx) => (
                                    <Col key={imgIdx}>
                                        <Link to={`/brands/${brandNames[imgIdx + (groupIdx * imagesPerSlide)]}`}>
                                            {/* <Link to={`/brands/${brandNames}`}> */}
                                            <img
                                                className="brand-carousel d-block mx-5"
                                                src={image}
                                                alt={`Slide ${groupIdx} Image ${imgIdx}`}
                                            />
                                        </Link>
                                    </Col>
                                ))}
                            </Row>
                        </Carousel.Item>
                    ))}
                </Carousel>
                <div
                    className="carousel-arrow carousel-arrow-right"
                    onClick={() => carouselRef.current.next()}
                >→</div>
            </div>
        </div>
    );
}

export default BrandCarousel;
