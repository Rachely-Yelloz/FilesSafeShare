import sodium from 'libsodium-wrappers';
export default async function encryptFile(file: File) {
    await sodium.ready;

    const key = sodium.randombytes_buf(32); // 🔐 יצירת מפתח רנדומלי
    const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);

    const fileBuffer = await file.arrayBuffer();
    const fileUint8 = new Uint8Array(fileBuffer);

    // הצפנת הקובץ
    const ciphertext = sodium.crypto_secretbox_easy(fileUint8, nonce, key);

    return { ciphertext, nonce, key };
}


export async function decryptFile(
  ciphertext: Uint8Array,
  nonce: Uint8Array,
  key: Uint8Array,
  type: string
): Promise<Blob> {
  await sodium.ready;
  const decrypted = sodium.crypto_secretbox_open_easy(ciphertext, nonce, key);
  if (!decrypted) {
    throw new Error("Decryption failed. Possibly wrong key or corrupted data.");
  }
  return new Blob([new Uint8Array(decrypted)], { type });
}
