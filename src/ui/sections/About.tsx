export default function About() {
  return (
    <section id="about" className="section section--left" aria-labelledby="about-title">
      <div className="panel">
        <p className="eyebrow">About</p>
        <h2 id="about-title" className="heading">
          I solve problems that matter.
        </h2>
        <p className="body">
          I'm a Full Stack Web Developer building real-time digital ecosystems that scale. I focus on performance, security, and thoughtful architecture. When I'm not writing code, I use AI agents to automate boilerplate work and testing, so I can focus on what actually matters.
        </p>
        <p className="body">
          That means spending my time on strong system design, handling complex state under concurrency, and implementing multi-layered security. Things like custom rate limiters, request-level security policies, and proper input validation aren't exciting, but they're essential.
        </p>
      </div>
    </section>
  );
}
