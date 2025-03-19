// Import files
import path from 'node:path'
import * as dotenv from 'dotenv'
import * as cloudinary from 'cloudinary';

// Loading environment variables from the .env file
dotenv.config({path: path.resolve('./src/config/.env')})

// Configuration
cloudinary.v2.config({
    cloud_name: process.env.cloud_name, // Cloudinary cloud name
    secure: true,  // Enabling secure URLs (HTTPS)
    api_key: process.env.api_key, // Cloudinary API key
    api_secret: process.env.api_secret // Cloudinary API secret
});

// Exporting the configured Cloudinary instance for use in other files
export default cloudinary.v2