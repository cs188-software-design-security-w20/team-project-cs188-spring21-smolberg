import * as forge from 'node-forge'

/**
 * 
 * @callback uploadCallback
 * @param {string} encryptedFilename filename to be set on gdrive
 * @param {forge.util.ByteBuffer} bytes encrypted bytes to upload
 */

/**
 * Encrypts and uploads
 * @param {File| Blob} file File to encrypt and upload 
 * @param {uploadCallback} uploadCallback callback to upload
 * @param {string} key 32 bytes for the key
 * @param {string} iv 16 bytes for the IV 
 * @returns {[string, string, string]} the key, initialization vector, then encrypted file name in a list
 */
const encryptAndUpload = (file, uploadCallback, key = forge.random.getBytesSync(32), iv = forge.random.getBytesSync(16)) => {

    var cipher = forge.cipher.createCipher('AES-CTR', key);
    var encryptedFilename = forge.util.binary.hex.encode(forge.random.getBytesSync(32)).toString();
    cipher.start({iv: iv});
    var reader = new FileReader;

    reader.onloadend = () => {
        cipher.update(forge.util.createBuffer(forge.util.createBuffer(reader.result)));
        if(cipher.finish() == false) {
            throw "Encryption Error"
        }
        uploadCallback(encryptedFilename, cipher.output);
    }

    reader.readAsArrayBuffer(file);
    return [key, iv, encryptedFilename];

}
/**
 * @callback downloadCallback
 * @param filename name of the file to download
 * @param {forge.util.ByteBuffer} result plaintext bytes for the file
 */

/**
 * Decrypts and then downloads
 * @param {forge.util.ByteBuffer} encryptedBytes 
 * @param {string} key 
 * @param {downloadCallback} downloadCallback 
 * @param {string} iv 
 * @param {string} filename 
 */
const decryptAndDownload = (encryptedBytes, key, downloadCallback, iv, filename) => {
    var decipher = forge.cipher.createDecipher('AES-CTR', key);
    decipher.start({iv: iv});
    decipher.update(encryptedBytes);
    if(decipher.finish() == false) {
        throw "Decryption Error"
    }
    downloadCallback(filename, decipher.output);
}

export {encryptAndUpload, decryptAndDownload}