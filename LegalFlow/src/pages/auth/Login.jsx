import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import googleLogo from "../../assets/images/google.png";
import leftImage from "../../assets/images/left-side.jpeg";
import MessageModal from "../../components/MessageModal";
import { loginSuccess } from "../../redux/authSlice";
import { login } from "../../services/authService";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        }
        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        try {
            const data = {
                email: formData.email,
                password: formData.password,
            };
            const response = await login(data);
            const { user, token } = response.data;
            dispatch(loginSuccess({ user, token }));
            setMessage(response.data.message || "Login Successfull");
            setMessageType("success")
        } catch (error) {
            setMessage("Invalid Email and Password");
            setMessageType("error")
        } finally {
            setFormData({
                email: "",
                password: "",
            })
        }
    };

    return (
        <div className="bg-gray-200 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-[1200px] min-h-[700px] mx-4 sm:mx-6 lg:mx-8 rounded-[30px] overflow-hidden shadow-2xl border border-gray-400 grid grid-cols-1 lg:grid-cols-2">
                <div className="bg-white flex flex-col items-center justify-center px-6 sm:px-10 lg:px-16 py-12 lg:py-0">
                    <img src={leftImage} alt="Image" className="w-48 sm:w-64 lg:w-96 mb-8" />
                    <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                        Welcome!
                    </h1>

                    <p className="text-center text-gray-600 text-base sm:text-lg leading-7 sm:leading-8 max-w-md">
                        Optimize legal operations with our comprehensive platform,
                        empowering you to automate document creation, efficiently
                        manage contracts, and mitigate risk, all in one streamlined
                        solution.
                    </p>
                </div>


                <div className="bg-black text-white flex items-center justify-center px-6 sm:px-10 py-12 lg:py-0">
                    <div className="w-full max-w-[430px]">
                        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-8 sm:mb-12">                            LegalFlow
                        </h2>

                        <h3 className="text-2xl sm:text-3xl font-semibold text-center mb-2">                            Login
                        </h3>

                        <p className="text-center text-gray-400 mb-10">
                            Welcome back! Please enter your login credentials
                        </p>

                        <form onSubmit={handleSubmit}>
                            <input name="email" placeholder="Email" required value={formData.email} onChange={handleChange}
                                className="w-full bg-transparent border border-gray-500 rounded-lg py-3 px-5 pr-12 text-white placeholder:text-gray-500 focus:outline-none focus:border-white mb-4" />
                            {errors.email && (
                                <p className="text-red-500 text-sm mb-4">
                                    {errors.email}
                                </p>
                            )}

                            <div className="relative mb-4">
                                <input type={showPassword ? "text" : "password"} name="password" placeholder="Password"
                                    required value={formData.password} onChange={handleChange} className="w-full bg-transparent border border-gray-500 rounded-lg py-3 px-5 pr-14 text-white placeholder:text-gray-500 focus:outline-none focus:border-white" />
                                {errors.password && (
                                    <p className="text-red-500 text-sm mb-4">
                                        {errors.password}
                                    </p>
                                )}

                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2">
                                    {showPassword ? "🚫" : "👁"}
                                </button>
                            </div>

                            <div className="flex justify-between items-center mb-8">
                                <Link to="/forgot-password" className="text-sm underline">
                                    Forgot Password?
                                </Link>
                            </div>

                            <button type="submit" className="w-full bg-white text-black font-semibold py-4 rounded-lg hover:bg-gray-300">
                                Login
                            </button>
                            {message && (
                                <MessageModal message={message} type={messageType} confirmText="OK"
                                    onClose={() => {
                                        setMessage("")
                                        if (messageType === "success") {
                                            navigate("/dashboard");
                                        }
                                    }} />
                            )}
                        </form>

                        <button className="w-full border border-gray-500 rounded-lg py-4 mt-6 flex items-center justify-center gap-3 hover:bg-gray-900" onClick={() => alert("Google Login is not enable")} >
                            <img src={googleLogo} alt="Google" className="w-6" />
                            <span>Sign in with Google</span>
                        </button>

                        <p className="text-center mt-8 text-gray-400">
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-white underline">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;


// <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//     <div className="w-[350px] rounded-xl bg-white p-6 text-center shadow-xl">
//         <h2 className={`mb-2 text-xl font-semibold ${messageType === "success" ? "text-green-600" : "text-red-400"}`}>
//             {messageType === "success" ? "Success" : "Login Failed"}
//         </h2>
//         <p className="mb-5 text-gray-600">{message}</p>
//         <button onClick={() => {
//             if (messageType === "success") {
//                 navigate("/dashboard");
//             } setMessage("")
//         }} className="rounded-lg bg-black px-5 py-2 text-white">OK</button>
//     </div>
// </div>