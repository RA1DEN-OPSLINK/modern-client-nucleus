interface UploadingFilesProps {
  files: File[];
}

export function UploadingFiles({ files }: UploadingFilesProps) {
  if (files.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-background border rounded-lg p-4 shadow-lg">
      <h3 className="font-semibold mb-2">Uploading files...</h3>
      {files.map((file) => (
        <div key={file.name} className="text-sm">
          {file.name}
        </div>
      ))}
    </div>
  );
}