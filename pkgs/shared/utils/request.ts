import type { AxiosRequestConfig } from 'axios'
import { blake2b } from 'blakejs'

const API_KEY = import.meta.env.VITE_PUBLIC_KEY ?? ''

const strToUtf8Bytes = (str: string): Uint8Array => {
  return new TextEncoder().encode(str)
}

const BLOCK_SIZE = 128
const OUTLEN = 32

export const hmacBlake2b256 = (data: string): string => {
  const key = strToUtf8Bytes(API_KEY)
  const msg = strToUtf8Bytes(data)

  let k = key
  if (k.length > BLOCK_SIZE) {
    k = blake2b(k, undefined, OUTLEN)
  }

  // pad key
  const kPad = new Uint8Array(BLOCK_SIZE)
  kPad.set(k)

  const oPad = new Uint8Array(BLOCK_SIZE)
  const iPad = new Uint8Array(BLOCK_SIZE)

  for (let i = 0; i < BLOCK_SIZE; i++) {
    const b = kPad[i] as number
    oPad[i] = b ^ 0x5c
    iPad[i] = b ^ 0x36
  }

  // inner hash
  const innerData = new Uint8Array(BLOCK_SIZE + msg.length)
  innerData.set(iPad)
  innerData.set(msg, BLOCK_SIZE)

  const innerHash = blake2b(innerData, undefined, OUTLEN)

  // outer hash
  const outerData = new Uint8Array(BLOCK_SIZE + innerHash.length)
  outerData.set(oPad)
  outerData.set(innerHash, BLOCK_SIZE)

  const finalHash = blake2b(outerData, undefined, OUTLEN)

  // hex output
  return Array.from(finalHash)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export function generateSignaturePayload(config: AxiosRequestConfig, ts: string): string {
  const urlPath = config.url ?? ''
  const method = (config.method ?? 'GET').toUpperCase()

  let payload = urlPath + ts + method

  if (config.params) {
    const params = { ...config.params }
    const keys = Object.keys(params).sort()
    for (const k of keys) {
      const val = params[k]
      if (val !== undefined && val !== null) {
        payload += k + String(val)
      }
    }
  }

  if (config.data) {
    if (config.data instanceof FormData) {
    } else {
      payload += typeof config.data === 'object' ? JSON.stringify(config.data) : String(config.data)
    }
  }

  return payload
}

export function getSignatureHeaders(config: AxiosRequestConfig) {
  const ts = Math.floor(Date.now() / 1000).toString()
  const payload = generateSignaturePayload(config, ts)
  const sig = hmacBlake2b256(payload)

  return {
    'X-Timestamp': ts,
    'X-Signature': sig,
  }
}
