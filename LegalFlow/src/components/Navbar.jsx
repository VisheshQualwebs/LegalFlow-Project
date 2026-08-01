import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {

    let user = null;

    try {
        const storedUser = localStorage.getItem("user");
        if (storedUser && storedUser !== "undefined") {
            user = JSON.parse(storedUser);
        }
    } catch (err) {
        console.error("Invalid user in localStorage:", err);
        localStorage.removeItem("user");
    }

    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (!confirmLogout) return;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
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
        </div>
    );
};

export default Navbar;