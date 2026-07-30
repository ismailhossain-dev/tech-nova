import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import {
    ShieldCheck,
    Truck,
    CreditCard,
    RotateCcw,
    Headphones,
    Award,
    ArrowRight,
    Sparkles,
} from "lucide-react";

async function getStats() {
    try {
        const [productCount, brandCount] = await Promise.all([
            prisma.product.count({ where: { status: "PUBLISHED" } }),
            prisma.brand.count(),
        ]);

        return {
            products: productCount > 0 ? `${productCount.toLocaleString()}+` : "10,000+",
            brands: brandCount > 0 ? `${brandCount.toLocaleString()}+` : "15+",
        };
    } catch (error) {
        console.error("Failed to fetch stats for About page:", error);
        return {
            products: "10,000+",
            brands: "15+",
        };
    }
}

export default async function AboutPage() {
    const statsData = await getStats();

    const stats = [
        { label: "Products Available", value: statsData.products },
        { label: "Happy Customers", value: "50,000+" },
        { label: "Top Brands", value: statsData.brands },
        { label: "Customer Support", value: "24/7" },
    ];

    const valueProps = [
        {
            icon: ShieldCheck,
            title: "100% Genuine Products",
            description: "All items come with official manufacturer warranty and guaranteed authenticity.",
        },
        {
            icon: Truck,
            title: "Fast & Express Shipping",
            description: "Get your favorite gadgets delivered to your doorstep in record time with full tracking.",
        },
        {
            icon: CreditCard,
            title: "Secure Payments & COD",
            description: "Multiple safe payment options including SSLCommerz, Stripe, and Cash on Delivery.",
        },
        {
            icon: RotateCcw,
            title: "7-Day Easy Return",
            description: "Hassle-free replacement or return policy if you receive a damaged or defective product.",
        },
        {
            icon: Headphones,
            title: "24/7 Dedicated Support",
            description: "Our expert tech team is always ready to assist you with any query, anytime.",
        },
        {
            icon: Award,
            title: "Best Price Guarantee",
            description: "Competitive pricing on all the latest laptops, smartphones, and accessories.",
        },
    ];

    const teamMembers = [
        {
            name: "Alex Johnson",
            role: "Founder & CEO",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        },
        {
            name: "Sarah Chen",
            role: "Head of Operations",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
        },
        {
            name: "Michael Brown",
            role: "Lead Tech Specialist",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        },
    ];

    return (
        <div className="min-h-screen bg-[#181818] text-white font-sans selection:bg-blue-600 selection:text-white">

            {/* 1. HERO SECTION */}
            <section className="relative overflow-hidden border-b border-zinc-800/80 bg-gradient-to-b from-blue-950/20 via-transparent to-transparent py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-600/10 blur-3xl pointer-events-none rounded-full" />

                <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-800/50 text-blue-400 text-xs sm:text-sm font-semibold tracking-wide uppercase">
                        <Sparkles className="w-4 h-4" />
                        <span>About TechNova</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15]">
                        Empowering Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Digital Lifestyle</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
                        Your premier destination for genuine electronics, next-gen laptops, and smart gadgets backed by unmatched customer service.
                    </p>
                </div>
            </section>

            {/* 2. OUR STORY SECTION */}
            <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <div className="bg-[#202020] p-8 sm:p-12 rounded-3xl border border-zinc-800/80 shadow-xl space-y-6 text-zinc-300 leading-relaxed text-base sm:text-lg">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight border-b border-zinc-800 pb-4">
                        Our Story
                    </h2>
                    <p>
                        Founded with a passion for innovation and technology, TechNova started as a small tech store dedicated to bridging the gap between cutting-edge technology and tech enthusiasts. We believed that everyone deserves access to authentic, high-quality electronics without the worry of counterfeit products or poor customer service.
                    </p>
                    <p>
                        Over the years, we have grown into one of the most trusted e-commerce platforms for laptops, smartphones, wearables, and gaming gear. By partnering directly with top global brands like Apple, Samsung, Sony, ASUS, and Dell, we ensure that every product delivered is 100% genuine and fully backed by official warranties.
                    </p>
                    <p>
                        Our mission remains simple: to deliver the future of technology directly to your hands with transparency, competitive pricing, and an unwavering commitment to customer satisfaction.
                    </p>
                </div>
            </section>

            {/* 3. STATS BAR */}
            <section className="bg-[#121212] border-y border-zinc-800/80 py-14 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
                    {stats.map((stat, idx) => (
                        <div
                            key={idx}
                            className="p-6 rounded-2xl bg-[#202020] border border-zinc-800/80 shadow-md hover:border-zinc-700 transition-all space-y-2"
                        >
                            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-400 tracking-tight">
                                {stat.value}
                            </div>
                            <div className="text-xs sm:text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. WHY CHOOSE US */}
            <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        Why Choose TechNova?
                    </h2>
                    <p className="text-zinc-400 text-base">
                        We provide an end-to-end shopping experience built around trust, speed, and reliability.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {valueProps.map((prop, idx) => {
                        const Icon = prop.icon;
                        return (
                            <div
                                key={idx}
                                className="group bg-[#202020] p-8 rounded-3xl border border-zinc-800/80 shadow-md hover:shadow-2xl hover:border-blue-500/40 transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-blue-950/60 border border-blue-800/40 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                    <Icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">
                                    {prop.title}
                                </h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    {prop.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 5. OUR TEAM */}
            <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800/80">
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        Meet Our Leadership
                    </h2>
                    <p className="text-zinc-400 text-base">
                        The passionate team behind TechNova’s vision and day-to-day operations.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {teamMembers.map((member, idx) => (
                        <div
                            key={idx}
                            className="group bg-[#202020] rounded-3xl border border-zinc-800/80 overflow-hidden text-center shadow-md hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="relative w-full h-72 bg-zinc-900 overflow-hidden">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    unoptimized
                                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white">
                                    {member.name}
                                </h3>
                                <p className="text-xs font-bold text-blue-400 mt-1 uppercase tracking-wider">
                                    {member.role}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 6. CTA BANNER */}
            <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#121212] text-white border-t border-zinc-800/80">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                        Ready to Upgrade Your Tech?
                    </h2>
                    <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                        Explore our vast collection of original electronics, laptops, and gadgets with exclusive deals today.
                    </p>
                    <div>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105"
                        >
                            Ready to Shop <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}