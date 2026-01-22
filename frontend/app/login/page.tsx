'use client';

import { createClient } from '@/lib/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import Navbar from '@/components/Navbar';

export default function Login() {
    const supabase = createClient();

    return (
        <div className="min-h-screen bg-[#000000] bg-grid text-white relative selection:bg-cyan-500/30">
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
                <div className="w-full max-w-md space-y-10 bg-zinc-900/20 backdrop-blur-2xl p-12 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden group">
                    {/* Cybernetic Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[50px] rounded-full -mr-16 -mt-16" />

                    <div className="text-center relative z-10">
                        <h2 className="text-4xl font-bold tracking-[ -0.05em] uppercase italic text-white leading-none">
                            Identity_Check
                        </h2>
                        <p className="mt-4 text-[10px] text-zinc-500 font-mono uppercase tracking-[0.4em]">
                            Authorized_Personnel_Only
                        </p>
                    </div>


                    <div className="relative z-10">
                        <Auth
                            supabaseClient={supabase}
                            appearance={{
                                theme: ThemeSupa,
                                variables: {
                                    default: {
                                        colors: {
                                            brand: '#06b6d4', // Cyan
                                            brandAccent: '#0891b2',
                                            brandButtonText: 'white',
                                            defaultButtonBackground: '#18181b', // Zinc 900
                                            defaultButtonBackgroundHover: '#27272a',
                                            inputBackground: '#09090b', // Zinc 950
                                            inputBorder: '#27272a',
                                            inputText: 'white',
                                            inputLabelText: '#a1a1aa',
                                        },
                                        radii: {
                                            borderRadiusButton: '4px',
                                            inputBorderRadius: '4px',
                                        },
                                        fonts: {
                                            bodyFontFamily: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
                                            buttonFontFamily: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
                                        }
                                    },
                                },
                                className: {
                                    button: 'uppercase tracking-widest font-bold !border-white/10 hover:!border-cyan-500/50 transition-colors',
                                    input: '!bg-black/50 !border-white/10 focus:!border-cyan-500/50 transition-colors',
                                    label: 'uppercase tracking-wider text-xs',
                                }
                            }}
                            theme="dark"
                            providers={[]}
                            showLinks={false}
                            redirectTo={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/dashboard`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
