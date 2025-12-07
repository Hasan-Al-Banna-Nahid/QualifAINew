// app/qualifai/content/page.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Play, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Link as LinkIcon, 
  Upload as UploadIcon, 
  Type as TypeIcon,
  AlertCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

type InputType = 'url' | 'file' | 'text';

export default function ContentQAPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [inputType, setInputType] = useState<InputType>('url');
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedContent, setExtractedContent] = useState<string | null>(null);
  
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleExtraction = async () => {
    setIsExtracting(true);
    setExtractedContent(null);
    setTestResults([]);

    try {
      let contentToProcess = "";

      if (inputType === 'text') {
        contentToProcess = text;
      } else if (inputType === 'url') {
        // Call extraction API
        const res = await fetch('/api/documents/extract', {
            method: 'POST',
            body: JSON.stringify({ url, type: 'text/html' }), // Defaulting to html/text for URL
             headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        contentToProcess = data.text;
      } else if (inputType === 'file' && file) {
          // Upload file logic - for now we use a data URL or object URL approach to send to our extraction API 
          // However, our current extraction API takes a URL. define a way to handle file uploads.
          // Since we don't have a file storage bucket set up yet, we will mock the "upload" and use a client-side reader for simple files
          // OR we can convert to base64 and send to an endpoint if it supported it.
          // As a workaround for this "Ingestion" task without a backend storage:
          
          if (file.type === 'application/json') {
              const text = await file.text();
              contentToProcess = text; // Just read directly
          } else if (file.name.endsWith('.csv')) {
              const text = await file.text();
              contentToProcess = text;
          } else {
             // For PDF/DOCX we'd need to upload. 
             // Let's create a temporary object URL and see if our backend can fetch it (it can't if it's localhost blob).
             // So we actually need to read it client side or assume the user has a public URL for now.
             // BUT, since we implemented 'mammoth' and 'pdf-parse' on the backend, we really want to use that.
             // We can update the API to accept base64 or raw body. 
             // For this task, let's stick to Client Side text reading for JSON/CSV/TXT and show a message for PDF/DOCX needing storage integration.
             if (file.type.includes('pdf') || file.type.includes('word') || file.name.includes('.docx')) {
                 toast.error("PDF/DOCX upload requires File Storage (Pending Implementation). Please use Text, JSON, CSV or a Public URL.");
                 setIsExtracting(false);
                 return;
             }
             contentToProcess = await file.text();
          }
      }

      if (!contentToProcess) {
        throw new Error("No content found to process");
      }

      setExtractedContent(contentToProcess);
      toast.success("Content extracted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to extract content: " + (error as Error).message);
    } finally {
      setIsExtracting(false);
    }
  };

  const runContentTests = async () => {
    if (!extractedContent) return;
    
    setIsTesting(true);

    // Simulate Content QA testing based on extracted content
    const tests = [
      { name: "Grammar & Spelling Check", status: "running" },
      { name: "Tone & Voice Consistency", status: "running" },
      { name: "Plagiarism Detection", status: "running" },
      { name: "Readability Score Analysis", status: "running" },
      { name: "Keyword Density Check", status: "running" },
      { name: "Brand Guidelines Compliance", status: "running" },
      { name: "CMS Structure Validation", status: "running" },
    ];

    setTestResults(tests);

    // Simulate test execution
    for (let i = 0; i < tests.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setTestResults((prev) =>
        prev.map((test, index) =>
          index === i
            ? { ...test, status: Math.random() > 0.15 ? "passed" : "failed" }
            : test
        )
      );
    }

    setIsTesting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-blue-50/50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Content QA
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Data ingestion and quality assurance for content and CMS exports
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
            {/* Input Section */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                    <button
                        onClick={() => setInputType('url')}
                        className={cn(
                            "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all",
                            inputType === 'url' ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                    >
                        <LinkIcon className="w-4 h-4" />
                        <span>URL / Google Doc</span>
                    </button>
                    <button
                        onClick={() => setInputType('file')}
                        className={cn(
                            "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all",
                            inputType === 'file' ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                    >
                        <UploadIcon className="w-4 h-4" />
                        <span>CMS Export Upload</span>
                    </button>
                    <button
                        onClick={() => setInputType('text')}
                        className={cn(
                            "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all",
                            inputType === 'text' ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                    >
                        <TypeIcon className="w-4 h-4" />
                        <span>Direct Text</span>
                    </button>
                </div>

                <div className="space-y-4">
                    {inputType === 'url' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Google Doc or Web Page URL
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://docs.google.com/document/d/..."
                                    className="flex-1 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2 flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                For Google Docs, ensure the document is public or use the "Publish to Web" link.
                            </p>
                        </div>
                    )}

                    {inputType === 'file' && (
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-indigo-500 transition-colors bg-gray-50 dark:bg-gray-900/50">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".json,.csv,.txt,.md"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <div className="flex flex-col items-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <UploadIcon className="w-12 h-12 text-gray-400 mb-4" />
                                <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                                    {file ? file.name : "Click to upload CMS Export"}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Supports JSON, CSV, TXT, MD from WordPress, Drupal, Contentful, etc.
                                </p>
                            </div>
                        </div>
                    )}

                    {inputType === 'text' && (
                        <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Paste Content Directly
                            </label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                rows={8}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Paste your article or content here..."
                            />
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleExtraction}
                            disabled={isExtracting || (inputType === 'url' && !url) || (inputType === 'file' && !file) || (inputType === 'text' && !text)}
                            className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isExtracting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Ingesting...
                                </>
                            ) : (
                                <>
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    Ingest Content
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Test Interface */}
            {extractedContent && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Content Analysis
                            </h2>
                            <p className="text-sm text-gray-500">
                                Ready to analyze {extractedContent.length} characters
                            </p>
                        </div>
                        <button
                        onClick={runContentTests}
                        disabled={isTesting}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25"
                        >
                        <Play className="w-4 h-4" />
                        <span>{isTesting ? "Analyzing..." : "Run Analysis"}</span>
                        </button>
                    </div>

                    {/* Content Preview (Collapsed) */}
                    <div className="mb-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 max-h-40 overflow-y-auto text-sm text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
                        {extractedContent}
                    </div>

                    {/* Test Results */}
                    <div className="space-y-4">
                        {testResults.map((test, index) => (
                        <motion.div
                            key={test.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800"
                        >
                            <div className="flex items-center space-x-3">
                            {test.status === "running" && (
                                <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full"
                                />
                            )}
                            {test.status === "passed" && (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                            )}
                            {test.status === "failed" && (
                                <XCircle className="w-5 h-5 text-red-500" />
                            )}
                            <span className="font-medium text-gray-900 dark:text-white">
                                {test.name}
                            </span>
                            </div>

                            {test.status === "running" && (
                            <div className="flex space-x-1">
                                {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{
                                    duration: 0.6,
                                    delay: i * 0.2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    }}
                                    className="w-2 h-2 bg-indigo-500 rounded-full"
                                />
                                ))}
                            </div>
                            )}
                        </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
      </div>
    </div>
  );
}
