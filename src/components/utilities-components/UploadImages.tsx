import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import imageCompression from "browser-image-compression";

type ImageUploadProps = {
  value?: string;
  onChange: (base64: string | null) => void;
  error?: string;
  label?: string;
};

export function UploadImages({
  value,
  onChange,
  error,
  label,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);

  // Nueva función usando browser-image-compression
  const compressFileToBase64 = async (file: File): Promise<string> => {
    const options = {
      maxSizeMB: 0.5, // tamaño máximo deseado (1 MB)
      maxWidthOrHeight: 512, // resolución máxima
      useWebWorker: true, // para no bloquear UI
      fileType: "image/jpeg", // opcional, convierte a JPEG para mejor compresión
      initialQuality: 0.4, // calidad inicial
    };

    const compressedFile = await imageCompression(file, options);

    // Convertir a Base64 con FileReader
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(compressedFile);
    });
    return base64;
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        try {
          const base64 = await compressFileToBase64(file);
          onChange(base64); // enviamos Base64 comprimido al backend
          setPreview(URL.createObjectURL(file)); // preview igual que antes
        } catch (err) {
          console.error("Error al comprimir la imagen:", err);
        }
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const removeImage = () => {
    setPreview(null);
    onChange(null);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm uppercase font-bold block">{label}</label>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer ${
          isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 rounded-xl mx-auto"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-3 -right-3 bg-white rounded-full shadow p-1"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <Upload size={32} />
            <p className="text-sm mt-2">
              {isDragActive
                ? "Suelta la imagen aquí"
                : "Arrastra o haz clic para subir una imagen"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Formatos: JPG, PNG, WEBP
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
