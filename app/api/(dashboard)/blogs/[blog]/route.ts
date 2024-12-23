import connect from "@/lib/db";
import Blog from "@/lib/modals/blog";
import Category from "@/lib/modals/category";
import User from "@/lib/modals/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

interface Context {
  params: { blog: string };
  // Add other properties of `context` if needed
}
export const GET = async (request: Request, context: Context) => {
  const blogId = context.params.blog;

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid user ID" }), {
        status: 400,
      });
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid category ID" }),
        {
          status: 400,
        }
      );
    }
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid blog ID" }), {
        status: 400,
      });
    }

    await connect();

    const user = await User.findById(userId);
    const category = await Category.findById(categoryId);

    if (!user || !category) {
      return new NextResponse(
        JSON.stringify({ message: "User or category not found" }),
        {
          status: 404,
        }
      );
    }

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
      category: categoryId,
    });

    return new NextResponse(JSON.stringify({ blog }), { status: 200 });
  } catch (err: unknown) {
    // Check if err is an instance of Error to safely access message
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return new NextResponse("Error getting each blogs: " + errorMessage, {
      status: 500,
    });
  }
};

export const PATCH = async (request: Request, context: Context) => {
  const blogId = context.params.blog;
  try {
    const body = await request.json();
    const { title, description } = body;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    // const categoryId = searchParams.get("categoryId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid user ID" }), {
        status: 400,
      });
    }

    // if(!categoryId || !Types.ObjectId.isValid(categoryId)){
    //     return new NextResponse(JSON.stringify({message:"Invalid category ID"}), {
    //         status: 400,
    //     });
    // }
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid blog ID" }), {
        status: 400,
      });
    }
    await connect();

    const user = await User.findById(userId);
    const blog = await Blog.findOne({ _id: blogId, user: userId });
    if (!user || !blog) {
      return new NextResponse(
        JSON.stringify({ message: "User or blog not found" }),
        {
          status: 404,
        }
      );
    }
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, description },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({ message: "blog updated", blog: updatedBlog }),
      { status: 200 }
    );
  } catch (err: unknown) {
    // Check if err is an instance of Error to safely access message
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return new NextResponse("Error updating blogs: " + errorMessage, {
      status: 500,
    });
  }
};
