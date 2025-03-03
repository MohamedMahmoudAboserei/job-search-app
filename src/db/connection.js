import mongoose from "mongoose";

const connectDB = async () => {
    await mongoose.connect(process.env.DB_URL).then(res => {
        console.log(`db connected`);
    }).catch(err => {
        console.log(`fail to connect on DB : `, err);
    })
}

export default connectDB;