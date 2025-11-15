/**
 * Generate a random encryption key using Web Crypto API
 * This creates a derived key from the user's wallet address
 */
async function deriveKey(walletAddress: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = encoder.encode(walletAddress);

  // Import the key material
  const importedKey = await crypto.subtle.importKey(
    'raw',
    keyMaterial,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  // Derive a key from the wallet address
  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('im-human-seal-salt'), // Fixed salt for consistency
      iterations: 100000,
      hash: 'SHA-256',
    },
    importedKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt data using Web Crypto API (AES-GCM)
 * The data is encrypted using a key derived from the wallet address
 * @param data - Data to encrypt (will be converted to JSON string)
 * @param walletAddress - User's wallet address for key derivation
 * @returns Encrypted data as Uint8Array
 */
export async function encryptWithSeal(
  data: any,
  walletAddress?: string
): Promise<Uint8Array> {
  try {
    // Convert data to JSON string then to Uint8Array
    const jsonString = JSON.stringify(data);
    const dataBytes = new TextEncoder().encode(jsonString);

    // Generate a random IV (Initialization Vector)
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Derive encryption key from wallet address or use default
    const key = walletAddress
      ? await deriveKey(walletAddress)
      : await deriveKey('default-seal-key');

    // Encrypt the data
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      dataBytes
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedData), iv.length);

    return combined;
  } catch (error) {
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt data using Web Crypto API (AES-GCM)
 * @param encryptedData - Encrypted data as Uint8Array (includes IV)
 * @param walletAddress - User's wallet address for key derivation
 * @returns Decrypted data as original object
 */
export async function decryptWithSeal(
  encryptedData: Uint8Array,
  walletAddress?: string
): Promise<any> {
  try {
    // Extract IV and encrypted data
    const iv = encryptedData.slice(0, 12);
    const data = encryptedData.slice(12);

    // Derive decryption key
    const key = walletAddress
      ? await deriveKey(walletAddress)
      : await deriveKey('default-seal-key');

    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    // Convert Uint8Array back to JSON string then parse
    const jsonString = new TextDecoder().decode(decryptedData);
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Convert Uint8Array to Base64 string for storage/transmission
 */
export function uint8ArrayToBase64(data: Uint8Array): string {
  return Buffer.from(data).toString('base64');
}

/**
 * Convert Base64 string back to Uint8Array
 */
export function base64ToUint8Array(base64: string): Uint8Array {
  return new Uint8Array(Buffer.from(base64, 'base64'));
}
