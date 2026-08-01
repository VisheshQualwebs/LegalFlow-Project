import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Feature from "../components/Feature";
import Footer from "../components/Footer";

const Home = () => (
    <div className="min-h-screen bg-[#F6F1E7] text-[#171717]">
        <Navbar />
        <Hero />

        <section className="border-y border-[#D8CDB8] bg-[#EFE8DA]">
            <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap justify-center gap-x-12 gap-y-3 text-sm text-[#665F54]">
                <span>✓ Built for Indian law firms</span>
                <span>✓ Cases & Hearings</span>
                <span>✓ Lawyer Management</span>
                <span>✓ Secure Documents</span>
            </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20">
            <p className="text-xs font-bold tracking-[.2em] uppercase text-[#9A7625]">
                Everything in one place
            </p>
            <h2 className="text-4xl font-bold mt-3">Run your legal workflow smarter.</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
                <Feature n="01" title="Case Management" text="Create, organize and track every case." />
                <Feature n="02" title="Lawyer Assignment" text="Assign cases to the right lawyer." />
                <Feature n="03" title="Hearing Tracking" text="Never lose track of important dates." />
                <Feature n="04" title="Documents" text="Keep every case document organized." />
            </div>
        </section>

        <section className="bg-[#171717] text-white">
            <div className="max-w-7xl mx-auto px-6 py-20 text-center">
                <p className="text-xs tracking-[.2em] uppercase text-[#C49A3A]">LegalFlow</p>
                <h2 className="text-4xl md:text-5xl font-bold mt-4">
                    Your legal work. One clear workflow.
                </h2>
                <a href="/signup" className="inline-flex mt-8 px-7 py-3.5 rounded-full bg-[#F6F1E7] text-[#171717] font-semibold hover:bg-white">
                    Create your account →
                </a>
            </div>
        </section>

        <Footer />
    </div>
);

export default Home;