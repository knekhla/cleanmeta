'use client';

import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut, ShieldCheck, User } from 'lucide-react';

export default function Navbar() {
    const supabase = createClient();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    return (
        <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-[100]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                            <ShieldCheck className="w-8 h-8 text-cyan-400 relative z-10" />
                        </div>
                        <span className="font-bold text-2xl text-white tracking-[ -0.05em] uppercase italic group-hover:text-cyan-400 transition-colors">
                            CleanMeta
                        </span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="#features" className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">Features</Link>
                        <Link href="#pricing" className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">Pricing</Link>
                        <Link href="#security" className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">Security</Link>
                        <Link href="#api" className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">API</Link>
                    </div>

                    <div className="flex items-center space-x-6">
                        {user ? (
                            <div className="flex items-center gap-6">
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest hidden sm:block">
                                    Auth_ID: <span className="text-zinc-300">{user.email?.split('@')[0]}</span>
                                </span>
                                <button
                                    onClick={handleSignOut}
                                    className="p-2.5 rounded-lg border border-white/5 hover:border-red-500/30 hover:bg-red-500/5 text-zinc-500 hover:text-red-400 transition-all"
                                    title="Disconnect Terminal"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-6">
                                <Link href="/login" className="text-[10px] font-bold text-zinc-200 uppercase tracking-widest hover:text-white transition-colors">
                                    Login
                                </Link>
                                <Link
                                    href="/login"
                                    className="inline-flex items-center justify-center px-6 py-2.5 border border-cyan-400 text-[10px] uppercase font-bold tracking-[0.2em] rounded bg-cyan-400 text-black hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(0,242,255,0.2)]"
                                >
                                    Join Network
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
