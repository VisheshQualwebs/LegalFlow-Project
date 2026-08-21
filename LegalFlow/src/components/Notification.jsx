import { useState } from "react";
import { FaBell } from "react-icons/fa";

const Notification = () => {
    const [bar, setBar] = useState(false);

    return (
        <div>
            <button onClick={() => setBar((prev) => !prev)} className="text-black text-2xl px-5 py-2 hover:cursor-pointer">
                <FaBell title='Notification' />
            </button>
            {bar && (
                <div className="absolute right-5 top-12 z-[50] w-64 h-100 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between px-3 py-2 border-b">
                        <h3 className="text-black text-sm font-semibold">Notifications</h3>
                        <button className="text-gray-400 hover:bg-red-500 hover:text-black px-1 py-1" onClick={() => setBar(false)}>X</button>
                    </div>
                    <div className="px-3 py-2">
                        <p className="text-xs text-gray-400">No new notifications</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Notification
