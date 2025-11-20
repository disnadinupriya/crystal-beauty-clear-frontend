import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/loader";
import { FaSearch, FaUserPlus, FaTrash, FaUserEdit, FaTimes, FaSave } from "react-icons/fa";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Modal States
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    
    // Selected User for Edit
    const [selectedUser, setSelectedUser] = useState(null);
    const [editFormData, setEditFormData] = useState({
        rol: "user",
        isDisabled: false
    });

    // New User Form State
    const [newUser, setNewUser] = useState({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        phone: "",
        rol: "user"
    });

    const token = localStorage.getItem("token");

    // 1. Fetch Users
    const fetchUsers = () => {
        if (!token) return;
        setIsLoading(true);
        axios.get(import.meta.env.VITE_BACKEND_URL + "/api/user", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
            const usersData = Array.isArray(res.data) ? res.data : (res.data.users || []);
            setUsers(usersData);
            setIsLoading(false);
        })
        .catch((err) => {
            console.error("Error fetching users:", err);
            toast.error("Failed to load users.");
            setIsLoading(false);
        });
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    // 2. Handle Search
    const filteredUsers = users.filter(user => 
        (user.firstName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (user.lastName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    // 3. Add User
    const handleAddUser = (e) => {
        e.preventDefault();
        axios.post(import.meta.env.VITE_BACKEND_URL + "/api/user", newUser, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            toast.success("User added successfully!");
            setShowAddModal(false);
            setNewUser({ email: "", firstName: "", lastName: "", password: "", phone: "", rol: "user" });
            fetchUsers();
        })
        .catch((err) => {
            toast.error(err.response?.data?.message || "Failed to add user");
        });
    };

    // 4. Handle Row Click (Open Edit Modal)
    const handleRowClick = (user) => {
        setSelectedUser(user);
        setEditFormData({
            rol: user.rol,
            isDisabled: user.isDisabled
        });
        setShowEditModal(true);
    };

    // 5. Save Changes (Update User)
    const handleSaveChanges = () => {
        if (!selectedUser) return;

        axios.put(import.meta.env.VITE_BACKEND_URL + "/api/user/" + (selectedUser._id || selectedUser.id), editFormData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            toast.success("User updated successfully");
            setShowEditModal(false);
            fetchUsers(); // Refresh list
        })
        .catch((err) => {
            toast.error("Failed to update user");
            console.error(err);
        });
    };

    // 6. Delete User
    const handleDelete = () => {
        if (!selectedUser) return;
        if (window.confirm(`Are you sure you want to delete ${selectedUser.firstName}?`)) {
            axios.delete(import.meta.env.VITE_BACKEND_URL + "/api/user/" + (selectedUser._id || selectedUser.id), {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(() => {
                toast.success("User deleted");
                setShowEditModal(false);
                setUsers(users.filter(u => (u._id || u.id) !== (selectedUser._id || selectedUser.id)));
            })
            .catch(() => toast.error("Failed to delete user"));
        }
    };

    return (
        <div className="w-full p-6 bg-gray-50 min-h-screen relative">
            {/* --- Header --- */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="bg-blue-600 text-white p-2 rounded-lg text-xl">👥</span>
                    User Management
                </h1>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
                >
                    <FaUserPlus /> Add New User
                </button>
            </div>

            {/* --- Search --- */}
            <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* --- Table --- */}
            {isLoading ? (
                <div className="flex justify-center mt-20"><Loader /></div>
            ) : (
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                <th className="px-5 py-4">User Info</th>
                                <th className="px-5 py-4">Email</th>
                                <th className="px-5 py-4">Role</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4 text-right">Click to Edit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                                <tr 
                                    key={user._id || user.id} 
                                    onClick={() => handleRowClick(user)}
                                    className="hover:bg-blue-50 cursor-pointer transition-colors duration-200"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm">
                                                {user.firstName?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-gray-900 font-semibold capitalize">
                                                    {user.firstName} {user.lastName}
                                                </p>
                                                <p className="text-gray-400 text-xs">{user.phone || "No phone"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-gray-600">
                                        {user.email}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.rol === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                            {user.rol || "user"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isDisabled ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {user.isDisabled ? "Disabled" : "Active"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-right text-gray-400">
                                        <FaUserEdit />
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-5 py-10 text-center text-gray-500">
                                        No users found matching "{searchQuery}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- 1. ADD USER MODAL --- */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
                        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-white text-lg font-bold">Add New User</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white text-2xl">&times;</button>
                        </div>
                        <form onSubmit={handleAddUser} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="text" placeholder="First Name" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newUser.firstName} onChange={e => setNewUser({...newUser, firstName: e.target.value})} />
                                <input required type="text" placeholder="Last Name" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newUser.lastName} onChange={e => setNewUser({...newUser, lastName: e.target.value})} />
                            </div>
                            <input required type="email" placeholder="Email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                            <input required type="tel" placeholder="Phone" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newUser.phone} onChange={e => setNewUser({...newUser, phone: e.target.value})} />
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="password" placeholder="Password" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                                <select className="w-full px-4 py-2 border rounded-lg bg-white"
                                    value={newUser.rol} onChange={e => setNewUser({...newUser, rol: e.target.value})}>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-lg">Create User</button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- 2. EDIT USER POPUP (MODAL) --- */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative">
                        <div className="h-24 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                        <button onClick={() => setShowEditModal(false)} className="absolute top-3 right-3 bg-black/20 hover:bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center transition">
                            <FaTimes />
                        </button>
                        
                        <div className="px-6 pb-6 -mt-12">
                            <div className="flex justify-center mb-4">
                                <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500 shadow-md">
                                    {selectedUser.firstName?.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-gray-800 capitalize">
                                    {selectedUser.firstName} {selectedUser.lastName}
                                </h3>
                                <p className="text-gray-500 text-sm">{selectedUser.email}</p>
                            </div>

                            <div className="space-y-4">
                                {/* --- Change Role --- */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">User Role</label>
                                    <select 
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={editFormData.rol}
                                        onChange={(e) => setEditFormData({...editFormData, rol: e.target.value})}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                {/* --- Change Status --- */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                                    <select 
                                        className={`w-full border rounded-lg px-3 py-2 focus:ring-2 outline-none font-medium ${editFormData.isDisabled ? 'text-red-600 border-red-200 bg-red-50' : 'text-green-600 border-green-200 bg-green-50'}`}
                                        value={editFormData.isDisabled}
                                        onChange={(e) => setEditFormData({...editFormData, isDisabled: e.target.value === "true"})}
                                    >
                                        <option value="false">Active</option>
                                        <option value="true">Disabled / Banned</option>
                                    </select>
                                </div>

                                {/* --- Action Buttons --- */}
                                <div className="flex gap-3 pt-2">
                                    <button 
                                        onClick={handleDelete}
                                        className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 font-medium flex justify-center items-center gap-2 transition"
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                    <button 
                                        onClick={handleSaveChanges}
                                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium flex justify-center items-center gap-2 transition shadow-md"
                                    >
                                        <FaSave /> Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}