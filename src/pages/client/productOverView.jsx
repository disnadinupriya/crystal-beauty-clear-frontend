import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import PrductCard from "../../components/products-card.jsx"; // Ensure correct import path
import Loader from "../../components/loader.jsx"; // Assuming you have a Loader component

export default function ProductOverView() {
  const { productid } = useParams();
  console.log("Product ID from params:", productid);

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
  }, [productid, status]);

  return (
    <div className="h-full w-full \">
      {
        status =="loading" && <Loader />
      }
      {
        status === "loaded" && (
          <div className="w-full h-full flex flex-wrap justify-center">
            <PrductCard product={product} />
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
