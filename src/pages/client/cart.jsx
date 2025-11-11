import { Link } from "react-router-dom";
import { BsCart4 } from "react-icons/bs";

export default function Header() {
  return (
    <>
      {/* Fixed navbar */}
      <div className="fixed top-0 left-0 w-full h-[70px] bg-blue-500 flex justify-center items-center z-50">
        <div className="flex justify-evenly items-center w-[500px] text-white text-xl">
          <Link to="/" className="hover:text-gray-200">Home</Link>
          <Link to="/products" className="ml-4 hover:text-gray-200">Products</Link>
          <Link to="/contact" className="ml-4 hover:text-gray-200">Contact Us</Link>
          <Link to="/reviews" className="ml-4 hover:text-gray-200">Reviews</Link>
          <Link to="/cart" className="ml-4 text-3xl absolute right-[30px] hover:text-gray-200">
            <BsCart4 />
          </Link>
        </div>
      </div>

      {/* Space below fixed header */}
      <div className="h-[70px]"></div>
    </>
  );
}
