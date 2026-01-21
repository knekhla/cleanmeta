'use client';

import { createClient } from '@/lib/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import Navbar from '@/components/Navbar';

export default function Login() {
    const supabase = createClient();

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex flex-col items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl shadow-gray-200/50">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
                        <p className="mt-2 text-sm text-gray-500">Sign in to your account</p>
                    </div>

                    <Auth
                        supabaseClient={supabase}
                        appearance={{
                            theme: ThemeSupa,
                            variables: {
                                default: {
                                    colors: {
                                        brand: '#2563eb',
                                        brandAccent: '#1d4ed8',
                                    },
                                    radii: {
                                        borderRadiusButton: '9999px',
                                        inputBorderRadius: '12px',
                                    }
                                },
                            },
                        }}
                        providers={['github', 'google']}
                        redirectTo={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`}
                    />
                </div>
            </div>
        </div>
    );
}
