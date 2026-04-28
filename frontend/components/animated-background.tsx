"use client"

import { useEffect, useRef } from "react"

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let W = window.innerWidth
    let H = window.innerHeight

    canvas.width = W
    canvas.height = H

    // Warm brownish-yellow particle colors
    const colors = [
      "rgba(186, 117, 23, 0.18)",
      "rgba(239, 159, 39, 0.14)",
      "rgba(250, 199, 117, 0.12)",
      "rgba(133, 79, 11, 0.12)",
      "rgba(250, 238, 218, 0.20)",
      "rgba(186, 117, 23, 0.10)",
    ]

    // Particles
    const particles = Array.from({ length: 28 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 120 + 40,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.008 + 0.004,
    }))

    // Small floating dots
    const dots = Array.from({ length: 40 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.25 + 0.05,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // Draw soft orbs
      particles.forEach((p) => {
        p.pulse += p.pulseSpeed
        const pulsedR = p.r + Math.sin(p.pulse) * 12

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulsedR)
        grad.addColorStop(0, p.color)
        grad.addColorStop(1, "rgba(0,0,0,0)")

        ctx.beginPath()
        ctx.arc(p.x, p.y, pulsedR, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        p.x += p.dx
        p.y += p.dy

        if (p.x < -p.r) p.x = W + p.r
        if (p.x > W + p.r) p.x = -p.r
        if (p.y < -p.r) p.y = H + p.r
        if (p.y > H + p.r) p.y = -p.r
      })

      // Draw small dots
      dots.forEach((d) => {
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(186, 117, 23, ${d.opacity})`
        ctx.fill()

        d.x += d.dx
        d.y += d.dy

        if (d.x < 0) d.x = W
        if (d.x > W) d.x = 0
        if (d.y < 0) d.y = H
        if (d.y > H) d.y = 0
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W
      canvas.height = H
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, opacity: 1 }}
    />
  )
}