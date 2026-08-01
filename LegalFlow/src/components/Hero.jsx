import { Link } from "react-router-dom";
import Stat from "./Stat";

const Hero = () => (
    <section className="max-w-7xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-16 items-center">
        <div>
            <p className="text-xs font-bold tracking-[.2em] uppercase text-[#9A7625] mb-6">
                Legal Case Management
            </p>
            <h1 className="text-5xl md:text-6xl font-bold leading-[1] tracking-tight">
                Your cases deserve better than spreadsheets.
            </h1>
            <p className="mt-7 text-lg text-[#665F54] max-w-xl leading-relaxed">
                AI-powered case management for Indian law firms. Manage cases, lawyers,
                hearings and documents in one place.
            </p>
            <Link to="/signup" className="inline-flex mt-9 px-7 py-3.5 rounded-full bg-[#171717] text-white font-semibold">
                Get Started Free →
            </Link>
        </div>

        <div className="bg-[#FFFDF8] border border-[#D8CDB8] rounded-3xl p-5 shadow-xl">
            <div className="border border-[#D8CDB8] rounded-2xl overflow-hidden">
                <div className="bg-[#EFE8DA] px-5 py-3 flex gap-2">
                    <i className="w-2.5 h-2.5 rounded-full bg-[#C49A3A]" />
                    <i className="w-2.5 h-2.5 rounded-full bg-[#B8AA91]" />
                    <i className="w-2.5 h-2.5 rounded-full bg-[#B8AA91]" />
                </div>

                <div className="p-6">
                    <p className="text-sm text-[#776F62]">Welcome back, Legal Team</p>
                    <h2 className="text-2xl font-bold mt-1">Your Dashboard</h2>

                    <div className="grid grid-cols-3 gap-3 mt-7">
                        <Stat value="128" label="Cases" />
                        <Stat value="12" label="Hearings" />
                        <Stat value="246" label="Documents" />
                    </div>

                    <div className="mt-5 h-28 rounded-xl bg-[#F3EDE2] border border-[#E1D7C6] p-4">
                        <p className="text-xs text-[#776F62]">Upcoming Hearing</p>
                        <p className="font-semibold mt-2">Sharma vs. Verma</p>
                        <p className="text-xs text-[#9A7625] mt-1">Today · 10:30 AM</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default Hero;