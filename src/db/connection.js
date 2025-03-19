// Import files
import mongoose from "mongoose";

// Connect DB using mongoose
const connectDB = async () => {
    await mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true,
        tlsAllowInvalidCertificates: false,
    }).then(res => {
        console.log(`db connected`);
    }).catch(err => {
        console.log(`fail to connect on DB : `, err);
    })
}

export default connectDB;