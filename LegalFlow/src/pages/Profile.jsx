import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "boneyard-js/react";
import { useEffect, useState } from "react";
import MessageModal from "../components/MessageModal";
import useAuth from "../hooks/useAuth";
import userService from "../services/userService";

function Profile() {
    const { user } = useAuth();
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const queryClient = useQueryClient();
    const [profile, setProfile] = useState({
        fullName: "",
        phone: "",
        barCouncilNumber: "",
        specialization: "",
        experience: "",
        password: "",
        confirmPassword: "",
    });

    const { data: profileData, isLoading: loading, isError, error } = useQuery({
        queryKey: ["user-profile", user?.id],
        queryFn: async () => {
            const response = await userService.read(user.id);
            return response.data.data;
        },
        enabled: !!user?.id,
    });

    useEffect(() => {
        if (!profileData) return;
        setProfile((prev) => ({
            ...prev,
            ...profileData,
            password: "",
            confirmPassword: "",
        }))
    }, [profileData]);

    const updateProfileMutation = useMutation({
        mutationFn: (payload) => {
            return userService.update(user.id, payload);
        },
        onSuccess: () => {
            setProfile((prev) => ({
                ...prev,
                password: "",
                confirmPassword: "",
            }));
            setMessage("Profile Updated Successfully!");
            setMessageType("success");
            queryClient.invalidateQueries({
                queryKey: ["user-profile", user?.id],
            });
        },
        onError: () => {
            setMessage("Failed to update profile");
            setMessageType("error");
        }
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(e.target.name, e.target.value);
        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const maskPhoneNumber = (phone) => {
        if (!phone) return "";
        const digits = String(phone).replace(/\D/g, "");
        if (digits.length !== 10) {
            return digits;
        }
        return `${digits.slice(0, 3)}****${digits.slice(7)}`;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (profile.password && profile.password !== profile.confirmPassword) {
            // alert("Passwords do not match");
            setMessage("Password do not match");
            setMessageType("error");
            return;
        }

        const payload = {
            fullName: profile.fullName,
            phone: profile.phone,
        };

        if (profile.specialization) {
            payload.specialization = profile.specialization;
        }

        if (profile.experience) {
            payload.experience = profile.experience;
        }

        if (profile.password) {
            payload.password = profile.password;
        }
        updateProfileMutation.mutate(payload);
    };

    if (isError) {
        return (
            <div className="text-red-500">
                {error.response?.data?.message || "Failed to load profile"}
            </div>
        )
    }

    return (
        <Skeleton name="profile-page" loading={loading} color="#e5e5e5" darkColor="#444444" animate="shimmer" shimmerColor="#eeeeee" darkShimmerColor="#555555">
            <div>
                <h1 className="text-3xl font-bold mb-6">
                    My Profile
                </h1>
                <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-xl shadow p-6 space-y-5">
                    <div>
                        <label className="block font-medium mb-1">
                            Full Name
                        </label>
                        <input type="text" name="fullName" value={profile.fullName || ""} onChange={handleChange} className="w-full border rounded-lg p-3" />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">
                            Phone Number
                        </label>
                        <input type="text" name="phone" value={maskPhoneNumber(profile.phone)} readOnly className="w-full border rounded-lg p-3" maxLength={10} minLength={10} />
                    </div>

                    {user.role === "lawyer" && (
                        <>
                            <div>
                                <label className="block font-medium mb-1">
                                    Bar Council Number
                                </label>
                                <input type="text" name="barCouncilNumber" value={profile.barCouncilNumber || ""} onChange={handleChange} className="w-full border rounded-lg p-3" />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">
                                    Specialization
                                </label>
                                <input type="text" name="specialization" value={profile.specialization || ""} onChange={handleChange} className="w-full border rounded-lg p-3" />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">
                                    Experience (Years)
                                </label>
                                <input type="text" name="experience" value={profile.experience || ""} onChange={handleChange} className="w-full border rounded-lg p-3" />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="font-medium mb-1">
                            New Password
                        </label>
                        <input type="text" name="password" value={profile.password || ""} onChange={handleChange} className="w-full border rounded-lg p-3" minLength={6} maxLength={16} />
                    </div>

                    <div>
                        <label className="font-medium mb-1">
                            Confirm Password
                        </label>
                        <input type="text" name="confirmPassword" value={profile.confirmPassword || ""} onChange={handleChange} className="w-full border rounded-lg p-3" />
                        {profile.confirmPassword && profile.password !== profile.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                Passwords do not match
                            </p>
                        )}
                    </div>

                    <button type="submit" disabled={updateProfileMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
                        {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                    </button>
                </form>
                {message && (<MessageModal message={message} type={messageType} onClose={() => setMessage("")} />)}
            </div >
        </Skeleton>
    );
}

export default Profile;

// color="#b8b8b8" darkColor="#2f2f2f" animate="shimmer" shimmerColor="#d0d0d0" darkShimmerColor="#4b4b4b"