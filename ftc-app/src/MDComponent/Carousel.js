import React, { useState } from "react";
import Carousel from 'react-bootstrap/Carousel'

const ControlledCarousel = ({ fastfood }) => {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    return (
        <Carousel activeIndex={index} onSelect={handleSelect} >
            {fastfood.map((item, idx) => (
                <Carousel.Item>
                    <img
                        width="200"
                        height="250"
                        className="d-block w-100"
                        // src={item.Logo}
                        alt={item.CompanyName}
                    />
                    <Carousel.Caption>
                        <h3>{item.CompanyName}</h3>
                        <p>{item.Description}</p>
                    </Carousel.Caption>
                </Carousel.Item>
            ))
            }
        </Carousel>
    );
}

export default ControlledCarousel;