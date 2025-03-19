// Import files
import multer from "multer";

// Function to upload files to the cloud with optional file validation
export const uploadCloudFile = (fileValidation = []) => {
    // Setting up multer storage
    const storage = multer.diskStorage({});

    // File filter function to validate file types
    function fileFilter(req, file, cb) {
        if (fileValidation.includes(file.mimetype)) {
            return cb(null, true);
        }
        // Reject the file with an error message
        return cb(new Error("Invalid file format"), false);
    }

    // Returning a multer instance with the specified file filter and storage
    return multer({ dest: 'dest', fileFilter, storage });
}