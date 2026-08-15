import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import IncomingCall from "../pages/IncomingCall";
import useAuth from "../hooks/useAuth";

const DashboardLayout = () => {
    const { user } = useAuth();
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
                <Navbar />
                <main className="flex-1 px-12 py-10">
                    <div className="mx-auto w-full max-w-[1280px]">
                        <Outlet />
                    </div>
                </main>
                <Footer />
            </div>
            {user && (user.role === "lawyer" || user.role === "client") && (
                <IncomingCall user={user} />
            )}
        </div>
    );
};

export default DashboardLayout;