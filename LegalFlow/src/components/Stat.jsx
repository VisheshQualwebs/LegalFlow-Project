const Stat = ({ value, label }) => {
  return (
    <div className="bg-white border border-[#D8CDB8] rounded-xl p-4">
      <b className="text-xl">{value}</b>
      <p className="text-xs text-[#776F62] mt-1">{label}</p>
    </div>
  );
};

export default Stat;