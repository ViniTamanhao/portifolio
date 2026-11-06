import { AsciiPlatypus } from './components/AsciiPlatypus'
import { ThemeToggle } from './components/ThemeToggle'
import { AsciiMargins } from './components/AsciiMargins'
import type { ReactNode } from 'react'

const experience = [
  {
    company: 'SMAAART', role: 'Software Engineer',
    start: 'Jan 2026', startDate: '2026-01', end: 'Present',
    description: 'Modernizing automotive dealership software with an international team. Go services, React, Next.js, TypeScript, APIs, and integrations, alongside the care of existing production systems.',
  },
  {
    company: 'ToutPourSaGloire', role: 'Full-stack Developer',
    start: 'Nov 2024', startDate: '2024-11', end: 'Jan 2026', endDate: '2026-01',
    description: 'Built production React and TypeScript applications, reusable UI components, API integrations, and content-driven features with Strapi.',
  },
  {
    company: 'Desiring God', role: 'Technology Coordinator / Software Developer',
    start: 'Jan 2024', startDate: '2024-01', end: 'Jan 2026', endDate: '2026-01',
    description: 'Built Python and Node.js automation, backend tooling, integrations, and internal software for international publishing workflows.',
  },
  {
    company: 'Ministério Fiel', role: 'Developer',
    start: 'Jun 2023', startDate: '2023-06', end: 'Jan 2026', endDate: '2026-01',
    description: 'Developed internal and public-facing applications, backend services, APIs, and automation with Python, Node.js, and TypeScript.',
  },
  {
    company: 'GO-IT', role: 'Intern / Junior Developer',
    start: 'May 2022', startDate: '2022-05', end: 'Jul 2023', endDate: '2023-07',
    description: 'Worked across full-stack applications: Node.js APIs, React and Next.js interfaces, databases, and AWS-based projects.',
  },
]

function Section({ id, number, title, children }: {
  id: string; number: string; title: string; children: ReactNode
}) {
  return (
    <section className="section" aria-labelledby={`${id}-heading`} id={id}>
      <h2 id={`${id}-heading`} className="section-label"><span aria-hidden="true">{number} / </span>{title}</h2>
      <div className="section-body">{children}</div>
    </section>
  )
}

function Arrow() {
  return <span className="link-arrow" aria-hidden="true">↗</span>
}

export function App() {
  return (
    <>
      <AsciiMargins />
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="page">
        <header className="masthead">
          <a href="#" className="monogram" aria-label="Vinícius Silva, back to top">V</a>
          <div className="masthead-tools">
            <span className="location">São José dos Campos, BR</span>
            <ThemeToggle />
          </div>
        </header>

        <main id="main">
          <div className="introduction">
            <p className="eyebrow">Software engineer</p>
            <h1>Vinícius Silva<span className="name-period">.</span></h1>
            <p className="intro-lead">I build backend systems, interfaces, and tools that make software easier to understand.</p>
          </div>
          <div className="introduction introduction-details">
            <p>I’m a software engineer in Brazil with over four years of professional experience. Most days, I work with Go, TypeScript, and React, moving between APIs and the interfaces that use them.</p>
            <p>I’m drawn to developer tooling, software architecture, and infrastructure. Lately, I’ve been exploring how coding agents can carry useful knowledge from one session to the next.</p>
            <a className="text-link intro-contact" href="mailto:vtamanhao@gmail.com">Say hello <Arrow /></a>
          </div>

          <Section id="building" number="01" title="Building">
            <article className="project">
              <div className="project-heading">
                <h3><a className="text-link" href="https://github.com/ViniTamanhao/graybox-core">Graybox <Arrow /></a></h3>
                <span className="status active"><span aria-hidden="true" />Active</span>
              </div>
              <p>A Go CLI for understanding HTTP API behavior. Capture traffic, redact sensitive data, replay requests, and compare responses with semantic diffs.</p>
              <p className="project-note">A closer look at what changed, and where.</p>
            </article>
            <article className="project">
              <div className="project-heading">
                <h3>Unak</h3>
                <span className="status">In development</span>
              </div>
              <p>An experiment in shared knowledge for AI coding agents. I’m exploring how agents could preserve, retrieve, and share context across sessions, environments, and workflows.</p>
              <p className="project-note">United Agentic Knowledge. Still taking shape.</p>
            </article>
          </Section>

          <Section id="experience" number="02" title="Experience">
            <p className="section-preface">Teams I’ve worked with. Some chapters overlap.</p>
            <ol className="experience-list">
              {experience.map(job => (
                <li className="job" key={job.company}>
                  <div className="job-heading">
                    <h3>{job.company}</h3>
                    <p className="dates"><time dateTime={job.startDate}>{job.start}</time><span aria-hidden="true"> — </span><span className="sr-only"> to </span>{job.endDate ? <time dateTime={job.endDate}>{job.end}</time> : job.end}</p>
                  </div>
                  <p className="job-role">{job.role}</p>
                  <p className="job-description">{job.description}</p>
                </li>
              ))}
            </ol>
            <div className="education">
              <span className="eyebrow">Along the way</span>
              <p>Computer Engineering <span className="education-date">2023–2028</span></p>
              <p className="education-school">Universidade Virtual do Estado de São Paulo (UNIVESP)</p>
            </div>
          </Section>

          <Section id="elsewhere" number="03" title="Elsewhere">
            <p>For code, a conversation, or a simple hello.</p>
            <nav className="social-links" aria-label="Find me elsewhere">
              <a className="text-link" href="https://github.com/ViniTamanhao">GitHub <Arrow /></a>
              <a className="text-link" href="https://www.linkedin.com/in/vin%C3%ADciustamanh%C3%A3o/">LinkedIn <Arrow /></a>
              <a className="text-link" href="mailto:vtamanhao@gmail.com">Email <Arrow /></a>
            </nav>
          </Section>
          <AsciiPlatypus />
        </main>

        <footer className="footer">
          <p>A small corner of the internet.<br /><span>Made with care, in Brazil.</span></p>
          <a className="text-link" href="#main">Back to top ↑</a>
        </footer>
      </div>
    </>
  )
}
