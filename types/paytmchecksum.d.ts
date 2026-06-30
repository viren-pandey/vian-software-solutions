declare module 'paytmchecksum' {
  class PaytmChecksum {
    static iv: string
    static encrypt(input: string, key: string): string
    static decrypt(encrypted: string, key: string): string
    static generateSignature(params: Record<string, any> | string, key: string): Promise<string>
    static verifySignature(params: Record<string, any> | string, key: string, checksum: string): Promise<boolean>
    static generateSignatureByString(params: string, key: string): Promise<string>
    static verifySignatureByString(params: string, key: string, checksum: string): Promise<boolean>
    static generateRandomString(length: number): string
    static getStringByParams(params: Record<string, any>): string
    static calculateHash(params: string, salt: string): string
    static calculateChecksum(params: string, key: string, salt: string): string
  }
  export = PaytmChecksum
}
