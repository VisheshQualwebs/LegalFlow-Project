const StatusBar = ({ label, value = 0, total = 0 }) => {
    const percentage = total ? (value / total) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between mb-2">
                <span className="text-gray-600">{label}</span>
                <span className="font-semibold">{value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
};

export default StatusBar;