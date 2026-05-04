// Generates a satisfying "tick" completion sound using Web Audio API
// No audio files needed — works entirely in the browser

export const playCompletionSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext
    if (!AudioContext) return

    const ctx = new AudioContext()

    // Two-tone pleasant "ding" sound
    const playTone = (frequency: number, startTime: number, duration: number, gainValue: number) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(frequency, startTime)
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.8, startTime + duration)

      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(gainValue, startTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

      oscillator.start(startTime)
      oscillator.stop(startTime + duration)
    }

    const now = ctx.currentTime

    // First note
    playTone(600, now, 0.15, 0.3)
    // Second note — slightly higher, plays right after
    playTone(900, now + 0.12, 0.2, 0.2)

    // Auto close context after sound finishes
    setTimeout(() => ctx.close(), 500)
  } catch {
    // Silently fail if audio not supported
  }
}

// Check if sounds are enabled from localStorage
export const isSoundEnabled = (): boolean => {
  try {
    const cached = localStorage.getItem("ticked_sounds")
    return cached !== "false" // default true if not set
  } catch {
    return true
  }
}

// Cache sound setting to localStorage (called from settings page)
export const setSoundEnabled = (enabled: boolean) => {
  try {
    localStorage.setItem("ticked_sounds", String(enabled))
  } catch {}
}