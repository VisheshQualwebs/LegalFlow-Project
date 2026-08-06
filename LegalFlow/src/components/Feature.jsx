const Feature = ({ n, title, text }) => {
    return (
        <div className="border-t-2 border-[#C49A3A] bg-[#FFFDF8] p-6 rounded-b-xl">
            <span className="text-xs text-[#9A7625] font-bold">
                {n}
            </span>
            <h3 className="font-bold text-lg mt-5">
                {title}
            </h3>
            <p className="text-sm text-[#665F54] mt-2 leading-relaxed">
                {text}
            </p>
        </div>
    );
};

export default Feature;