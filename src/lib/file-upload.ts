import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

// Interface for file-like objects that can be uploaded
interface UploadableFile {
  name: string;
  type: string;
  arrayBuffer: () => Promise<ArrayBuffer>;
}

// Only create the S3 client if we're on the server side
const isServer = typeof window === 'undefined';
let s3Client: S3Client | null = null;

if (isServer) {
  s3Client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
  });
}

/**
 * Uploads a file to S3
 * @param file File-like object with name, type, and arrayBuffer method
 * @returns Promise that resolves to the public URL of the uploaded file
 */
export async function uploadFileToS3(file: UploadableFile): Promise<string> {
  if (!s3Client) {
    throw new Error('S3 client is not initialized. This function should only be called on the server side.');
  }

  const fileExtension = file.name.split('.').pop() || '';
  const key = `reviews/${uuidv4()}.${fileExtension}`;
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type || 'application/octet-stream',
      ACL: 'public-read', // Make the uploaded file publicly accessible
    });

    await s3Client.send(command);
    
    // Return the public URL of the uploaded file
    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('Failed to upload file to S3');
  }
}

/**
 * Uploads multiple files to S3 in parallel
 * @param files Array of file-like objects
 * @returns Promise that resolves to an array of public URLs of the uploaded files
 */
export async function uploadMultipleFiles(files: UploadableFile[]): Promise<string[]> {
  if (!s3Client) {
    throw new Error('S3 client is not initialized. This function should only be called on the server side.');
  }

  try {
    return await Promise.all(files.map(file => uploadFileToS3(file)));
  } catch (error) {
    console.error('Error uploading files:', error);
    throw new Error('Failed to upload one or more files');
  }
}
