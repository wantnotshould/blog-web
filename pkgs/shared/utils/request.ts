import { AxiosRequestConfig } from 'axios'
import { blake2b } from 'blakejs'

const API_KEY = import.meta.env.VITE_PUBLIC_KEY

const strToUtf8Bytes = (str: string): Uint8Array => {
  return new TextEncoder().encode(str)
}
export const hmacBlake2b256 = (data: string): string => {
  const blockSize = 128
  const outlen = 32

  let keyUint8 = strToUtf8Bytes(API_KEY)
  const dataUint8 = strToUtf8Bytes(data)

  if (keyUint8.length > blockSize) {
    keyUint8 = blake2b(keyUint8, null, outlen)
  }

  const k_pad = new Uint8Array(blockSize)
  k_pad.set(keyUint8)

  const o_key_pad = new Uint8Array(blockSize)
  const i_key_pad = new Uint8Array(blockSize)

  for (let i = 0; i < blockSize; i++) {
    const byte = k_pad[i] as number
    o_key_pad[i] = byte ^ 0x5c
    i_key_pad[i] = byte ^ 0x36
  }

  const inner = new Uint8Array(blockSize + dataUint8.length)
  inner.set(i_key_pad)
  inner.set(dataUint8, blockSize)
  const innerHash = blake2b(inner, null, outlen)

  const outer = new Uint8Array(blockSize + innerHash.length)
  outer.set(o_key_pad)
  outer.set(innerHash, blockSize)
  const finalHash = blake2b(outer, null, outlen)

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
      payload += typeof config.data === 'object' ? JSON.stringify(config.data) : config.data
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
