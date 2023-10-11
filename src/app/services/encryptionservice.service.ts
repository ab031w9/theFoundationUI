// Importing necessary modules
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  private readonly encoder = new TextEncoder();
  private readonly decoder = new TextDecoder();
  private password: string = 'your-password';

  async deriveKey(password: string = this.password): Promise<CryptoKey> {
    const baseKey = this.encoder.encode(password);
    try {
      const importedKey = await window.crypto.subtle.importKey(
        'raw',
        baseKey,
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );
      return await window.crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: new Uint8Array(16), iterations: 10000, hash: 'SHA-256' },
        importedKey,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      console.error('Error deriving key', error);
      throw error;
    }
  }

  async encrypt(data: string, password: string = this.password): Promise<{ iv: number[], encrypted: number[] }> {
    const key = await this.deriveKey(password);
    const encoded = this.encoder.encode(data);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    try {
      const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encoded
      );
      return { iv: Array.from(iv), encrypted: Array.from(new Uint8Array(encrypted)) };
    } catch (error) {
      console.error('Error encrypting data', error);
      throw error;
    }
  }

  async decrypt(data: { iv: number[], encrypted: number[] }, password: string = this.password): Promise<string> {
    const key = await this.deriveKey(password);
    try {
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(data.iv) },
        key,
        new Uint8Array(data.encrypted)
      );
      return this.decoder.decode(decrypted);
    } catch (error) {
      console.error('Error decrypting data', error);
      throw error;
    }
  }
}
