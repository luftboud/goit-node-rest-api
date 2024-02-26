import path from "path";
import multer from "multer";
import { URL } from "url";

const __dirname = new URL("..", import.meta.url).pathname;

const tempDir = path.join(__dirname, "temp");

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: multerConfig,
});

export function uploadSingleFile(fileType) {
  return upload.single(fileType)
}