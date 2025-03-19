// Import files
import path from "node:path";
import multer from "multer";

// Function to upload files to local disk storage with optional file validation
export const uploadDiskFile = (fileValidation = []) => {
    // Configuring multer storage for disk uploads
    const storage = multer.diskStorage({
        // Setting the destination folder for uploaded files
        destination: (req, file, cb) => {
            cb(null, path.resolve('./src/uploads'));
        },
        // Generating a unique filename for each uploaded file
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + "_" + file.originalname);
        }
    });

    // File filter function to validate file types
    function fileFilter(req, file, cb) {
        if (fileValidation.includes(file.mimetype)) {
            cb(null, true); // Accept the file if it's a valid type
        }
        cb("In-valid file format", false); // Reject the file with an error message
    }
    // Returning a multer instance with specified storage and file filter
    return multer({ dest: 'defaultUploads', fileFilter, storage });
}