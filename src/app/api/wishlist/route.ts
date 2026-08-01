import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server"
export async function POST(req: Request) {

    const body = await req.json();


    const user = await prisma.user.create({

        data: {
            name: body.name,
            email: body.email,

        }

    });


    return NextResponse.json({
        message: "User created successfully",
        data: user
    });

}

// export async function GET(req: Request) {
//     try {

//     } catch (error) {
//         console.log(error)
//         return NextResponse.json(
//             {
//                 message: "Wihlist GET filed",
//             },
//             { status: 500 }
//         )
//     }
// }

// export async function DELETE(req: Request) {
//     try {

//     } catch (error) {
//         console.log(error)
//         return NextResponse.json(
//             {
//                 message: "Wihlist delete filed",
//             },
//             { status: 500 }
//         )
//     }
// }