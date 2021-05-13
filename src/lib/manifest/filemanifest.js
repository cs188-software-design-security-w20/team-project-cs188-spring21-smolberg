import { cipher } from "../crypto";
/** File Manifest Constructor
 *
 */
class FileManifest {
  // constructor() {
  //   this.files = {};
  // }

  constructor(manifest) {
    this.files = manifest ? JSON.parse(manifest) : {};
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
    this.files[newFilename] = oldFilename;
    delete this.files[oldFilename];
  }

  stringify() {
    return JSON.stringify(this.files);
  }

  static parse(manifest) {
    return JSON.parse(manifest);
  }

  encrypt(key, iv) {
    return cipher.encryptFile(
      new Blob([this.stringify()], { type: "application/json" }),
      key,
      iv
    );
  }

  static decrypt(encryptedManifest, key, iv) {
    return new FileManifest(
      cipher.decrypt(encryptedManifest, key, iv).toString()
    );
  }
}

// eslint-disable-next-line import/prefer-default-export
export { FileManifest };
