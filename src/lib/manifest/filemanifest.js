

/** File Manifest Constructor
 * 
 */
const FileManifest = () => {
	this.files = [];
    //maybe add a manifest.settings or something
    //if we do subdirectories, add a manifest.folder, which contains a similar data structure containing folders and files within
	const addFile = (filename, encFilename, key, iv) => {
		this.files[filename].key = key;
		this.files[filename].iv = iv;
		this.files[filename].encFilename;
		
		//save any other file metadata here
	}
	/** Gets file data needed to get and decrypt the file
	 * 
	 * @param {String} filename 
	 * @returns {key, iv, encFilename}
	 */
	const getFile = (filename) => {
		return this.files[filename]
	}
	/**
	 * Deletes file from manifest
	 * @param {String} filename File to delete 
	 */
	const deleteFile = (filename) => {
		
		delete this.files[filename];
	}
	/**
	 * Renames a file in the manifest
	 * @param {String} newFilename 
	 * @param {String} oldFilename
	 */
	const renameFile = (newFilename, oldFilename) => {
		
		this.files[newFilename] = oldFilename;
		delete this.files[oldFilename];
	}

	const stringify = JSON.stringify(this);
	const parse = (manifest) => { return JSON.parse(manifest); }
}



export {FileManifest}