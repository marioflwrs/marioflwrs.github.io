import './App.css'
import { useRef, useState, useEffect } from 'react'
import type { TouchEvent } from 'react'
import { motion } from 'framer-motion'

const ACCENT1 = '#D732AA'
const ACCENT2 = '#FB2702'

const heroBg = `linear-gradient(135deg, ${ACCENT1} 0%, ${ACCENT2} 100%)`

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

	return (
	  <section
		style={{
		  width: '100vw',
		  height: '100vh',
		  background: heroBg,
		  display: 'flex',
		  flexDirection: 'row',
		  alignItems: 'center',
		  justifyContent: 'center',
		  position: 'relative',
		  overflow: 'hidden',
		  gap: 32,
		}}
		id="hero"
	  >
  <motion.img
	src="/avatar.png"
	alt="Mario Ballesteros"
	initial={{ scale: 0.7, opacity: 0, y: 40 }}
	animate={{ scale: 1, opacity: 1 }}
	transition={{ duration: 0.8, ease: 'easeOut' }}
	style={{
	  width: 120,
	  height: 120,
	  borderRadius: '50%',
	  border: `4px solid ${ACCENT2}`,
	  objectFit: 'cover',
	  boxShadow: `0 4px 32px ${ACCENT1}55`,
	  position: 'relative',
	}}
	whileHover={undefined}
  />
  {/* Bounce animation overlay */}
  <motion.div
	style={{
	  position: 'absolute',
	  left: 0,
	  top: 0,
	  width: 120,
	  height: 120,
	  pointerEvents: 'none',
	}}
	animate={{
	  y: [0, -30, 0, 30, 0],
	  x: [0, 20, 0, -20, 0],
	}}
	transition={{
	  duration: 4,
	  repeat: Infinity,
	  repeatType: 'loop',
	  ease: 'easeInOut',
	}}
	children={null}
  />
		<div style={{
		  display: 'flex',
		  flexDirection: 'column',
		  alignItems: 'flex-start',
		  maxWidth: 500,
		  minWidth: 320,
		}}>
		  <motion.h1
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.5, duration: 0.7 }}
			style={{
			  fontFamily: 'monospace',
			  color: '#fff',
			  fontSize: '2.2rem',
			  fontWeight: 700,
			  textAlign: 'left',
			  letterSpacing: '-1px',
			  lineHeight: 1.2,
			  margin: 0,
			  width: '100%',
			  whiteSpace: 'nowrap',
			  background: 'rgba(30, 30, 40, 0.95)',
			  borderRadius: 10,
			  padding: '1.2rem 2rem',
			  boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
			  borderLeft: `6px solid ${ACCENT1}`,
			  borderBottom: `2px solid ${ACCENT2}`,
			  position: 'relative',
			  overflow: 'hidden',
			  minWidth: 320,
			  maxWidth: 500,
			  display: 'block',
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
			  initial={{ opacity: 0, y: 10 }}
			  animate={{ opacity: 1, y: 0 }}
			  transition={{ delay: 0.2, duration: 0.5 }}
			  style={{
				color: '#fff',
				fontSize: '1.1rem',
				fontWeight: 400,
				opacity: 0.85,
				marginTop: 8,
				fontFamily: 'monospace',
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

  return (
	<section
	  ref={ref}
	  id="projects"
	  style={{
		width: '100vw',
		height: '100vh',
		background: '#fff',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
		position: 'relative',
	  }}
	>
			<h2 style={{ color: ACCENT1, marginBottom: 24, fontSize: '2rem' }}>Projects</h2>
			<div style={{ width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
						background: '#f9f9f9',
						borderRadius: 20,
						minWidth: 260,
						maxWidth: 320,
						minHeight: 220,
						padding: '2rem 1.5rem',
						border: `2px solid ${ACCENT1}22`,
						cursor: 'pointer',
						position: 'relative',
						boxShadow: active === 0 ? `0 2px 16px ${ACCENT2}22` : undefined,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						touchAction: 'pan-y', // allows horizontal drag on mobile
					}}
				>
					<h3 style={{ color: ACCENT2, marginBottom: 8 }}>{projects[active].title}</h3>
					<p style={{ color: '#222', marginBottom: 16 }}>{projects[active].desc}</p>
					<a
						href={projects[active].link}
						target="_blank"
						rel="noopener noreferrer"
						style={{
							color: '#fff',
							background: ACCENT1,
							padding: '0.5rem 1.2rem',
							borderRadius: 24,
							textDecoration: 'none',
							fontWeight: 600,
							fontSize: '1rem',
							transition: 'background 0.2s',
							marginTop: 'auto',
						}}
					>
						View Project
					</a>
				</motion.div>
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
		background: '#fff',
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
				<h2 style={{ color: ACCENT2, fontSize: '2rem', marginBottom: 24 }}>Contact</h2>
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
						color: '#fff',
						fontWeight: 700,
						cursor: 'pointer',
						marginBottom: 24,
						boxShadow: `0 2px 16px ${ACCENT1}22`,
						transition: 'background 0.2s',
						textDecoration: 'none',
					}}
				>
					Say Hello
				</motion.a>
				<div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 24 }}>
					<a href="mailto:maballesteros@protonmail.com" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT1, fontSize: 28 }}>
						📧
					</a>
					<a href="https://linkedin.com/in/marioflwrs" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT2, fontSize: 28 }}>
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
