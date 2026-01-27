import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#020617]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/10 via-transparent to-transparent opacity-60" />
      <div className="w-full max-w-lg bg-slate-900/80 backdrop-blur-[60px] p-12 rounded-[4rem] border-2 border-white/10 shadow-[0_0_120px_rgba(0,0,0,0.9)] relative z-10 transition-all">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mb-3 stylish-text tracking-tighter uppercase">{title}</h1>
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;