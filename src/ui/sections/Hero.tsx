export default function Hero() {
  return (
    <section id="hero" className="section section--center" aria-labelledby="hero-title">
      <div className="panel panel--hero">
        <p className="eyebrow">You've arrived at the Skylands</p>
        <h1 id="hero-title" className="title">
          Mario&nbsp;Flowers
        </h1>
        <p className="subtitle">Full-stack engineer who cares about what you can see and what you can't. Fast in the browser, solid on the server, locked down at the edge.</p>
        <a className="cta" href="#projects">
          Begin the journey
          <span aria-hidden="true"> ↓</span>
        </a>
        <span className="scroll-hint" aria-hidden="true">↓</span>
      </div>
    </section>
  );
}
