export default function About() {
  return (
    <section id="about" className="section section--left" aria-labelledby="about-title">
      <div className="panel">
        <p className="eyebrow">About</p>
        <h2 id="about-title" className="heading">
          I solve problems that matter.
        </h2>
        <p className="body">
          I'm a full-stack engineer who thinks about the whole picture: what the user experiences, how the code holds up under pressure, and whether the system is actually secure.
        </p>
        <p className="body">
          Most teams chase features and speed. I obsess over the parts you don't see — validation, rate limiting, resilience. That's where hard problems hide, and where I focus my energy.
        </p>
      </div>
    </section>
  );
}
