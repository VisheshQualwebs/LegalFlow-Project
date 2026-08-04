import { useEffect, useState } from "react";
import userService from "../services/userService";
import useAuth from "../hooks/useAuth";
import { Skeleton } from "boneyard-js/react";

function Profile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState({
        fullName: "",
        phone: "",
        barCouncilNumber: "",
        specialization: "",
        experience: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Effect")
        if (user?.id) {
            loadProfile();
        }
    }, [user?.id]);

    const loadProfile = async () => {
        console.log("loadProfile called");
        try {
            const response = await userService.read(user.id);
            setProfile((prev) => ({
                ...prev,
                ...response.data.data,
                password: "",
                confirmPassword: "",
            }));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(e.target.name, e.target.value);
        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (profile.password && profile.password !== profile.confirmPassword) {
            alert("Passwords do not match");
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

        try {
            await userService.update(user.id, payload);
            alert("Profile updated successfully");
            setProfile((prev) => ({
                ...prev,
                password: "",
                confirmPassword: "",
            }));
            setTimeout(() => {
                setLoading(false)
            }, 2000);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Skeleton name="profile-page" loading={loading}>
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
                        <input type="text" name="phone" value={profile.phone || ""} onChange={handleChange} className="w-full border rounded-lg p-3" maxLength={10} minLength={10} />
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
                        {profile.password && profile.password !== profile.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                Passwords do not match
                            </p>
                        )}
                    </div>

                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
                        Save Changes
                    </button>
                </form>
            </div >
        </Skeleton>
    );
}

export default Profile;

// color="#b8b8b8" darkColor="#2f2f2f" animate="shimmer" shimmerColor="#d0d0d0" darkShimmerColor="#4b4b4b"