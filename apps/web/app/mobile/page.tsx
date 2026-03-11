import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mobile App Coming Soon — Snap-It',
  description: 'Snap-It mobile apps for iOS and Android coming soon. Currently available on desktop.',
}

export default function MobilePage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo/Title */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Snap-It
          </h1>
          <p className="text-white/50 text-lg">Beautiful Screenshots Instantly</p>
        </div>

        {/* Main Message */}
        <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white">Mobile Apps Coming Soon</h2>
            <p className="text-white/50">
              We're working on native apps for iOS and Android
            </p>
          </div>

          {/* App Store Badges */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* App Store Badge */}
            <a
              href="#"
              className="flex items-center gap-3 bg-white/10 rounded-lg px-6 py-3.5 border border-white/10 hover:bg-white/15 transition-colors cursor-not-allowed opacity-70"
              aria-disabled="true"
            >
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-left">
                <div className="text-[10px] text-white/40 uppercase tracking-wide">Coming Soon</div>
                <div className="text-base font-semibold text-white -mt-0.5">App Store</div>
              </div>
            </a>

            {/* Google Play Badge */}
            <a
              href="#"
              className="flex items-center gap-3 bg-white/10 rounded-lg px-6 py-3.5 border border-white/10 hover:bg-white/15 transition-colors cursor-not-allowed opacity-70"
              aria-disabled="true"
            >
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
              <div className="text-left">
                <div className="text-[10px] text-white/40 uppercase tracking-wide">Coming Soon</div>
                <div className="text-base font-semibold text-white -mt-0.5">Google Play</div>
              </div>
            </a>
          </div>

          {/* Desktop Notice */}
          <div className="pt-4 border-t border-white/10">
            <div className="inline-flex items-center gap-2 bg-sky-500/10 text-sky-400 rounded-lg px-4 py-2 text-sm border border-sky-500/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Desktop version available now</span>
            </div>
            <p className="text-white/30 text-sm mt-3">
              Visit Snap-It on your desktop or laptop to start creating beautiful screenshots
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-white/30 text-sm">
          <p>Get notified when we launch</p>
          <p className="text-xs mt-2 text-white/20">Follow us for updates</p>
        </div>
      </div>
    </div>
  )
}
