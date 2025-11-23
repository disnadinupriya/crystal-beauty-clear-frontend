import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaSearch, FaTrash, FaEye } from "react-icons/fa"; // Added FaEye

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [modelIsDisplaing, setModelIsDisplaing] = useState(false);
  const [displaingOrder, setDisplaingOrder] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!loaded) {
      const token = localStorage.getItem("token");
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/order", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("Orders fetched successfully:", response.data);
          setOrders(response.data);
          setLoaded(true);
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
        });
    }
  }, [loaded]);

  function changeOrderStatus(orderId, status) {
    const token = localStorage.getItem("token");
    axios
      .put(import.meta.env.VITE_BACKEND_URL + "/api/order/" + orderId, {
        status: status,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Order status updated successfully:", response.data);
        toast.success("Order status updated successfully");
        setLoaded(false);
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
      });
  }

  function deleteOrder(orderId) {
    if (!window.confirm(`Are you sure you want to delete Order #${orderId}? This cannot be undone.`)) {
      return;
    }

    const token = localStorage.getItem("token");
    
    axios
      .delete(import.meta.env.VITE_BACKEND_URL + "/api/order/" + orderId, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        toast.success("Order deleted successfully");
        setOrders((prevOrders) => prevOrders.filter((order) => order.orderId !== orderId));
        
        if (displaingOrder?.orderId === orderId) {
          setModelIsDisplaing(false);
          setDisplaingOrder(null);
        }
      })
      .catch((error) => {
        console.error("Error deleting order:", error);
        toast.error("Failed to delete order");
      });
  }

  // Helper function for status colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Delivered": return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled": return "bg-red-100 text-red-800 border-red-200";
      case "Processing": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase().trim();
    const id = (order.orderId || "").toLowerCase();
    const email = (order.email || "").toLowerCase();
    const name = (order.name || "").toLowerCase();

    return id.includes(query) || email.includes(query) || name.includes(query);
  });

  return (
    <div className="min-h-screen w-full bg-gray-50 py-4 px-3 sm:px-6 lg:px-8">
      {loaded ? (
        <div className="w-full max-w-7xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Order Management
            </h1>
            
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out shadow-sm"
              />
            </div>
          </div>

          {/* --- Desktop Table View (Hidden on Mobile) --- */}
          <div className="hidden md:block bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order.orderId} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-600">
                          #{order.orderId}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          <div className="font-medium text-gray-900">{order.name}</div>
                          <div className="text-gray-500 text-xs">{order.email}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">
                          {order.address}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {order.phoneNumber}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <select
                            value={order.status}
                            onChange={(e) => changeOrderStatus(order.orderId, e.target.value)}
                            className={`block w-full pl-2 pr-8 py-1 text-xs font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 sm:text-sm cursor-pointer border ${getStatusColor(order.status)}`}
                          >
                            <option value="Pending" className="bg-white text-gray-900">Pending</option>
                            <option value="Delivered" className="bg-white text-gray-900">Delivered</option>
                            <option value="Cancelled" className="bg-white text-gray-900">Cancelled</option>
                            <option value="Processing" className="bg-white text-gray-900">Processing</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          LKR {order.total.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                          <button
                            onClick={() => {
                              setModelIsDisplaing(true);
                              setDisplaingOrder(order);
                            }}
                            className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-md transition-colors duration-200 text-xs shadow-sm font-medium"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-4 py-8 text-center text-sm text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <span className="mb-2 text-lg">🔍</span>
                          No orders found matching "{searchQuery}"
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* --- Mobile Card View (Visible on Mobile) --- */}
          <div className="md:hidden space-y-4">
             {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <div key={order.orderId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                           <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">#{order.orderId}</span>
                           <p className="text-sm text-gray-500 mt-1">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <select
                            value={order.status}
                            onChange={(e) => changeOrderStatus(order.orderId, e.target.value)}
                            className={`block pl-2 pr-6 py-1 text-xs font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer border ${getStatusColor(order.status)}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Processing">Processing</option>
                          </select>
                     </div>
                     
                     <div className="mb-4">
                        <h3 className="text-gray-900 font-semibold">{order.name}</h3>
                        <p className="text-gray-500 text-sm">{order.email}</p>
                     </div>

                     <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                        <div>
                            <p className="text-xs text-gray-400 uppercase">Total</p>
                            <p className="font-bold text-gray-900">LKR {order.total.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase">Phone</p>
                            <p>{order.phoneNumber}</p>
                        </div>
                     </div>
                     
                     <button
                        onClick={() => {
                          setModelIsDisplaing(true);
                          setDisplaingOrder(order);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                      >
                        <FaEye /> View Details
                      </button>
                  </div>
                ))
             ) : (
                <div className="text-center py-10 bg-white rounded-xl border border-gray-200 text-gray-500">
                   <p>No orders found matching "{searchQuery}"</p>
                </div>
             )}
          </div>
            
            {/* Modal */}
            {modelIsDisplaing && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden transform transition-all relative flex flex-col max-h-[90vh]">
                  
                  <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center shrink-0">
                    <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                        Order #{displaingOrder?.orderId || "-"}
                    </h2>
                    <button
                      className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-1.5"
                      onClick={() => setModelIsDisplaing(false)}
                    >
                      <IoMdClose size={20} />
                    </button>
                  </div>

                  <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 shrink-0">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                           <p className="text-indigo-900 font-medium">Date</p>
                           <p className="text-indigo-700">{displaingOrder?.date ? new Date(displaingOrder.date).toLocaleDateString() : "-"}</p>
                        </div>
                        <div>
                           <p className="text-indigo-900 font-medium">Status</p>
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(displaingOrder?.status)}`}>
                              {displaingOrder?.status || "-"}
                           </span>
                        </div>
                        <div className="col-span-2 sm:col-span-1 text-left sm:text-right mt-2 sm:mt-0">
                           <p className="text-indigo-900 font-medium">Total Amount</p>
                           <p className="text-indigo-700 font-bold text-lg">LKR {displaingOrder?.total || "0"}.00</p>
                        </div>
                      </div>
                  </div>

                  <div className="overflow-y-auto p-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Order Items</h3>
                    <div className="space-y-4">
                    {(displaingOrder?.billItems || []).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-3 rounded-lg border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all"
                      >
                        <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden bg-white">
                          <img
                            src={item.Image || item.image}
                            alt={item.ProductName || item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.ProductName || item.name || "Unnamed Product"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Unit Price: LKR {item.price || 0}.00
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            LKR {((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Qty: {item.quantity || 0}
                          </p>
                        </div>
                      </div>
                    ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-right flex flex-col-reverse sm:flex-row justify-between items-center gap-3 shrink-0">
                    {/* Delete button is ONLY here now */}
                    <button
                        onClick={() => deleteOrder(displaingOrder.orderId)}
                        className="w-full sm:w-auto px-4 py-2 bg-red-50 border border-red-200 rounded-md text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center gap-2 transition-colors"
                    >
                        <FaTrash size={14} /> Delete Order
                    </button>
                    <button 
                      onClick={() => setModelIsDisplaing(false)}
                      className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Close
                    </button>
                  </div>

                </div>
              </div>
            )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      )}
    </div>
  );
}