import Spline from '@splinetool/react-spline'

export default function HeroSpline() {
  return (
    <section className="relative w-full h-[320px] md:h-[420px] lg:h-[520px] overflow-hidden rounded-2xl bg-black/5">
      <Spline
        scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-center px-6">
        <div className="max-w-2xl">
          <h1 className="text-2xl md:text-4xl font-semibold tracking-tight text-gray-800">
            Your AI Tutor — Personalized Playlists, Step‑by‑Step Coaching
          </h1>
          <p className="mt-3 text-sm md:text-base text-gray-600">
            An adaptive mentor that plans your learning path from trusted sources and coaches you through it.
          </p>
        </div>
      </div>
    </section>
  )
}
