export default function Hero() {
  return (
    <section id="hero" className="section section--center" aria-labelledby="hero-title">
      <div className="panel panel--hero">
        <p className="eyebrow">Welcome to the Skylands</p>
        <h1 id="hero-title" className="title">
          Mario&nbsp;Flowers
        </h1>
        <p className="subtitle">Creative developer building immersive things for the web.</p>
        <a className="cta" href="#projects">
          Explore the islands
          <span aria-hidden="true"> ↓</span>
        </a>
      </div>
    </section>
  );
}
