'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Activity, Database, FileText, Server, AlertCircle, Shield, Smartphone, Zap } from 'lucide-react';
import clsx from 'clsx';

interface DashboardStats {
    totalFiles: number;
    totalBytes: number;
    avgProcessingTime: number;
    gpsRemoved: number;
    deviceInfoRemoved: number;
    aiGenerationsDetected: number;
    errorRate: number;
    videoCount: number;
}

export default function AdminDashboard() {
    const supabase = createClient();
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            fetchData();
        };
        checkUser();
    }, [router, supabase]);

    const fetchData = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/admin/stats`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }

            const logsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/admin/logs?limit=10`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (logsRes.ok) {
                const logsData = await logsRes.json();
                setLogs(logsData.logs || []);
            }

        } catch (error) {
            console.error('Failed to fetch stats', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#000000] bg-grid text-white flex items-center justify-center">
                <div className="font-mono text-cyan-400 animate-pulse tracking-widest text-xs uppercase">Connecting_Secure_Uplink...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#000000] bg-grid text-white selection:bg-cyan-500/30 pb-20">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                    <div>
                        <h1 className="text-5xl font-bold tracking-[ -0.05em] text-white uppercase italic">
                            ADMIN_CONSOLE
                        </h1>
                        <p className="text-zinc-500 font-mono text-[10px] tracking-[0.4em] mt-3 uppercase">
                            System_Status: <span className="text-cyan-400 animate-pulse">OPTIMAL</span> // Ver: 2.1.0-Spectre
                        </p>
                    </div>
                    <button
                        onClick={fetchData}
                        className="px-6 py-3 bg-zinc-900 border border-white/5 hover:border-cyan-500/50 text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 hover:text-cyan-400 transition-all active:scale-95"
                    >
                        Force_Refresh
                    </button>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        label="Total File Ops"
                        value={stats?.totalFiles || 0}
                        icon={<FileText className="w-4 h-4 text-cyan-400" />}
                    />
                    <StatCard
                        label="Video Stream Ops"
                        value={stats?.videoCount || 0}
                        icon={<Activity className="w-4 h-4 text-purple-400" />}
                    />
                    <StatCard
                        label="Data Mass (Bytes)"
                        value={formatBytes(stats?.totalBytes || 0)}
                        icon={<Database className="w-4 h-4 text-emerald-400" />}
                    />
                    <StatCard
                        label="Avg Latency (ms)"
                        value={`${stats?.avgProcessingTime || 0}ms`}
                        icon={<Zap className="w-4 h-4 text-yellow-400" />}
                    />
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1 md:col-span-2 bg-zinc-900/20 border border-white/5 rounded-2xl p-8 backdrop-blur-2xl">
                        <h3 className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500 mb-8 flex items-center gap-2">
                            <Shield className="w-3 h-3 text-cyan-500" /> Privacy_Neutralization_Report
                        </h3>
                        <div className="grid grid-cols-3 gap-8">
                            <div className="p-6 bg-black/40 rounded border border-white/5 hover:border-cyan-500/20 transition-all group">
                                <div className="text-3xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors italic">{stats?.gpsRemoved}</div>
                                <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">GPS_SCRUBBED</div>
                            </div>
                            <div className="p-6 bg-black/40 rounded border border-white/5 hover:border-cyan-500/20 transition-all group">
                                <div className="text-3xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors italic">{stats?.deviceInfoRemoved}</div>
                                <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">DEVICE_HANDSHAKE_STRIPPED</div>
                            </div>
                            <div className="p-6 bg-black/40 rounded border border-white/5 hover:border-purple-500/20 transition-all group">
                                <div className="text-3xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors italic">{stats?.aiGenerationsDetected}</div>
                                <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">AI_SIG_ANOMALIES</div>
                            </div>
                        </div>
                    </div>


                    <div className="bg-zinc-900/20 border border-white/5 rounded-2xl p-8 backdrop-blur-2xl flex flex-col justify-center items-center text-center">
                        <h3 className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500 mb-6">Security_Handshake</h3>
                        <div className="w-24 h-24 rounded-full border-2 border-cyan-500/10 flex items-center justify-center relative my-4">
                            <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin transition-all duration-1000" style={{ animationDuration: '3s' }} />
                            <span className="text-xl font-bold text-white tracking-tighter italic">{100 - (stats?.errorRate || 0)}%</span>
                        </div>
                        <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mt-4">Integrity_Index</p>
                    </div>
                </div>

                {/* Logs Table */}
                <div className="bg-zinc-900/20 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-2xl">
                    <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-black/40">
                        <h3 className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-2">
                            <Server className="w-3 h-3 text-white" /> Node_Activity_Logs
                        </h3>
                        <span className="flex h-1.5 w-1.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[10px] font-mono">
                            <thead className="bg-black/60 text-zinc-600">
                                <tr>
                                    <th className="px-8 py-4 uppercase tracking-[0.2em] font-bold">Timestamp</th>
                                    <th className="px-8 py-4 uppercase tracking-[0.2em] font-bold">Subsystem</th>
                                    <th className="px-8 py-4 uppercase tracking-[0.2em] font-bold">Mass</th>
                                    <th className="px-8 py-4 uppercase tracking-[0.2em] font-bold">Latency</th>
                                    <th className="px-8 py-4 uppercase tracking-[0.2em] font-bold">Anomalies</th>
                                    <th className="px-8 py-4 uppercase tracking-[0.2em] font-bold">Return_Code</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-zinc-400">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-cyan-500/5 transition-colors group">
                                        <td className="px-8 py-4 whitespace-nowrap text-zinc-600 group-hover:text-zinc-400">
                                            {new Date(log.created_at).toLocaleTimeString()}
                                        </td>
                                        <td className="px-8 py-4 whitespace-nowrap">
                                            <span className={clsx(
                                                "px-2 py-0.5 rounded-sm text-[9px] uppercase font-bold tracking-[0.1em]",
                                                log.file_type === 'video' ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                            )}>
                                                {log.file_type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 whitespace-nowrap uppercase">{formatBytes(log.size_bytes)}</td>
                                        <td className="px-8 py-4 whitespace-nowrap">{log.processing_time_ms}ms</td>
                                        <td className="px-8 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                {log.meta_gps_found && <span className="text-red-500">GPS</span>}
                                                {log.meta_device_found && <span className="text-orange-500 font-bold italic">DEV</span>}
                                                {log.meta_ai_found && <span className="text-purple-400">AI_SIG</span>}
                                                {!log.meta_gps_found && !log.meta_device_found && !log.meta_ai_found && <span className="text-zinc-800">NULL</span>}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 whitespace-nowrap">
                                            <span className={clsx(
                                                "font-bold tracking-widest",
                                                log.status === 'success' ? "text-cyan-400" : "text-red-500"
                                            )}>
                                                {log.status === 'success' ? '0x00_OK' : '0x01_ERR'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) {
    return (
        <div className="bg-zinc-900/20 border border-white/5 rounded-2xl p-8 backdrop-blur-2xl hover:border-cyan-500/20 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-[40px] rounded-full -mr-12 -mt-12" />
            <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-mono">{label}</span>
                <div className="p-2.5 bg-black/40 rounded border border-white/5 group-hover:border-cyan-500/20 transition-colors">
                    {icon}
                </div>
            </div>
            <div className="text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors font-mono tracking-tighter italic relative z-10">
                {value}
            </div>
        </div>
    );
}

function formatBytes(bytes: number, decimals = 1) {
    if (!+bytes) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

