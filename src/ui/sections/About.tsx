export default function About() {
  return (
    <section id="about" className="section section--left" aria-labelledby="about-title">
      <div className="panel">
        <p className="eyebrow">About</p>
        <h2 id="about-title" className="heading">
          Built for hard problems.
        </h2>
        <p className="body">
          I&apos;m a Full-Stack Product Engineer who cares about the intersection of code, motion,
          and design. I build interfaces and experiences that feel alive — performant, accessible,
          and engineered to last.
        </p>
        <p className="body">
          I approach every system through three lenses: what it does for users, how it&apos;s built
          under the hood, and how it&apos;s restricted at the perimeter. That last layer — security,
          validation, rate limiting, CI/CD — is where I think most engineers underinvest.
          It&apos;s where I focus.
        </p>
      </div>
    </section>
  );
}
