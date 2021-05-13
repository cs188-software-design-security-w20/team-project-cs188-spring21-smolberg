import * as forge from "node-forge";
import { cipher } from "../crypto";

class UserManifest {
  constructor(
    mpwHash,
    name = forge.util.binary.hex
      .encode(forge.random.getBytesSync(32))
      .toString(),
    key = forge.random.getBytesSync(32),
    iv = forge.random.getBytesSync(16)
  ) {
    this.version = 0.1;
    this.mpwHash = mpwHash;
    this.fileManifest = { name, key, iv };
  }

  static fromManifest(other) {
    return new UserManifest(other.mpwHash, other.name, other.key, other.iv);
  }

  stringify() {
    return JSON.stringify({
      mpwHash: this.mpwHash,
      version: this.version,
      fileManifest: {
        name: this.fileManifest.name,
        key: forge.util.encode64(this.fileManifest.key),
        iv: forge.util.encode64(this.fileManifest.iv),
      },
    });
  }

  static parse(manifest) {
    return JSON.parse(manifest);
  }

  encrypt(key, iv) {
    return cipher.encryptFile(new Blob([this.stringify()]), key, iv);
  }

  static decrypt(encryptedManifest, key, iv) {
    const decrypted = cipher.decrypt(encryptedManifest, key, iv);
    const parsed = JSON.parse(decrypted);
    return new UserManifest(
      parsed.mpwHash,
      parsed.fileManifest.name,
      forge.util.decode64(parsed.fileManifest.key),
      forge.util.decode64(parsed.fileManifest.iv)
    );
  }

  // we might want to prototype in upload and download functions for this.state
}

// eslint-disable-next-line import/prefer-default-export
export { UserManifest };
