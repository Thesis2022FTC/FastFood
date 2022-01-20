import React, { useState } from "react";
import Carousel from 'react-bootstrap/Carousel'

const ControlledCarousel = ({ slider }) => {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

 const images=[
"https://firebasestorage.googleapis.com/v0/b/fastfood-queue.appspot.com/o/slides%2Fslide1.PNG?alt=media&token=536c07c1-4995-4566-a713-e8c552177b89",
"https://firebasestorage.googleapis.com/v0/b/fastfood-queue.appspot.com/o/slides%2Fslide2.jpg?alt=media&token=59bd54e3-c17d-4917-a46d-b8c92c94b37d",
"https://firebasestorage.googleapis.com/v0/b/fastfood-queue.appspot.com/o/slides%2Fslide3.webp?alt=media&token=d8b8801d-317f-43c6-8003-e335ac5b1321",
"https://firebasestorage.googleapis.com/v0/b/fastfood-queue.appspot.com/o/slides%2Fslide4.png?alt=media&token=c35750d6-dc66-4a1a-aded-ada2d720b176",
"https://firebasestorage.googleapis.com/v0/b/fastfood-queue.appspot.com/o/slides%2Fslide5.jpg?alt=media&token=5e258569-a310-416c-b82d-bf3622ce2ef7",
"https://firebasestorage.googleapis.com/v0/b/fastfood-queue.appspot.com/o/slides%2Fslide6.jpg?alt=media&token=b17a6bc5-54d2-4f97-b9f2-2808f4b02c81"
 ]

   console.log('Pass SLiders',images)

    return (
        <Carousel activeIndex={index} onSelect={handleSelect} >
            {images.map((item, idx) => (
                <Carousel.Item>
                    <img
                        width="100"
                        height="400"
                        className="d-block w-100"
                         src={item}
                        
                        style={{resizeMode:'contains'}}
                    />
                    <Carousel.Caption>
                        {/* <h3>{item.CompanyName}</h3>
                        <p>{item.Description}</p> */}
                    </Carousel.Caption>
                </Carousel.Item>
            ))
            } 
        </Carousel>
    );
}

export default ControlledCarousel;