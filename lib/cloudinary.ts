//Imports:
import { v2 as cloudinary } from "cloudinary";
//Setting Up The Cloudinary:
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});
//Export:
export default cloudinary;
