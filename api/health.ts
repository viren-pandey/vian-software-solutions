import { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json')
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
}
