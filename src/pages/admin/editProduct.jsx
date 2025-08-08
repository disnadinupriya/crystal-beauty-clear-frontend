


import { DiEnvato } from "react-icons/di";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import React from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import mediaUpload from "../../../utils/mediaUpload.jsx";





import { createClient } from "@supabase/supabase-js";


export default function    EditProductFrom() {
    const locationData = useLocation();
        const navigate = useNavigate(); 

    
    if(locationData.state == null ) {
        toast.error("No product data found to edit.");
        window.location.href = "/admin/products"; // Redirect to products page
        // Prevent further execution
    }
    console.log("Location:", locationData.state);

    const [productId, setProductId] = useState(locationData.state.productId); // Use product._id if available
    const [name, setName] = useState(locationData.state.name || "");
    const [altName, setAltName] = useState(locationData.state.altName ? locationData.state.altName.join(", ") : "");
    const [price, setPrice] = useState(locationData.state.price || "");
    const [labelPrice, setLabelPrice] = useState(locationData.state.lablePrice || "");
    const [description, setDescription] = useState(locationData.state.description || "");
    const [images, setImages] = useState( []);
    const [stock, setStock] = useState(locationData.state.stock || "");




   async function handleSubmit() {

      const promisesArray = []; 

      for(let i = 0; i < images.length; i++) {

        const promise = mediaUpload(images[i])
        promisesArray[i] = promise;
        
      }
      try {

      const result = await Promise.all(promisesArray);
      console.log("All images uploaded:", result);

      
    console.log("Add Product button clicked");
   

    const altNameInArray = altName.split(",").map(s => s.trim()); // trim spaces

    const product = {
        productid: productId,               // lowercase 'productid'
        name: name,
        altName: altNameInArray,
        price: Number(price),               // convert to number
        lablePrice: Number(labelPrice),    // 'lablePrice' spelling, number type
        description: description,
        Image: result, // use the result from mediaUpload
        stock: parseInt(stock, 10),        // parseInt with radix
    };

    const token = localStorage.getItem("token");
    console.log("Token:", token);

    await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/product", product, {
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });

    toast.success("Product added successfully!");
    navigate("/admin/products");
    

  } catch (error) {
    console.error("Error uploading images:", error);
    toast.error("Failed to upload images. Please try again.");
  }
}
   
    


return (
  <div className="w-full h-screen bg-red-900 p-4 flex justify-center items-center">
  <div className="bg-white p-6 rounded-lg shadow-xl w-[500px] flex flex-col items-center">
    <h1 className="text-xl font-bold mb-4">Edit Product</h1>

    {/* Form Inputs */}
    <input disabled value={productId} onChange={(e) => setProductId(e.target.value)} className="w-full h-[40px] border border-gray-300 rounded-xl mb-2 px-3 text-center" placeholder="Product ID" />
    <input value={name} onChange={(e) => setName(e.target.value)} className="w-full h-[40px] border border-gray-300 rounded-xl mb-2 px-3 text-center" placeholder="Name" />
    <input value={altName} onChange={(e) => setAltName(e.target.value)} className="w-full h-[40px] border border-gray-300 rounded-xl mb-2 px-3 text-center" placeholder="Alt Name (comma separated)" />
    <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" className="w-full h-[40px] border border-gray-300 rounded-xl mb-2 px-3 text-center" placeholder="Price" />
    <input value={labelPrice} onChange={(e) => setLabelPrice(e.target.value)} type="number" className="w-full h-[40px] border border-gray-300 rounded-xl mb-2 px-3 text-center" placeholder="Label Price" />
    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-[80px] border border-gray-300 rounded-xl mb-2 px-3 py-2 text-center" placeholder="Description" />
    <input type="file" onChange={(e) => setImages(e.target.files)} className="w-full h-[40px] border border-gray-300 rounded-xl mb-2 px-3 text-center" multiple placeholder="upload images " />
    <input value={stock} onChange={(e) => setStock(e.target.value)} type="number" className="w-full h-[40px] border border-gray-300 rounded-xl mb-4 px-3 text-center" placeholder="Stock" />

    {/* Buttons */}
    <div className="w-full flex justify-center gap-4">
      <Link to="/admin/products" className="w-[150px] h-[40px] bg-red-500 rounded-xl text-white flex justify-center items-center hover:bg-red-600">
        Cancel
      </Link>
      <button onClick={handleSubmit} className="w-[150px] h-[40px] bg-green-500 rounded-xl text-white flex justify-center items-center hover:bg-green-600">
        Edit Product
      </button>
    </div>
  </div>
</div>

   
);
}


//https://guaxykwlwvybejqayzfg.supabase.co
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1YXh5a3dsd3Z5YmVqcWF5emZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTY3OTMsImV4cCI6MjA2OTk5Mjc5M30.29sck266mcjaHW8OeJeGgbWcOVl88yu6CiF687Odi3k