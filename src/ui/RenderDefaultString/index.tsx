const RenderedDefaultString = ({ element, children }) => {
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
