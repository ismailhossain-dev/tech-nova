"use client"
import { useCartStore } from "@/store/useCartStore";
import { Heart } from "lucide-react"
import { useSession } from "next-auth/react";

//typescript data type 
interface WishlistProductType {
    product: {
        id: string,
        name: string,
        slug: string,
        basePrice: number,
        images: string,
        avgRating: number,
        reviewCount: number,
        category: {
            name: string,
            slug: string
        },
        brand: {
            name: string,
            slug: string,

        },
        variants: {
            id: string,
            sku: string,
            price: number,
            stockQuantity: number,
            attributes: string,
        }[]




    }
}

export default function WishlistButton({ product }: WishlistProductType) {
    const { data: session, status } = useSession()
    if (status === "loading") {
        return <p>Loaidng....</p>
    }

    // const isInWishlist = useCartStore((state) => state.isInWishlist(defaultVariant?.id || ""));
    // const toggleWishlist = useCartStore((state) => state.toggleWishlist);

    // const handleToggleWishlist = (e: React.MouseEvent) => {
    //     e.preventDefault();
    //     if (defaultVariant) {
    //         toggleWishlist(defaultVariant.id);
    //     }
    // };

    //wishlist er ei data gola rakbo 
    // email
    // "programmar.miraz@gmail.com"
    // name
    // "miraz"
    // createdAt
    // "2026-07-24T15:46:48.232Z"

    const handleToggleWishlist = () => {
        const { id, basePrice, images, name, avgRating } = product;
        console.log("hello bro", id, basePrice, images, name, avgRating)
    }

    return (
        <div>
            <button
                onClick={handleToggleWishlist}
                aria-label="Wishlist"
                className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/60 backdrop-blur-sm text-zinc-400 hover:text-red-500 transition-colors shadow-sm"
            >
                {/* <Heart
                    className={`w-3.5 h-3.5 ${isInWishlist ? "fill-red-500 text-red-500" : ""
                        }`}
                /> */}
                <Heart />
            </button>
        </div>
    )
}