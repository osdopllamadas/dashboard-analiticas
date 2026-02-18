/**
 * Módulo de Encriptación AES-256
 * 
 * Proporciona funciones para encriptar y desencriptar datos sensibles
 * como API keys y credenciales de Supabase.
 * 
 * IMPORTANTE: La clave de encriptación debe estar en variables de entorno
 * y NUNCA debe ser commiteada al repositorio.
 */

import crypto from 'crypto';

// Algoritmo de encriptación
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // Para AES, esto es siempre 16
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

/**
 * Deriva una clave de encriptación desde la clave maestra
 */
function deriveKey(password: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(password, salt, 100000, KEY_LENGTH, 'sha512');
}

/**
 * Encripta un texto usando AES-256-GCM
 * 
 * @param text - Texto plano a encriptar
 * @param masterKey - Clave maestra (debe venir de process.env.ENCRYPTION_KEY)
 * @returns Texto encriptado en formato base64
 */
export function encrypt(text: string, masterKey?: string): string {
  if (!text) {
    throw new Error('Text to encrypt cannot be empty');
  }

  // Usar la clave maestra desde variables de entorno
  const key = masterKey || process.env.ENCRYPTION_KEY;
  
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }

  try {
    // Generar salt e IV aleatorios
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Derivar clave de encriptación
    const derivedKey = deriveKey(key, salt);
    
    // Crear cipher
    const cipher = crypto.createCipheriv(ALGORITHM, derivedKey, iv);
    
    // Encriptar
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Obtener tag de autenticación
    const tag = cipher.getAuthTag();
    
    // Combinar salt + iv + tag + encrypted y convertir a base64
    const result = Buffer.concat([
      salt,
      iv,
      tag,
      Buffer.from(encrypted, 'hex')
    ]);
    
    return result.toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Desencripta un texto encriptado con AES-256-GCM
 * 
 * @param encryptedText - Texto encriptado en formato base64
 * @param masterKey - Clave maestra (debe venir de process.env.ENCRYPTION_KEY)
 * @returns Texto desencriptado
 */
export function decrypt(encryptedText: string, masterKey?: string): string {
  if (!encryptedText) {
    throw new Error('Encrypted text cannot be empty');
  }

  // Usar la clave maestra desde variables de entorno
  const key = masterKey || process.env.ENCRYPTION_KEY;
  
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }

  try {
    // Convertir de base64 a buffer
    const buffer = Buffer.from(encryptedText, 'base64');
    
    // Extraer componentes
    const salt = buffer.subarray(0, SALT_LENGTH);
    const iv = buffer.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const tag = buffer.subarray(
      SALT_LENGTH + IV_LENGTH,
      SALT_LENGTH + IV_LENGTH + TAG_LENGTH
    );
    const encrypted = buffer.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
    
    // Derivar clave de encriptación
    const derivedKey = deriveKey(key, salt);
    
    // Crear decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, derivedKey, iv);
    decipher.setAuthTag(tag);
    
    // Desencriptar
    let decrypted = decipher.update(encrypted.toString('hex'), 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data - data may be corrupted or key is incorrect');
  }
}

/**
 * Valida si un texto está encriptado correctamente
 * 
 * @param encryptedText - Texto a validar
 * @returns true si el texto parece estar encriptado correctamente
 */
export function isValidEncrypted(encryptedText: string): boolean {
  try {
    const buffer = Buffer.from(encryptedText, 'base64');
    const minLength = SALT_LENGTH + IV_LENGTH + TAG_LENGTH + 1;
    return buffer.length >= minLength;
  } catch {
    return false;
  }
}

/**
 * Genera una clave de encriptación aleatoria segura
 * Útil para generar la ENCRYPTION_KEY inicial
 * 
 * @returns Clave aleatoria en formato base64
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('base64');
}

/**
 * Hash de una cadena usando SHA-256
 * Útil para comparar valores sin almacenar el original
 * 
 * @param text - Texto a hashear
 * @returns Hash en formato hexadecimal
 */
export function hash(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Verifica si un texto coincide con un hash
 * 
 * @param text - Texto plano
 * @param hashedText - Hash a comparar
 * @returns true si coinciden
 */
export function verifyHash(text: string, hashedText: string): boolean {
  return hash(text) === hashedText;
}

// Exportar tipos para TypeScript
export type EncryptedString = string;
export type DecryptedString = string;
