import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

export function TopLoader() {
  const location = useLocation()
  const [width, setWidth] = useState(0)
  const [opacity, setOpacity] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const mountedRef = useRef(false)

  const start = () => {
    clearInterval(intervalRef.current)
    clearTimeout(timeoutRef.current)
    setWidth(0)
    setOpacity(1)

    let current = 0
    setWidth(15)
    current = 15

    intervalRef.current = setInterval(() => {
      current += (85 - current) * 0.1
      if (current >= 84.5) {
        current = 84.5
        clearInterval(intervalRef.current)
      }
      setWidth(current)
    }, 30)
  }

  const finish = () => {
    clearInterval(intervalRef.current)
    setWidth(100)
    timeoutRef.current = setTimeout(() => {
      setOpacity(0)
      timeoutRef.current = setTimeout(() => setWidth(0), 300)
    }, 200)
  }

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      return
    }
    start()
    const t = setTimeout(finish, 300)
    return () => clearTimeout(t)
  }, [location.pathname, location.search])

  useEffect(() => () => {
    clearInterval(intervalRef.current)
    clearTimeout(timeoutRef.current)
  }, [])

  return (
    <>
      <style>{`
        @keyframes loaderShimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
      <div
        className="fixed top-0 left-0 z-[9999] h-[3px] pointer-events-none"
        style={{
          width: `${width}%`,
          opacity,
          transition: opacity === 0
            ? 'opacity 0.3s ease'
            : width === 100
              ? 'width 0.2s ease-out, opacity 0.3s ease'
              : 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
          background: 'linear-gradient(90deg, #f59e0b 0%, #f97316 30%, #fbbf24 60%, #fb923c 100%)',
          backgroundSize: '300% 100%',
          animation: 'loaderShimmer 1.5s linear infinite',
          boxShadow: '0 0 8px rgba(245,158,11,0.8), 0 0 20px rgba(251,146,60,0.5)',
          borderRadius: '0 2px 2px 0',
        }}
      />
    </>
  )
}
