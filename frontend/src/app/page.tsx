import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
      {/* --- Navigation --- */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo Icon */}
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-white font-bold text-xl shadow-md">
            SS
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">SkillSync AI</h1>
            <p className="text-xs text-slate-500 -mt-1 font-medium">Align your skills. Accelerate your career.</p>
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <div className="hidden md:flex gap-6">
            <a className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors" href="#features">Features</a>
            <a className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors" href="#how">How it works</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-700 hover:text-indigo-600 px-3 py-2 transition-colors">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* --- Hero Section --- */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16 md:py-24">
          {/* Left: Text Content */}
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-slate-900">
              Get interview-ready resumes and a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#7C3AED]">learning roadmap</span> tailored to you
            </h2>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              Upload your resume, pick a role, and let SkillSync AI analyze live job listings to generate an ATS-friendly resume and a bite-sized learning plan that fits your style.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white font-semibold shadow-lg shadow-indigo-200 hover:opacity-95 hover:translate-y-[-1px] transition-all"
              >
                Try free — Upload resume
              </Link>
              <a
                href="#how"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                See how it works
              </a>
            </div>

            <div className="mt-10 flex items-center gap-8 text-sm text-slate-500 border-t border-slate-100 pt-6">
              <div>
                <strong className="block text-slate-900">For students & pros</strong>
                <span>Resume + roadmap in minutes</span>
              </div>
              <div>
                <strong className="block text-slate-900">AI-powered</strong>
                <span>Gemini 2.5 Flash analysis</span>
              </div>
            </div>
          </div>

          {/* Right: UI Preview Card */}
          <div className="relative">
            {/* Decorative blob behind */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl blur-2xl opacity-50 -z-10"></div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xl relative z-10">
              <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Preview — Optimized Resume</div>
                <div className="px-2 py-1 bg-slate-50 text-slate-500 text-xs rounded-md font-medium">Role: Data Analyst</div>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900">Lokesh Manneti</h3>
                    <p className="text-xs text-slate-500">Bengaluru, India</p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  A results-driven analyst with experience building ETL pipelines. <span className="font-medium text-slate-900">Keywords: SQL, Python, Tableau.</span>
                </p>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex gap-3 p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <span className="shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2" />
                    <div>
                      <div className="font-semibold text-slate-800">Implemented optimized SQL queries</div>
                      <div className="text-slate-500 text-xs mt-0.5">Improved report runtime by 40%</div>
                    </div>
                  </div>

                  <div className="flex gap-3 p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <span className="shrink-0 w-2 h-2 bg-amber-400 rounded-full mt-2" />
                    <div>
                      <div className="font-semibold text-slate-800">Built data visualizations</div>
                      <div className="text-slate-500 text-xs mt-0.5">Dashboards with Tableau for stakeholder insights</div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <button className="flex-1 px-3 py-2 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-600 shadow-sm">Copy text</button>
                  <button className="flex-1 px-3 py-2 text-xs font-medium rounded-lg bg-slate-900 text-white shadow-md">Download PDF</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section id="features" className="py-20 border-t border-slate-200">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-3xl font-bold text-slate-900">Everything you need to grow</h3>
            <p className="mt-4 text-slate-600">We don't just fix your resume; we tell you what skills you're missing and exactly how to learn them.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-4">⚙️</div>
              <h4 className="font-bold text-lg text-slate-900">Live Job Analysis</h4>
              <p className="mt-2 text-slate-600 leading-relaxed">Our AI scans thousands of current job postings for your target role to find the *actual* skills recruiters are demanding right now.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-2xl mb-4">📝</div>
              <h4 className="font-bold text-lg text-slate-900">ATS-Optimized Resume</h4>
              <p className="mt-2 text-slate-600 leading-relaxed">Automatically rewrite your bullet points to include high-value keywords, maximizing your score on Applicant Tracking Systems.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl mb-4">🎯</div>
              <h4 className="font-bold text-lg text-slate-900">Personalized Roadmap</h4>
              <p className="mt-2 text-slate-600 leading-relaxed">Turn ambiguous feedback like "needs more experience" into a concrete, week-by-week learning plan with resources.</p>
            </div>
          </div>
        </section>

        {/* --- How it Works --- */}
        <section id="how" className="py-20">
          <h3 className="text-3xl font-bold text-center mb-12">How it works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-0.5 bg-slate-100 -z-10"></div>

            {[
              { num: 1, title: "Upload Resume", desc: "Upload a PDF. We extract your text securely." },
              { num: 2, title: "Choose Role", desc: "Tell us your dream job (e.g. 'React Dev')." },
              { num: 3, title: "AI Analysis", desc: "Gemini identifies your specific skill gaps." },
              { num: 4, title: "Get Roadmap", desc: "Receive a tailored plan to close those gaps." },
            ].map((step, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm relative group">
                <div className="w-16 h-16 mx-auto bg-white border-4 border-slate-50 text-xl font-bold flex items-center justify-center rounded-full mb-4 group-hover:border-indigo-50 group-hover:text-indigo-600 transition-colors">
                  {step.num}
                </div>
                <h5 className="font-bold text-center text-slate-900">{step.title}</h5>
                <p className="text-sm text-slate-500 text-center mt-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- CTA Strip --- */}
        <section className="my-20 py-12 px-8 rounded-3xl bg-gradient-to-r from-[#1E293B] to-[#0F172A] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div>
              <h4 className="text-3xl font-bold mb-2">Ready to accelerate your career?</h4>
              <p className="text-slate-400 text-lg">Join users who have already optimized their path.</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/signup"
                className="px-8 py-4 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-50 transition-colors shadow-lg"
              >
                Upload Resume
              </Link>
            </div>
          </div>
        </section>

        {/* --- Footer --- */}
        <footer className="py-10 border-t border-slate-100 text-sm text-slate-500">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>© {new Date().getFullYear()} SkillSync AI. Built with Gemini 2.5 & Next.js.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}