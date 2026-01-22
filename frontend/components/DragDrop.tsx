'use client';

import React, { useState, useCallback } from 'react';
import { Upload, File as FileIcon, CheckCircle, AlertCircle, ShieldCheck, Lock, Activity, Zap, Server, ChevronRight, Database, MapPin, Cpu, Laptop, Download, Loader2 } from 'lucide-react';
import clsx from 'clsx';

export default function DragDrop() {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [processedUrl, setProcessedUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) setFile(droppedFile);
    }, []);

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) setFile(selectedFile);
    };

    const uploadFile = async () => {
        if (!file) return;
        setUploading(true);
        setError(null);
        setProgress(0);

        // Simulation of progress based on Image 2
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 68) {
                    clearInterval(interval);
                    return 68;
                }
                return prev + 2;
            });
        }, 100);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/upload/single`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('System Fail: Handshake Rejected');

            const data = await response.json();

            // Wait for visual progress to hit 68 then finish
            setTimeout(() => {
                setProcessedUrl(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${data.url}`);
                setUploading(false);
            }, 2000);

        } catch (err: any) {
            setError(err.message);
            setUploading(false);
        } finally {
            clearInterval(interval);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto">
            {!uploading && !processedUrl && !error && (
                <div
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    className={clsx(
                        "relative flex flex-col items-center justify-center p-20 rounded-[32px] border-2 border-dashed transition-all duration-700 bg-zinc-900/10 backdrop-blur-3xl group min-h-[400px]",
                        isDragging ? "border-cyan-400 bg-cyan-400/5 scale-[1.02]" : "border-white/5 hover:border-cyan-400/20"
                    )}
                >
                    <input
                        type="file"
                        onChange={onFileSelect}
                        className="hidden"
                        id="fileInput"
                        accept="image/*,video/*"
                    />

                    {file ? (
                        <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                            <div className="bg-cyan-500/10 p-8 rounded-2xl border border-cyan-500/20 inline-block">
                                <FileIcon className="w-16 h-16 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-white mb-2 uppercase italic tracking-tight">{file.name}</h3>
                                <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.4em]">
                                    Payload_Mass: <span className="text-cyan-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                </p>
                            </div>
                            <button
                                onClick={uploadFile}
                                className="px-12 py-5 bg-cyan-400 hover:bg-cyan-300 text-black rounded font-bold uppercase text-xs tracking-[0.4em] transition-all shadow-[0_0_50px_rgba(0,242,255,0.2)]"
                            >
                                Start Deep Scrubbing
                            </button>
                        </div>
                    ) : (
                        <div className="text-center space-y-8">
                            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 inline-block group-hover:border-cyan-500/40 transition-colors">
                                <Upload className="w-16 h-16 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-3xl font-bold text-white uppercase italic tracking-tight">Drag & Drop Secure Payload</h3>
                                <p className="text-zinc-500 text-sm font-light max-w-md mx-auto">
                                    Supports JPG, PNG, PDF, MP4, and RAW formats (Max 500MB)
                                </p>
                            </div>

                            <label
                                htmlFor="fileInput"
                                className="inline-block px-12 py-5 bg-cyan-400 hover:bg-cyan-300 text-black rounded cursor-pointer font-bold uppercase text-xs tracking-[0.4em] transition-all"
                            >
                                Start Deep Scrubbing
                            </label>

                            <div className="flex items-center justify-center gap-12 pt-8">
                                <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                                    <ShieldCheck className="w-4 h-4" /> End-to-End Encrypted
                                </div>
                                <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                                    <Lock className="w-4 h-4" /> Zero Logs Policy
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {uploading && (
                <div className="bg-zinc-950 border border-white/5 rounded-[32px] p-8 lg:p-12 backdrop-blur-3xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-4 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {/* Left Sidebar Simulation */}
                    <div className="hidden lg:flex flex-col border-r border-white/5 pr-8 space-y-10">
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Recent Scans</h4>
                            <div className="space-y-4">
                                <div className="p-4 bg-cyan-400/5 border border-cyan-400/20 rounded-xl space-y-2">
                                    <div className="text-xs font-bold text-white truncate">{file?.name}</div>
                                    <div className="text-[9px] font-mono text-cyan-400 uppercase flex items-center gap-2">
                                        <Loader2 className="w-3 h-3 animate-spin" /> Processing...
                                    </div>
                                </div>
                                <div className="p-4 bg-white/5 border border-white/5 rounded-xl opacity-40">
                                    <div className="text-xs font-bold text-zinc-400 truncate">raw_export_v2.jpg</div>
                                    <div className="text-[9px] font-mono text-emerald-500 uppercase">Sanitized</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Navigation</h4>
                            <nav className="space-y-4">
                                <NavItem label="Clearance History" active={false} icon={<Activity className="w-4 h-4" />} />
                                <NavItem label="Neural Logs" active={true} icon={<Server className="w-4 h-4" />} />
                                <NavItem label="Privacy Shields" active={false} icon={<ShieldCheck className="w-4 h-4" />} />
                            </nav>
                        </div>
                    </div>

                    {/* Main Processing Hub */}
                    <div className="lg:col-span-2 flex flex-col items-center justify-between min-h-[500px] py-4">
                        <div className="w-full flex justify-between items-start mb-8">
                            <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-[9px] font-mono text-cyan-400 uppercase tracking-widest">
                                Secure Protocol v4.2
                            </div>
                            <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded text-[9px] font-mono text-red-500 uppercase tracking-widest font-bold">
                                Emergency Stop
                            </div>
                        </div>

                        <div className="text-center space-y-2">
                            <h2 className="text-4xl font-bold uppercase italic tracking-tighter">
                                Metaclean <span className="text-cyan-400 italic">Scrubbing</span>
                            </h2>
                            <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">
                                Source: /internal/neural_link/{file?.name}
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 w-full my-8">
                            <MetricBox label="Detected Threats" value="42" color="cyan" detail="+12 Sig" />
                            <MetricBox label="Scrubbed Data" value="1.2" color="cyan" detail="MB" />
                            <MetricBox label="Anonymity Score" value="94" color="cyan" detail="%" />
                        </div>

                        {/* Large Circular Dial */}
                        <div className="relative w-72 h-72 flex items-center justify-center">
                            <div className="absolute inset-0 bg-cyan-400/5 blur-[100px] rounded-full animate-pulse" />
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="144" cy="144" r="120" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-white/5" strokeDasharray="6 6" />
                                <circle
                                    cx="144" cy="144" r="120"
                                    stroke="currentColor" strokeWidth="6"
                                    strokeDasharray={2 * Math.PI * 120}
                                    strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                                    fill="transparent"
                                    className="text-cyan-400 transition-all duration-500 ease-out"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-7xl font-bold italic tracking-tighter">{progress}%</span>
                                <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-cyan-400 mt-2">Scrubbing</span>
                            </div>
                        </div>

                        <div className="w-full space-y-4 mt-8">
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <h4 className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">AI Signature Erasure</h4>
                                    <p className="text-[9px] text-zinc-600 font-mono">Removing Midjourney generation fingerprints...</p>
                                </div>
                                <div className="text-[9px] font-mono text-zinc-600 uppercase">TASK_ID: 99x_01</div>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-400 w-2/3 animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* Right Panel Simulation */}
                    <div className="hidden lg:flex flex-col border-l border-white/5 pl-8 space-y-8">
                        <div>
                            <h4 className="text-sm font-bold text-white uppercase italic tracking-tight mb-2">Metadata Analysis</h4>
                            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Found vs Sanitized Comparison</p>
                        </div>

                        <div className="space-y-4">
                            <AnalysisItem label="GPS Coordinates" value="40.7128° N" status="Redacted" danger />
                            <AnalysisItem label="Device Profile" value="Sony Alpha 7 IV" status="Generic_HW" danger />
                            <AnalysisItem label="AI Signature" value="Midjourney v6" status="Erased" danger />
                            <AnalysisItem label="ICC Profile" value="Neutralized" status="OK" />
                        </div>

                        <div className="mt-auto space-y-3">
                            <button className="w-full py-4 bg-zinc-900 border border-white/5 rounded-lg text-[10px] font-bold text-cyan-400 uppercase tracking-widest hover:bg-zinc-800 transition-all">
                                Full Report (.pdf)
                            </button>
                            <button className="w-full py-4 bg-purple-500 hover:bg-purple-400 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(188,0,255,0.2)]">
                                Download Cleaned
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {processedUrl && (
                <div className="bg-zinc-950 border border-white/10 rounded-[40px] p-20 backdrop-blur-3xl text-center space-y-12 animate-in zoom-in-95 duration-700">
                    <div className="w-32 h-32 bg-cyan-400/20 rounded-full flex items-center justify-center mx-auto border-4 border-cyan-400 relative">
                        <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-20" />
                        <CheckCircle className="w-16 h-16 text-cyan-400 relative z-10" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-5xl font-bold uppercase italic tracking-tighter">Identity Purged</h2>
                        <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.5em]">Digital footprint successfully neutralized</p>
                    </div>

                    <div className="flex gap-6 justify-center pt-8">
                        <a
                            href={processedUrl}
                            download={`clean-${file?.name || 'file'}`}
                            className="px-12 py-5 bg-cyan-400 hover:bg-cyan-300 text-black rounded font-bold uppercase text-xs tracking-[0.4em] transition-all shadow-[0_0_50px_rgba(0,242,255,0.3)]"
                        >
                            Download_Clean_Node
                        </a>
                        <button
                            onClick={() => {
                                setFile(null);
                                setProcessedUrl(null);
                            }}
                            className="px-12 py-5 bg-zinc-900 border border-white/5 text-zinc-400 rounded font-bold uppercase text-xs tracking-[0.4em] hover:bg-zinc-800 hover:text-white transition-all"
                        >
                            Cycle_Next
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-950/20 border border-red-500/20 rounded-[32px] p-20 backdrop-blur-3xl text-center space-y-8 animate-in shake-in duration-500">
                    <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
                        <AlertCircle className="w-12 h-12 text-red-500" />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-3xl font-bold uppercase italic text-red-500">Err_System_Fatal</h2>
                        <p className="text-red-400/60 font-mono text-xs uppercase tracking-widest leading-relaxed">
                            {error} <br />
                            Handshake protocol interrupted by external anomaly.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setError(null);
                            setFile(null);
                        }}
                        className="px-10 py-4 bg-red-600 hover:bg-red-500 text-white rounded font-bold uppercase text-[10px] tracking-[0.4em] transition-all"
                    >
                        Reboot_Process
                    </button>
                </div>
            )}
        </div>
    );
}

function NavItem({ label, active, icon }: any) {
    return (
        <div className={clsx(
            "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all cursor-pointer group",
            active ? "bg-cyan-400/10 border-cyan-400/30 text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
        )}>
            <div className={clsx(active ? "text-cyan-400" : "text-zinc-600 group-hover:text-zinc-400")}>{icon}</div>
            <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
        </div>
    );
}

function MetricBox({ label, value, detail, color }: any) {
    return (
        <div className="bg-black/60 border border-white/5 p-5 rounded-2xl text-center space-y-1">
            <div className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">{label}</div>
            <div className="text-2xl font-bold italic tracking-tighter text-white">
                {value} <span className="text-[10px] text-cyan-400/60 ml-1">{detail}</span>
            </div>
        </div>
    );
}

function AnalysisItem({ label, value, status, danger }: any) {
    return (
        <div className="space-y-2 border-b border-white/5 pb-4 last:border-0">
            <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{label}</span>
                {danger && <AlertCircle className="w-3 h-3 text-red-500" />}
            </div>
            <div className="flex justify-between items-baseline font-mono">
                <span className={clsx("text-xs font-bold uppercase", danger ? "text-red-500" : "text-white")}>{value}</span>
                <span className={clsx("text-[9px] uppercase font-bold", danger ? "text-red-600/80 italic" : "text-emerald-500")}>{status}</span>
            </div>
        </div>
    );
}
