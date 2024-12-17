import connect from "@/lib/db"
import User from "@/lib/modals/user";
import { NextResponse } from "next/server"


export const GET = async()=>{
    try{
        await connect();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users));
    }
    catch (error: unknown) {
        let errorMessage = "Unknown error occurred";
        
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "string") {
            errorMessage = error;
        }
    
        return new NextResponse("Error fetching data: " + errorMessage, { status: 500 });
    }
}