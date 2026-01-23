'use client';

import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut, ShieldCheck } from 'lucide-react';

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
        <nav className="border-b border-lime-400/20 bg-black/80 backdrop-blur-xl sticky top-0 z-[100]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-lime-500 blur-lg opacity-20 group-hover:opacity-60 transition-opacity" />
                            <ShieldCheck className="w-8 h-8 text-lime-400 relative z-10" />
                        </div>
                        <span className="font-bold text-2xl text-white tracking-[-0.05em] uppercase italic group-hover:text-lime-400 transition-colors">
                            CleanMeta
                        </span>
                    </Link>

                    {/* Desktop Navigation Links - Monospace */}
                    <div className="hidden md:flex items-center space-x-8">
                        {['Features', 'Pricing', 'Security', 'API'].map((item) => (
                            <Link key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-mono font-bold text-zinc-500 hover:text-lime-400 uppercase tracking-widest transition-colors">
                                {item}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center space-x-6">
                        {user ? (
                            <div className="flex items-center gap-6">
                                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest hidden sm:block">
                                    Auth_ID: <span className="text-lime-400">{user.email?.split('@')[0]}</span>
                                </span>
                                <button
                                    onClick={handleSignOut}
                                    className="p-2 rounded border border-zinc-800 hover:border-red-500/50 hover:bg-red-950/30 text-zinc-500 hover:text-red-500 transition-all font-mono text-xs"
                                    title="Disconnect Terminal"
                                >
                                    LOGOUT
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-8">
                                <Link href="/login" className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest hover:text-white transition-colors">
                                    Login
                                </Link>
                                <Link
                                    href="/login"
                                    className="inline-flex items-center justify-center px-6 py-2.5 border border-lime-400 text-[10px] uppercase font-bold tracking-[0.2em] bg-lime-400 text-black hover:bg-lime-300 hover:scale-105 transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)]"
                                >
                                    Join_Network
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
