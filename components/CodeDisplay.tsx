
import React, { useState } from 'react';
import { GeneratedFile } from '../types';
import ClipboardIcon from './icons/ClipboardIcon';
import CheckIcon from './icons/CheckIcon';

interface CodeDisplayProps {
  files: GeneratedFile[];
}

const CodeBlock: React.FC<{ file: GeneratedFile }> = ({ file }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(file.code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-lg">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-700/50 border-b border-gray-700">
        <span className="font-mono text-sm text-yellow-300">{file.fileName}</span>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 text-xs text-gray-400 hover:text-white transition-colors p-1.5 rounded-md hover:bg-gray-600"
        >
          {isCopied ? (
            <>
              <CheckIcon className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <ClipboardIcon className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-sm overflow-x-auto">
        <code className="language-java font-mono">{file.code}</code>
      </pre>
    </div>
  );
};


const CodeDisplay: React.FC<CodeDisplayProps> = ({ files }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-200">Generated Project Files</h3>
      {files.map((file) => (
        <CodeBlock key={file.fileName} file={file} />
      ))}
    </div>
  );
};

export default CodeDisplay;
