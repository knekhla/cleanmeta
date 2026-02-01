
'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import DragDrop from '@/components/DragDrop';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Key, Copy, Trash2, Plus, Zap, Activity, Clock } from 'lucide-react';
import clsx from 'clsx';

export default function Dashboard() {
    const supabase = createClient();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [apiKeys, setApiKeys] = useState<any[]>([]);
    const [newKey, setNewKey] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            setUser(user);
            fetchDashboardData(user);
        };
        init();
    }, []);

    const fetchDashboardData = async (user: any) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            // Fetch Keys
            const resKeys = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/keys`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const keysData = await resKeys.json();
            setApiKeys(Array.isArray(keysData) ? keysData : []);

            // Fetch Profile/Stats (Mocked or Real)
            const resDash = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/dashboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const dashData = await resDash.json();
            setProfile(dashData.profile);

            setLoading(false);
        } catch (e) {
            console.error(e);
        }
    };

    const createKey = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/keys`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session?.access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: `Key ${apiKeys.length + 1}` })
        });
        const data = await res.json();
        if (data.apiKey) {
            setNewKey(data.apiKey);
            fetchDashboardData(user);
        }
    };

    const deleteKey = async (id: string) => {
        const { data: { session } } = await supabase.auth.getSession();
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/keys/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${session?.access_token}` }
        });
        fetchDashboardData(user);
    };

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">INITIALIZING SYSTEM...</div>;

    return (
        <div className="min-h-screen bg-black text-foreground font-sans selection:bg-lime-400 selection:text-black">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
                <header className="border-b border-zinc-800 pb-8">
                    <h1 className="text-4xl font-bold uppercase italic text-white flex items-center gap-4">
                        <Activity className="text-lime-400" />
                        Command Center
                    </h1>
                    <p className="text-zinc-500 font-mono mt-2 uppercase tracking-widest">
                        User: {user.email} // Status: {profile?.tier || 'UNKNOWN'}
                    </p>
                </header>

                {/* Decontamination Chamber */}
                <div className="space-y-6">
                    <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
                        <h2 className="text-2xl font-bold uppercase italic text-white flex gap-3 items-center">
                            <Activity className="w-5 h-5 text-lime-400" /> Active Workspace (Decontamination)
                        </h2>
                        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest animate-pulse">
                            Secure_Link: ESTABLISHED
                        </div>
                    </div>
                    <DragDrop />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Access Card */}
                    <div className="col-span-1 bg-[#050505] border border-zinc-800 p-8 space-y-6">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-lime-400/10 border border-lime-400/30">
                                <ShieldCheck className="w-6 h-6 text-lime-400" />
                            </div>
                            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Current Plan</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold uppercase italic text-white">{profile?.tier || 'GHOST'}</div>
                            <div className="text-xs font-mono text-zinc-500 mt-2 uppercase">Usage Limit: {profile?.usage_limit} Ops/Day</div>
                        </div>
                        <button onClick={() => router.push('/#pricing')} className="w-full py-3 border border-zinc-700 hover:border-lime-400 text-zinc-400 hover:text-white uppercase text-[10px] font-bold tracking-widest transition-all">
                            Upgrade Access
                        </button>
                    </div>

                    {/* API Keys Section */}
                    <div className="col-span-2 bg-[#050505] border border-zinc-800 p-8 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold uppercase italic text-white flex gap-3 items-center">
                                <Key className="w-5 h-5 text-lime-400" /> API Credentials
                            </h2>
                            <button onClick={createKey} className="px-4 py-2 bg-lime-400 hover:bg-lime-300 text-black font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all">
                                <Plus className="w-3 h-3" /> Generate Key
                            </button>
                        </div>

                        {newKey && (
                            <div className="bg-lime-900/20 border border-lime-400 p-6 animate-in fade-in slide-in-from-top-4">
                                <div className="text-lime-400 font-bold uppercase text-xs tracking-widest mb-2">New Key Generated (Copy Now - Won't Show Again)</div>
                                <div className="flex items-center gap-4 bg-black p-3 border border-lime-400/30 font-mono text-sm text-white break-all">
                                    {newKey}
                                    <Copy className="w-4 h-4 text-zinc-500 hover:text-white cursor-pointer ml-auto" onClick={() => navigator.clipboard.writeText(newKey)} />
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {apiKeys.length === 0 ? (
                                <div className="text-zinc-600 font-mono text-sm uppercase p-4 border border-zinc-900 border-dashed text-center">No Active Keys Found</div>
                            ) : (
                                apiKeys.map((key: any) => (
                                    <div key={key.id} className="flex flex-col md:flex-row items-center justify-between p-4 border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
                                            <div>
                                                <div className="font-bold text-white text-sm uppercase">{key.name}</div>
                                                <div className="font-mono text-xs text-zinc-500 uppercase">{key.key_prefix}****************</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-[10px] font-mono text-zinc-600 uppercase flex items-center gap-2">
                                                <Clock className="w-3 h-3" /> Used: {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'NEVER'}
                                            </div>
                                            <button onClick={() => deleteKey(key.id)} className="text-zinc-600 hover:text-red-500 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Integration Guide for n8n */}
                <div className="bg-zinc-900/20 border border-zinc-800 p-8 space-y-6">
                    <h3 className="text-xl font-bold uppercase italic text-white flex gap-3 items-center">
                        <Zap className="w-5 h-5 text-orange-500" /> n8n Complete Workflow
                    </h3>
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
                        Full automation: Generate Grid → Wait → Upscale U1 → Get HD Image
                    </p>

                    <div className="space-y-8 font-mono text-xs text-zinc-400">
                        {/* Step 1 */}
                        <div className="space-y-2">
                            <div className="uppercase tracking-widest text-lime-400 font-bold border-b border-lime-400/20 pb-1 w-fit">STEP 1: HTTP Request (POST /v1/imagine)</div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div><span className="text-zinc-500">Method:</span> POST</div>
                                    <div><span className="text-zinc-500">URL:</span> https://api.artifyapi.com/v1/imagine</div>
                                    <div><span className="text-zinc-500">Headers:</span></div>
                                    <div className="pl-4 text-zinc-500">x-api-key: sk_b43334218a97f664c54f36abd3afcfb295f897d282b2b6df</div>
                                    <div className="pl-4 text-zinc-500">Content-Type: application/json</div>
                                </div>
                                <div className="space-y-1">
                                    <div><span className="text-zinc-500">Body (JSON):</span> {'{"prompt": "your image description here"}'}</div>
                                    <div><span className="text-zinc-500">Returns:</span> {'{"jobId": "xxx-xxx"}'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="space-y-2">
                            <div className="uppercase tracking-widest text-lime-400 font-bold border-b border-lime-400/20 pb-1 w-fit">STEP 2: Wait Node</div>
                            <div>Wait 60 seconds for image generation to complete.</div>
                        </div>

                        {/* Step 3 */}
                        <div className="space-y-2">
                            <div className="uppercase tracking-widest text-lime-400 font-bold border-b border-lime-400/20 pb-1 w-fit">STEP 3: HTTP Request (GET /v1/jobs/:id)</div>
                            <div><span className="text-zinc-500">Method:</span> GET</div>
                            <div><span className="text-zinc-500">URL:</span> https://api.artifyapi.com/v1/jobs/{'{{$json.jobId}}'}</div>
                            <div><span className="text-zinc-500">Headers:</span> x-api-key: sk_b43334218a97f664c54f36abd3afcfb295f897d282b2b6df</div>
                            <div><span className="text-zinc-500">Check:</span> status == "completed"</div>
                        </div>

                        {/* Step 4 */}
                        <div className="space-y-2">
                            <div className="uppercase tracking-widest text-lime-400 font-bold border-b border-lime-400/20 pb-1 w-fit">STEP 4: HTTP Request (POST /v1/upscale)</div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div><span className="text-zinc-500">Method:</span> POST</div>
                                    <div><span className="text-zinc-500">URL:</span> https://api.artifyapi.com/v1/upscale</div>
                                    <div><span className="text-zinc-500">Headers:</span></div>
                                    <div className="pl-4 text-zinc-500">x-api-key: sk_b43334218a97f664c54f36abd3afcfb295f897d282b2b6df</div>
                                </div>
                                <div className="space-y-1">
                                    <div><span className="text-zinc-500">Body (JSON):</span> {'{"job_id": "{{$json.id}}", "index": 1}'}</div>
                                    <div><span className="text-zinc-500">Returns:</span> {'{"id": "upscale-job-id"}'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Step 5 */}
                        <div className="space-y-2">
                            <div className="uppercase tracking-widest text-lime-400 font-bold border-b border-lime-400/20 pb-1 w-fit">STEP 5: Wait + Get Final Result</div>
                            <div>Wait: 60 seconds</div>
                            <div><span className="text-zinc-500">Then GET:</span> https://api.artifyapi.com/v1/jobs/{'{{$json.id}}'}</div>
                            <div><span className="text-zinc-500">Result:</span> result.image_url = Your HD 2048x2048 image!</div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
