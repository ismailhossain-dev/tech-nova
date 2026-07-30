"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

export default function Banner() {
    const textRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // GSAP Animation: টেক্সট উপর থেকে নিচে নামবে এবং ফেড-ইন হবে
        if (textRef.current) {
            gsap.fromTo(
                textRef.current.children,
                {
                    y: -40,
                    opacity: 0,
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.2,
                    ease: "power3.out",
                }
            );
        }

        // ইমেজ ডানপাশ থেকে স্মুথলি এন্টার করবে
        if (imageRef.current) {
            gsap.fromTo(
                imageRef.current,
                {
                    x: 50,
                    opacity: 0,
                },
                {
                    x: 0,
                    opacity: 1,
                    duration: 1.2,
                    delay: 0.3,
                    ease: "power3.out",
                }
            );
        }
    }, []);

    return (
        <section className="relative w-full min-h-[420px] md:min-h-[480px] lg:h-[520px] bg-[#181818] border-zinc-800/80 rounded-3xl overflow-hidden flex flex-col md:flex-row items-center justify-between p-6 sm:p-10 lg:p-12 mb-10 gap-6 absolute mt-[-30px]">

            {/* ১. ব্যাকগ্রাউন্ড লাইট স্পট (ইমেজকে বড় ও উজ্জ্বল দেখানোর জন্য) */}
            <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-blue-600/20 blur-[130px] rounded-full pointer-events-none z-0" />

            {/* ২. বাম পাশের টেক্সট কন্টেন্ট */}
            <div
                ref={textRef}
                className="z-10 flex-1 flex flex-col justify-center items-start max-w-xl"
            >
                <span className="px-3.5 py-1 bg-zinc-800/80 border border-zinc-700/50 text-amber-400 text-xs font-semibold uppercase tracking-widest rounded-full mb-4 shadow-inner">
                    Limited Time Offer
                </span>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-300 tracking-tight leading-tight uppercase">
                    End Season <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                        Smartphones
                    </span>
                </h2>

                <p className="mt-3 text-xs sm:text-sm text-zinc-400 uppercase tracking-wider font-medium flex items-center gap-2">
                    Last call for up to{" "}
                    <span className="text-2xl sm:text-3xl font-black text-amber-400">
                        $250
                    </span>{" "}
                    off!
                </p>

                {/* নতুন প্রিমিয়াম গ্লোয়িং বাটন */}
                <Link
                    href="/shop"
                    className="group relative mt-6 sm:mt-8 px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-extrabold text-sm sm:text-base rounded-2xl shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] active:scale-95 transition-all duration-300 flex items-center gap-2 overflow-hidden"
                >
                    <span className="relative z-10">Start Buying</span>
                    <svg
                        className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                    </svg>
                </Link>
            </div>

            {/* ৩. ডান পাশের বড় সাইজের ব্যানার ছবি */}
            <div
                ref={imageRef}
                className="relative z-10 w-full md:w-3/5 h-[320px] sm:h-[400px] md:h-[460px] lg:h-[500px] flex justify-center md:justify-end items-center"
            >
                <div className="relative w-full h-full max-w-[650px] scale-105 sm:scale-110 md:scale-115 transition-transform duration-500">
                    <Image
                        src="/assets/banner.png"
                        alt="End season banner"
                        fill
                        priority
                        className="object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.9)]"
                    />
                </div>
            </div>
        </section>
    );
}