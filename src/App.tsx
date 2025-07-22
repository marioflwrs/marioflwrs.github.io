import './App.css'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const messages = [
	{
		text: 'GOOD MORNING',
		bg: '#222',
		color: '#FFD700',
	},
	{
		text: 'WELCOME TO MY SITE',
		bg: '#005f73',
		color: '#fff',
	},
	{
		text: 'ENJOY YOUR STAY!',
		bg: '#fff',
		color: '#222',
	},
]

function App() {
	const [msgIndex, setMsgIndex] = useState(0)
	const [displayed, setDisplayed] = useState('')
	const [typing, setTyping] = useState(true)

	useEffect(() => {
		setDisplayed('')
		setTyping(true)
		let i = 0
		const interval = setInterval(() => {
			setDisplayed(messages[msgIndex].text.slice(0, i + 1))
			i++
			if (i === messages[msgIndex].text.length) {
				clearInterval(interval)
				setTyping(false)
				// Wait before showing next message
				setTimeout(() => {
					if (msgIndex < messages.length - 1) {
						setMsgIndex(msgIndex + 1)
					}
				}, 1200)
			}
		}, 100)
		return () => clearInterval(interval)
		// eslint-disable-next-line
	}, [msgIndex])

	const { bg, color } = messages[msgIndex]

	return (
		<div
			style={{
				background: bg,
				minHeight: '100vh',
				transition: 'background 0.5s',
			}}
		>
			<motion.h1
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
				style={{
					fontFamily: 'monospace',
					display: 'inline-block',
					color,
					transition: 'color 0.5s',
				}}
			>
				{displayed}
				<motion.span
					animate={{ opacity: typing ? [0, 1, 0] : 0 }}
					transition={{ repeat: Infinity, duration: 1 }}
					style={{ display: 'inline-block' }}
				>
					|
				</motion.span>
			</motion.h1>
		</div>
	)
}

export default App
