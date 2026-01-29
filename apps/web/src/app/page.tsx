import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl">YourSaaS</div>
          <div className="flex items-center gap-6">
            <Link href="#features" className="text-sm text-gray-600 hover:text-gray-900">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-sm bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-4 px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm font-medium">
            🚀 Launch Special — Lifetime Deal Available
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Your Compelling
            <span className="text-brand-600"> Value Proposition</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            One sentence that explains exactly what problem you solve and for whom.
            Make it specific and outcome-focused.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#pricing"
              className="bg-brand-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-brand-700 transition shadow-lg shadow-brand-600/25"
            >
              Get Lifetime Access — $59
            </Link>
            <Link
              href="#demo"
              className="border border-gray-300 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-50 transition"
            >
              See Demo
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            ✓ One-time payment &nbsp; ✓ Lifetime updates &nbsp; ✓ 30-day refund
          </p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-gray-50 border-y">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-sm text-gray-500 mb-6">Trusted by teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            {/* Replace with actual logos */}
            {['Company 1', 'Company 2', 'Company 3', 'Company 4'].map((co) => (
              <div key={co} className="text-xl font-semibold text-gray-400">
                {co}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Fast Setup',
                desc: 'Get started in minutes, not hours. No complex configuration.',
              },
              {
                icon: '🔒',
                title: 'Secure by Default',
                desc: 'Enterprise-grade security without the enterprise complexity.',
              },
              {
                icon: '📈',
                title: 'Built to Scale',
                desc: 'From side project to production. Grows with your needs.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border bg-white hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Simple Pricing</h2>
          <p className="text-center text-gray-600 mb-12">
            One price. Lifetime access. No subscriptions.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {/* LTD Card */}
            <div className="p-8 rounded-2xl border-2 border-brand-600 bg-white relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Lifetime Deal</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold">$59</span>
                <span className="text-gray-500 line-through">$299/yr</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'All features included',
                  'Lifetime updates',
                  'Priority support',
                  '30-day money back',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-brand-600 text-white py-3 rounded-lg font-medium hover:bg-brand-700 transition">
                Get Lifetime Access
              </button>
            </div>

            {/* Monthly Card */}
            <div className="p-8 rounded-2xl border bg-white">
              <h3 className="text-2xl font-bold mb-2">Monthly</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'All features included',
                  'Regular updates',
                  'Email support',
                  'Cancel anytime',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button className="w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition">
                Start Monthly
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join 500+ teams already using YourSaaS.
          </p>
          <Link
            href="#pricing"
            className="inline-block bg-brand-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-brand-700 transition shadow-lg shadow-brand-600/25"
          >
            Get Lifetime Access — $59
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} YourSaaS. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-900">Terms</Link>
            <Link href="/contact" className="hover:text-gray-900">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
