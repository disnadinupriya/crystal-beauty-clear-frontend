import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/loader.jsx";
import ImageSlider from "../../components/imageslider.jsx";
import { addToCart, getCart } from "../../../utils/cart.js";

export default function ProductOverView() {
  const { productid } = useParams();
  const navigate = useNavigate();

  if (!productid) {
    window.location.href = "/products";
  }

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (status === "loading") {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/product/" + productid)
        .then((res) => {
          setProduct(res.data);
          setStatus("loaded");
        })
        .catch((error) => {
          toast.error("Error fetching product");
          console.error("Error fetching product:", error);
          setStatus("error");
        });
    }
  }, [status]);

  if (status === "loading") return <Loader />;

  if (status === "error") {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <h1 className="text-2xl font-semibold text-gray-700">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 py-8 px-4 md:px-16">
      {/* ---------- Desktop Layout ---------- */}
      <div className="hidden md:flex w-full h-full justify-center items-start gap-10">
        {/* Image Section */}
        <div className="w-1/2 flex justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl shadow p-4">
            <ImageSlider images={product.Image} />
          </div>
        </div>

        {/* Details Section */}
        <div className="w-1/2 bg-white rounded-2xl shadow p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

          {product.altName?.length > 0 && (
            <h2 className="text-xl font-medium text-gray-500 mb-4">
              {product.altName.join(", ")}
            </h2>
          )}

          {/* Price Section */}
          <div className="flex items-center mb-6">
            {product.lablePrice > product.price ? (
              <>
                <h2 className="text-3xl font-semibold text-gray-800 mr-3">
                  LKR {product.price.toFixed(2)}
                </h2>
                <h2 className="text-xl line-through text-gray-500">
                  LKR {product.lablePrice.toFixed(2)}
                </h2>
              </>
            ) : (
              <h2 className="text-3xl font-semibold text-gray-800">
                LKR {product.price.toFixed(2)}
              </h2>
            )}
          </div>

          <p className="text-gray-700 text-lg mb-8">{product.description}</p>

          <div className="flex gap-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
              onClick={() => {
                addToCart(product, 1);
                toast.success("Product added to cart");
              }}
            >
              Add to Cart
            </button>

            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
              onClick={() => {
                navigate("/checkout", {
                  state: {
                    item: [
                      {
                        productid: product.productid,
                        name: product.name,
                        altName: product.altName,
                        price: product.price,
                        lablePrice: product.lablePrice,
                        Image: product.Image,
                        stock: product.stock,
                        quantity: 1,
                      },
                    ],
                  },
                });
              }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Mobile Layout ---------- */}
      <div className="block md:hidden">
        {/* Image Section */}
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow p-4">
            <ImageSlider images={product.Image} />
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-3 text-center">
            {product.name}
          </h1>

          {product.altName?.length > 0 && (
            <h2 className="text-lg font-medium text-gray-500 mb-4 text-center">
              {product.altName.join(", ")}
            </h2>
          )}

          {/* Price */}
          <div className="flex justify-center items-center mb-5">
            {product.lablePrice > product.price ? (
              <>
                <h2 className="text-2xl font-semibold text-gray-800 mr-2">
                  LKR {product.price.toFixed(2)}
                </h2>
                <h2 className="text-lg line-through text-gray-500">
                  LKR {product.lablePrice.toFixed(2)}
                </h2>
              </>
            ) : (
              <h2 className="text-2xl font-semibold text-gray-800">
                LKR {product.price.toFixed(2)}
              </h2>
            )}
          </div>

          <p className="text-gray-700 text-base mb-6 text-center">
            {product.description}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
              onClick={() => {
                addToCart(product, 1);
                toast.success("Product added to cart");
              }}
            >
              Add to Cart
            </button>

            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
              onClick={() => {
                navigate("/checkout", {
                  state: {
                    item: [
                      {
                        productid: product.productid,
                        name: product.name,
                        altName: product.altName,
                        price: product.price,
                        lablePrice: product.lablePrice,
                        Image: product.Image,
                        stock: product.stock,
                        quantity: 1,
                      },
                    ],
                  },
                });
              }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
