import { useState } from "react";

export default function ImageSlider(props) {
    const images = props.images;
    const [activeImage, setActiveImage] = useState(0);

    console.log("ImageSlider received images:", images);

    if (!Array.isArray(images) || images.length === 0) {
        return (
            <div className="w-full h-full bg-gray-200 flex justify-center items-center">
                <p className="text-gray-500">No images available</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-gray-200 flex justify-center items-center">
            <div className="w-[70%] bg-gray-300 aspect-square relative">
                {/* ✅ Show active image */}
                <img
                    src={images[activeImage]}
                    alt={`Slide ${activeImage + 1}`}
                    className="w-full h-full object-cover"
                />

                {/* ✅ Thumbnails */}
                <div className="w-full h-[100px] backdrop-blur-3xl absolute bottom-0 left-0 flex justify-center items-center">
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className={`h-full aspect-square object-cover mx-[5px] cursor-pointer border-2 ${
                                index === activeImage
                                    ? "border-white"
                                    : "border-transparent"
                            }`}
                            onClick={() => setActiveImage(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
