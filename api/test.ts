export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json')
  res.json({ status: 'ok', message: 'API is working', path: req.url, method: req.method })
}
