import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import Loader from "../../components/loader.jsx"; // Assuming you have a Loader component
import ImageSlider from "../../components/imageslider.jsx"; // Assuming you have an ImageSlider component
import { addToCart, getCart } from "../../../utils/cart.js";









export default function ProductOverView() {
  const { productid } = useParams();
  console.log("Product ID from params:", productid);
  const navigate = useNavigate();

  if (productid == null) {
    window.location.href = "/products";
  }

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (status === "loading") {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/product/" + productid)
        .then((res) => {
          console.log("Product fetched successfully:", res.data);
          setProduct(res.data);
          setStatus("loaded");
        })
        .catch((error) => {
            toast.error("Error fetching product: " );
          console.error("Error fetching product:", error);
          setStatus("error");
        });
    }
  }, [ status]);

  return (
    <div className="h-full w-full ">
      {
        status =="loading" && <Loader />
      }
      {
        status === "loaded" && (
          <div className="w-full h-full flex flex-wrap justify-center">
            <div className="w-[50%] h-full bg-red-200"> 
              {console.log(product)}
              <ImageSlider images={product.Image} />

              
             

            </div>

            <div className="w-[50%] h-full p-8"> 
              <h1 className="text-3xl font-bold mb-4 text-center mb-4">{product.name}</h1>
              <h2 className="text-3xl font-bold mb-4 text-center text-gray-600 text-gray-500">{product.altName.join(", ")}</h2>
              <div className=" mb-4 flex mb-4 justify-center items-center">
                {
                  product.lablePrice>product.price?
                  <>
                  <h2 className="text-3xl mr-4 text-center">LKR:{product.price.toFixed(2)}</h2>
                  <h2 className="text-2xl line-through text-gray-500 text-center ">LKR:{product.lablePrice.toFixed(2)}</h2>:
                  
                  </>
                  :
                  <h2 className="text-3xl mb-4">{product.price}</h2>
                }
              </div>

              <p className="text-lg font-semibold text-gray-800 mb-4 text-center">{product.description}</p>

              <div className="w-full flex justify-center mb-4">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                  onClick={() => {
                   addToCart(product,1);
                   toast.success("Product added to cart");
                   console.log(getCart());
                      
                  }
}

                   
                  >
                  Add to Cart
                </button>
             
              
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    
                  }}
                  >
                  Buy Now
                </button>
              </div>
             
          </div>
          </div>
        ) 
      }
      {
        status === "error" && (
          <div className="w-full h-full flex flex-wrap justify-center">
            <h1>Product not found</h1>
          </div>
        ) 
      }
    </div>
  );
}
