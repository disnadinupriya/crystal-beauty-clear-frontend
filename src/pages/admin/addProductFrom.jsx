import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import mediaUpload from "../../../utils/mediaUpload.jsx";
import { createClient } from "@supabase/supabase-js";
import { FaPlus } from "react-icons/fa";


export default function AddProductForm() {
  const [productid, setProductid] = useState("");
  const [name, setName] = useState("");
  const [altName, setAltName] = useState("");
  const [price, setPrice] = useState("");
  const [lablePrice, setLablePrice] = useState(""); // keep spelling consistent
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [stock, setStock] = useState("");

  const navigate = useNavigate();

  async function handleSubmit() {
    const promisesArray = [];

    for (let i = 0; i < images.length; i++) {
      promisesArray.push(mediaUpload(images[i]));
    }

    try {
      const result = await Promise.all(promisesArray);
      console.log("All images uploaded:", result);

      const altNameInArray = altName.split(",").map((s) => s.trim());

      const product = {
        productid,
        name,
        altName: altNameInArray,
        price: Number(price),
        lablePrice: Number(lablePrice),
        description,
        Image: result,
        stock: parseInt(stock, 10),
      };

      const token = localStorage.getItem("token");
      await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/product", product, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Product added successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error uploading images or adding product:", error);
      toast.error("Failed to add product. Please try again.");
    }
  }

  return (
    <div className="w-full h-screen bg-red-900 p-4 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[500px] flex flex-col items-center">
        <h1 className="text-xl font-bold mb-4">Add Product</h1>

        <input
          value={productid}
          onChange={(e) => setProductid(e.target.value)}
          className="w-full h-[40px] border border-gray-300 rounded-xl mb-2 px-3 text-center"
          placeholder="Product ID"
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-[40px] border border-gray-300 rounded-xl mb-2 px-3 text-center"
          placeholder="Name"
        />
        <input
          value={altName}
          onChange={(e) => setAltName(e.target.value)}
          className="w-full h-[40px] border border-gray-300 rounded-xl mb-2 px-3 text-center"
          placeholder="Alt Name (comma separated)"
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="number"
          className="w-full h-[40px] border border-gray-300 rounded-xl mb-2 px-3 text-center"
          placeholder="Price"
        />
        <input
          value={lablePrice}
          onChange={(e) => setLablePrice(e.target.value)}
          type="number"
          className="w-full h-[40px] border border-gray-300 rounded-xl mb-2 px-3 text-center"
          placeholder="Label Price"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-[80px] border border-gray-300 rounded-xl mb-2 px-3 py-2 text-center"
          placeholder="Description"
        />
        <input
          type="file"
          onChange={(e) => setImages(e.target.files)}
          className="w-full h-[40px] border border-gray-300 rounded-xl mb-2 px-3 text-center"
          multiple
          placeholder="Upload images"
        />
        <input
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          type="number"
          className="w-full h-[40px] border border-gray-300 rounded-xl mb-4 px-3 text-center"
          placeholder="Stock"
        />

        <div className="w-full flex justify-center gap-4">
          <Link
            to="/admin/products"
            className="w-[150px] h-[40px] bg-red-500 rounded-xl text-white flex justify-center items-center hover:bg-red-600"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            className="w-[150px] h-[40px] bg-green-500 rounded-xl text-white flex justify-center items-center hover:bg-green-600"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}
