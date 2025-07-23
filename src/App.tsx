import './App.css'
import { useRef, useState, useEffect } from 'react'
import type { TouchEvent } from 'react'
import { motion } from 'framer-motion'

const ACCENT1 = '#D732AA'

const projects = [
	{
		title: 'Portfolio',
		desc: 'Personal site built with React + Vite.',
		link: 'https://github.com/marioflwrs/portfolio',
	},
	{
		title: 'Cool App',
		desc: 'A fun project using Framer Motion.',
		link: 'https://github.com/marioflwrs/cool-app',
	},
	{
		title: 'Open Source',
		desc: 'Contributions to the community.',
		link: 'https://github.com/marioflwrs',
	},
]

function HeroSection() {
	// Typewriter effect for the main line
	const mainLine = "Hi, I'm Mario Ballesteros"
	const subLine = "Creative Web Developer"
	const [displayed, setDisplayed] = useState('')
	const [done, setDone] = useState(false)
	useState(() => {
		let i = 0
		const interval = setInterval(() => {
			setDisplayed(mainLine.slice(0, i + 1))
			i++
			if (i === mainLine.length) {
				clearInterval(interval)
				setDone(true)
			}
		}, 40)
		return () => clearInterval(interval)
	})

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
	const check = () => setIsMobile(window.innerWidth <= 700)
	check()
	window.addEventListener('resize', check)
	return () => window.removeEventListener('resize', check)
  }, [])

  return (
	<section id="hero" className={isMobile ? 'hero mobile' : 'hero'}>
	  <motion.img
		id="hero-avatar"
		src="/avatar.png"
		alt="Mario Ballesteros"
		initial={{ opacity: 0, scale: 0.7, y: 40 }}
		animate={isMobile
		  ? { opacity: 1, scale: 1, y: 0, x: 0 }
		  : {
			  scale: [0.4, 2.2, 0.6, 1.8, 0.5, 2.5, 0.4],
			  opacity: 1,
			  y: [0, -18, 0, 18, 0],
			  x: [0, 12, 0, -12, 0],
			}
		}
		transition={isMobile
		  ? { duration: 0.8, ease: 'easeOut' }
		  : {
			  scale: { duration: 10, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' },
			  opacity: { duration: 0.8, ease: 'easeOut' },
			  y: { duration: 8, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' },
			  x: { duration: 10, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' },
			}
		}
		className={isMobile ? 'hero-avatar mobile' : 'hero-avatar'}
	  />
	  <div id="hero-text" className="hero-text">
		<motion.h1
		  initial={{ opacity: 0, y: 30 }}
		  animate={{ opacity: 1, y: 0 }}
		  transition={{ delay: 0.5, duration: 0.7 }}
		  className={isMobile ? 'hero-title mobile' : 'hero-title'}
		>
		  {displayed}
		  <motion.span
			animate={{ opacity: done ? 0 : [0, 1, 0] }}
			transition={{ repeat: Infinity, duration: 1 }}
			className="hero-cursor"
		  >
			|
		  </motion.span>
		</motion.h1>
		{done && (
		  <motion.div
			className={isMobile ? 'subline mobile' : 'subline'}
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2, duration: 0.5 }}
		  >
			{subLine}
		  </motion.div>
		)}
	  </div>
	</section>
  )
}

function ProjectsSection() {
	const ref = useRef(null)
	const [active, setActive] = useState(0)

	// Carousel navigation (mobile swipe/desktop arrows)
	const goTo = (idx: number) => setActive((idx + projects.length) % projects.length)

  // Mobile detection (reuse logic from HeroSection)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
	const check = () => setIsMobile(window.innerWidth <= 700)
	check()
	window.addEventListener('resize', check)
	return () => window.removeEventListener('resize', check)
  }, [])

  return (
	<section ref={ref} id="projects" className="projects-section">
	  <h2 className="projects-title">Projects</h2>
	  <div className="projects-carousel">
		{!isMobile && (
		  <button
			aria-label="Previous"
			onClick={() => goTo(active - 1)}
			className="carousel-arrow prev"
		  >
			‹
		  </button>
		)}
		<motion.div
		  key={active}
		  initial={{ x: 80, opacity: 0, scale: 0.95 }}
		  animate={{ x: 0, opacity: 1, scale: 1 }}
		  exit={{ x: -80, opacity: 0, scale: 0.95 }}
		  transition={{ duration: 0.5, type: 'spring' }}
		  whileHover={{ scale: 1.04 }}
		  drag="x"
		  dragConstraints={{ left: 0, right: 0 }}
		  dragElastic={0.2}
		  onDragEnd={(_, info) => {
			if (info.offset.x < -60) {
			  goTo(active + 1)
			} else if (info.offset.x > 60) {
			  goTo(active - 1)
			}
		  }}
		  className={active === 0 ? 'project-card active' : 'project-card'}
		>
		  <h3 className="project-title">{projects[active].title}</h3>
		  <p className="project-desc">{projects[active].desc}</p>
		  <a
			href={projects[active].link}
			target="_blank"
			rel="noopener noreferrer"
			className="project-link"
		  >
			View Project
		  </a>
		</motion.div>
		{!isMobile && (
		  <button
			aria-label="Next"
			onClick={() => goTo(active + 1)}
			className="carousel-arrow next"
		  >
			›
		  </button>
		)}
	  </div>
	  <div className="carousel-dots">
		{projects.map((_, i) => (
		  <span
			key={i}
			onClick={() => goTo(i)}
			className={i === active ? 'carousel-dot active' : 'carousel-dot'}
		  />
		))}
	  </div>
		</section>
	)
}

function ContactSection() {
  return (
	<section id="contact" className="contact-section">
	  {/* Floating background elements */}
	  <motion.div
		className="contact-float contact-float1"
		animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
		transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
	  />
	  <motion.div
		className="contact-float contact-float2"
		animate={{ y: [0, -20, 0], x: [0, -15, 0] }}
		transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
	  />
	  <div className="contact-content">
		<h2 className="contact-title">Contact</h2>
		<motion.a
		  href="mailto:maballesteros@protonmail.com"
		  target="_blank"
		  rel="noopener noreferrer"
		  initial={{ scale: 1 }}
		  whileHover={{ scale: 1.1 }}
		  className="contact-link"
		>
		  Say Hello
		</motion.a>
		<div className="contact-icons">
		  <a href="mailto:maballesteros@protonmail.com" target="_blank" rel="noopener noreferrer" className="contact-icon email">
			📧
		  </a>
		  <a href="https://linkedin.com/in/marioflwrs" target="_blank" rel="noopener noreferrer" className="contact-icon linkedin">
			in
		  </a>
		  {/* Optional: Add a contact form here */}
		</div>
	  </div>
	</section>
	)
}


// Section navigation logic
const sections = [
  { id: 'hero', component: <HeroSection /> },
  { id: 'projects', component: <ProjectsSection /> },
  { id: 'contact', component: <ContactSection /> },
]

function App() {
  const [sectionIdx, setSectionIdx] = useState(0)
  const touchStartY = useRef<number | null>(null)

  // Handle wheel (desktop)
  useEffect(() => {
	const onWheel = (e: WheelEvent) => {
		if (e.deltaY > 40) {
		setSectionIdx(idx => Math.min(idx + 1, sections.length - 1))
		} else if (e.deltaY < -40) {
		setSectionIdx(idx => Math.max(idx - 1, 0))
		}
	}
	window.addEventListener('wheel', onWheel, { passive: false })
	return () => window.removeEventListener('wheel', onWheel)
  }, [])

  // Handle swipe (mobile)
  const onTouchStart = (e: TouchEvent) => {
	touchStartY.current = e.touches[0].clientY
  }
  const onTouchEnd = (e: TouchEvent) => {
	if (touchStartY.current === null) return
	const deltaY = e.changedTouches[0].clientY - touchStartY.current
	if (deltaY < -50) {
		setSectionIdx(idx => Math.min(idx + 1, sections.length - 1))
	} else if (deltaY > 50) {
		setSectionIdx(idx => Math.max(idx - 1, 0))
	}
	touchStartY.current = null
  }

  return (
	<div
		style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}
		onTouchStart={onTouchStart}
		onTouchEnd={onTouchEnd}
	>
		<motion.div
		key={sectionIdx}
		initial={{ y: 60, opacity: 0 }}
		animate={{ y: 0, opacity: 1 }}
		exit={{ y: -60, opacity: 0 }}
		transition={{ duration: 0.5, ease: 'easeOut' }}
		style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }}
	  >
		{sections[sectionIdx].component}
	  </motion.div>
	  {/* Optional: Section indicators */}
	  <div style={{ position: 'absolute', right: 16, bottom: 32, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 10 }}>
		{sections.map((s, i) => (
		  <span
			key={s.id}
			style={{
			  width: 10,
			  height: 10,
			  borderRadius: '50%',
			  background: i === sectionIdx ? ACCENT1 : '#ddd',
			  display: 'inline-block',
			  margin: 2,
			  transition: 'background 0.2s',
			}}
		  />
		))}
	  </div>
	</div>
  )
}

export default App
