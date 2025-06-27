import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2, X, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isAnalyzing: boolean;
}

export const FileUpload = ({ onFileUpload, isAnalyzing }: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const handleFile = useCallback((selectedFile: File | null) => {
    if (selectedFile) {
      if (selectedFile.name.endsWith('.txt') && selectedFile.type === 'text/plain') {
        setFile(selectedFile);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a valid .txt file exported from WhatsApp.",
        });
      }
    }
  }, [toast]);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    handleFile(event.dataTransfer.files?.[0] ?? null);
  }, [handleFile]);

  const onDragEnter = useCallback(() => setIsDragOver(true), []);
  const onDragLeave = useCallback(() => setIsDragOver(false), []);

  const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0] ?? null);
    event.target.value = '';
  };

  const handleAnalyze = () => {
    if (file) {
      onFileUpload(file);
    }
  };

  if (file) {
    return (
      <div className="text-center space-y-6">
        <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold">File Ready for Analysis</h3>
          <p className="text-muted-foreground">{file.name} ({(file.size / 1024).toFixed(1)} KB)</p>
        </div>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => setFile(null)} disabled={isAnalyzing}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Start Analysis'
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      className={`relative rounded-xl border-2 border-dashed p-12 text-center transition-colors
        ${isDragOver ? 'border-primary bg-primary/10' : 'border-border'}`}
    >
      <div className="space-y-4">
        <div className="mx-auto h-16 w-16 text-muted-foreground">
          <Upload />
        </div>
        <h3 className="text-2xl font-semibold">Upload your .txt chat file</h3>
        <p className="text-muted-foreground">
          Drag & drop your file here or{' '}
          <label htmlFor="file-upload" className="font-semibold text-primary cursor-pointer hover:underline">
            click to browse
          </label>
        </p>
      </div>
      <input
        type="file"
        id="file-upload"
        accept=".txt,text/plain"
        onChange={onFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isAnalyzing}
      />
    </div>
  );
};

export default FileUpload;
