export async function getAboutUsImages() {
  const url = process.env.NEXT_PUBLIC_GATEWAY_API_URL + '/about-us/images'
  try {
    const res = await fetch(url, {
      next: { tags: ['about-us-images'] },
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) {
      console.error('Failed to fetch about us images', res.statusText)
      return []
    }
    const json = await res.json()
    return json.data
  } catch (err) {
    console.error('Failed to fetch about us images', err)
    return []
  }
}
