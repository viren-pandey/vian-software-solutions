import crypto from 'crypto'
import PaytmChecksum from 'paytmchecksum'

interface PaytmConfig {
  mid: string
  merchantKey: string
  website: string
  industryTypeId: string
  environment: 'stage' | 'prod'
  callbackUrl: string
}

let cachedConfig: PaytmConfig | null = null

function loadConfig(): PaytmConfig {
  if (cachedConfig) return cachedConfig

  const mid = process.env.PAYTM_MID?.trim()
  const merchantKey = process.env.PAYTM_MKEY?.trim()
  const website = process.env.PAYTM_WEBSITE?.trim()
  const industryTypeId = process.env.PAYTM_INDUSTRY_TYPE_ID?.trim() || 'Retail'
  const environment = (process.env.PAYTM_ENV?.trim() as 'stage' | 'prod') || 'stage'
  const callbackUrl = process.env.PAYTM_CALLBACK_URL?.trim()

  const missing: string[] = []
  if (!mid) missing.push('PAYTM_MID')
  if (!merchantKey) missing.push('PAYTM_MKEY')
  if (!website) missing.push('PAYTM_WEBSITE')
  if (!callbackUrl) missing.push('PAYTM_CALLBACK_URL')
  if (!['stage', 'prod'].includes(environment)) missing.push('PAYTM_ENV (must be stage or prod)')

  if (missing.length > 0) {
    const msg = `Paytm configuration missing: ${missing.join(', ')}`
    console.error('[Paytm] ' + msg)
    throw new PaytmError('PAYTM_NOT_CONFIGURED', msg)
  }

  // TypeScript narrowing - we know these are strings now
  const config: PaytmConfig = {
    mid: mid!,
    merchantKey: merchantKey!,
    website: website!,
    industryTypeId,
    environment,
    callbackUrl: callbackUrl!,
  }

  cachedConfig = config

  console.log(`[Paytm] Config loaded: env=${environment}, mid=${mid!.substring(0, 6)}***, website=${website}`)
  return config
}

function getBaseUrl(env: 'stage' | 'prod'): string {
  return env === 'prod'
    ? 'https://secure.paytmpayments.com'
    : 'https://securestage.paytmpayments.com'
}

const CHANNEL_ID = 'WEB'

export function getMid(): string {
  return loadConfig().mid
}

export function getEnv(): string {
  return loadConfig().environment
}

export function getCallbackUrl(): string {
  return loadConfig().callbackUrl
}

export function isConfigured(): boolean {
  try {
    loadConfig()
    return true
  } catch {
    return false
  }
}

export async function generateSignature(body: Record<string, any>): Promise<string> {
  const { merchantKey } = loadConfig()
  return PaytmChecksum.generateSignature(JSON.stringify(body), merchantKey)
}

export async function verifySignature(body: Record<string, any>, signature: string): Promise<boolean> {
  const { merchantKey } = loadConfig()
  return PaytmChecksum.verifySignature(JSON.stringify(body), merchantKey, signature)
}

function generateOrderId(prefix: string): string {
  return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`
}

function sanitizeAmount(amount: number | string): string {
  return Number(amount).toFixed(2)
}

function logRequest(label: string, data: any) {
  const sanitized = JSON.parse(JSON.stringify(data))
  if (sanitized.head?.signature) sanitized.head.signature = '***'
  if (sanitized.body?.mid) sanitized.body.mid = sanitized.body.mid.substring(0, 6) + '***'
  if (sanitized.body?.merchantKey) sanitized.body.merchantKey = '***'
  console.log(`[Paytm] ${label}:`, JSON.stringify(sanitized).slice(0, 2000))
}

function logResponse(label: string, status: number, data: any, orderId?: string) {
  const sanitized = JSON.parse(JSON.stringify(data))
  if (sanitized.head?.signature) sanitized.head.signature = '***'
  console.log(`[Paytm] ${label} (${status})${orderId ? ` orderId=${orderId}` : ''}:`, JSON.stringify(sanitized).slice(0, 2000))
}

export interface CreateOrderInput {
  amount: number | string
  custId: string
  callbackUrl?: string
}

export interface CreateOrderResult {
  orderId: string
  txnToken: string
  amount: string
  mid: string
  env: string
  paytmResponse: any
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const config = loadConfig()
  const orderId = generateOrderId('ORD')
  const amount = sanitizeAmount(input.amount)
  const callbackUrl = input.callbackUrl || config.callbackUrl

  const body = {
    requestType: 'Payment',
    mid: config.mid,
    websiteName: config.website,
    orderId,
    txnAmount: { value: amount, currency: 'INR' },
    userInfo: { custId: input.custId },
    callbackUrl,
  }

  const signature = await generateSignature(body)
  const url = `${getBaseUrl(config.environment)}/theia/api/v1/initiateTransaction?mid=${config.mid}&orderId=${orderId}`
  const payload = { body, head: { channelId: CHANNEL_ID, signature } }

  logRequest('CreateOrder Request', payload)

  let paytmRes: Response
  try {
    paytmRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (err: any) {
    console.error('[Paytm] Network error:', err?.message || err)
    throw new PaytmError('PAYTM_NETWORK_ERROR', `Network error calling Paytm: ${err?.message || err}`)
  }

  const rawText = await paytmRes.text()
  let responseJson: any
  try {
    responseJson = JSON.parse(rawText)
  } catch {
    console.error('[Paytm] Invalid JSON response:', rawText.slice(0, 500))
    throw new PaytmError('PAYTM_INVALID_RESPONSE', 'Paytm returned non-JSON response', { raw: rawText.slice(0, 1000) })
  }

  logResponse('CreateOrder Response', paytmRes.status, responseJson, orderId)

  if (responseJson.head?.signature) {
    const valid = await verifySignature(responseJson.body || {}, responseJson.head.signature).catch(() => false)
    if (!valid) {
      console.error('[Paytm] Signature verification failed for orderId:', orderId)
      throw new PaytmError('PAYTM_SIGNATURE_MISMATCH', 'Paytm response signature verification failed', responseJson)
    }
  }

  const resultInfo = responseJson.body?.resultInfo
  if (!resultInfo || resultInfo.resultStatus !== 'S') {
    const errMsg = resultInfo?.resultMsg || resultInfo?.resultStatus || 'Unknown Paytm error'
    const errCode = resultInfo?.resultCode || ''
    console.error('[Paytm] Order creation failed:', errMsg, `(${errCode})`, 'orderId:', orderId)
    throw new PaytmError('PAYTM_ORDER_FAILED', `Paytm: ${errMsg} (${errCode})`, responseJson)
  }

  const txnToken = responseJson.body?.txnToken
  if (!txnToken) {
    console.error('[Paytm] No txnToken in response for orderId:', orderId)
    throw new PaytmError('PAYTM_NO_TXN_TOKEN', 'No txnToken in Paytm response', responseJson)
  }

  console.log('[Paytm] Order created successfully:', orderId, 'txnToken:', txnToken.substring(0, 12) + '...')

  return {
    orderId,
    txnToken,
    amount,
    mid: config.mid,
    env: config.environment,
    paytmResponse: responseJson,
  }
}

export interface ProductOrderInput {
  amount: number | string
  custId: string
  callbackUrl?: string
  productId: string
}

export async function createProductOrder(input: ProductOrderInput): Promise<CreateOrderResult> {
  const config = loadConfig()
  const orderId = generateOrderId('PROD')
  const amount = sanitizeAmount(input.amount)
  const callbackUrl = input.callbackUrl || config.callbackUrl

  const body = {
    requestType: 'Payment',
    mid: config.mid,
    websiteName: config.website,
    orderId,
    txnAmount: { value: amount, currency: 'INR' },
    userInfo: { custId: input.custId },
    callbackUrl,
  }

  const signature = await generateSignature(body)
  const url = `${getBaseUrl(config.environment)}/theia/api/v1/initiateTransaction?mid=${config.mid}&orderId=${orderId}`
  const payload = { body, head: { channelId: CHANNEL_ID, signature } }

  logRequest('CreateProductOrder Request', payload)

  let paytmRes: Response
  try {
    paytmRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (err: any) {
    console.error('[Paytm] Network error:', err?.message || err)
    throw new PaytmError('PAYTM_NETWORK_ERROR', `Network error calling Paytm: ${err?.message || err}`)
  }

  const rawText = await paytmRes.text()
  let responseJson: any
  try {
    responseJson = JSON.parse(rawText)
  } catch {
    console.error('[Paytm] Invalid JSON response:', rawText.slice(0, 500))
    throw new PaytmError('PAYTM_INVALID_RESPONSE', 'Paytm returned non-JSON response', { raw: rawText.slice(0, 1000) })
  }

  logResponse('CreateProductOrder Response', paytmRes.status, responseJson, orderId)

  if (responseJson.head?.signature) {
    const valid = await verifySignature(responseJson.body || {}, responseJson.head.signature).catch(() => false)
    if (!valid) {
      console.error('[Paytm] Signature verification failed for orderId:', orderId)
      throw new PaytmError('PAYTM_SIGNATURE_MISMATCH', 'Paytm response signature verification failed', responseJson)
    }
  }

  const resultInfo = responseJson.body?.resultInfo
  if (!resultInfo || resultInfo.resultStatus !== 'S') {
    const errMsg = resultInfo?.resultMsg || resultInfo?.resultStatus || 'Unknown Paytm error'
    const errCode = resultInfo?.resultCode || ''
    console.error('[Paytm] Product order creation failed:', errMsg, `(${errCode})`, 'orderId:', orderId)
    throw new PaytmError('PAYTM_ORDER_FAILED', `Paytm: ${errMsg} (${errCode})`, responseJson)
  }

  const txnToken = responseJson.body?.txnToken
  if (!txnToken) {
    console.error('[Paytm] No txnToken in response for orderId:', orderId)
    throw new PaytmError('PAYTM_NO_TXN_TOKEN', 'No txnToken in Paytm response', responseJson)
  }

  console.log('[Paytm] Product order created successfully:', orderId, 'txnToken:', txnToken.substring(0, 12) + '...')

  return {
    orderId,
    txnToken,
    amount,
    mid: config.mid,
    env: config.environment,
    paytmResponse: responseJson,
  }
}

export interface TransactionStatusInput {
  orderId: string
}

export interface TransactionStatusResult {
  status: 'TXN_SUCCESS' | 'TXN_FAILURE' | 'PENDING'
  txnId?: string
  amount?: string
  bankTxnId?: string
  bankName?: string
  paymentMode?: string
  rawResponse: any
}

export async function getTransactionStatus(input: TransactionStatusInput): Promise<TransactionStatusResult> {
  const config = loadConfig()
  const { orderId } = input

  const body = { mid: config.mid, orderId }
  const signature = await generateSignature(body)
  const payload = { body, head: { channelId: CHANNEL_ID, signature } }

  logRequest('TransactionStatus Request', payload)

  let res: Response
  try {
    res = await fetch(`${getBaseUrl(config.environment)}/v3/order/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (err: any) {
    console.error('[Paytm] Network error verifying status:', err?.message || err)
    throw new PaytmError('PAYTM_NETWORK_ERROR', `Network error verifying status: ${err?.message || err}`)
  }

  const rawText = await res.text()
  let data: any
  try {
    data = JSON.parse(rawText)
  } catch {
    console.error('[Paytm] Invalid status response:', rawText.slice(0, 500))
    throw new PaytmError('PAYTM_INVALID_RESPONSE', 'Invalid status response from Paytm', { raw: rawText.slice(0, 1000) })
  }

  logResponse('TransactionStatus Response', res.status, data, orderId)

  if (data.head?.signature) {
    const valid = await verifySignature(data.body || {}, data.head.signature).catch(() => false)
    if (!valid) {
      console.error('[Paytm] Transaction status signature verification failed for orderId:', orderId)
      throw new PaytmError('PAYTM_SIGNATURE_MISMATCH', 'Transaction status signature verification failed', data)
    }
  }

  const resultInfo = data.body?.resultInfo
  const txnStatus = data.body?.txnStatus || 'PENDING'
  const txnId = data.body?.txnId

  const statusMap: Record<string, 'TXN_SUCCESS' | 'TXN_FAILURE' | 'PENDING'> = {
    TXN_SUCCESS: 'TXN_SUCCESS',
    TXN_FAILURE: 'TXN_FAILURE',
    PENDING: 'PENDING',
  }
  const status = statusMap[txnStatus] || 'PENDING'

  console.log('[Paytm] Transaction status:', orderId, status, txnId ? `txnId=${txnId}` : '')

  return {
    status,
    txnId,
    amount: data.body?.txnAmount,
    bankTxnId: data.body?.bankTxnId,
    bankName: data.body?.bankName,
    paymentMode: data.body?.paymentMode,
    rawResponse: data,
  }
}

export class PaytmError extends Error {
  public code: string
  public paytmResponse?: any

  constructor(code: string, message: string, paytmResponse?: any) {
    super(message)
    this.name = 'PaytmError'
    this.code = code
    this.paytmResponse = paytmResponse
  }

  toJSON() {
    return {
      error: this.message,
      code: this.code,
      ...(this.paytmResponse ? { detail: JSON.stringify(this.paytmResponse).slice(0, 500) } : {}),
    }
  }
}