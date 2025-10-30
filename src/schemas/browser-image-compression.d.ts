declare module "browser-image-compression" {
  export default function imageCompression(
    file: File,
    options?: {
      maxSizeMB?: number;
      maxWidthOrHeight?: number;
      useWebWorker?: boolean;
      fileType?: string;
      maxIteration?: number;
      onProgress?: (progress: number) => void;
    }
  ): Promise<File>;
}
