import { useEffect, useRef, useState } from 'react'

function AnimatedBackground() {
    const [scrollY, setScrollY] = useState(0)
    const orbsRef = useRef([])

    useEffect(() => {
        let animationFrameId

        const handleScroll = () => {
            setScrollY(window.pageYOffset)
        }

        const handleMouseMove = (e) => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId)
            }

            animationFrameId = requestAnimationFrame(() => {
                const mouseX = e.clientX / window.innerWidth
                const mouseY = e.clientY / window.innerHeight

                orbsRef.current.forEach((orb, index) => {
                    if (orb) {
                        const speed = 20 + (index * 15)
                        const x = (mouseX - 0.5) * speed
                        const y = (mouseY - 0.5) * speed
                        const scrollOffset = scrollY * (0.1 + (index * 0.05))
                        orb.style.transform = `translate(${x}px, ${y + scrollOffset}px)`
                    }
                })
            })
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        window.addEventListener('mousemove', handleMouseMove, { passive: true })

        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('mousemove', handleMouseMove)
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId)
            }
        }
    }, [scrollY])

    return (
        <div className="bg-animation">
            <div className="gradient-orb orb-1" ref={el => orbsRef.current[0] = el}></div>
            <div className="gradient-orb orb-2" ref={el => orbsRef.current[1] = el}></div>
            <div className="gradient-orb orb-3" ref={el => orbsRef.current[2] = el}></div>
            <div className="grid-overlay"></div>
        </div>
    )
}

export default AnimatedBackground
