import axios from "axios";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import React from "react";
import { toast } from "react-hot-toast";
import { GrEdit } from "react-icons/gr";
import Loader from "../../components/loader";
import { useNavigate } from "react-router-dom";
import EditProduct from "./editProduct.jsx";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loaded) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/product")
        .then((response) => {
          console.log("Products fetched successfully:", response.data);
          setProducts(response.data);
          setLoaded(true);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    }
  }, [loaded]);

  async function handleDelete(id) {
    const token = localStorage.getItem("token");
    if (token == null) {
      toast.error("You are not authorized to delete this product.");
      return;
    }
    try {
      console.log("Deleting product with ID:", id);
      await axios.delete(import.meta.env.VITE_BACKEND_URL + "/api/product/" + id, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      // ✅ Remove the product from state instead of refetching
      setProducts((prev) => prev.filter((product) => product._id !== id));
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product. Please try again.");
    }
  }

  return (
    <div className="w-full h-full rounded-lg p-4 relative">
      <Link to="/admin/addProduct" className="w-[50px] h-[50px] flex justify-center items-center text-white text-lg  bg-blue-500 p-2  rounded-full hover:bg-blue-600 transition-colors  cursor-pointer right-5 bottom-5 absolute">
        <FaPlus />
      </Link>

      {loaded && (
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
            {products.map((product, index) => {
              console.log("Rendering product:", product.productid);
              return (
                <tr key={product._id} className="cursor-pointer hover:bg-gray-500 hover:text-white">
                  <td className="px-6 py-4 border-b border-gray-200">{product.productid}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{product.name}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{product.price}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{product.lablePrice}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{product.stock}</td>
                  <td>
                    <div className="flex justify-center">
                      <FaTrashAlt
                        className="text-[20px] mr-4 hover:text-red-600"
                        onClick={() => {
                          handleDelete(product.productid);
                        }}
                      />
                      <GrEdit
                        className="text-[20px] mr-4 hover:text-blue-600"
                        onClick={() => {
                          // Navigate to edit product from
                          navigate(`/admin/editProduct/`, {
                            state:product
                            
                          });
                        }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {!loaded && <Loader />}
    </div>
  );
}