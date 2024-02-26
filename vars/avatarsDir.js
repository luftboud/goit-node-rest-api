import { URL } from "url";
import path from "path";

const __dirname = new URL("..", import.meta.url).pathname;

export const avatarsDir = path.join(__dirname, "public", "avatars");
