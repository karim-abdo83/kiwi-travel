import { hasAdminAccess } from "@/lib/admin-auth";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const adminMiddleware = async () => {
  // This code runs on your server before upload
  const { sessionClaims } = await auth();

  if (hasAdminAccess(sessionClaims)) return {};

  const user = await currentUser();

  // If you throw, the user will not be able to upload
  if (!hasAdminAccess(user)) throw new UploadThingError("Forbidden");

  return {};
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  fileUploader: f({
    image: {
      maxFileCount: 30,
      maxFileSize: "128MB",
    },
    video: {
      maxFileCount: 30,
      maxFileSize: "512MB",
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(adminMiddleware)
    .onUploadComplete(() => ({ message: "Success" })),
  countryImageUploader: f({
    image: {
      maxFileCount: 1,
      maxFileSize: "128MB",
    },
  })
    .middleware(adminMiddleware)
    .onUploadComplete(() => ({ message: "Success" })),
  reviewImageUploader: f({
      image: {
        maxFileCount: 1,
        maxFileSize: "8MB",
      }
    })
      .onUploadComplete(() => ({ message: "Success" }))
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
