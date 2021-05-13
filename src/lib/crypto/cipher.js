import * as forge from "node-forge";

const AES_MODE = "AES-CTR";

/**
 * Encrypts file
 * @param {File| Blob} file File to encrypt and upload
 * @param {string} key 32 bytes for the key
 * @param {string} iv 16 bytes for the IV
 * @param {string} mode Encryption mode for AES. Defaults to AES_MODE
 * @returns {Promise} the key, initialization vector, then encrypted file name in a list
 */
const encryptFile = (
  file,
  key = forge.random.getBytesSync(32),
  iv = forge.random.getBytesSync(16),
  mode = AES_MODE
) =>
  new Promise((resolve, reject) => {
    const cipher = forge.cipher.createCipher(mode, key);
    const encryptedFilename = forge.util.binary.hex
      .encode(forge.random.getBytesSync(32))
      .toString();
    cipher.start({ iv });
    const reader = new FileReader();

    reader.onloadend = () => {
      cipher.update(forge.util.createBuffer(reader.result));
      if (cipher.finish() === false) {
        reject(new Error("Encryption Error"));
      }
      resolve({
        key,
        iv,
        encryptedFilename,
        cipher: cipher.output,
      });
    };

    reader.readAsArrayBuffer(file);
  });
/**
 * Decrypts
 * @param {ArrayBuffer} encryptedBytes
 * @param {string} key
 * @param {string} iv
 * @param {string} mode Encryption mode for AES. Defaults to AES_MODE
 */
const decrypt = (encryptedBytes, key, iv, mode = AES_MODE) => {
  const decipher = forge.cipher.createDecipher(mode, key);
  decipher.start({ iv });
  decipher.update(forge.util.createBuffer(encryptedBytes, "raw"));
  if (decipher.finish() === false) {
    throw Error("Decryption Error");
  }
  return decipher.output.getBytes();
};

/**
 * Decrypts and then downloads
 * @param {ArrayBuffer} encryptedBytes
 * @param {string} filename
 * @param {string} key
 * @param {string} iv
 */
const decryptAndDownloadFile = (encryptedBytes, filename, key, iv) => {
  const decrypted = decrypt(encryptedBytes, key, iv);
  const link = document.createElement("a");
  link.setAttribute("download", filename);
  const blob = new Blob([forge.util.binary.raw.decode(decrypted)]);
  link.href = window.URL.createObjectURL(blob);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export { encryptFile, decryptAndDownloadFile, decrypt };
