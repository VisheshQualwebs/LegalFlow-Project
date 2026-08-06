const Footer = () => {
  return (
    <footer className="bg-[#171717] text-[#A9A194] border-t border-[#38342E] px-6 py-6 flex justify-between text-sm">
      <b className="text-white">
        LegalFlow.
      </b>
      <span>
        © {new Date().getFullYear()} LegalFlow
      </span>
    </footer>
  );
};

export default Footer;