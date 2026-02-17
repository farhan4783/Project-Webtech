import { useEffect, useState } from 'react'

function MouseGlow() {
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY })
            setVisible(true)
        }

        const handleMouseLeave = () => {
            setVisible(false)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [])

    return (
        <div
            className="cursor-glow"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                opacity: visible ? 1 : 0
            }}
        />
    )
}

export default MouseGlow
