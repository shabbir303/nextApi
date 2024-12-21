import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server";

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
    return new NextResponse(
      "Error creating user: " + errorMessage,
      { status: 500 }
    );
  }
};
