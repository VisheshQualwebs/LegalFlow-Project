import { useState } from "react";
import { signup } from "../services/authService";
import MessageModal from "../components/MessageModal";

function Settings() {
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "admin",
    })

    const [error, setError] = useState({});

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const validateForm = () => {
        const newerror = {};
        if (!form.email.trim()) {
            newerror.email = "Email is required";
        }

        if (!form.fullName.trim()) {
            newerror.fullName = "Name is required";
        }

        if (!form.phone.trim()) {
            newerror.phone = "Phone Number is required";
        } else if (form.phone.length !== 10) {
            newerror.phone = "Enter a Valid Phone Number";
        }

        if (!form.password.trim()) {
            newerror.password = "Password is required";
        } else if (form.password.length < 6) {
            newerror.password = "Password must be at least 6 characters";
        }

        if (!form.confirmPassword.trim()) {
            newerror.confirmPassword = "Confirm Password is required";
        } else if (form.password !== form.confirmPassword) {
            newerror.confirmPassword = "Password do not matched"
        }
        return newerror;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationerror = validateForm();

        if (Object.keys(validationerror).length > 0) {
            setError(validationerror);
            return;
        }

        setError({});

        try {
            const response = await signup(form);
            // alert("Admin Added Successfully");
            setMessage(response.data.message || "Admin Added Successfully");
            setMessageType("success");
            setForm({
                fullName: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: "",
                role: "admin",
            });
        } catch (error) {
            console.error("Error adding admin:", error);
            // alert(error.response?.data?.message || "Failed to add admin. Please try again.");
            setMessage(error.response?.data?.message || "Failed to add admin. Please try again.");
            setMessageType("error");
        }
    }

    return (
        <div>
            <div className="w-full max-w-lg">
                <h1 className="text-3xl font-bold mb-6">Add Admin</h1>
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-5">
                    <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Enter Name" className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    {error.fullName && (<p className="text-red-500 text-sm">{error.fullName} </p>)}

                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter Email" className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    {error.email && (<p className="text-red-500 text-sm">{error.email} </p>)}

                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Enter Phone No." minLength={10} maxLength={10} className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    {error.phone && (<p className="text-red-500 text-sm">{error.phone} </p>)}

                    <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Enter Password" minLength={6} className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    {error.password && (<p className="text-red-500 text-sm">{error.password} </p>)}

                    <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    {error.confirmPassword && (<p className="text-red-500 text-sm">{error.confirmPassword} </p>)}

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">Add</button>
                </form>
                {message && (<MessageModal message={message} type={messageType} onClose={() => setMessage("")} />)}
            </div>
        </div>
    )
}

export default Settings;