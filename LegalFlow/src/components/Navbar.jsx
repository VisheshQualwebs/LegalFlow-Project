import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MessageModal from "./MessageModal";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { useTranslation } from "react-i18next";

const Navbar = () => {
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const { t, i18n } = useTranslation();

    const handleLogout = () => {
        setMessage(t("navbar.logoutConfirm"));
        setMessageType("confirm");
    };

    const handleConfirmLogout = () => {
        try {
            dispatch(logout());
            setMessage("");
            setMessageType("");
            navigate("/");
        } catch (error) {
            console.log(error);
            setMessage(t("navbar.logoutFailed"));
            setMessageType("error");
        }
    }

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
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
                    <div>
                        <h1 className="text-3xl font-bold">
                            {t("navbar.welcome")} {user?.fullName}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <select value={i18n.resolvedLanguage} onChange={(e) => changeLanguage(e.target.value)} className="border rounded px-2 py-1">
                            <option value="en">English</option>
                            <option value="hi">हिंदी</option>
                            <option value="he">Hinglish</option>
                        </select>
                        <button onClick={handleLogout} className="bg-red-600 text-white px-5 py-2 rounded">
                            {t("navbar.logout")}
                        </button>
                    </div>
                </div>
            )}
            {message && (
                <MessageModal message={message} type={messageType}
                    onClose={() => setMessage("")}
                    onConfirm={handleConfirmLogout} confirmText={t("navbar.logout")} />
            )}
        </div>
    );
};

export default Navbar;