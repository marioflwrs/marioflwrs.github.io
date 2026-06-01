export default function Contact() {
  return (
    <section id="contact" className="section section--center" aria-labelledby="contact-title">
      <div className="panel panel--contact">
        <p className="eyebrow">Contact</p>
        <h2 id="contact-title" className="heading">
          Let&apos;s build something
        </h2>
        <p className="body">
          The sun&apos;s setting on the journey — but this is where it starts. Reach out and
          let&apos;s talk.
        </p>
        <ul className="link-row">
          <li>
            <a href="mailto:hello@example.com">Email</a>
          </li>
          <li>
            <a href="https://github.com/marioflwrs" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
