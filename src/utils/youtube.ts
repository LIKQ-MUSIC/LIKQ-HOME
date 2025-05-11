// utils/youtubeClient.ts
import axios from 'axios'

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY // หรือใส่ตรงๆ (ไม่แนะนำ)

export const youtubeClient = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  params: {
    key: YOUTUBE_API_KEY
  }
})
