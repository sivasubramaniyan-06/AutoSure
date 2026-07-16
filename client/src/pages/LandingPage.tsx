/**
 * AUTOSURE — Landing Page
 * Clean, premium product landing page for AI vehicle damage assessments.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/utils/constants';

export default function LandingPage() {
  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 flex flex-col selection:bg-blue-500/30 selection:text-blue-200">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0B1220]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-sky-400 shadow-lg">
              <span className="text-sm font-black text-white">A</span>
            </div>
            <span className="bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent text-xl font-black tracking-tight">
              AUTOSURE
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to={ROUTES.LOGIN} className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">
              Sign In
            </Link>
            <Button as={Link} to={ROUTES.REGISTER} size="sm">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="relative px-6 py-20 md:py-32 flex flex-col items-center text-center max-w-4xl mx-auto gap-6 z-10">
          {/* Subtle glow background */}
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
          
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 text-xs text-blue-400 font-semibold uppercase tracking-wider">
            <span>✨ AI-Powered Claims Processing</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white leading-tight">
            AI Vehicle Damage<br />
            <span className="bg-gradient-to-r from-blue-500 to-sky-400 bg-clip-text text-transparent">
              Assessment
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl text-balance leading-relaxed">
            Upload vehicle photos and receive instant AI-powered insurance damage analysis, itemized repair estimates, and automated fraud checks.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            <Button
              as={Link}
              to={ROUTES.CLAIM_SUBMIT}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 border-none px-8 font-semibold shadow-lg shadow-blue-500/20"
            >
              Start Assessment
            </Button>
            <Button
              onClick={scrollToHowItWorks}
              variant="secondary"
              size="lg"
              className="px-8 font-semibold bg-white/5 border border-white/10 hover:bg-white/10"
            >
              Learn More
            </Button>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="border-t border-white/5 py-24 bg-slate-950/20">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                How It Works
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Streamline incident reports into verified digital insurance settlements in 3 quick steps.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  step: '01',
                  title: 'Upload Incident Photos',
                  desc: 'Provide owner details, vehicle parameters, and snap 6 mandatory damage angles of your vehicle.',
                  icon: '📸',
                },
                {
                  step: '02',
                  title: 'Instant AI Audit',
                  desc: 'Gemini Vision AI matches damage severity, maps parts, checks EXIF timestamps, and estimates pricing.',
                  icon: '🤖',
                },
                {
                  step: '03',
                  title: 'Approved Settlement',
                  desc: 'Download high-quality PDF reports, get insurance approvals, or transfer directly to repair workshops.',
                  icon: '💸',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="relative rounded-2xl border border-white/5 bg-white/[0.01] p-8 flex flex-col gap-4 hover:border-blue-500/20 transition-all group"
                >
                  <div className="absolute top-6 right-6 font-mono text-3xl font-black text-white/5 group-hover:text-blue-500/5 transition-colors">
                    {item.step}
                  </div>
                  <div className="text-3xl" aria-hidden>{item.icon}</div>
                  <h3 className="text-lg font-bold text-slate-200">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-white/5 py-24">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Built For Modern Insurance Audits
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Platform features designed for customers, claim officers, and assessors.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {[
                {
                  title: 'AI Powered Analysis',
                  desc: 'Advanced Vision AI automatically detects scratches, creases, cracks, and structural bumper damage.',
                  icon: '⚡',
                  color: 'from-blue-500/20 to-indigo-500/5',
                },
                {
                  title: 'Insurance Ready Reports',
                  desc: 'Get formatted itemized spreadsheets and claim approvals with calculated probabilities.',
                  icon: '📊',
                  color: 'from-sky-500/20 to-cyan-500/5',
                },
                {
                  title: 'Trusted & Secure',
                  desc: 'Fully encrypted connections, Firebase user access lists, role-based controls, and CORS safeguards.',
                  icon: '🛡️',
                  color: 'from-emerald-500/20 to-teal-500/5',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/5 bg-white/[0.01] p-8 flex flex-col gap-4 hover:bg-white/[0.02] transition-all hover:border-white/10"
                >
                  <div className="text-2xl" aria-hidden>{item.icon}</div>
                  <h3 className="text-lg font-bold text-slate-200">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950/40 py-12">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">AUTOSURE</span>
            <span>© {new Date().getFullYear()} AutoSure Platforms Inc.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
