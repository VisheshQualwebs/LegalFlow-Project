import { useState } from "react";
import { useNavigate } from "react-router-dom";

import caseService from "../services/caseService";

const CreateCase = () => {

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        }


        if (!formData.caseType) {
            newErrors.caseType = "Case Type is required";
        }

        if (!formData.file) {
            newErrors.file = "File is required";
        }

        return newErrors;
    };


    const [formData, setFormData] = useState({
        title: "",
        description: "",
        caseType: "",
        file: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        const maxFileSize = 1048576;

        if (files) {
            const file = files[0];

            if (file) {

                if (!file) return;

                const allowedTypes = ["application/pdf"];

                if (file.size > maxFileSize) {
                    setErrors({ file: 'File size must be less than 1MB.' });
                    e.target.value = "";
                    return;
                }
                if (!allowedTypes.includes(file.type)) {
                    alert("Only Pdf files are allowed.")
                    e.target.value = "";
                    return;
                }
            }
            setErrors((prev) => ({
                ...prev,
                file: ""
            }));

            setFormData((prev) => ({
                ...prev,
                [name]: file,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        const data = new FormData();

        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("caseType", formData.caseType);
        data.append("file", formData.file);

        try {
            await caseService.create(data);

            alert("Case Registered Successfully");

            navigate("/my-cases");
        } catch (error) {
            alert(error.message || "Unable to create case");
        }

    };

    return (
        <div className="flex justify-center bg-gray-100 p-3">
            <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">
                        Register New Case
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Fill the case details.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <input type="text" name="title" placeholder="Case Title" value={formData.title}
                        onChange={handleChange} className="w-full border p-3 rounded-2xl" />
                    {errors.title && (
                        <p className="text-red-500 text-sm mb-4">
                            {errors.title}
                        </p>
                    )}

                    <textarea name="description" placeholder="Description" value={formData.description}
                        onChange={handleChange} className="w-full border p-3 rounded-2xl" />
                    {errors.description && (
                        <p className="text-red-500 text-sm mb-4">
                            {errors.description}
                        </p>
                    )}

                    <select name="caseType" value={formData.caseType} onChange={handleChange} className="w-full border p-3 rounded-2xl" >
                        <option value="">Select Case Type</option>
                        <option value="Civil">Civil</option>
                        <option value="Criminal">Criminal</option>
                        <option value="Family">Family</option>
                        <option value="Property">Property</option>
                        <option value="Corporate">Corporate</option>
                    </select>

                    {errors.caseType && (
                        <p className="text-red-500 text-sm">
                            {errors.caseType}
                        </p>
                    )}

                    <div className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center">
                        <label htmlFor="file" className="cursor-pointer font-medium">
                            {formData.file ? `${formData.file.name}` : "Upload Supporting Document (PDF)"}
                        </label>

                        <p className="text-xs text-gray-500 mt-2">
                            Upload FIR, Notice, Agreement, Evidence, or other supporting document.
                        </p>
                    </div>

                    <input id="file" type="file" name="file" accept=".pdf" onChange={handleChange} className="hidden" />

                    {errors.file && (
                        <p className="text-red-500 text-sm">
                            * {errors.file}
                        </p>
                    )}


                    <div className="flex justify-center">
                        <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition">
                            Create Case
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCase;