import connect from "@/lib/db";
import Blog from "@/lib/modals/blog";
import Category from "@/lib/modals/category";
import User from "@/lib/modals/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {

 
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "user not found" }), {
        status: 404,
      });
    }

    if(!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(JSON.stringify({ message: "category not found" }), {
        status: 404,
      });
    }
    await connect();
    const user = await User.findById(userId);
    if(!user){
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    

    const category = await Category.findById(categoryId);
    if(!category){
      return new NextResponse(JSON.stringify({ message: "Category not found" }), {
        status: 404,
      });
    }

    const filter: { user: Types.ObjectId; category: Types.ObjectId }  = {
      user : new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId)
    }

    // todo
    const blogs = await Blog.find(filter);

    return new NextResponse(JSON.stringify({blogs}), { status: 200 });
  } 
  
  catch (err: unknown) {
    // Check if err is an instance of Error to safely access message
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return new NextResponse("Error getting blogs: " + errorMessage, {
      status: 500,
    });
  }
};


export const POST = async(request:Request)=>{
  try{
    const {searchParams} = new URL(request.url)
    const userId = searchParams.get('userId');
    const categoryId = searchParams.get('categoryId');

    const body = await request.json();
    const {title, description} = body;

    if(!userId || !Types.ObjectId.isValid(userId)){
      return new NextResponse(JSON.stringify({message:"Invalid user ID"}), {
        status: 400,
      });
    }

    if(!categoryId || !Types.ObjectId.isValid(categoryId)){
      return new NextResponse(JSON.stringify({message:"Invalid category ID"}), {
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
    const category = await Category.findById(categoryId);
    if(!category){
      return new NextResponse(JSON.stringify({message:"Category not found"}), {
        status: 404,
      });
    }


    const newBlog = new Blog({
      title,
      description,
      user:new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId)
    })

    await newBlog.save();
    return new NextResponse(JSON.stringify({message:"Blog created", blog:newBlog}),
     { status: 201 });
  }
  catch (err: unknown) {
    // Check if err is an instance of Error to safely access message
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return new NextResponse("Error getting blogs: " + errorMessage, {
      status: 500,
    });
  }
}