function CarouselImage({ text }) {

    let imagePath;

    switch (text) {
        case "First slide":
            imagePath = "/cartoon1.jpg";
            break;
        case "Second slide":
            imagePath = "/cartoon2.jpg";
            break;
        case "Third slide":
            imagePath = "/cartoon3.jpg";
            break;
        case "Forth slide":
            imagePath = "/cartoon4.jpg";
            break;
        case "Fifth slide":
            imagePath = "/Sale.jpg";
            break;
        default:
            imagePath = "/cartoon4.jpg"
            break;
    }

    return (
        <div className="carousel-image-container">

            <img
                id='carousel-image'
                className="d-block w-100"
                src={imagePath}
                alt={text}

            />
        </div>

    );
}

export default CarouselImage;
