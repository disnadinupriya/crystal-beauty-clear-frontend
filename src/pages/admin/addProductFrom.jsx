/*product id
name
alttNaame
price
lablePrice
description
image
stock*/

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


export default function AddProductFrom() {

    const [productId, setProductId] = useState("");
    const [name, setName] = useState("");
    const [altName, setAltName] = useState("");
    const [price, setPrice] = useState("");
    const [labelPrice, setLabelPrice] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [stock, setStock] = useState("");

    function handleSubmit() {
    console.log("Add Product button clicked");

    const altNameInArray = altName.split(",").map(s => s.trim()); // trim spaces

    const product = {
        productid: productId,               // lowercase 'productid'
        name: name,
        altName: altNameInArray,
        price: Number(price),               // convert to number
        lablePrice: Number(labelPrice),    // 'lablePrice' spelling, number type
        description: description,
        Image: [                           // capital 'I' and array
            "https://lipsum.app/id/24/1600x900",
            "https://lipsum.app/id/25/1600x900",
            "https://lipsum.app/id/26/1600x900"
        ],
        stock: parseInt(stock, 10),        // parseInt with radix
    };

    const token = localStorage.getItem("token");
    console.log("Token:", token);

    axios.post(import.meta.env.VITE_BACKEND_URL + "/api/product", product, {
        headers: {
            "Authorization": `Bearer ${token}`
        },
    }).then((response) => {
        console.log("Product to be added:", product);
        toast.success("Product added successfully!");
    }).catch((error) => {
        console.error("Error adding product:", error);
    });
}



return (
  <div className="w-full h-screen bg-red-900 p-4 flex justify-center items-center">
  <div className="bg-white p-6 rounded-lg shadow-xl w-[500px] flex flex-col items-center">
    <h1 className="text-xl font-bold mb-4">Add Product</h1>

    {/* Form Inputs */}
    <input value={productId} onChange={(e) => setProductId(e.target.value)} className="w-full h-[40px] border border-gray-300 rounded-xl mb-2 px-3 text-center" placeholder="Product ID" />
    <input value={name} onChange={(e) => setName(e.target.value)} className="w-full h-[40px] border border-gray-300 rounded-xl mb-2 px-3 text-center" placeholder="Name" />
    <input value={altName} onChange={(e) => setAltName(e.target.value)} className="w-full h-[40px] border border-gray-300 rounded-xl mb-2 px-3 text-center" placeholder="Alt Name (comma separated)" />
    <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" className="w-full h-[40px] border border-gray-300 rounded-xl mb-2 px-3 text-center" placeholder="Price" />
    <input value={labelPrice} onChange={(e) => setLabelPrice(e.target.value)} type="number" className="w-full h-[40px] border border-gray-300 rounded-xl mb-2 px-3 text-center" placeholder="Label Price" />
    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-[80px] border border-gray-300 rounded-xl mb-2 px-3 py-2 text-center" placeholder="Description" />
    <input value={stock} onChange={(e) => setStock(e.target.value)} type="number" className="w-full h-[40px] border border-gray-300 rounded-xl mb-4 px-3 text-center" placeholder="Stock" />

    {/* Buttons */}
    <div className="w-full flex justify-center gap-4">
      <Link to="/admin/products" className="w-[150px] h-[40px] bg-red-500 rounded-xl text-white flex justify-center items-center hover:bg-red-600">
        Cancel
      </Link>
      <button onClick={handleSubmit} className="w-[150px] h-[40px] bg-green-500 rounded-xl text-white flex justify-center items-center hover:bg-green-600">
        Add Product
      </button>
    </div>
  </div>
</div>

   
);
}
