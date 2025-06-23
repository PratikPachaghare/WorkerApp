import mongoose from "mongoose";

export const connectionDb = async()=>{
    try {
        mongoose.connect(process.env.DB_link);
        console.log("database connected succsefuly");
    } catch (error) {
        console.log("error in db connect",error);
    }
}
