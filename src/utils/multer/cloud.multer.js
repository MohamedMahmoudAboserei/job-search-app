import multer from "multer";

export const uploadCloudFile = (fileValidation = []) => {
    const storage = multer.diskStorage({})
    function fileFilter(req, file, cb) {
        if (fileValidation.includes(file.mimetype)) {
            return cb(null, true);
        }
        return cb(new Error("Invalid file format"), false);
    }
    return multer({ dest: 'dest', fileFilter, storage });
}

