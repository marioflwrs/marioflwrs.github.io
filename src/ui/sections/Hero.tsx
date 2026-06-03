export default function Hero() {
  return (
    <section id="hero" className="section section--center" aria-labelledby="hero-title">
      <div className="panel panel--hero">
        <p className="eyebrow">Welcome to the Skylands</p>
        <h1 id="hero-title" className="title" style={{ fontSize: 'clamp(1.8rem, 5.5vw, 3.6rem)' }}>
          Mario Ballesteros
        </h1>
        <p className="subtitle">Full Stack Web Developer. I build fast, secure web applications with real-time systems. Focused on clean architecture, robust security, and AI-powered workflows.</p>
        <a className="cta" href="#projects">
          Begin the journey
          <span aria-hidden="true"> ↓</span>
        </a>
        <span className="scroll-hint" aria-hidden="true">↓</span>
      </div>
    </section>
  );
}
