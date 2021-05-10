
import aes from 'crypto-js/aes';
import CryptoJS from 'crypto-js';



/**
 * Encrypts File and Uploads it to Google Drive
 * @param {File|Blob} file the file to be encrypted and uploaded
 * @param {CryptoJS.lib.WordArray} key Key to be used
 * @param {CryptoJS.lib.WordArray} iv Initialization vector used
 * @returns {String} Name of encrypted file on gDrive
 */
const encryptAndUpload = (file, key, iv) => {

    var reader = new FileReader;
    //might be used if we use progressive encryption, splitting files into chunks. 
    //var aesEncryptor = CryptoJS.algo.AES.createEncryptor(key, { iv: iv, mode: CryptoJS.mode.CTR });
    var encryptedFileName = randomString();


    const upload = (filename, fileBuffer) => { return null }; //TODO: upload to gdrive, fileBuffer is a in a weird WordArray crypto-js comes with



    const randomString = () => {
        var buf = new Uint8Array(32);
        window.crypto.getRandomValues(buf);
        return Array.from(buf, (i) => i.toString(16).padStart(2, "0"))
    }

    reader.onloadend = () => {
        var encOut = aes.encrypt(reader.result, key, {iv: iv, mode: CryptoJS.mode.CTR});
        upload(encryptedFileName, encOut.ciphertext);
    }

    reader.readAsArrayBuffer(file);

    return encryptedFileName;
}

/**
 * 
 * @param {CryptoJS.lib.WordArray} encrypted Ciphertext to be decrypted
 * @param {CryptoJS.lib.WordArray} key Key to decrypt ciphertext with
 * @param {CryptoJS.lib.WordArray} iv Initialization vector
 * @returns {CryptoJS.lib.WordArray} Decrypted ciphertext
 */
const decryptFile = (encrypted, key, iv) => {

    var decOut = aes.decrypt(fileBuffer, key, {iv: iv});

    return decOut; //array of decrypted ciphertext
}