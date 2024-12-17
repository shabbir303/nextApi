import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

const connect = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Already connected...");
    return;
  }

  if (connectionState === 2) {
    console.log("connecting...");
    return;
  }

  try {
    await mongoose.connect(uri!, {
      dbName: "next14restAPI",
      bufferCommands: true,
    });
    console.log("connected");
  } catch (err) {
    if (err instanceof Error) {
      console.log("Err", err.message);
      throw new Error("Error: " + err.message);
    }
  }
};

export default connect;
