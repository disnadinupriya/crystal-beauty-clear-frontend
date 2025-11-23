import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import mediaUpload from "../../../utils/mediaUpload"; 
import { FaCloudUploadAlt, FaArrowLeft, FaSave, FaTimes } from "react-icons/fa";

export default function AddProductForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [productid, setProductid] = useState("");
  const [name, setName] = useState("");
  const [altName, setAltName] = useState("");
  const [price, setPrice] = useState("");
  const [lablePrice, setLablePrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!productid || !name || !price || !description || images.length === 0) {
      toast.error("Please fill required fields and upload images.");
      return;
    }

    setIsLoading(true);
    const promisesArray = [];
    for (let i = 0; i < images.length; i++) {
      promisesArray.push(mediaUpload(images[i]));
    }

    try {
      const imgUrls = await Promise.all(promisesArray);
      const altNameInArray = altName.split(",").map((s) => s.trim()).filter(s => s);

      const product = {
        productid,
        name,
        altName: altNameInArray,
        price: Number(price),
        lablePrice: Number(lablePrice) || 0,
        description,
        Image: imgUrls,
        stock: parseInt(stock, 10) || 0,
      };

      const token = localStorage.getItem("token");
      await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/product", product, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Product added successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-6 px-4 sm:py-10">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden border border-gray-100">
        
        {/* Header: Adjusted padding and text size for mobile */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-5 sm:px-8 sm:py-6 text-white flex justify-between items-center">
          <h1 className="text-lg sm:text-2xl font-bold flex items-center gap-2 sm:gap-3">
            <FaCloudUploadAlt className="text-xl sm:text-2xl" /> 
            <span>Add New Product</span>
          </h1>
          <Link to="/admin/products" className="text-blue-100 hover:text-white flex items-center gap-2 text-sm sm:text-base font-medium">
            <FaArrowLeft /> Back
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Left Column */}
          <div className="space-y-5 sm:space-y-6">
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">ID</label>
                <input type="text" value={productid} onChange={(e) => setProductid(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="SKU-001" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Product Name" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Alt Names</label>
                <input type="text" value={altName} onChange={(e) => setAltName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Comma separated" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Price</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Label Price</label>
                <input type="number" value={lablePrice} onChange={(e) => setLablePrice(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Stock</label>
                <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5 sm:space-y-6 flex flex-col h-full">
            <div className="flex-1">
                <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-40 sm:h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all" />
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-blue-300 text-center cursor-pointer hover:bg-blue-50 transition-colors relative group">
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <FaCloudUploadAlt className="text-4xl text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">Click to Upload Images</span>
            </div>
            
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-2">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative group w-full h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <img src={src} className="w-full h-full object-cover" alt="preview" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all shadow-md">
                        <FaTimes size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Actions: Mobile Stacked, Desktop Inline */}
          <div className="lg:col-span-2 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-6 border-t border-gray-100">
            <Link to="/admin/products" className="px-6 py-3 rounded-lg text-gray-700 font-semibold bg-gray-100 hover:bg-gray-200 text-center transition-colors w-full sm:w-auto">
                Cancel
            </Link>
            <button type="submit" disabled={isLoading} className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg text-white font-bold bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-200 transition-all transform active:scale-95 w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? "Uploading..." : <><FaSave /> Save Product</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}