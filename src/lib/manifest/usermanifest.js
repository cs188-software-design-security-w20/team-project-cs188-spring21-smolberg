const UserManifest = () => {
    this.version = 0.1; //guess we are doing versioning here
    this.fileManifestName = null;
    this.fileManifestIV = null;
    this.fileManifestKey = null;

    const setFileManifest = (fileManifestName, fileManifestIV, fileManifestKey) => {
        this.fileManifestName = fileManifestName;
        this.fileManifestIV = fileManifestIV;
        this.fileManifestKey = fileManifestKey;
    }

    const stringify = JSON.stringify(this);
    const parse = (manifest) => { return JSON.parse(manifest); }
    //we might want to prototype in upload and download functions for this
}

export {UserManifest}