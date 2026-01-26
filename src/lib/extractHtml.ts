/**
 * Extract HTML content from a container element including all styles
 * This is specifically designed for contract preview components
 */
export async function extractHtmlWithStyles(
  containerRef: HTMLDivElement | null
): Promise<string> {
  if (!containerRef) {
    throw new Error('Container ref is null')
  }

  // Clone the container to avoid modifying the original
  const clone = containerRef.cloneNode(true) as HTMLDivElement

  // Convert ALL logo images to base64 data URL (for multi-page documents)
  const logoImages = clone.querySelectorAll(
    'img[src="/logo-hover.svg"]'
  ) as NodeListOf<HTMLImageElement>

  if (logoImages.length > 0) {
    try {
      // Fetch the logo once and convert to base64
      const response = await fetch('/logo-hover.svg')
      const blob = await response.blob()
      const reader = new FileReader()

      const logoDataUrl = await new Promise<string>(resolve => {
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(blob)
      })

      // Apply the base64 data URL to ALL logo images
      logoImages.forEach(img => {
        img.src = logoDataUrl
      })
    } catch (error) {
      console.warn('Failed to convert logo to base64:', error)
    }
  }

  // Fetch and convert TH Sarabun New fonts to base64
  const fontUrls = [
    '/fonts/THSarabunNew.ttf',
    '/fonts/THSarabunNew-Bold.ttf',
    '/fonts/THSarabunNew-Italic.ttf',
    '/fonts/THSarabunNew-BoldItalic.ttf'
  ]

  const fontBase64Map: Record<string, string> = {}

  for (const fontUrl of fontUrls) {
    try {
      const response = await fetch(fontUrl)
      const blob = await response.blob()
      const reader = new FileReader()

      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })

      fontBase64Map[fontUrl] = base64
    } catch (error) {
      console.warn(`Failed to load font ${fontUrl}:`, error)
    }
  }

  // Get the outer HTML of the cloned container
  let html = clone.outerHTML

  // Strip pdf-page-gap class (used only for UI visual separation)
  html = html.replace(/pdf-page-gap/g, '')

  // Extract all applied styles from the document
  const styles = Array.from(document.styleSheets)
    .flatMap(sheet => {
      try {
        return Array.from(sheet.cssRules)
      } catch (e) {
        // CORS issues with external stylesheets
        return []
      }
    })
    .map(rule => rule.cssText)
    .join('\n')

  // Build complete HTML document with embedded fonts
  return `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    ${styles}
    
    /* Embed TH Sarabun New fonts as base64 */
    @font-face {
      font-family: 'TH Sarabun New';
      font-style: normal;
      font-weight: 400;
      src: url('${fontBase64Map['/fonts/THSarabunNew.ttf'] || ''}') format('truetype');
    }
    
    @font-face {
      font-family: 'TH Sarabun New';
      font-style: normal;
      font-weight: 700;
      src: url('${fontBase64Map['/fonts/THSarabunNew-Bold.ttf'] || ''}') format('truetype');
    }
    
    @font-face {
      font-family: 'TH Sarabun New';
      font-style: italic;
      font-weight: 400;
      src: url('${fontBase64Map['/fonts/THSarabunNew-Italic.ttf'] || ''}') format('truetype');
    }
    
    @font-face {
      font-family: 'TH Sarabun New';
      font-style: italic;
      font-weight: 700;
      src: url('${fontBase64Map['/fonts/THSarabunNew-BoldItalic.ttf'] || ''}') format('truetype');
    }
    
    /* Embed Noto Sans Thai from Google Fonts for header */
    @font-face {
      font-family: 'Noto Sans Thai';
      font-style: normal;
      font-weight: 400;
      src: url('https://fonts.gstatic.com/s/notosansthai/v20/iJWnBXeUZi_OHPqn4wq6hQ2_hbJ1xyN9wd43SofNWcd1MKVQt_So_9CdU5RtpzF-QRvzzXg.woff2') format('woff2');
    }
    
    @font-face {
      font-family: 'Noto Sans Thai';
      font-style: normal;
      font-weight: 700;
      src: url('https://fonts.gstatic.com/s/notosansthai/v20/iJWnBXeUZi_OHPqn4wq6hQ2_hbJ1xyN9wd43SofNWcd1MKVQt_So_9CdU5RttjJ-QRvzzXg.woff2') format('woff2');
    }
    
    /* PDF-specific styles for paging */
    @page {
      size: A4;
      margin: 0;
    }
    
    body {
      margin: 0;
      padding: 0;
      font-family: 'TH Sarabun New', sans-serif;
    }
    
    /* Ensure contract container has white background */
    .bg-white {
      background-color: white !important;
    }
    
    /* Font classes */
    .font-sans {
      font-family: 'Noto Sans Thai', sans-serif !important;
    }
    
    .font-sarabun {
      font-family: 'TH Sarabun New', sans-serif !important;
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>
  `.trim()
}
