
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isAnalyzing: boolean;
}

const FileUpload = ({ onFileUpload, isAnalyzing }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const txtFile = files.find(file => file.name.endsWith('.txt'));
    
    if (txtFile) {
      setSelectedFile(txtFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.txt')) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  return (
    <div className="space-y-6">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragOver
            ? 'border-pink-400 bg-pink-50'
            : 'border-gray-300 hover:border-pink-300 hover:bg-pink-25'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">Drop your WhatsApp chat here</h3>
        <p className="text-gray-600 mb-4">or click to browse files</p>
        
        <input
          type="file"
          accept=".txt"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        
        <label htmlFor="file-upload">
          <Button variant="outline" className="cursor-pointer">
            <FileText className="h-4 w-4 mr-2" />
            Choose File
          </Button>
        </label>
      </div>

      {selectedFile && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">{selectedFile.name}</p>
                <p className="text-sm text-green-600">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleUpload} 
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Chat'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
