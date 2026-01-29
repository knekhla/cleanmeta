
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { AlertTriangle, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPassword() {
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/dashboard?reset=true`,
        });

        if (error) {
            setError(error.message);
        } else {
            setSuccess(true);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-white uppercase italic tracking-tighter">Recover Access</h1>
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
                        Initiate credentials reset protocol
                    </p>
                </div>

                <div className="bg-[#050505] border border-zinc-800 p-8 space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-lime-400" />

                    {!success ? (
                        <form onSubmit={handleReset} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Target Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-zinc-600" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black border border-zinc-800 py-3 pl-12 pr-4 text-white text-sm font-mono focus:border-lime-400 focus:outline-none transition-colors"
                                        placeholder="user@domain.com"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-3 text-red-500 text-xs font-mono bg-red-950/20 p-3 border border-red-900/50">
                                    <AlertTriangle className="w-4 h-4" /> {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-lime-400 hover:bg-lime-300 text-black font-bold uppercase text-xs tracking-[0.2em] transition-all flex justify-center items-center gap-2 group-hover:shadow-[0_0_20px_rgba(204,255,0,0.3)]"
                            >
                                {loading ? 'Transmitting...' : 'Send Reset Link'} <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    ) : (
                        <div className="text-center space-y-6 py-4">
                            <div className="text-lime-400 font-bold uppercase text-xl italic tracking-tight">Signal Sent</div>
                            <p className="text-zinc-500 text-sm font-mono leading-relaxed">
                                Check your inbox. A secure link has been transmitted to {email}.
                            </p>
                            <Link href="/login" className="inline-block text-zinc-400 hover:text-white text-xs uppercase tracking-widest border-b border-zinc-800 hover:border-white transition-all pb-1">
                                Return to Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
