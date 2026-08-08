import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import leftImage from "../../assets/images/left-side.jpeg";
import MessageModal from "../../components/MessageModal";
import { signup } from "../../services/authService";
import { Skeleton } from "boneyard-js/react";

const Signup = () => {
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        role: "client",
        status: "",
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        barCouncilNumber: "",
        specialization: "",
        experience: "",
    });

    const signupMutation = useMutation({
        mutationFn: (form) => signup(form),
        onSuccess: () => {
            setMessage("Account Created Successfully");
            setMessageType("success");
        },
        onError: (error) => {
            setMessage(error.message || "Unable to Create Account");
            setMessageType("error");
        }
    })

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full Name is required"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone Number is required";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirm Password is required";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (formData.role === "lawyer") {

            if (!formData.barCouncilNumber.trim()) {
                newErrors.barCouncilNumber = "Bar Council Number is required";
            }

            if (!formData.specialization.trim()) {
                newErrors.specialization = "Specialization is required";
            }

            if (!formData.experience) {
                newErrors.experience = "Experience is required";
            }
        }
        return newErrors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        signupMutation.mutate(formData);
        setFormData({
            role: "client",
            status: "",
            fullName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            barCouncilNumber: "",
            specialization: "",
            experience: "",
        })
    };

    return (
        <Skeleton name="login" loading={signupMutation.isPending} color="#e5e5e5" darkColor="#444444" animate="shimmer" shimmerColor="#eeeeee" darkShimmerColor="#555555">
            <div className="bg-gray-200 min-h-screen flex items-center justify-center">
                <div className="w-[1200px] min-h-[700px] rounded-[30px] overflow-hidden shadow-2xl border border-gray-400 grid grid-cols-2">
                    <div className="bg-white flex flex-col items-center justify-center px-16">
                        <img src={leftImage} alt="Left Image" className="w-96 mb-8" />

                        <h1 className="text-5xl font-bold mb-6">Join LegalFlow</h1>

                        <p className="text-center text-gray-600 text-lg leading-8">
                            Create your account to manage legal operations efficiently.
                        </p>
                    </div>

                    <div className="bg-black text-white flex justify-center py-12">
                        <div className="w-[430px]">
                            <h2 className="text-5xl font-bold text-center mb-10">
                                Sign Up
                            </h2>

                            <div className="flex justify-center gap-8 mb-8">
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="role" value="client" checked={formData.role === "client"} onChange={handleChange} />
                                    Client
                                </label>

                                <label className="flex items-center gap-2">
                                    <input type="radio" name="role" value="lawyer" checked={formData.role === "lawyer"} onChange={handleChange} />
                                    Lawyer
                                </label>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange}
                                    className="w-full bg-transparent border border-gray-500 rounded-lg py-4 px-5 placeholder:text-gray-500 focus:outline-none focus:border-white" />
                                {errors.fullName && (<p className="text-red-500 text-sm">{errors.fullName} </p>)}

                                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange}
                                    className="w-full bg-transparent border border-gray-500 rounded-lg py-4 px-5 placeholder:text-gray-500 focus:outline-none focus:border-white" />
                                {errors.email && (<p className="text-red-500 text-sm">{errors.email}</p>)}

                                <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} maxLength={10}
                                    className="w-full bg-transparent border border-gray-500 rounded-lg py-4 px-5 placeholder:text-gray-500 focus:outline-none focus:border-white" />
                                {errors.phone && (<p className="text-red-500 text-sm">{errors.phone}</p>)}

                                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} maxLength={16} minLength={6}
                                    className="w-full bg-transparent border border-gray-500 rounded-lg py-4 px-5 placeholder:text-gray-500 focus:outline-none focus:border-white" />
                                {errors.password && (<p className="text-red-500 text-sm">{errors.password}</p>)}

                                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange}
                                    className="w-full bg-transparent border border-gray-500 rounded-lg py-4 px-5 placeholder:text-gray-500 focus:outline-none focus:border-white" />
                                {errors.confirmPassword && (<p className="text-red-500 text-sm">{errors.confirmPassword}</p>)}

                                {formData.role === "lawyer" && (
                                    <>
                                        <input type="text" name="barCouncilNumber" placeholder="Bar Council Number" value={formData.barCouncilNumber} onChange={handleChange}
                                            className="w-full bg-transparent border border-gray-500 rounded-lg py-4 px-5 placeholder:text-gray-500 focus:outline-none focus:border-white" />
                                        {errors.barCouncilNumber && (<p className="text-red-500 text-sm">{errors.barCouncilNumber}</p>)}

                                        <input type="text" name="specialization" placeholder="Specialization" value={formData.specialization} onChange={handleChange}
                                            className="w-full bg-transparent border border-gray-500 rounded-lg py-4 px-5 placeholder:text-gray-500 focus:outline-none focus:border-white" />
                                        {errors.specialization && (<p className="text-red-500 text-sm">{errors.specialization}</p>)}

                                        <input type="number" name="experience" placeholder="Experience (Years)" value={formData.experience} onChange={handleChange}
                                            className="w-full bg-transparent border border-gray-500 rounded-lg py-4 px-5 placeholder:text-gray-500 focus:outline-none focus:border-white" />
                                        {errors.experience && (<p className="text-red-500 text-sm">{errors.experience}</p>)}
                                    </>
                                )}

                                <button type="submit" className="w-full bg-white text-black font-semibold py-4 rounded-lg hover:bg-gray-300 transition">
                                    Create Account
                                </button>
                                {message && (
                                    <MessageModal message={message} type={messageType}
                                        onClose={() => {
                                            setMessage("");
                                            if (messageType === "success") {
                                                navigate("/login");
                                            }
                                        }}
                                    />
                                )}

                                <p className="text-center text-gray-400 mt-6">
                                    Already have an account?{" "}
                                    <Link to="/login" className="text-white underline">Login</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Skeleton>
    )
}

export default Signup;