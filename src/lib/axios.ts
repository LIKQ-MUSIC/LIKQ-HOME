import axios from 'axios'

const gatewayApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GATEWAY_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default gatewayApi
