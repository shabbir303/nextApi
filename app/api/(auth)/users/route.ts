import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
const ObjectId = Types.ObjectId;

export const GET = async () => {
  try {
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users));
  } catch (error: unknown) {
    let errorMessage = "Unknown error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return new NextResponse("Error fetching data: " + errorMessage, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    await connect();
    const newUser = new User(body);
    await newUser.save();
    return new NextResponse(
      JSON.stringify({ message: "user is created", user: newUser }),
      { status: 200 }
    );
  } catch (err: unknown) {
    // Check if err is an instance of Error to safely access message
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return new NextResponse("Error creating user: " + errorMessage, {
      status: 500,
    });
  }
};

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId, newUserName } = body;
    await connect();
    if (!userId || !newUserName) {
      return new NextResponse("id or newusername not found", { status: 404 });
    }
    if(!Types.ObjectId.isValid(userId)){
        return new NextResponse("invalid userId", { status: 404 });
    }

    const updatedUser = await User.findOneAndUpdate(
        {_id: new ObjectId(userId)},
        { userName: newUserName }, 
        { new: true });
    
        if(!updatedUser){
            return new NextResponse("User not found", { status: 404 });
        }
        return new NextResponse(JSON.stringify({ message: "user updated", user: updatedUser }), { status: 200 });

  } catch (err: unknown) {
    // Check if err is an instance of Error to safely access message
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return new NextResponse("Error creating user: " + errorMessage, {
      status: 500,
    });
  }
};


export const DELETE = async(request:Request)=>{

}
