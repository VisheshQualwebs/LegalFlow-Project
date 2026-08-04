import React, { useState } from 'react'

const MessageModal = ({ message, type = "success", onClose, onConfirm, confirmText = "Confirm", }) => {
    if (!message) return null;
    const isConfirm = type === "confirm";
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-[350px] rounded-xl bg-white p-6 text-center shadow-xl">
                <h2 className={`mb-2 text-xl font-semibold ${type === "success" ? "text-green-600" : type === "confirm" ? "text-gray-800" : "text-red-500"}`}>
                    {type === "success" ? "Success" : type === "confirm" ? "Confirm" : "Error"}
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
