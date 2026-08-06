import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MessageModal from "./MessageModal";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

const Navbar = () => {
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const handleLogout = () => {
        setMessage("Are you sure you want to logout?");
        setMessageType("confirm");
    }

    const handleConfirmLogout = () => {
        try {
            dispatch(logout());
            setMessage("");
            setMessageType("");
            navigate("/");
        } catch (error) {
            console.log(error);
            setMessage("Failed to logout");
            setMessageType("error");
        }
    }

    return (
        <div>
            {!user ? (
                <header className="border-b border-[#D8CDB8] bg-[#F6F1E7]">
                    <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                        <Link to="/" className="text-xl font-bold">LegalFlow<span className="text-[#C49A3A]">.</span></Link>
                        <div className="flex gap-3">
                            <Link to="/login" className="px-5 py-2.5 rounded-full border border-[#B8AA91] text-sm">
                                Login
                            </Link>
                            <Link to="/signup" className="px-5 py-2.5 rounded-full bg-[#171717] text-white text-sm font-semibold">
                                Get Started →
                            </Link>
                        </div>
                    </nav>
                </header>
            ) : (
                <div className="bg-white shadow p-5 flex justify-between items-center">
                    <h1 className="text-3xl font-bold">
                        Welcome, {user?.fullName}
                    </h1>

                    <button onClick={handleLogout} className="bg-red-600 text-white px-5 py-2 rounded">
                        Logout
                    </button>
                </div>
            )}
            {message && (
                <MessageModal message={message} type={messageType}
                    onClose={() => setMessage("")}
                    onConfirm={handleConfirmLogout} confirmText="Logout" />
            )}
        </div>
    );
};

export default Navbar;