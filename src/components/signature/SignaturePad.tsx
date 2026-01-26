'use client'

import { useRef, useState, useEffect } from 'react'
import { getStroke } from 'perfect-freehand'

interface Point {
  x: number
  y: number
  pressure?: number
}

interface SignaturePadProps {
  onSave: (dataUrl: string) => void
  width?: number
  height?: number
  className?: string
}

export default function SignaturePad({
  onSave,
  width = 600,
  height = 300,
  className = ''
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [points, setPoints] = useState<Point[][]>([[]])
  const [currentStroke, setCurrentStroke] = useState<Point[]>([])

  const getPointFromEvent = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      pressure: 0.5
    }
  }

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    setIsDrawing(true)
    const point = getPointFromEvent(e)
    setCurrentStroke([point])
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (!isDrawing) return

    const point = getPointFromEvent(e)
    setCurrentStroke(prev => [...prev, point])
  }

  const stopDrawing = () => {
    if (isDrawing && currentStroke.length > 0) {
      setPoints(prev => {
        const newPoints = [...prev]
        newPoints[newPoints.length - 1] = currentStroke
        newPoints.push([])
        return newPoints
      })
      setCurrentStroke([])
    }
    setIsDrawing(false)
  }

  const clear = () => {
    setPoints([[]])
    setCurrentStroke([])
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const save = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/png')
    onSave(dataUrl)
  }

  // Render strokes
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw all completed strokes
    points.forEach(stroke => {
      if (stroke.length < 2) return

      const pathData = getStroke(stroke, {
        size: 4,
        thinning: 0.5,
        smoothing: 0.5,
        streamline: 0.5
      })

      const path = new Path2D(getSvgPathFromStroke(pathData))
      ctx.fillStyle = '#000000'
      ctx.fill(path)
    })

    // Draw current stroke
    if (currentStroke.length > 1) {
      const pathData = getStroke(currentStroke, {
        size: 4,
        thinning: 0.5,
        smoothing: 0.5,
        streamline: 0.5
      })

      const path = new Path2D(getSvgPathFromStroke(pathData))
      ctx.fillStyle = '#000000'
      ctx.fill(path)
    }
  }, [points, currentStroke])

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="border-2 border-zinc-700 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="cursor-crosshair touch-none"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={clear}
          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={save}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          Save Signature
        </button>
      </div>
    </div>
  )
}

// Helper function to convert stroke points to SVG path
function getSvgPathFromStroke(stroke: number[][]): string {
  if (!stroke.length) return ''

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length]
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
      return acc
    },
    ['M', ...stroke[0], 'Q']
  )

  d.push('Z')
  return d.join(' ')
}
