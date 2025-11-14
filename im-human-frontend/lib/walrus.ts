// Walrus Testnet Configuration
const WALRUS_PUBLISHER = 'https://publisher.walrus-testnet.walrus.space';
const WALRUS_AGGREGATOR = 'https://aggregator.walrus-testnet.walrus.space';
const STORAGE_EPOCHS = 5; // Store for 5 epochs

/**
 * Upload encrypted data to Walrus testnet
 * @param encryptedData - Encrypted data as Uint8Array
 * @returns Blob ID from Walrus
 */
export async function uploadToWalrus(
  encryptedData: Uint8Array
): Promise<string> {
  try {
    // Use HTTP API to upload blob
    // Store for 5 epochs with deletable flag
    const response = await fetch(
      `${WALRUS_PUBLISHER}/v1/blobs?epochs=${STORAGE_EPOCHS}`,
      {
        method: 'PUT',
        body: encryptedData as any, // TypeScript workaround for Uint8Array
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Walrus upload error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`Failed to upload to Walrus (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log('Walrus upload response:', result);

    // Extract blob ID from response
    // Response can be either newlyCreated or alreadyCertified
    if (result.newlyCreated) {
      const blobId = result.newlyCreated.blobObject?.blobId || result.newlyCreated.blobId;
      if (blobId) return blobId;
    }

    if (result.alreadyCertified) {
      const blobId = result.alreadyCertified.blobObject?.blobId || result.alreadyCertified.blobId;
      if (blobId) return blobId;
    }

    // Try to get blob ID from any location in response
    if (result.blobId) {
      return result.blobId;
    }

    console.error('Unexpected Walrus response format:', result);
    throw new Error('Could not extract blob ID from Walrus response');
  } catch (error) {
    console.error('Error uploading to Walrus:', error);
    throw error;
  }
}

/**
 * Download encrypted data from Walrus
 * @param blobId - Blob ID to retrieve
 * @returns Encrypted data as Uint8Array
 */
export async function downloadFromWalrus(blobId: string): Promise<Uint8Array> {
  try {
    const response = await fetch(`${WALRUS_AGGREGATOR}/v1/${blobId}`);

    if (!response.ok) {
      throw new Error(`Failed to download from Walrus: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.error('Error downloading from Walrus:', error);
    throw error;
  }
}

/**
 * Get Walrus blob info
 * @param blobId - Blob ID to check
 * @returns Blob metadata
 */
export async function getBlobInfo(blobId: string) {
  try {
    const response = await fetch(`${WALRUS_AGGREGATOR}/v1/${blobId}`, {
      method: 'HEAD',
    });

    return {
      exists: response.ok,
      size: response.headers.get('content-length'),
      contentType: response.headers.get('content-type'),
    };
  } catch (error) {
    console.error('Error getting blob info:', error);
    return { exists: false, size: null, contentType: null };
  }
}

/**
 * Generate Walrus URL for accessing blob
 * @param blobId - Blob ID
 * @returns Full URL to access the blob
 */
export function getWalrusUrl(blobId: string): string {
  return `https://walruscan.com/testnet/blob/${blobId}`;
}
