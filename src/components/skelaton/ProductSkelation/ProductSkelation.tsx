export default function ProductSkeleton() {
    return (
        <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 animate-pulse space-y-4 shadow-xl">
            {/* ইমেজ স্কেলেটন */}
            <div className="w-full h-48 bg-zinc-800 rounded-xl" />

            {/* ব্র্যান্ড ও ক্যাটাগরি স্কেলেটন */}
            <div className="flex justify-between items-center">
                <div className="h-4 w-16 bg-zinc-800 rounded-full" />
                <div className="h-4 w-12 bg-zinc-800 rounded-full" />
            </div>

            {/* টাইটেল স্কেলেটন */}
            <div className="space-y-2">
                <div className="h-4 w-full bg-zinc-800 rounded-md" />
                <div className="h-4 w-2/3 bg-zinc-800 rounded-md" />
            </div>

            {/* প্রাইস ও বাটন স্কেলেটন */}
            <div className="pt-2 flex justify-between items-center border-t border-zinc-800">
                <div className="h-6 w-20 bg-zinc-800 rounded-md" />
                <div className="h-9 w-24 bg-zinc-800 rounded-xl" />
            </div>
        </div>
    );
}