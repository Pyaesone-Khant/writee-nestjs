import { BadRequestException } from "@nestjs/common";
import { Request } from "express";

export const fileFilter = (req: Request, file: Express.Multer.File, callback: CallableFunction) => {
  const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  const extension = file?.mimetype;
  if (!allowedFileTypes.includes(extension)) {
    return callback(new BadRequestException("Invalid file type. Only jpeg, jpg and png files are allowed!"), false);
  }

  callback(null, true);
}