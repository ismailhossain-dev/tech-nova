// "use client";

// import { usePathname } from "next/navigation";
// import { Navbar } from "./Navbar";

// export default function NavbarWrapper() {
//     const pathname = usePathname(); // ১. usePathname কল করে বর্তমান পাথ নেওয়া হলো

//     const navLinks = [
//         { href: "/" },
//         { href: "/shop" },
//         { href: "/categories" },
//         { href: "/brands" },
//         { href: "/compare" },
//         { href: "/about" },
//     ];

//     // ২. some() ব্যবহার করে চেক করা হচ্ছে অবজেক্টের href এর সাথে বর্তমান pathname মিলে কি না
//     const shouldShowNavbar = navLinks.some((link) => link.href === pathname);

//     return (
//         <>
//             {shouldShowNavbar && <Navbar />}
//         </>
//     );
// }