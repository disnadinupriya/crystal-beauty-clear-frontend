import axios from "axios";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";


export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const url = import.meta.env.VITE_BACKEND_URL + "/api/product";
    console.log("Backend URL:", url);

    axios
      .get(url)
      .then((response) => {
        console.log("Products fetched successfully:", response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <div className="w-full h-full rounded-lg p-4 relative">
      <Link to="/admin/addProduct" className="w-[50px] h-[50px] flex justify-center items-center text-white text-lg  bg-blue-500 p-2  rounded-full hover:bg-blue-600 transition-colors  coursor-pointer right-5 bottom-5 absolute">
            <FaPlus/>
      </  Link>

      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr>
              {/*productId,name,price,description,price,lablePrice,stock*/}
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Label Price</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {
          products.map((product) => {
            console.log("Rendering product:", product.productId);
            return (
             
            <tr key={product.productId} className="cursor-pointer hover:bg-gray-800 hover:text-white">
              <td className="px-6 py-4 border-b border-gray-200">{product._id}</td>
              <td className="px-6 py-4 border-b border-gray-200">{product.name}</td>
              <td className="px-6 py-4 border-b border-gray-200">{product.price}</td>
              <td className="px-6 py-4 border-b border-gray-200">{product.lablePrice}</td>
              <td className="px-6 py-4 border-b border-gray-200">{product.stock}</td>
              <td className="px-6 py-4 border-b border-gray-200">
                {/* Actions can be added here */}
              </td>
            </tr>
            );
          })
          }
          
        </tbody>
      </table>
          
      {
      
        
    }

      </div>
  );
}
