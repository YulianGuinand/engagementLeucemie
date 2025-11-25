import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for the app
export const ourFileRouter = {
  certificateUploader: f({ image: { maxFileSize: "4MB" } }).onUploadComplete(
    async ({ file }) => {
      console.log("Upload complete:", file.ufsUrl);
      return { url: file.ufsUrl };
    }
  ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
