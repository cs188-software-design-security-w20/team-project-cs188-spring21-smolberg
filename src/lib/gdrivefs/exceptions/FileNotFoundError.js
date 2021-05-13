class FileNotFoundError extends Error {
  constructor(msg) {
    super(msg);
    this.name = "FileNotFoundError";
  }
}

export default FileNotFoundError;
