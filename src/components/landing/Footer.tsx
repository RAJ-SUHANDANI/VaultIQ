'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#0a0f1e]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-lg font-bold text-white">VaultIQ</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Control Every Rupee. Master Every Decision. Your premium personal finance companion.
            </p>
          </div>

          {[
            {
              title: 'Product',
              links: ['Features', 'Pricing', 'Demo', 'Integrations'],
            },
            {
              title: 'Company',
              links: ['About', 'Blog', 'Careers', 'Contact'],
            },
            {
              title: 'Legal',
              links: ['Privacy', 'Terms', 'Security', 'Cookies'],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-gray-500 hover:text-emerald-400 transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} VaultIQ. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Made with 💚 for smart money managers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
