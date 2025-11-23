import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaSearch, FaTrash, FaEdit, FaBoxOpen, FaEye, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import Loader from "../../components/loader";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const navigate = useNavigate();

  // Safe Backend URL
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // 1. Fetch Products
  useEffect(() => {
    axios
      .get(BACKEND_URL + "/api/product")
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : (response.data.products || []);
        setProducts(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
        setIsLoading(false);
      });
  }, []);

  // 2. Delete Product
  const handleDelete = async (e, product) => {
    e.stopPropagation(); // Prevent row click (Popup won't open)
    const idToSend = product.productid || product._id;
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) return;
    
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${BACKEND_URL}/api/product/${encodeURIComponent(idToSend)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProducts((prevProducts) => 
        prevProducts.filter((p) => {
            if (p._id && product._id) {
                return p._id !== product._id;
            }
            return String(p.productid) !== String(product.productid);
        })
      );
      
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.");
    }
  };

  // Navigation handler for Edit to stop bubbling
  const handleEdit = (e, product) => {
    e.stopPropagation(); // Prevent row click
    navigate("/admin/editProduct", { state: product });
  };

  // 3. Search Filter & Sort Logic
  const q = (searchQuery || "").toString().toLowerCase().trim();
  
  const filteredProducts = products
    .filter((product) => {
      const name = (product?.name || "").toString().toLowerCase();
      const idStr = (product?.productid ?? product?._id ?? "").toString().toLowerCase();
      return name.includes(q) || idStr.includes(q);
    })
    .sort((a, b) => {
        const idA = (a.productid || "").toString();
        const idB = (b.productid || "").toString();
        return idA.localeCompare(idB, undefined, { numeric: true, sensitivity: 'base' });
    });

  // 4. Helper Function to get Image
  const getProductImage = (product) => {
    return Array.isArray(product?.Image) && product.Image.length > 0
      ? product.Image[0]
      : Array.isArray(product?.image) && product.image.length > 0
      ? product.image[0]
      : (typeof product?.Image === 'string' ? product.Image : (typeof product?.image === 'string' ? product.image : "https://via.placeholder.com/150"));
  };

  return (
    <div className="w-full p-4 sm:p-6 bg-gray-50 min-h-screen relative">
      
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
          <span className="bg-blue-600 text-white p-2 rounded-lg text-xl"><FaBoxOpen/></span>
          Product Inventory
        </h1>
        <Link 
          to="/admin/addProduct" 
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105"
        >
          <FaPlus /> Add New Product
        </Link>
      </div>

      {/* --- Search Bar --- */}
      <div className="mb-6 relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by Name or Product ID..."
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* --- Content Area --- */}
      {isLoading ? (
        <div className="flex justify-center mt-20"><Loader /></div>
      ) : (
        <>
            {/* --- Desktop Table View (Hidden on Mobile) --- */}
            <div className="hidden md:block bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
            <table className="min-w-full leading-normal">
                <thead>
                <tr className="bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <th className="px-5 py-4">Product Details</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-5 py-4 text-center">Stock</th>
                    <th className="px-5 py-4 text-center">Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => {
                    const uniqueKey = product._id || product.productid || index;
                    const imgSource = getProductImage(product);

                    // Price Logic
                    const price = Number(product?.price) || 0;
                    const labelPrice = Number(product?.lablePrice ?? product?.labelPrice) || 0;
                    const hasDiscount = labelPrice > price;
                    const discount = hasDiscount 
                        ? Math.round(((labelPrice - price) / labelPrice) * 100) 
                        : 0;

                    return (
                        <tr 
                            key={uniqueKey} 
                            onClick={() => setSelectedProduct(product)}
                            className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                        <td className="px-5 py-4">
                            <div className="flex items-center">
                            <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                                <img className="w-full h-full object-cover" src={imgSource} alt={product?.name || 'Product'} />
                            </div>
                            <div className="ml-4">
                                <p className="text-gray-900 font-bold text-sm">{product.name}</p>
                                <p className="text-gray-400 text-xs">ID: {product.productid || product._id}</p>
                            </div>
                            </div>
                        </td>

                        <td className="px-5 py-4">
                            <div>
                            <p className="text-gray-900 font-semibold">LKR {price.toFixed(2)}</p>
                            {hasDiscount && (
                                <div className="flex items-center gap-2">
                                <p className="text-gray-400 text-xs line-through">LKR {labelPrice.toFixed(2)}</p>
                                <span className="text-green-600 text-xs font-bold bg-green-100 px-1 rounded">-{discount}%</span>
                                </div>
                            )}
                            </div>
                        </td>

                        <td className="px-5 py-4 text-center">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.stock > 10 ? "bg-green-100 text-green-800" : product.stock > 0 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                            }`}>
                            {product.stock > 0 ? `${product.stock} In Stock` : "Out of Stock"}
                            </span>
                        </td>

                        <td className="px-5 py-4 text-center">
                            <div className="flex justify-center gap-3">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedProduct(product);
                                }}
                                className="text-green-500 hover:text-green-700 bg-green-50 p-2 rounded-full hover:bg-green-100 transition shadow-sm"
                                title="View Product"
                            >
                                <FaEye />
                            </button>

                            <button
                                onClick={(e) => handleEdit(e, product)}
                                className="text-blue-500 hover:text-blue-700 bg-blue-50 p-2 rounded-full hover:bg-blue-100 transition shadow-sm"
                                title="Edit Product"
                            >
                                <FaEdit size={20} />
                            </button>
                            
                            <button
                                onClick={(e) => handleDelete(e, product)}
                                className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full hover:bg-red-100 transition shadow-sm"
                                title="Delete Product"
                            >
                                <FaTrash size={20} />
                            </button>
                            </div>
                        </td>
                        </tr>
                    );
                    })
                ) : (
                    <tr>
                    <td colSpan="4" className="px-5 py-10 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                        <span className="text-4xl mb-2">🔍</span>
                        <p>No products found matching "{searchQuery}"</p>
                        </div>
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>

            {/* --- Mobile Card View (Visible on Mobile) --- */}
            <div className="md:hidden space-y-4">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => {
                        const uniqueKey = product._id || product.productid || index;
                        const imgSource = getProductImage(product);
                        const price = Number(product?.price) || 0;
                        
                        return (
                            <div 
                                key={uniqueKey} 
                                onClick={() => setSelectedProduct(product)}
                                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 active:scale-[0.99] transition-transform"
                            >
                                <div className="flex gap-4 mb-3">
                                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-100 shrink-0">
                                        <img src={imgSource} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-gray-900 font-bold text-lg truncate">{product.name}</h3>
                                        <p className="text-xs text-gray-500 mb-1">ID: {product.productid || product._id}</p>
                                        <p className="text-blue-600 font-bold">LKR {price.toFixed(2)}</p>
                                        <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                                            product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                        }`}>
                                            {product.stock > 0 ? `${product.stock} In Stock` : "Out of Stock"}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
                                        className="flex items-center justify-center gap-1 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100"
                                    >
                                        <FaEye /> View
                                    </button>
                                    <button 
                                        onClick={(e) => handleEdit(e, product)}
                                        className="flex items-center justify-center gap-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100"
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button 
                                        onClick={(e) => handleDelete(e, product)}
                                        className="flex items-center justify-center gap-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100"
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-10 bg-white rounded-xl border border-gray-200 text-gray-500">
                        <span className="text-3xl block mb-2">🔍</span>
                        <p>No products found</p>
                    </div>
                )}
            </div>
        </>
      )}

      {/* --- Product Detail Popup (Modal) --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden transform transition-all scale-100 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 shrink-0">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <FaBoxOpen /> Product Details
              </h2>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="text-white hover:bg-white/20 p-1.5 rounded-full transition"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-8">
                
                {/* Image Section */}
                <div className="w-full md:w-1/2">
                  <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-md">
                    <img 
                      src={getProductImage(selectedProduct)} 
                      alt={selectedProduct.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* If multiple images exist, show small thumbnails below */}
                  {(selectedProduct.image || selectedProduct.Image)?.length > 1 && (
                      <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                         {(selectedProduct.image || selectedProduct.Image).map((img, i) => (
                            <img key={i} src={img} alt="thumb" className="w-16 h-16 object-cover rounded-md border border-gray-200 shrink-0" />
                         ))}
                      </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="w-full md:w-1/2 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h3>
                    <p className="text-sm text-gray-500">ID: {selectedProduct.productid || selectedProduct._id}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Price:</span>
                      <span className="text-xl font-bold text-blue-600">LKR {selectedProduct.price}</span>
                    </div>
                    {selectedProduct.lablePrice > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Label Price:</span>
                        <span className="text-gray-400 line-through">LKR {selectedProduct.lablePrice}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Stock Status:</span>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        selectedProduct.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {selectedProduct.stock > 0 ? `${selectedProduct.stock} Items` : "Out of Stock"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Description:</h4>
                    <p className="text-gray-600 text-sm leading-relaxed bg-white border border-gray-200 p-3 rounded-lg h-32 overflow-y-auto">
                      {selectedProduct.description || "No description provided."}
                    </p>
                  </div>

                  {selectedProduct.altName && selectedProduct.altName.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-gray-700 text-sm mb-1">Tags / Alt Names:</h4>
                        <div className="flex flex-wrap gap-2">
                          {(Array.isArray(selectedProduct.altName) ? selectedProduct.altName : selectedProduct.altName.split(',')).map((tag, i) => (
                             <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md border border-gray-200">{tag}</span>
                          ))}
                        </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50 shrink-0">
               <button 
                 onClick={() => setSelectedProduct(null)}
                 className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
               >
                 Close
               </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}