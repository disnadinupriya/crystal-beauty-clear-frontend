import { Link } from "react-router-dom";
import { BsCart4 } from "react-icons/bs";



export default function Header() {
    return (
        <div className="h-[70px] w-full bg-blue-500 flex justify-center items-center">

            <div className="   flex justify-evenly items-center w-[500px]
                               text-white text-xl ">
            <Link to="/">Home</Link>
            <Link to="/products" className="ml-4">Products</Link>
            <Link to="/contact" className="ml-4">Contact us</Link>
            <Link to="/rewiews" className="ml-4">Reviews</Link>
            <Link to="/cart" className="ml-4 text-3xl right-[30px] absolute"><BsCart4 /></Link>
            </div>
        </div>
    );
}
