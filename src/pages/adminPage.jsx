import { Route,Routes ,Link } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { MdWarehouse } from "react-icons/md";
import { FaFileInvoice } from "react-icons/fa";
import AdminProductsPage from "./admin/Products";
import React from "react";
import { useState } from "react";
import AddProductFrom from "./admin/addProductFrom.jsx";
import EditProduct from "./admin/editProduct.jsx";







export default function AdminPage() {
    return (
        <div className="w-full h-screen bg-gray-300  flex p-2">
           <div className="h-full w-[300px] ">
                <Link to="/admin/users" className ="block p-2 text-red-600 flex item-center " ><FaUsers  className="mr-2 "/> Users</Link>
                <Link to="/admin/products" className="block p-2 text-red-600 flex item-center"><MdWarehouse className="mr-2 "/>Products</Link>
                <Link to="/admin/orders" className="block p-2 text-red-600 flex item-center"><FaFileInvoice className="mr-2 "/> Orders</Link>
           </div>

           <div className="h-full w-[calc(100vw-300px)] bg-white rounded-lg ">
              <Routes path="/*">
                <Route path="/admin" element={<h1>Dashboard</h1>}/>
                <Route path="/users" element={<h1>Users</h1>}/>
                <Route path="/products" element={<AdminProductsPage/>}/>
                <Route path="/orders" element={<h1>Orders</h1>}/>
                <Route path="/addProduct" element={<h1>{<AddProductFrom/>}</h1>}/>
                <Route path="/editProduct/" element={<h1><EditProduct/></h1>}/>
              </Routes>
           </div>
        </div>
    );
}