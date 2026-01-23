'use client';

import React, { useState, useCallback } from 'react';
import { Upload, File as FileIcon, CheckCircle, AlertTriangle, ShieldCheck, Lock, Activity, Server, Loader2, Fingerprint, Eye, EyeOff } from 'lucide-react';
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/process/single`, {
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
                        "relative flex flex-col items-center justify-center p-20 border-[3px] border-dashed transition-all duration-300 bg-[#0A0A0A] group min-h-[450px]",
                        isDragging
                            ? "border-lime-400 bg-lime-400/5 scale-[1.01]"
                            : "border-zinc-800 hover:border-lime-400/50"
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
                        <div className="text-center space-y-8 animate-in fade-in zoom-in duration-300">
                            <div className="bg-lime-400/10 p-8 inline-block border-[3px] border-lime-400">
                                <FileIcon className="w-16 h-16 text-lime-400" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-white mb-2 uppercase italic tracking-tight">{file.name}</h3>
                                <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.4em]">
                                    Mass: <span className="text-lime-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                </p>
                            </div>
                            <button
                                onClick={uploadFile}
                                className="px-12 py-5 bg-lime-400 hover:bg-lime-300 text-black font-bold uppercase text-xs tracking-[0.4em] transition-all shadow-[8px_8px_0_rgba(255,255,255,0.1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none border border-lime-400"
                            >
                                Initiate Scrubbing
                            </button>
                        </div>
                    ) : (
                        <div className="text-center space-y-8">
                            <div className="bg-zinc-900 p-8 inline-block group-hover:bg-zinc-800 transition-colors border border-zinc-800 group-hover:border-lime-400/50">
                                <Upload className="w-16 h-16 text-zinc-600 group-hover:text-lime-400 transition-colors" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-3xl font-bold text-white uppercase italic tracking-tight">Drop Secure Payload</h3>
                                <p className="text-zinc-500 text-sm font-mono uppercase tracking-widest max-w-md mx-auto">
                                    [JPG, PNG, PDF, RAW - MAX 500MB]
                                </p>
                            </div>

                            <label
                                htmlFor="fileInput"
                                className="inline-block px-12 py-5 bg-transparent border-2 border-lime-400 text-lime-400 hover:bg-lime-400 hover:text-black cursor-pointer font-bold uppercase text-xs tracking-[0.4em] transition-all"
                            >
                                Initiate Scrubbing
                            </label>

                            <div className="flex items-center justify-center gap-12 pt-8">
                                <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                                    <ShieldCheck className="w-4 h-4" /> End-to-End Encrypted
                                </div>
                                <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                                    <Lock className="w-4 h-4" /> No-Log Policy
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {uploading && (
                <div className="bg-[#050505] border border-lime-400/20 p-8 lg:p-12 relative overflow-hidden grid grid-cols-1 lg:grid-cols-4 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {/* Left Sidebar Simulation */}
                    <div className="hidden lg:flex flex-col border-r border-zinc-900 pr-8 space-y-10">
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] font-mono">Process Queue</h4>
                            <div className="space-y-2">
                                <div className="p-4 bg-lime-400/5 border-l-2 border-lime-400 space-y-2">
                                    <div className="text-xs font-bold text-white truncate">{file?.name}</div>
                                    <div className="text-[9px] font-mono text-lime-400 uppercase flex items-center gap-2">
                                        <Loader2 className="w-3 h-3 animate-spin" /> Analyzing...
                                    </div>
                                </div>
                                <div className="p-4 bg-zinc-900/50 border-l-2 border-zinc-800 opacity-50">
                                    <div className="text-xs font-bold text-zinc-400 truncate">batch_66.raw</div>
                                    <div className="text-[9px] font-mono text-zinc-600 uppercase">Waiting</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] font-mono">Modules</h4>
                            <nav className="space-y-2">
                                <NavItem label="Metadata Stripper" active={true} icon={<Activity className="w-4 h-4" />} />
                                <NavItem label="AI Noise Injector" active={true} icon={<Fingerprint className="w-4 h-4" />} />
                                <NavItem label="Exif Destroyer" active={true} icon={<EyeOff className="w-4 h-4" />} />
                            </nav>
                        </div>
                    </div>

                    {/* Main Processing Hub */}
                    <div className="lg:col-span-2 flex flex-col items-center justify-between min-h-[500px] py-4">
                        <div className="w-full flex justify-between items-start mb-8">
                            <div className="px-3 py-1 bg-lime-400/10 border border-lime-400/30 rounded-none text-[9px] font-mono text-lime-400 uppercase tracking-widest">
                                Protocol: TOXIC_WIPE_V4
                            </div>
                            <div className="px-3 py-1 bg-red-900/20 border border-red-500/50 rounded-none text-[9px] font-mono text-red-500 uppercase tracking-widest font-bold cursor-pointer hover:bg-red-500 hover:text-white transition-all">
                                ABORT
                            </div>
                        </div>

                        <div className="text-center space-y-4">
                            <h2 className="text-5xl font-bold uppercase italic tracking-tighter text-white">
                                Scrubbing <span className="text-lime-400 text-stroke">Active</span>
                            </h2>
                            <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest bg-zinc-900 inline-block px-3 py-1">
                                Target: {file?.name}
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 w-full my-8">
                            <MetricBox label="Threats Found" value="42" color="orange" detail="Detected" />
                            <MetricBox label="Data Erased" value="1.2" color="lime" detail="MB" />
                            <MetricBox label="Privacy Score" value="99" color="lime" detail="%" />
                        </div>

                        {/* Large Circular Dial - Industrial */}
                        <div className="relative w-72 h-72 flex items-center justify-center">
                            <div className="absolute inset-0 border border-zinc-800 rounded-full" />
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="144" cy="144" r="120" stroke="#222" strokeWidth="12" fill="transparent" />
                                <circle
                                    cx="144" cy="144" r="120"
                                    stroke="currentColor" strokeWidth="12"
                                    strokeDasharray={2 * Math.PI * 120}
                                    strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                                    fill="transparent"
                                    className="text-lime-400 transition-all duration-300 ease-linear"
                                    strokeLinecap="butt"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm rounded-full m-4 border border-zinc-800">
                                <span className="text-8xl font-bold italic tracking-tighter text-white">{progress}<span className="text-4xl text-zinc-600">%</span></span>
                                <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-lime-400 mt-2 animate-pulse">Processing</span>
                            </div>
                        </div>

                        <div className="w-full space-y-4 mt-8">
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <h4 className="text-[11px] font-bold text-lime-400 uppercase tracking-widest font-mono">Current Task: Signature Erasure</h4>
                                    <p className="text-[9px] text-zinc-500 font-mono">Injecting stochastic noise patterns...</p>
                                </div>
                                <div className="text-[9px] font-mono text-zinc-600 uppercase">PID: 99x_01</div>
                            </div>
                            <div className="h-2 w-full bg-zinc-900 overflow-hidden border border-zinc-800">
                                <div className="h-full bg-lime-400 w-2/3" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    </div>

                    {/* Right Panel Simulation */}
                    <div className="hidden lg:flex flex-col border-l border-zinc-900 pl-8 space-y-8">
                        <div>
                            <h4 className="text-sm font-bold text-white uppercase italic tracking-tight mb-2">Analysis Feed</h4>
                            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Real-time metadata interception</p>
                        </div>

                        <div className="space-y-4 font-mono">
                            <AnalysisItem label="GPS Coordinates" value="40.7128° N" status="DESTROYED" danger />
                            <AnalysisItem label="Device ID" value="Sony Alpha 7" status="OBFUSCATED" danger />
                            <AnalysisItem label="AI Pattern" value="Midjourney" status="ERASED" danger />
                            <AnalysisItem label="ICC Profile" value="Rebuilt" status="CLEAN" />
                        </div>

                        <div className="mt-auto space-y-3">
                            <button className="w-full py-4 bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-lime-400 uppercase tracking-widest hover:bg-zinc-800 transition-all">
                                View Full Log
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {processedUrl && (
                <div className="bg-[#050505] border border-lime-400/30 p-20 text-center space-y-12 animate-in zoom-in-95 duration-500 shadow-[0_0_100px_rgba(204,255,0,0.1)]">
                    <div className="w-32 h-32 bg-lime-400 rounded-full flex items-center justify-center mx-auto relative animate-bounce">
                        <CheckCircle className="w-16 h-16 text-black relative z-10" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-6xl font-bold uppercase italic tracking-tighter text-white">CLEANSED</h2>
                        <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.5em]">Zero Tracers Remaining</p>
                    </div>

                    <div className="flex gap-6 justify-center pt-8">
                        <a
                            href={processedUrl}
                            download={`clean-${file?.name || 'file'}`}
                            className="px-12 py-5 bg-lime-400 hover:bg-lime-300 text-black font-bold uppercase text-xs tracking-[0.4em] transition-all shadow-[8px_8px_0_white] hover:translate-x-1 hover:translate-y-1 hover:shadow-none border border-lime-400"
                        >
                            Download_Asset
                        </a>
                        <button
                            onClick={() => {
                                setFile(null);
                                setProcessedUrl(null);
                            }}
                            className="px-12 py-5 bg-transparent border border-white text-zinc-300 font-bold uppercase text-xs tracking-[0.4em] hover:bg-white hover:text-black transition-all"
                        >
                            Next_Job
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-950/10 border border-red-600 p-20 text-center space-y-8 animate-in shake-in duration-500">
                    <div className="w-24 h-24 bg-red-600 rounded-none flex items-center justify-center mx-auto">
                        <AlertTriangle className="w-12 h-12 text-black" />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-4xl font-bold uppercase italic text-red-600">FATAL_ERROR</h2>
                        <p className="text-red-500 font-mono text-xs uppercase tracking-widest leading-relaxed">
                            {error} <br />
                            PROCESS TERMINATED UNEXPECTEDLY.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setError(null);
                            setFile(null);
                        }}
                        className="px-10 py-4 bg-red-600 hover:bg-red-500 text-black font-bold uppercase text-[10px] tracking-[0.4em] transition-all"
                    >
                        REBOOT_SYSTEM
                    </button>
                </div>
            )}
        </div>
    );
}

function NavItem({ label, active, icon }: any) {
    return (
        <div className={clsx(
            "flex items-center gap-3 px-4 py-3 border transition-all cursor-pointer group",
            active ? "bg-lime-400/10 border-lime-400/50 text-white" : "border-transparent text-zinc-600 hover:text-zinc-300"
        )}>
            <div className={clsx(active ? "text-lime-400" : "text-zinc-700 group-hover:text-zinc-500")}>{icon}</div>
            <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
        </div>
    );
}

function MetricBox({ label, value, detail, color }: any) {
    const isLime = color === 'lime';
    const isOrange = color === 'orange';
    return (
        <div className="bg-[#111] border border-zinc-800 p-5 text-center space-y-1 hover:border-white/20 transition-colors">
            <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">{label}</div>
            <div className="text-3xl font-bold italic tracking-tighter text-white">
                {value} <span className={clsx("text-[10px] ml-1 uppercase", isLime ? "text-lime-600" : "text-orange-600")}>{detail}</span>
            </div>
        </div>
    );
}

function AnalysisItem({ label, value, status, danger }: any) {
    return (
        <div className="space-y-2 border-b border-zinc-800 pb-4 last:border-0 hover:bg-white/5 p-2 transition-colors">
            <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{label}</span>
                {danger && <AlertTriangle className="w-3 h-3 text-orange-600" />}
            </div>
            <div className="flex justify-between items-baseline font-mono">
                <span className={clsx("text-xs font-bold uppercase", danger ? "text-orange-500" : "text-white")}>{value}</span>
                <span className={clsx("text-[9px] uppercase font-bold", danger ? "text-red-500 line-through decoration-red-500" : "text-lime-500")}>{status}</span>
            </div>
        </div>
    );
}
