import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";


export default function adminOrdersPage() {
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
              <div
                className="fixed bg-[#00000090] w-full h-full top-0 left-0 flex justify-center items-center
                        "
              >
                <div className="bg-white p-6 rounded-lg w-[600px] h-[600px] relative max-w-[600px] max-h-[600px] ">
                  <div className="w-ful h-[200px] bg-red-400">
                    <h1 className="text-2xl font-bold text-white">
                      Order ID : {displaingOrder.orderId}
                    </h1>
                    <h1 className="text-2xl font-bold text-white">
                      Order Date:{" "}
                      {new Date(displaingOrder.date).toLocaleDateString()}
                      <h1 className="text-2xl font-bold text-white">
                        Order Status: {displaingOrder.status}
                      </h1>
                      <h1 className="text-2xl font-bold text-white">
                        Order Total: LKR {displaingOrder.total}.00
                      </h1>
                    </h1>
                  </div>
                  <div className="w-full h-[400px] max-h-[400px] overflow-y-scroll">
                    {displaingOrder.billItems.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="flex justify-between items-center"
                        >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-[100px] h-[100px] object-cover"
                            />
                          <h1 className="text-2xl font-bold text-gray-800">
                            {item.name}
                          </h1>
                          <h1 className="text-2xl font-bold text-gray-800">
                            LKR {item.price}.00
                          </h1>
                          <h1 className="text-2xl font-bold text-gray-800">
                            {item.quantity}
                          </h1>
                          <h1 className="text-2xl font-bold text-gray-800">
                            LKR {item.total}.00
                          </h1>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    className="w-[40px] h-[40px] rounded-full  flex justify-center item-center  shadow-xl
                   shadow-black absolute right-[20px] top-[20px]"
                    onClick={() => {
                      setModelIsDisplaing(false);
                    }}
                  >
                    <IoMdClose />
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
