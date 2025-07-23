
import './App.css'



import React, { useRef, useState, useEffect } from 'react';
import './App.css';
import { motion } from 'framer-motion';
import { FaArrowsAltV, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { MdSwipeVertical } from 'react-icons/md';
import ThemeToggle from './components/ThemeToggle';
import HeroSection from './components/HeroSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';

const ACCENT1 = '#D732AA';
const ACCENT2 = '#FF3C1A';

const sections = [
  { id: 'hero', component: <HeroSection /> },
  { id: 'projects', component: <ProjectsSection /> },
  { id: 'contact', component: <ContactSection /> },
];

function App() {
  const [sectionIdx, setSectionIdx] = useState(0)
  const [darkMode, setDarkMode] = useState(() => {
	// Prefer system dark mode on first load
	if (typeof window !== 'undefined' && window.matchMedia) {
	  return window.matchMedia('(prefers-color-scheme: dark)').matches
	}
	return false
  })
  const touchStartY = useRef<number | null>(null)

  // Mobile detection for hint
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
	const check = () => setIsMobile(window.innerWidth <= 700)
	check()
	window.addEventListener('resize', check)
	return () => window.removeEventListener('resize', check)
  }, [])

  // Apply dark mode class to body
  useEffect(() => {
	document.body.classList.toggle('dark', darkMode)
  }, [darkMode])

  // Handle wheel and keyboard navigation (always enabled)
  useEffect(() => {
	const onWheel = (e: WheelEvent) => {
	  if (e.deltaY > 40) {
		setSectionIdx(idx => Math.min(idx + 1, sections.length - 1))
	  } else if (e.deltaY < -40) {
		setSectionIdx(idx => Math.max(idx - 1, 0))
	  }
	}
	const onKeyDown = (e: KeyboardEvent) => {
	  if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
	  if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
		setSectionIdx(idx => Math.min(idx + 1, sections.length - 1))
	  } else if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
		setSectionIdx(idx => Math.max(idx - 1, 0))
	  }
	}
	window.addEventListener('wheel', onWheel, { passive: false })
	window.addEventListener('keydown', onKeyDown)
	return () => {
	  window.removeEventListener('wheel', onWheel)
	  window.removeEventListener('keydown', onKeyDown)
	}
  }, [])

  // Handle swipe (mobile)
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
	touchStartY.current = e.touches[0].clientY
  }
  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
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
	  <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
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
	  {/* Section indicators */}
	  <div style={{ position: 'absolute', right: 16, bottom: 32, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 10 }}>
		{sections.map((s, i) => (
		  <span
			key={s.id}
			style={{
			  width: 10,
			  height: 10,
			  borderRadius: '50%',
			  background: i === sectionIdx ? (darkMode ? ACCENT1 : ACCENT2) : '#ddd',
			  display: 'inline-block',
			  margin: 2,
			  transition: 'background 0.2s',
			}}
		  />
		))}
	  </div>
	  {/* Scroll/Swipe hint */}
	  <motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 0.8, y: 0 }}
		transition={{ delay: 1.2, duration: 0.7 }}
		style={{
		  position: 'absolute',
		  left: 0,
		  right: 0,
		  bottom: 12,
		  textAlign: 'center',
		  fontSize: 18,
		  color: darkMode ? '#fff' : '#222',
		  letterSpacing: 1,
		  pointerEvents: 'none',
		  zIndex: 20,
		  fontFamily: 'monospace',
		  textShadow: '0 2px 8px #0008',
		  display: 'flex',
		  flexDirection: 'column',
		  alignItems: 'center',
		  gap: 2,
		}}
	  >
		<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
		  <FaArrowsAltV style={{ fontSize: 22, marginRight: 6, verticalAlign: 'middle' }} />
		  {isMobile ? <MdSwipeVertical style={{ fontSize: 22, verticalAlign: 'middle' }} /> : 'Scroll'}
		</span>
		<span style={{ fontSize: 13, opacity: 0.7, marginTop: 2 }}>
		  {isMobile ? 'Swipe' : (
			<span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
			  <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
				<FaArrowsAltV style={{ fontSize: 15, marginRight: 2, verticalAlign: 'middle' }} />
				Scroll
			  </span>
			  <span style={{ margin: '0 6px' }}>|</span>
			  <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
				<b>W</b> <FaArrowUp style={{ fontSize: 13, verticalAlign: 'middle' }} />
			  </span>
			  <span style={{ margin: '0 2px' }}>/</span>
			  <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
				<b>S</b> <FaArrowDown style={{ fontSize: 13, verticalAlign: 'middle' }} />
			  </span>
			  <span style={{ margin: '0 2px' }}>/</span>
			  <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
				<FaArrowUp style={{ fontSize: 13, verticalAlign: 'middle' }} />
				<FaArrowDown style={{ fontSize: 13, verticalAlign: 'middle' }} />
			  </span>
			  <span style={{ marginLeft: 4 }}>to navigate</span>
			</span>
		  )}
		</span>
	  </motion.div>
	</div>
  )
}

export default App
