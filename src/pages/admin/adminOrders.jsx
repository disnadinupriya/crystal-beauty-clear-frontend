import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";


export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [modelIsDisplaing, setModelIsDisplaing] = useState(false);
  const [displaingOrder, setDisplaingOrder] = useState(null);

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
  /*{
    "_id": "6905d599b21a55836a3b3c13",
    "orderId": "ORD0022",
    "email": "gayan1@gmail.com",
    "name": "disna",
    "address": "maho",
    "status": "Pending",
    "phoneNumber": "0784773387",
    "billItems": [
        {
            "productid": "1122121121211212",
            "ProductName": "5",
            "Image": "https://guaxykwlwvybejqayzfg.supabase.co/storage/v1/object/public/images/1754824223159cosmatic%20(3).jpeg",
            "quantity": 1,
            "price": 5,
            "_id": "6905d599b21a55836a3b3c14"
        }
    ],
    "total": 5,
    "date": "2025-11-01T09:40:41.227Z",
    "__v": 0
}*/
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-white py-10 px-6">
      {loaded ? (
        <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            📦 All Orders
          </h1>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-xl">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Customer Email
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Customer Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">Address</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Phone Number
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="border-b hover:bg-blue-50 transition duration-200 text-center cursor-pointer"
                    onClick={() => {
                      setModelIsDisplaing(true);
                      setDisplaingOrder(order);
                    }}
                  >
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {order.orderId}
                    </td>
                    <td className="px-4 py-3">{order.email}</td>
                    <td className="px-4 py-3">{order.name}</td>
                    <td className="px-4 py-3">{order.address}</td>
                    <td className="px-4 py-3">{order.phoneNumber}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-semibold text-blue-700">
                      LKR {order.total}.00
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {modelIsDisplaing && (
              <div className="fixed bg-[#00000090] w-full h-full top-0 left-0 flex justify-center items-center">
                <div className="bg-white rounded-lg w-[600px] h-[600px] relative max-w-[600px] max-h-[600px] overflow-hidden">
                  <div className="w-full bg-red-400 p-6">
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
