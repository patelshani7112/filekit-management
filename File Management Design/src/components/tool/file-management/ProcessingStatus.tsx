import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface ProcessingStatusProps {
  status: 'processing' | 'success' | 'error';
  progress?: number;
  message: string;
  fileName?: string;
}

export function ProcessingStatus({ status, progress = 0, message, fileName }: ProcessingStatusProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {status === 'processing' && (
        <>
          <Loader2 className="w-16 h-16 text-purple-600 animate-spin mb-4" />
          <h3 className="mb-2">{message}</h3>
          {fileName && <p className="text-sm text-gray-600 mb-4">{fileName}</p>}
          {progress > 0 && (
            <div className="w-full max-w-md">
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">{progress}%</p>
            </div>
          )}
        </>
      )}
      
      {status === 'success' && (
        <>
          <CheckCircle2 className="w-16 h-16 text-green-600 mb-4" />
          <h3 className="mb-2 text-green-600">{message}</h3>
          {fileName && <p className="text-sm text-gray-600">{fileName}</p>}
        </>
      )}
      
      {status === 'error' && (
        <>
          <XCircle className="w-16 h-16 text-red-600 mb-4" />
          <h3 className="mb-2 text-red-600">{message}</h3>
          {fileName && <p className="text-sm text-gray-600">{fileName}</p>}
        </>
      )}
    </div>
  );
}
