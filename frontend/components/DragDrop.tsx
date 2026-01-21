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
    const [report, setReport] = useState<{ gps: boolean; device: string | null; ai: boolean } | null>(null);
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
            setReport(null);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
            setProcessedUrl(null);
            setReport(null);
        }
    };

    const uploadFile = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);
        setReport(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();

            const formData = new FormData();
            formData.append('file', file);

            const headers: Record<string, string> = {};
            if (session) {
                headers['Authorization'] = `Bearer ${session.access_token}`;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/process/single`, {
                method: 'POST',
                headers,
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Processing failed');
            }

            // Capture Privacy Report Headers
            const gps = res.headers.get('X-Clean-GPS') === 'true';
            const device = res.headers.get('X-Clean-Device') ? decodeURIComponent(res.headers.get('X-Clean-Device')!) : null;
            const ai = res.headers.get('X-Clean-AI') === 'true';
            setReport({ gps, device, ai });

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
        <div className="w-full max-w-2xl mx-auto space-y-8 relative z-10">
            <div
                className={clsx(
                    "relative border border-white/10 rounded-3xl p-16 text-center transition-all duration-500 ease-out cursor-pointer overflow-hidden group backdrop-blur-xl",
                    isDragging ? "bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_50px_-10px_rgba(6,182,212,0.3)]" : "bg-white/5 hover:bg-white/10 hover:border-white/20",
                    file && !uploading && !processedUrl ? "border-purple-500/50 bg-purple-500/5" : ""
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {/* Scanner Light Effect */}
                <div className={clsx(
                    "absolute inset-x-0 h-1 bg-cyan-400 blur-sm transition-all duration-[2000ms] ease-in-out opacity-0",
                    uploading && "animate-[scan_2s_ease-in-out_infinite] opacity-100"
                )} />

                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                    onChange={handleChange}
                    accept="image/*,video/*"
                    disabled={uploading || !!processedUrl}
                />

                <div className="pointer-events-none relative z-20 flex flex-col items-center justify-center space-y-6">
                    {uploading ? (
                        <>
                            <div className="relative">
                                <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 animate-pulse" />
                                <Loader2 className="w-16 h-16 text-cyan-400 animate-spin relative z-10" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-cyan-400 font-mono text-lg tracking-widest animate-pulse">PROCESSING_DATA...</p>
                                <p className="text-slate-500 text-sm">Stripping coordinates & AI signatures</p>
                            </div>
                        </>
                    ) : processedUrl ? (
                        <div className="animate-in zoom-in-50 duration-300">
                            <div className="relative mb-6 mx-auto w-20 h-20 flex items-center justify-center">
                                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
                                <CheckCircle className="w-20 h-20 text-green-400 relative z-10" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">System Clean.</h3>
                            <p className="text-slate-400 mb-8">Metadata effectively neutralized.</p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto relative z-30">
                                <a
                                    href={processedUrl}
                                    download={`clean_${file?.name}`}
                                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold tracking-wide hover:brightness-110 transition-all shadow-[0_0_30px_-5px_rgba(6,182,212,0.4)]"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Download className="w-5 h-5 mr-2" />
                                    DOWNLOAD_CLEAN
                                </a>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFile(null);
                                        setProcessedUrl(null);
                                        setReport(null);
                                    }}
                                    className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-medium hover:bg-white/10 transition-colors backdrop-blur-md"
                                >
                                    NEW_FILE
                                </button>
                            </div>
                        </div>
                    ) : file ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="w-20 h-20 mx-auto bg-purple-500/20 rounded-2xl flex items-center justify-center mb-4 border border-purple-500/30">
                                <FileImage className="w-10 h-10 text-purple-400" />
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xl font-bold text-white tracking-tight">{file.name}</p>
                                    <p className="text-sm text-purple-300/60 font-mono mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB DETECTED</p>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // prevent triggering input
                                        uploadFile();
                                    }}
                                    className="pointer-events-auto relative z-50 w-full px-8 py-4 bg-white text-black text-lg font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                                >
                                    INITIATE CLEANSE
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="relative group-hover:scale-110 transition-transform duration-300">
                                <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
                                <Upload className="w-16 h-16 text-slate-400 group-hover:text-cyan-400 transition-colors relative z-10" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-2xl font-bold text-white tracking-tight">
                                    Drop Target
                                </p>
                                <p className="text-slate-400">
                                    or <span className="text-cyan-400 underline decoration-cyan-400/30 underline-offset-4 group-hover:decoration-cyan-400 transition-all">initiate manual upload</span>
                                </p>
                            </div>
                            <div className="pt-4 flex gap-3 justify-center text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                                <span>JPG</span>
                                <span className="text-slate-800">•</span>
                                <span>PNG</span>
                                <span className="text-slate-800">•</span>
                                <span>MP4</span>
                                <span className="text-slate-800">•</span>
                                <span>MOV</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center font-mono text-sm animate-in fade-in slide-in-from-top-2 backdrop-blur-md">
                    ⚠ ERROR: {error}
                </div>
            )}
        </div>
    );
}
