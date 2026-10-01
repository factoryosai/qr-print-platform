'use client';

import Link from 'next/link';
import { ArrowRight, QrCode, Smartphone, Printer, CheckCircle2, Cloud, Shield, Zap, LayoutDashboard } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Banner */}
      <div className="bg-indigo-600 text-white text-sm py-2 px-4 text-center font-medium">
        <span className="opacity-90">🚀 New: Windows Print Agent 2.0 is live! Automated printer routing now available.</span>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-50/80 backdrop-blur-lg border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Printer className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">ScanToPrint</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-indigo-600 transition">How it works</a>
            <a href="#features" className="hover:text-indigo-600 transition">Features</a>
            <a href="#pricing" className="hover:text-indigo-600 transition">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">
              Log in
            </Link>
            <Link href="/signup" className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-full hover:bg-slate-800 transition shadow-sm">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grid.dapperui.pro/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="max-w-7xl mx-auto px-6 relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium text-sm mb-8 ring-1 ring-inset ring-indigo-200">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
            No apps required for customers
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 max-w-4xl mx-auto leading-tight">
            The modern operating system for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">print shops.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Eliminate WhatsApp clutter and USB viruses. Customers scan a QR code, upload files, and jobs are instantly routed to your Windows printers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
              Create your shop <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 rounded-full font-semibold hover:bg-slate-50 transition border border-slate-200 flex items-center justify-center">
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* Value Prop / Steps Section */}
      <section id="how-it-works" className="py-24 bg-white border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">A seamless experience</h2>
            <p className="text-slate-600">From the customer's phone directly to your paper.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-100 -z-10 -translate-y-1/2"></div>
            
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 relative group hover:-translate-y-1 transition duration-300">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition">
                <QrCode className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Scan QR</h3>
              <p className="text-slate-600">Customer walks in and scans the unique QR code on your counter using any smartphone camera.</p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 relative group hover:-translate-y-1 transition duration-300">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-6 text-cyan-600 group-hover:scale-110 transition">
                <Smartphone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Upload & Set</h3>
              <p className="text-slate-600">They select PDF or images, choose B&W/Color, select copies, and see the exact pricing instantly.</p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 relative group hover:-translate-y-1 transition duration-300">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition">
                <Printer className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Auto Print</h3>
              <p className="text-slate-600">The lightweight Print Agent catches the job and sends it silently to your connected Windows printer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything a print shop needs</h2>
            <p className="text-slate-600 text-lg">Powerful features wrapped in a ridiculously simple interface.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            <div className="md:col-span-2 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl p-8 text-white overflow-hidden relative shadow-sm border border-indigo-400/30">
              <div className="relative z-10">
                <LayoutDashboard className="w-10 h-10 mb-4 opacity-80" />
                <h3 className="text-2xl font-bold mb-2">Live Shop Dashboard</h3>
                <p className="text-indigo-100 max-w-sm">Monitor your queue in real-time. Retry failed prints, track daily revenue, and manage pricing rules from anywhere.</p>
              </div>
              <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-10">
                <LayoutDashboard className="w-64 h-64" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <Zap className="w-10 h-10 text-amber-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Instant Sync</h3>
              <p className="text-slate-600 text-sm">Orders hit your Windows Print Agent in milliseconds via WebSockets.</p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <Cloud className="w-10 h-10 text-cyan-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Cloud Storage</h3>
              <p className="text-slate-600 text-sm">Secure, short-lived signed URLs ensure customer files are protected.</p>
            </div>

            <div className="md:col-span-2 bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-sm border border-slate-800">
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <Shield className="w-10 h-10 mb-4 text-emerald-400" />
                  <h3 className="text-2xl font-bold mb-2">Privacy First Auto-Delete</h3>
                  <p className="text-slate-400 max-w-md">Once an order is printed, files are automatically swept from the server. Customers trust you, you save storage.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-600">Grow your shop's revenue without giving up your margins.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-slate-50 rounded-3xl p-10 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Starter</h3>
              <p className="text-slate-500 mb-6 text-sm">Perfect for evaluating the workflow.</p>
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-slate-900">₹0</span>
                <span className="text-slate-500 font-medium">/14 days</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Unlimited test prints', 'Live dashboard access', 'Basic B&W/Color routing', 'Community support'].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block w-full py-3 px-6 text-center rounded-xl font-semibold bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 transition">
                Start Trial
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-slate-900 rounded-3xl p-10 border border-slate-800 relative shadow-2xl shadow-indigo-900/20 ring-1 ring-indigo-500/50">
              <div className="absolute top-0 right-8 -translate-y-1/2">
                <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Professional</h3>
              <p className="text-slate-400 mb-6 text-sm">For busy cyber cafes and print shops.</p>
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-white">₹499</span>
                <span className="text-slate-400 font-medium">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Unlimited print jobs', 'Multi-printer auto routing', 'Aadhaar composite tools', 'Priority WhatsApp support', 'Custom shop branding'].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block w-full py-3 px-6 text-center rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-indigo-600 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://grid.dapperui.pro/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Ready to modernize your counter?</h2>
          <p className="text-indigo-100 text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of smart shop owners who have automated their print workflow. Setup takes less than 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="px-8 py-4 bg-white text-indigo-600 rounded-full font-bold hover:bg-slate-50 transition shadow-lg text-lg">
              Create free account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Printer className="w-6 h-6 text-indigo-500" />
              <span className="font-bold text-xl text-white tracking-tight">ScanToPrint</span>
            </div>
            <p className="mb-4 max-w-sm text-sm">Automating local print shops with seamless mobile uploads and direct-to-printer routing.</p>
            <p className="text-sm">Support: +91 70695 25795</p>
          </div>
          <div>
            <strong className="text-white font-semibold mb-4 block">Platform</strong>
            <ul className="space-y-2 text-sm">
              <li><a href="#how-it-works" className="hover:text-white transition">How it works</a></li>
              <li><a href="#features" className="hover:text-white transition">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
            </ul>
          </div>
          <div>
            <strong className="text-white font-semibold mb-4 block">Legal</strong>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>© {new Date().getFullYear()} ScanToPrint. Kaushik Savaliya. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
