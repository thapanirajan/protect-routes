
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.COMPASS_DB_URI)
        console.log("DB connected succesfully")
    } catch (error) {
        console.log("Internal server error")
    }
}

export default connectDB;