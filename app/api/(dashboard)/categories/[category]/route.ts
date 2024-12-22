import connect from "@/lib/db";
import Category from "@/lib/modals/category";
import User from "@/lib/modals/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const PATCH = async (request: Request, context: { params: { category: string } }) => {
    const categoryId = context.params.category;//find the categoryId like this
  try {
    const body = await request.json();
    const { title } = body; //fetch the title in the body

    const {searchParams} = new URL(request.url)
    const userId = searchParams.get("userId");

    if(!userId|| !Types.ObjectId.isValid(userId)){
        return new NextResponse(
            JSON.stringify({message:"invalid or missing userId"}), 
            {status:404})
    }
    await connect();
    if(!categoryId|| !Types.ObjectId.isValid(categoryId)){
        return new NextResponse(
            JSON.stringify({message:"invalid or missing categoryId"}), 
            {status:404})
    }
    const user = await User.findById(userId);
    if(!user){
        return new NextResponse(JSON.stringify({message:"User not found"}), {
            status: 404,
        });
    }
    
     const category = await Category.findOne({_id:categoryId, user:user})
    
    if(!category){
        return new NextResponse(JSON.stringify({message:"Category not found"}), {
            status: 404,
        });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        {title},
        {new: true}
    )

    return new NextResponse(
        JSON.stringify({message: "category updated", category: updatedCategory}),
        {status: 200}
    )
   
  } catch (err: unknown) {
    // Check if err is an instance of Error to safely access message
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return new NextResponse("Error updating categories: " + errorMessage, {
      status: 500,
    });
  }
};
