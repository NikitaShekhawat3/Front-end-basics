import mongoose from 'mongoose'

const connectDB=async ()=>{
    try {
        const conn= await mongoose.connect(process.env.MONGO_URL)
        console.log(`connected to mongoDB database ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error in MogoDB ${error}`)
    }
}

export default connectDB;