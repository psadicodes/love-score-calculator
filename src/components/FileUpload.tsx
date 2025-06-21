
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
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only set isDragOver to false if we're leaving the drop zone entirely
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    console.log('Files dropped:', files);
    
    if (files.length > 0) {
      const file = files[0];
      console.log('File type:', file.type, 'File name:', file.name);
      
      // Accept .txt files
      if (file.name.endsWith('.txt') || file.type === 'text/plain') {
        setSelectedFile(file);
        console.log('File accepted:', file.name);
      } else {
        console.log('File rejected - not a .txt file');
        alert('Please upload a .txt file (WhatsApp chat export)');
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed');
    const file = e.target.files?.[0];
    
    if (file) {
      console.log('File selected:', file.name, file.type);
      
      if (file.name.endsWith('.txt') || file.type === 'text/plain') {
        setSelectedFile(file);
        console.log('File accepted via input:', file.name);
      } else {
        console.log('File rejected via input - not a .txt file');
        alert('Please upload a .txt file (WhatsApp chat export)');
      }
    }
    
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log('Uploading file:', selectedFile.name);
      onFileUpload(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="space-y-6">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
          isDragOver
            ? 'border-pink-400 bg-pink-50'
            : 'border-gray-300 hover:border-pink-300 hover:bg-pink-25'
        }`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">Drop your WhatsApp chat here</h3>
        <p className="text-gray-600 mb-4">or click to browse files</p>
        
        <input
          type="file"
          accept=".txt,text/plain"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        
        <Button variant="outline" className="cursor-pointer" type="button">
          <FileText className="h-4 w-4 mr-2" />
          Choose File
        </Button>
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
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRemoveFile}
                disabled={isAnalyzing}
              >
                Remove
              </Button>
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
        </div>
      )}
    </div>
  );
};

export default FileUpload;
