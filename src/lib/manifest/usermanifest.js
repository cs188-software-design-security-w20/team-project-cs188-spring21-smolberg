import { cipher } from "../crypto";

class UserManifest {
  constructor(name, key, iv) {
    this.state = {
      version: 0.1,
      fileManifest: { name, key, iv },
    };
  }

  stringify() {
    return JSON.stringify(this.state);
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
    const decrypted = cipher.decrypt(encryptedManifest, key, iv).toString();
    const parsed = JSON.parse(decrypted);
    return new UserManifest(
      parsed.state.fileManifest.name,
      parsed.state.fileManifest.key,
      parsed.state.fileManifest.iv
    );
  }

  // we might want to prototype in upload and download functions for this.state
}

// eslint-disable-next-line import/prefer-default-export
export { UserManifest };
