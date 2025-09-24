import mongoose from "mongoose";


export const connectDB =async ()=>{
    await mongoose.connect('mongodb+srv://vshri029_db_user:tuZeaWvJOcbJ0GNX@cluster0.rvhopnj.mongodb.net/')
    .then(()=> console.log(`db connected`)
    )
}