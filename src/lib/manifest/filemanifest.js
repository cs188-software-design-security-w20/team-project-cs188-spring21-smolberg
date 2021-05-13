import * as forge from "node-forge";
import { cipher } from "../crypto";
/** File Manifest Constructor
 *
 */
class FileManifest {
  // constructor() {
  //   this.files = {};
  // }

  constructor(manifest = {}) {
    this.files = manifest;
  }

  // maybe add a manifest.settings or something
  // if we do subdirectories, add a manifest.folder, which contains a similar data structure containing folders and files within
  addFile(filename, encFilename, key, iv) {
    this.files[filename] = { key, iv, encFilename };
    // save any other file metadata here
  }

  /** Gets file data needed to get and decrypt the file
   *
   * @param {String} filename
   * @returns {key, iv, encFilename}
   */
  getFile(filename) {
    return this.files[filename];
  }

  searchByEncryptedName(query) {
    return Object.keys(this.files).find(
      (o) => this.files[o].encFilename === query
    );
  }

  /**
   * Deletes file from manifest
   * @param {String} filename File to delete
   */
  deleteFile(filename) {
    delete this.files[filename];
  }

  /**
   * Renames a file in the manifest
   * @param {String} newFilename
   * @param {String} oldFilename
   */
  renameFile(newFilename, oldFilename) {
    this.files[newFilename] = this.files[oldFilename];
    delete this.files[oldFilename];
  }

  stringify() {
    const newJson = {};
    Object.entries(this.files).forEach(([k, v]) => {
      newJson[k] = {
        key: forge.util.encode64(v.key),
        iv: forge.util.encode64(v.iv),
        encFilename: v.encFilename,
      };
    });
    return JSON.stringify(newJson);
  }

  static parse(manifest) {
    return JSON.parse(manifest);
  }

  encryptWithKey(key, iv) {
    return cipher.encryptFile(
      new Blob([this.stringify()], { type: "application/json" }),
      key,
      iv
    );
  }

  encrypt() {
    return cipher.encryptFile(
      new Blob([this.stringify()], { type: "application/json" })
    );
  }

  static decrypt(encryptedManifest, key, iv) {
    const decrypted = JSON.parse(cipher.decrypt(encryptedManifest, key, iv));
    const newJson = {};
    Object.entries(decrypted).forEach(([k, v]) => {
      newJson[k] = {
        key: forge.util.decode64(v.key),
        iv: forge.util.decode64(v.iv),
        encFilename: v.encFilename,
      };
    });
    return new FileManifest(newJson);
  }
}

// eslint-disable-next-line import/prefer-default-export
export { FileManifest };
