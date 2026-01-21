'use client';

import { useState, useCallback } from 'react';
import { Upload, X, FileImage, Loader2, CheckCircle, Download } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import clsx from 'clsx';

export default function DragDrop() {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [processedUrl, setProcessedUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setError(null);
            setProcessedUrl(null);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
            setProcessedUrl(null);
        }
    };

    const uploadFile = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();

            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/process/single`, {
                method: 'POST',
                headers: {
                    'Authorization': session ? `Bearer ${session.access_token}` : '',
                },
                body: formData,
            });

            if (!res.ok) {
                if (res.status === 401) throw new Error('Please sign in to process images');
                throw new Error('Processing failed');
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            setProcessedUrl(url);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            <div
                className={clsx(
                    "relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ease-in-out cursor-pointer overflow-hidden group",
                    isDragging ? "border-blue-500 bg-blue-50 scale-[1.02]" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50",
                    file ? "bg-white border-blue-200" : "bg-white"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleChange}
                    accept="image/*"
                    disabled={uploading || !!processedUrl}
                />

                <div className="pointer-events-none relative z-20 flex flex-col items-center justify-center space-y-4">
                    {uploading ? (
                        <>
                            <div className="p-4 bg-blue-50 rounded-full animate-pulse">
                                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                            </div>
                            <p className="text-gray-500 font-medium">Scrubbing metadata...</p>
                        </>
                    ) : processedUrl ? (
                        <>
                            <div className="p-4 bg-green-50 rounded-full">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <div>
                                <p className="text-gray-900 font-semibold text-lg">Clean & Ready!</p>
                                <div className="flex gap-4 mt-6 pointer-events-auto relative z-30 justify-center">
                                    <a
                                        href={processedUrl}
                                        download={`clean_${file?.name}`}
                                        className="inline-flex items-center px-6 py-2.5 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </a>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                            setProcessedUrl(null);
                                        }}
                                        className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        New File
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : file ? (
                        <>
                            <div className="bg-blue-50 p-4 rounded-2xl mb-2 relative group-hover:scale-110 transition-transform">
                                <FileImage className="w-10 h-10 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-gray-900">{file.name}</p>
                                <p className="text-sm text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <div className="pt-6 pointer-events-auto relative z-30">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // prevent triggering input
                                        uploadFile();
                                    }}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl shadow-blue-600/20 active:scale-95"
                                >
                                    Clean Metadata
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="bg-gray-50 p-4 rounded-2xl mb-2 group-hover:scale-110 transition-transform">
                                <Upload className="w-10 h-10 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            </div>
                            <p className="text-lg font-medium text-gray-900">
                                Drop your image here, or <span className="text-blue-600">click to browse</span>
                            </p>
                            <p className="text-sm text-gray-500 max-w-sm mx-auto">
                                Supports JPG, PNG, WEBP. Files are processed securely in memory and deleted immediately.
                            </p>
                        </>
                    )}
                </div>
            </div>

            {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center font-medium animate-in fade-in slide-in-from-top-2">
                    {error}
                </div>
            )}
        </div>
    );
}
