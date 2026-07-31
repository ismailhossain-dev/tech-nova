"use client";

import React from 'react';
// Swiper React কম্পোনেন্ট ইমপোর্ট
import { Swiper, SwiperSlide } from 'swiper/react';

// Swiper এর স্টাইলসমূহ
import 'swiper/css';

// Autoplay মডিউল ইমপোর্ট
import { Autoplay } from 'swiper/modules';

export default function LogoSlide() {
    // লোগোর ডাটা অ্যারো
    const logos = [
        { id: 1, src: "/logo/airdad.png", alt: "airdad logo 1" },
        { id: 2, src: "/logo/coinbuild.png", alt: "airdad logo 2" },
        { id: 3, src: "/logo/dinnabble.png", alt: "airdad logo 3" },
        { id: 4, src: "/logo/inalagirom.png", alt: "airdad logo 4" },
        { id: 5, src: "/logo/neetflex.png", alt: "airdad logo 5" },
        { id: 6, src: "/logo/pincorest.png", alt: "airdad logo 6" },
    ];

    return (
        <div className="w-full  py-8 border-y border-zinc-800 my-6">
            <div className="max-w-7xl mx-auto px-4">
                <Swiper
                    slidesPerView={2}
                    spaceBetween={30}
                    loop={true}
                    speed={2000} // স্মুথ এবং অবিরাম স্ক্রোল করার গতি
                    autoplay={{
                        delay: 0,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true, // মাউস নিলে স্লাইড থমে যাবে
                    }}
                    breakpoints={{
                        640: {
                            slidesPerView: 3,
                            spaceBetween: 40,
                        },
                        768: {
                            slidesPerView: 4,
                            spaceBetween: 50,
                        },
                        1024: {
                            slidesPerView: 5,
                            spaceBetween: 50,
                        },
                    }}
                    modules={[Autoplay]}
                    className="mySwiper flex items-center ease-linear"
                >
                    {logos.map((logo) => (
                        <SwiperSlide key={logo.id} className="flex items-center justify-center">
                            <div className="flex items-center justify-center p-3 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                                <img
                                    src={logo.src}
                                    alt={logo.alt}
                                    className="h-10 md:h-12 w-auto object-contain"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}