import { useEffect } from "react";

const MessageModal = ({ message, type = "success", onClose, onConfirm, confirmText = "Confirm", }) => {
    const isConfirm = type === "confirm";
    const isSuccess = type === "success";
    const isError = type === "error"

    useEffect(() => {
        if (!message) return null;
        const handleKeys = (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                if (isConfirm) {
                    onConfirm?.();
                } else {
                    onClose?.();
                }
            }

            if (e.key === "Escape") {
                e.preventDefault();
                onClose?.();
            }
        };
        document.addEventListener("keydown", handleKeys);

        return () => {
            document.removeEventListener("keydown", handleKeys);
        };
    }, [onClose, onConfirm, isConfirm, message]);

    if (!message) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-[350px] rounded-xl bg-white p-6 text-center shadow-xl">
                {/* {(isConfirm || isSuccess) && ( */}
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl font-bold 
                    ${isSuccess ? "bg-green-100 text-green-600" : isError ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"}`}>
                    {isSuccess ? "✓" : isError ? "✕" : "?"}
                </div>
                {/* )} */}
                <h2 className={`mb-2 text-xl font-semibold ${isSuccess ? "text-green-600" : isConfirm ? "text-gray-800" : "text-red-500"}`}>
                    {isSuccess ? "Success" : isConfirm ? "Confirm" : "Error"}
                </h2>
                <p className="mb-5 text-gray-600">{message}</p>
                {isConfirm ? (
                    <div className="flex justify-center gap-3 mb-5">
                        <button type='button' onClick={onConfirm} className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700">{confirmText}</button>
                        <button type='button' onClick={onClose} className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100">Cancel</button>
                    </div>
                ) : (
                    <button type='button' onClick={onClose} className="rounded-lg bg-black px-5 py-2 text-white">OK</button>
                )}
            </div>
        </div>
    )
}

export default MessageModal
