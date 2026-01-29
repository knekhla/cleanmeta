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
                                            brand: '#a3e635', // Lime-400
                                            brandAccent: '#84cc16', // Lime-500
                                            brandButtonText: 'black',
                                            defaultButtonBackground: '#18181b', // Zinc 900
                                            defaultButtonBackgroundHover: '#27272a',
                                            inputBackground: '#09090b', // Zinc 950
                                            inputBorder: '#27272a',
                                            inputText: 'white',
                                            inputLabelText: '#a1a1aa',
                                            anchorTextColor: '#a1a1aa',
                                            anchorTextHoverColor: '#a3e635',
                                        },
                                        radii: {
                                            borderRadiusButton: '0px', // Brutalist
                                            inputBorderRadius: '0px',
                                        },
                                        fonts: {
                                            bodyFontFamily: `var(--font-jetbrains-mono), monospace`,
                                            buttonFontFamily: `var(--font-jetbrains-mono), monospace`,
                                        }
                                    },
                                },
                                className: {
                                    button: '!font-bold !uppercase !tracking-widest !border !border-lime-400/20 hover:!border-lime-400 transition-all',
                                    input: '!bg-black/50 !border-zinc-800 focus:!border-lime-400/50 transition-colors !font-mono',
                                    label: '!uppercase !tracking-widest !text-[10px] !font-bold',
                                    anchor: '!text-[10px] !uppercase !tracking-widest hover:!text-lime-400 transition-colors',
                                }
                            }}
                            theme="dark"
                            providers={[]}
                            // showLinks={true} // Default is true, implied
                            redirectTo={`${process.env.NEXT_PUBLIC_APP_URL || 'https://cleanmeta.artifyapi.com'}/dashboard`}
                        />

                        {/* Custom Forgot Password Link Override if needed, but Supabase UI has one. 
                            However, since I made a custom page, I'll add a link here just in case 
                            users prefer a dedicated page or if the internal flow is confusing. 
                            Actually, the internal flow sends a magic link or reset email. 
                            My custom page does the same `resetPasswordForEmail`. 
                            I'll leave the Auth component to handle it for consistency. 
                        */}
                    </div>
                </div>
            </div>
        </div>
    );
}
