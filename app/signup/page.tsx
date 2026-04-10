"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store/store";
import { signupThunk } from "@/lib/store/auth/authThunks";
import { toast } from "sonner";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Target,
  RefreshCw,
  User,
  Zap,
  Fingerprint,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(signupThunk({ name, username, email, password })).unwrap();
      toast.success("Registration successful. Welcome to Allied Surplus!");
      router.push("/login"); // Redirect to login after signup
    } catch (err: any) {
      toast.error(err || "Registration error: Account could not be created.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50 relative overflow-hidden">
      <style jsx>{`
        input::placeholder {
          color: black !important;
          opacity: 1 !important;
          font-weight: 800 !important;
          font-style: italic !important;
        }
      `}</style>
      {/* Decorative Matrix Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none select-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#000_1px,_transparent_1px)] bg-[length:40px_40px]" />
      </div>

      {/* Visual Side (Hidden on Mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 relative p-16 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://alliedsurplus.com/wp-content/uploads/2019/10/WideBanner.jpg"
            alt="Mission Background"
            className="h-full w-full object-cover scale-110 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-slate-900" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <Target size={22} className="text-white" />
            </div>
            <span className="text-xl font-black text-white uppercase tracking-tighter">
              Allied Surplus <span className="text-emerald-500">Recruit</span>
            </span>
          </div>

          <div className="space-y-6 max-w-sm">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">
              Join the <br />
              Allied Family
            </h2>
            <p className="text-sm font-medium text-slate-400 italic leading-relaxed">
              Join our community of professionals and enthusiasts. Create your
              account to access our full catalog, track orders, and receive
              exclusive updates.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6">
          <div className="h-0.5 w-12 bg-emerald-600 rounded-full" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">
            Established Sector: Surplus-X
          </span>
        </div>
      </div>

      {/* Signup Side */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="max-w-md w-full">
          <div className="mb-12 text-center md:text-left">
            <div className="md:hidden flex justify-center mb-6">
              <div className="h-12 w-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Zap size={28} className="text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">
              Create <span className="text-slate-400">Account</span>
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">
              Join the Allied Surplus community.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black ml-1 flex items-center gap-2">
                <User size={12} className="text-emerald-600" /> Full Name
              </label>
              <Input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="!placeholder:text-black !placeholder:opacity-100 !placeholder:font-bold text-black h-12 bg-white border-slate-200 rounded-2xl focus-visible:ring-emerald-500/20 font-bold text-sm tracking-tight placeholder:italic placeholder:font-normal"
                placeholder="ENTER FULL NAME"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black ml-1 flex items-center gap-2">
                <Fingerprint size={12} className="text-emerald-600" /> Username
              </label>
              <Input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="!placeholder:text-black !placeholder:opacity-100 !placeholder:font-bold text-black h-12 bg-white border-slate-200 rounded-2xl focus-visible:ring-emerald-500/20 font-bold text-sm tracking-tight placeholder:italic placeholder:font-normal"
                placeholder="ENTER USERNAME"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black ml-1 flex items-center gap-2">
                <Mail size={12} className="text-emerald-600" /> Email Address
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="!placeholder:text-black !placeholder:opacity-100 !placeholder:font-bold text-black h-12 bg-white border-slate-200 rounded-2xl focus-visible:ring-emerald-500/20 font-bold text-sm tracking-tight placeholder:italic placeholder:font-normal"
                placeholder="ENTER EMAIL ADDRESS"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black ml-1 flex items-center gap-2">
                <Lock size={12} className="text-emerald-600" /> Password
              </label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="!placeholder:text-black !placeholder:opacity-100 !placeholder:font-bold h-12 bg-white border-slate-200 rounded-2xl focus-visible:ring-emerald-500/20 font-bold text-sm tracking-tight placeholder:italic"
                placeholder="ENTER PASSWORD"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-4 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <>
                  Create Account{" "}
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center pt-8 border-t border-slate-200">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Already registered?{" "}
              <Link href="/login" className="text-emerald-600 hover:underline">
                Sign In Here
              </Link>
            </p>
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 border border-slate-200 opacity-50">
              <Fingerprint size={14} className="text-slate-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                Secure Identity Layer Active
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-medium italic">
              Nested Matrix Environment v2.4.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
