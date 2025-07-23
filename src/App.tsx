import './App.css'
import { useRef, useState, useEffect } from 'react'
import type { TouchEvent } from 'react'
import { motion } from 'framer-motion'

const ACCENT1 = '#D732AA'
const ACCENT2 = '#FF3C1A'

const heroBg = `linear-gradient(135deg, #111216 0%, #1A1C22 100%)`

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
	<section
	  id="hero"
	  style={{
		width: '100vw',
		height: '100vh',
		background: heroBg,
		display: 'flex',
		flexDirection: isMobile ? 'column' : 'row',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		overflow: 'hidden',
		gap: 32,
		minHeight: '100vh',
		padding: 0,
	  }}
	>
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
		style={{
		  width: isMobile ? '28vw' : 'min(10vw, 72px)',
		  height: isMobile ? '28vw' : 'min(10vw, 72px)',
		  minWidth: 64,
		  minHeight: 64,
		  maxWidth: isMobile ? 120 : 120,
		  maxHeight: isMobile ? 120 : 120,
		  borderRadius: '50%',
		  border: `4px solid ${ACCENT1}`,
		  objectFit: 'cover',
		  boxShadow: `0 4px 32px ${ACCENT1}55`,
		  position: isMobile ? 'static' : 'relative',
		  margin: isMobile ? '0 auto 18px auto' : 0,
		  willChange: 'transform',
		}}
	  />
	  <div
		id="hero-text"
		style={{
		  display: 'flex',
		  flexDirection: 'column',
		  alignItems: 'center',
		  maxWidth: 500,
		  minWidth: 0,
		  paddingLeft: 0,
		  paddingRight: 0,
		}}
	  >
		<motion.h1
		  initial={{ opacity: 0, y: 30 }}
		  animate={{ opacity: 1, y: 0 }}
		  transition={{ delay: 0.5, duration: 0.7 }}
		  style={{
			fontFamily: 'monospace',
			color: '#F1F1F1',
			fontSize: isMobile ? '1.2rem' : '2.2rem',
			fontWeight: 700,
			textAlign: 'center',
			letterSpacing: '-1px',
			lineHeight: 1.2,
			margin: '0 auto',
			width: 'auto',
			minWidth: 'fit-content',
			maxWidth: 500,
			background: '#1A1C22',
			borderRadius: 10,
			padding: isMobile ? '0.7rem 0.7rem' : '1.2rem 2rem',
			boxShadow: '0 4px 24px #0008',
			borderLeft: `6px solid ${ACCENT2}`,
			borderBottom: `2px solid ${ACCENT1}`,
			position: 'relative',
			overflow: 'hidden',
			display: 'block',
			// Removed whiteSpace: 'nowrap' to allow wrapping
		  }}
		>
		  {displayed}
		  <motion.span
			animate={{ opacity: done ? 0 : [0, 1, 0] }}
			transition={{ repeat: Infinity, duration: 1 }}
			style={{
			  display: 'inline-block',
			  color: ACCENT2,
			  fontWeight: 900,
			}}
		  >
			|
		  </motion.span>
		</motion.h1>
		{done && (
		  <motion.div
			className="subline"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2, duration: 0.5 }}
			style={{
			  color: '#BBBBBB',
			  fontSize: isMobile ? '0.95rem' : '1.1rem',
			  fontWeight: 400,
			  opacity: 0.85,
			  marginTop: 8,
			  fontFamily: 'monospace',
			  textAlign: 'center',
			}}
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
	<section
	  ref={ref}
	  id="projects"
	  style={{
		width: '100vw',
		height: '100vh',
		background: '#111216',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
		position: 'relative',
	  }}
	>
	  <h2 style={{ color: ACCENT1, marginBottom: 24, fontSize: '2rem', textShadow: '0 2px 8px #0008' }}>Projects</h2>
	  <div style={{ width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
		{!isMobile && (
		  <button
			aria-label="Previous"
			onClick={() => goTo(active - 1)}
			style={{
			  background: 'none',
			  border: 'none',
			  fontSize: 32,
			  color: ACCENT1,
			  cursor: 'pointer',
			  marginRight: 8,
			  opacity: 0.7,
			}}
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
		  whileHover={{ scale: 1.04, boxShadow: `0 8px 32px ${ACCENT1}33` }}
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
		  style={{
			background: '#1A1C22',
			borderRadius: 20,
			minWidth: 260,
			maxWidth: 320,
			minHeight: 220,
			padding: '2rem 1.5rem',
			border: `2px solid ${ACCENT1}22`,
			cursor: 'pointer',
			position: 'relative',
			boxShadow: active === 0 ? `0 2px 16px ${ACCENT2}55` : undefined,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			touchAction: 'pan-y',
		  }}
		>
		  <h3 style={{ color: ACCENT2, marginBottom: 8, textShadow: '0 1px 4px #0008' }}>{projects[active].title}</h3>
		  <p style={{ color: '#BBBBBB', marginBottom: 16 }}>{projects[active].desc}</p>
		  <a
			href={projects[active].link}
			target="_blank"
			rel="noopener noreferrer"
			style={{
			  color: '#F1F1F1',
			  background: ACCENT1,
			  padding: '0.5rem 1.2rem',
			  borderRadius: 24,
			  textDecoration: 'none',
			  fontWeight: 600,
			  fontSize: '1rem',
			  transition: 'background 0.2s, box-shadow 0.2s',
			  marginTop: 'auto',
			  boxShadow: '0 0 12px 0 #D732AA55',
			}}
			onMouseOver={e => e.currentTarget.style.background = '#E94CBF'}
			onMouseOut={e => e.currentTarget.style.background = ACCENT1}
		  >
			View Project
		  </a>
		</motion.div>
		{!isMobile && (
		  <button
			aria-label="Next"
			onClick={() => goTo(active + 1)}
			style={{
			  background: 'none',
			  border: 'none',
			  fontSize: 32,
			  color: ACCENT2,
			  cursor: 'pointer',
			  marginLeft: 8,
			  opacity: 0.7,
			}}
		  >
			›
		  </button>
		)}
	  </div>
			<div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
				{projects.map((_, i) => (
					<span
						key={i}
						onClick={() => goTo(i)}
						style={{
							width: 10,
							height: 10,
							borderRadius: '50%',
							background: i === active ? ACCENT2 : '#ddd',
							display: 'inline-block',
							cursor: 'pointer',
							transition: 'background 0.2s',
						}}
					/>
				))}
			</div>
		</section>
	)
}

function ContactSection() {
  return (
	<section
	  id="contact"
	  style={{
		width: '100vw',
		height: '100vh',
		background: '#111216',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		overflow: 'hidden',
	  }}
	>
			{/* Floating background elements */}
			<motion.div
				style={{
					position: 'absolute',
					top: 40,
					left: 60,
					width: 80,
					height: 80,
					borderRadius: '50%',
					background: ACCENT1,
					opacity: 0.13,
					zIndex: 0,
				}}
				animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
				transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
			/>
			<motion.div
				style={{
					position: 'absolute',
					bottom: 40,
					right: 60,
					width: 60,
					height: 60,
					borderRadius: '50%',
					background: ACCENT2,
					opacity: 0.15,
					zIndex: 0,
				}}
				animate={{ y: [0, -20, 0], x: [0, -15, 0] }}
				transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
			/>
			<div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
		<h2 style={{ color: ACCENT2, fontSize: '2rem', marginBottom: 24, textShadow: '0 2px 8px #0008' }}>Contact</h2>
		<motion.a
		  href="mailto:maballesteros@protonmail.com"
		  target="_blank"
		  rel="noopener noreferrer"
		  initial={{ scale: 1 }}
		  whileHover={{ scale: 1.1, boxShadow: `0 0 24px ${ACCENT2}88` }}
		  style={{
			display: 'inline-block',
			padding: '1rem 2.5rem',
			fontSize: '1.2rem',
			borderRadius: 32,
			border: 'none',
			background: ACCENT1,
			color: '#F1F1F1',
			fontWeight: 700,
			cursor: 'pointer',
			marginBottom: 24,
			boxShadow: `0 2px 16px ${ACCENT1}55`,
			transition: 'background 0.2s, box-shadow 0.2s',
			textDecoration: 'none',
		  }}
		  onMouseOver={e => e.currentTarget.style.background = '#E94CBF'}
		  onMouseOut={e => e.currentTarget.style.background = ACCENT1}
		>
		  Say Hello
		</motion.a>
		<div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 24 }}>
		  <a href="mailto:maballesteros@protonmail.com" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT1, fontSize: 28, textShadow: '0 1px 4px #0008' }}>
			📧
		  </a>
		  <a href="https://linkedin.com/in/marioflwrs" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT2, fontSize: 28, textShadow: '0 1px 4px #0008' }}>
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
