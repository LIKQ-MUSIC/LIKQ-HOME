import React from 'react'

interface RenderedDefaultStringProps {
  element: string | React.ReactNode
  children: React.ReactNode | ((element: string) => React.ReactNode)
}

const RenderedDefaultString = ({
  element,
  children
}: RenderedDefaultStringProps) => {
  if (typeof element === 'string') {
    if (typeof children === 'function') {
      return children(element)
    }

    return children
  }

  // Otherwise, the element is assumed to be a valid React node.
  return element
}

export default RenderedDefaultString
