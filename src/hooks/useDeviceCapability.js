import { useState, useEffect } from 'react'

/**
 * Detects whether the current device can run a 3D scene.
 *
 * Now ALLOWS mobile devices if they have WebGL support.
 * Only blocks truly low-end devices (no WebGL, very low CPU, software renderers).
 *
 * Returns { is3DCapable: boolean, isMobile: boolean, isLoading: boolean }
 */

function getMobileBreakpoint() {
  if (typeof window === 'undefined') return false
  // Detect by touch support + screen size — covers phones AND tablets
  const hasTouchScreen = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
  return hasTouchScreen && window.innerWidth < 1024
}

function getReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

function getLowCPU() {
  if (typeof navigator === 'undefined') return false
  return (navigator.hardwareConcurrency ?? 4) <= 1
}

function getLowMemory() {
  if (typeof navigator === 'undefined') return false
  return (navigator).deviceMemory != null && (navigator).deviceMemory <= 1
}

/**
 * Quick WebGL capability probe.
 * Returns true only if WebGL is completely unavailable or is a software renderer.
 */
function probeWebGL() {
  if (typeof document === 'undefined') return { lowGPU: false, hasWebGL: false }

  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2', { powerPreference: 'high-performance' }) ||
      canvas.getContext('webgl', { powerPreference: 'high-performance' })

    if (!gl) return { lowGPU: true, hasWebGL: false }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      const lowGPUMarkers = [
        'swiftshader',
        'llvmpipe',
        'softpipe',
        'mesa',
      ]
      const r = renderer.toLowerCase()
      const lowGPU = lowGPUMarkers.some(m => r.includes(m))
      return { lowGPU, hasWebGL: true, renderer }
    }

    return { lowGPU: false, hasWebGL: true }
  } catch {
    return { lowGPU: true, hasWebGL: false }
  }
}

export default function useDeviceCapability() {
  const [state, setState] = useState({
    isLoading: true,
    isMobile: false,
    is3DCapable: true,
  })

  useEffect(() => {
    const isMobile = getMobileBreakpoint()
    const reducedMotion = getReducedMotion()
    const lowCPU = getLowCPU()
    const lowMemory = getLowMemory()
    const { lowGPU, hasWebGL } = probeWebGL()

    // Only block if:
    // - No WebGL at all
    // - Very low CPU (1 core)
    // - Very low memory (<=1GB)
    // - Software renderer (SwiftShader, Mesa, etc.)
    // - User explicitly prefers reduced motion
    // Mobile phones with WebGL are NOW ALLOWED
    const is3DCapable = hasWebGL && !reducedMotion && !lowCPU && !lowMemory && !lowGPU

    setState({
      isLoading: false,
      isMobile,
      is3DCapable,
    })

    const handleResize = () => {
      const nowMobile = getMobileBreakpoint()
      setState(prev => ({
        ...prev,
        isMobile: nowMobile,
      }))
    }

    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return state
}
