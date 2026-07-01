import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";

cloudinary.config({
    cloud_name: env.cloudinary.cloud_name,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
});

export default cloudinary;
