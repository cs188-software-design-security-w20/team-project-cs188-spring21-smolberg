import * as forge from 'node-forge'

const AES_MODE = 'AES-CTR'

/**
 * Encrypts file
 * @param {File| Blob} file File to encrypt and upload 
 * @param {string} key 32 bytes for the key
 * @param {string} iv 16 bytes for the IV 
 * @returns {Promise} the key, initialization vector, then encrypted file name in a list
 */
const encryptFile = (file, key = forge.random.getBytesSync(32), iv = forge.random.getBytesSync(16)) => {

    return new Promise((resolve, reject) => {
        const cipher = forge.cipher.createCipher(AES_MODE, key)
        const encryptedFilename = forge.util.binary.hex.encode(forge.random.getBytesSync(32)).toString()
        cipher.start({ iv: iv })
        const reader = new FileReader

        reader.onloadend = () => {
            cipher.update(forge.util.createBuffer(reader.result));
            if (cipher.finish() == false) {
                reject(new Error("Encryption Error"))
            }
            resolve({
                key,
                iv,
                encryptedFilename,
                cipher: cipher.output
            })
        }

        reader.readAsArrayBuffer(file);
    })
}

/**
 * Decrypts and then downloads
 * @param {ArrayBuffer} encryptedBytes 
 * @param {string} filename 
 * @param {string} key 
 * @param {string} iv 
 */
const decryptAndDownloadFile = (encryptedBytes, filename, key, iv) => {
    var decipher = forge.cipher.createDecipher(AES_MODE, key);
    decipher.start({ iv: iv });
    decipher.update(forge.util.createBuffer(encryptedBytes, 'raw'));
    if (decipher.finish() == false) {
        throw "Decryption Error";
    }
    var link = document.createElement("a");
    link.setAttribute('download', filename);
    let blob = new Blob([forge.util.binary.raw.decode(decipher.output.getBytes())])
    link.href = window.URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    link.remove();
}

export { encryptFile, decryptAndDownloadFile }