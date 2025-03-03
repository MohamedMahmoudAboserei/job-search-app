import path from 'node:path'
import * as dotenv from 'dotenv'
import * as cloudinary from 'cloudinary';

dotenv.config({path: path.resolve('./src/config/.env')})

// Configuration
cloudinary.v2.config({
    cloud_name: process.env.cloud_name,
    secure: true,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

export default cloudinary.v2