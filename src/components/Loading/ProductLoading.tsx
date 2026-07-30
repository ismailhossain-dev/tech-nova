import { Loader2 } from "lucide-react";

export default function ProductLoading() {
    return (
        <div className="min-h-[60vh] w-full flex flex-col items-center justify-center space-y-4 ">

            {/* Brand Logo & Glowing Spinner Wrapper */}
            <div className="relative flex items-center justify-center">
                {/* Outer Animated Glowing Ring */}
                <div className="absolute h-20 w-20 rounded-full bg-blue-500/20 dark:bg-blue-600/30 blur-xl animate-pulse" />

                {/* Spinning Lucide Icon */}
                <Loader2 className="h-12 w-12 text-blue-600 dark:text-blue-500 animate-spin" />
            </div>

            {/* Brand Name with Pulse Animation */}
            <div className="flex flex-col items-center space-y-1">
                <h2 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    TechNova
                </h2>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 animate-pulse">
                    Fetching awesome tech...
                </p>
            </div>

        </div>
    );
}