import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
    ShieldCheck,
    Truck,
    CreditCard,
    RotateCcw,
    Headphones,
    Award,
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
            description: "All items come with official manufacturer warranty and coverage.",
        },
        {
            icon: Truck,
            title: "Fast & Express Shipping",
            description: "Get your favorite gadgets delivered to your doorstep in record time.",
        },
        {
            icon: CreditCard,
            title: "Secure Payments & COD",
            description: "Multiple payment options including SSLCommerz, Stripe, and Cash on Delivery.",
        },
        {
            icon: RotateCcw,
            title: "7-Day Easy Return",
            description: "Hassle-free replacement or return policy if you receive a defective product.",
        },
        {
            icon: Headphones,
            title: "24/7 Live Support",
            description: "Our dedicated support team is always ready to assist you anytime.",
        },
        {
            icon: Award,
            title: "Best Price Guarantee",
            description: "Competitive pricing on all latest laptops, smartphones, and accessories.",
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
        <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans">

            {/* 1. HERO SECTION */}
            <section className="relative overflow-hidden bg-gradient-to-b from-blue-600/10 via-transparent to-transparent dark:from-blue-900/20 py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-5xl mx-auto text-center space-y-4">
                    <span className="text-xs sm:text-sm font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                        About TechNova
                    </span>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                        Empowering Your Digital Lifestyle
                    </h1>
                    <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto font-normal">
                        Your premier destination for genuine electronics, next-gen laptops, and smart gadgets backed by unmatched customer support.
                    </p>
                </div>
            </section>

            {/* 2. OUR STORY SECTION */}
            <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <div className="space-y-6 text-zinc-600 dark:text-zinc-300 leading-relaxed text-base sm:text-lg">
                    <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-6">
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
            <section className="bg-zinc-100 dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="space-y-1">
                            <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                                {stat.value}
                            </div>
                            <div className="text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. WHY CHOOSE US */}
            <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
                        Why Choose TechNova?
                    </h2>
                    <p className="mt-3 text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
                        We provide an end-to-end shopping experience built around trust, speed, and reliability.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {valueProps.map((prop, idx) => {
                        const Icon = prop.icon;
                        return (
                            <div
                                key={idx}
                                className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/50 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                                    {prop.title}
                                </h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    {prop.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 5. OUR TEAM (OPTIONAL) */}
            <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-200 dark:border-zinc-800">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
                        Meet Our Leadership
                    </h2>
                    <p className="mt-3 text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
                        The passionate team behind TechNova’s vision and day-to-day operations.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {teamMembers.map((member, idx) => (
                        <div
                            key={idx}
                            className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden text-center shadow-sm"
                        >
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-64 object-cover object-center"
                            />
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                                    {member.name}
                                </h3>
                                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1 uppercase">
                                    {member.role}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 6. CTA BANNER */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-zinc-900 text-white dark:bg-zinc-900/50 dark:border-t dark:border-zinc-800">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        Ready to Upgrade Your Tech?
                    </h2>
                    <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto">
                        Explore our vast collection of original electronics, laptops, and gadgets with exclusive deals today.
                    </p>
                    <div>
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-blue-600/25"
                        >
                            Ready to Shop
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}