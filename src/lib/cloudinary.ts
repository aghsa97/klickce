import { env } from "@/env";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadImage = async (url: string, publicId: string) => {
  try {
    const results = await cloudinary.uploader.upload(url, {
      public_id: publicId,
      upload_preset: "o1ylfqms",
      transformation: {
        quality: "auto:best",
        fetch_format: "auto",
        width: 1280,
        height: 720,
        crop: "limit",
      },
    });
    return { publicId: results.public_id };
  } catch (error) {
    console.log(error);
    return;
  }
};

export const deleteImage = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const deleteFolder = async (path: string) => {
  try {
    await cloudinary.api.delete_folder(path);
    return;
  } catch (error) {
    console.log(error);
    return;
  }
};
