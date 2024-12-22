import connect from "@/lib/db";
import Category from "@/lib/modals/category";
import User from "@/lib/modals/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";


export const GET = async(request:Request)=>{
    try{
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get('userId');

        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message:"Invalid user ID"}), {
                status: 400,
            });
        }
        await connect();

        const user = await User.findById(userId);
        if(!user){
            return new NextResponse(JSON.stringify({message:"User not found"}), {
                status: 404,
            });
        }

        const categories = await Category.find(
            {
                user: new Types.ObjectId(userId)
            }
        )
        return new NextResponse(JSON.stringify(categories), { status: 200 });
    }
    catch (err: unknown) {
            // Check if err is an instance of Error to safely access message
            const errorMessage = err instanceof Error ? err.message : "Unknown error";
            return new NextResponse("Error creating user: " + errorMessage, {
              status: 500,
            });
          }
        }