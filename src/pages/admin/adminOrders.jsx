import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// 1. Import Search Icon
import { FaSearch } from "react-icons/fa"; 

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [modelIsDisplaing, setModelIsDisplaing] = useState(false);
  const [displaingOrder, setDisplaingOrder] = useState(null);
  
  // 2. Add State for Search Query
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

  // 3. Filter Logic (Search by ID, Email, or Name)
  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase().trim();
    const id = (order.orderId || "").toLowerCase();
    const email = (order.email || "").toLowerCase();
    const name = (order.name || "").toLowerCase();

    return id.includes(query) || email.includes(query) || name.includes(query);
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-white py-10 px-6">
      {loaded ? (
        <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            📦 All Orders
          </h1>

          {/* 4. Search Bar UI */}
          <div className="mb-6 relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by Order ID, Email, or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-xl">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Order ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Customer Email</th>
                  <th className="px-4 py-3 text-left font-semibold">Customer Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Address</th>
                  <th className="px-4 py-3 text-left font-semibold">Phone Number</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Total</th>
                  <th className="px-4 py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {/* 5. Map through filteredOrders instead of orders */}
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.orderId}
                      className="border-b hover:bg-blue-50 transition duration-200 text-center cursor-pointer"
                    >
                      <td className="px-4 py-3 font-semibold text-gray-800">
                        {order.orderId}
                      </td>
                      <td className="px-4 py-3">{order.email}</td>
                      <td className="px-4 py-3">{order.name}</td>
                      <td className="px-4 py-3">{order.address}</td>
                      <td className="px-4 py-3">{order.phoneNumber}</td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => {
                            console.log(e.target.value);
                            changeOrderStatus(order.orderId, e.target.value);
                          }}
                          className="p-1 border rounded bg-white"
                        >
                          <option value={"Pending"}>Pending</option>
                          <option value={"Delivered"}>Delivered</option>
                          <option value={"Cancelled"}>Cancelled</option>
                          <option value={"Processing"}>Processing</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 font-semibold text-blue-700">
                        LKR {order.total}.00
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setModelIsDisplaing(true);
                            setDisplaingOrder(order);
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                      No orders found matching "{searchQuery}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {/* Modal Logic Remains Same */}
            {modelIsDisplaing && (
              <div className="fixed bg-[#00000090] w-full h-full top-0 left-0 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg w-[600px] h-[600px] relative max-w-[600px] max-h-[600px] overflow-hidden shadow-2xl">
                  <div className="w-full bg-blue-600 p-6">
                    <div className="mb-4">
                      <h2 className="text-2xl font-bold text-white">
                        Order ID: {displaingOrder?.orderId || "-"}
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-lg text-white">
                        <span className="font-medium">Date: </span>
                        {displaingOrder?.date ? new Date(displaingOrder.date).toLocaleDateString() : "-"}
                      </div>
                      <div className="text-lg text-white">
                        <span className="font-medium">Status: </span>
                        {displaingOrder?.status || "-"}
                      </div>
                      <div className="text-lg text-white">
                        <span className="font-medium">Total: </span>
                        LKR {displaingOrder?.total || "0"}.00
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-[calc(100%-200px)] overflow-y-auto p-6">
                    {(displaingOrder?.billItems || []).map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-4 mb-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.Image || item.image}
                            alt={item.ProductName || item.name}
                            className="w-[80px] h-[80px] object-cover rounded-md"
                          />
                          <div>
                            <div className="font-semibold text-gray-800">
                              {item.ProductName || item.name || "Unnamed Product"}
                            </div>
                            <div className="text-gray-600">
                              LKR {item.price || 0}.00
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-600">
                            Quantity: {item.quantity || 0}
                          </div>
                          <div className="font-semibold text-gray-800">
                            Total: LKR {((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                    onClick={() => setModelIsDisplaing(false)}
                  >
                    <IoMdClose size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[400px]">
          <Loader />
        </div>
      )}
    </div>
  );
}