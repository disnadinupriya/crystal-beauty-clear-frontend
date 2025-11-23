import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import mediaUpload from "../../../utils/mediaUpload"; 
import { FaCloudUploadAlt, FaArrowLeft, FaSave, FaTimes, FaEdit } from "react-icons/fa";

export default function EditProductForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Form Data States
  const [productid, setProductid] = useState("");
  const [name, setName] = useState("");
  const [altName, setAltName] = useState("");
  const [price, setPrice] = useState("");
  const [lablePrice, setLablePrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  
  // Images State
  const [images, setImages] = useState([]); 
  const [imagePreviews, setImagePreviews] = useState([]);

  // Safe Backend URL
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Load Data on Mount
  useEffect(() => {
    if (location.state) {
      const p = location.state;
      setProductid(p.productid || "");
      setName(p.name || "");
      setAltName(p.altName ? (Array.isArray(p.altName) ? p.altName.join(", ") : p.altName) : "");
      setPrice(p.price || "");
      setLablePrice(p.lablePrice || "");
      setDescription(p.description || "");
      setStock(p.stock || "");

      // --- Correctly load existing images ---
      const incomingImages = p.image || p.Image;

      if (incomingImages) {
         const imgs = Array.isArray(incomingImages) ? incomingImages : [incomingImages];
         const validImgs = imgs.filter(img => img);
         
         setImages(validImgs); 
         setImagePreviews(validImgs); 
      }
    } else {
      toast.error("No product selected");
      navigate("/admin/products");
    }
  }, [location.state, navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if(files.length === 0) return;

    setImages(prev => [...prev, ...files]); 
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    if (newPreviews[index] && !newPreviews[index].startsWith('http')) {
        URL.revokeObjectURL(newPreviews[index]);
    }
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // --- Image Processing ---
      const imagePromises = images.map((img) => {
        if (typeof img === 'string') {
          return Promise.resolve(img);
        } else {
          return mediaUpload(img);
        }
      });

      const finalImageUrls = await Promise.all(imagePromises);
      console.log("Final Images to Save:", finalImageUrls); 

      const altNameInArray = altName.split(",").map((s) => s.trim()).filter(s => s);

      const updatedProduct = {
        productid,
        name,
        altName: altNameInArray,
        price: Number(price),
        lablePrice: Number(lablePrice) || 0,
        description,
        image: finalImageUrls, 
        stock: parseInt(stock, 10) || 0,
      };

      const token = localStorage.getItem("token");
      await axios.put(`${BACKEND_URL}/api/product/${productid}`, updatedProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Product updated successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-6 px-4 sm:py-10">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden border border-gray-100">
        
        {/* --- Header --- */}
        <div className="bg-gradient-to-r from-orange-600 to-red-500 px-5 py-5 sm:px-8 sm:py-6 text-white flex justify-between items-center">
          <h1 className="text-lg sm:text-2xl font-bold flex items-center gap-2 sm:gap-3">
            <FaEdit className="text-xl sm:text-2xl" /> 
            <span>Edit Product</span>
          </h1>
          <Link to="/admin/products" className="text-white hover:text-gray-200 flex items-center gap-2 text-sm sm:text-base font-medium transition">
            <FaArrowLeft /> Back
          </Link>
        </div>

        {/* --- Form Content --- */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
            
            {/* Left Column: Text Inputs */}
            <div className="space-y-5 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">ID (Read-only)</label>
                <input 
                  disabled 
                  type="text" 
                  value={productid} 
                  className="w-full px-4 py-2.5 border border-gray-300 bg-gray-100 rounded-lg text-gray-600 cursor-not-allowed focus:outline-none" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Alt Names</label>
                <input 
                  type="text" 
                  value={altName} 
                  onChange={(e) => setAltName(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition" 
                  placeholder="Comma separated"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price</label>
                  <input 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Label Price</label>
                  <input 
                    type="number" 
                    value={lablePrice} 
                    onChange={(e) => setLablePrice(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Stock</label>
                <input 
                  type="number" 
                  value={stock} 
                  onChange={(e) => setStock(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition" 
                />
              </div>
            </div>

            {/* Right Column: Description & Images */}
            <div className="space-y-5 sm:space-y-6 flex flex-col h-full">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="w-full h-40 sm:h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition resize-none" 
                />
              </div>

              {/* Image Upload Area */}
              <div className="border-2 border-dashed border-orange-300 bg-orange-50 rounded-xl p-6 text-center cursor-pointer hover:bg-orange-100 transition relative group">
                 <input 
                   type="file" 
                   multiple 
                   accept="image/*" 
                   onChange={handleImageChange} 
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                 />
                 <div className="flex flex-col items-center">
                    <FaCloudUploadAlt className="text-4xl text-orange-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-bold text-gray-700 group-hover:text-orange-700">Add More Images</span>
                 </div>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 mt-2">
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="relative group w-full aspect-square bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <img src={src} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeImage(index)} 
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all shadow-md transform hover:scale-110"
                      >
                        <FaTimes size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <hr className="my-6 sm:my-8 border-gray-200" />

          {/* --- Bottom Buttons --- */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
            <button 
              type="button"
              onClick={() => navigate("/admin/products")}
              className="px-6 py-3 rounded-lg text-gray-700 font-semibold bg-gray-100 hover:bg-gray-200 transition w-full sm:w-auto"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading} 
              className={`flex items-center justify-center gap-2 px-8 py-3 rounded-lg text-white font-bold shadow-lg transition transform hover:-translate-y-0.5 w-full sm:w-auto ${isLoading ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'}`}
            >
              {isLoading ? "Updating..." : <><FaSave /> Update Product</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}