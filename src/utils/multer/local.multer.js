import path from "node:path";
import multer from "multer";

export const uploadDiskFile = (fileValidation = []) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve('./src/uploads'));
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + "_" + file.originalname);
            // cb(null, file.originalname);
        }
    })
    function fileFilter(req, file, cb) {
        if (fileValidation.includes(file.mimetype)) {
            cb(null, true);
        }
        cb("In-valid file format", false)
    }
    return multer({ dest: 'defaultUploads', fileFilter, storage });
}

