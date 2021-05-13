import constants from "../../constants";
import FileNotFoundError from "./exceptions/FileNotFoundError";

class GDriveFS {
  constructor() {
    this.baseDirId = null;
  }

  async init() {
    const getBaseDirName = async () => {
      const baseURL = new URL("https://www.googleapis.com/drive/v3/files");
      baseURL.searchParams.append(
        "q",
        `name = '${constants.ENCRYPTED_DIR_NAME}'`
      );
      const res = await fetch(baseURL, {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${window.gapi.auth.getToken().access_token}`,
        }),
      });
      const json = await res.json();
      // If the directory exists, store a reference
      if (
        json.files.length >= 1 &&
        json.files[0].name === constants.ENCRYPTED_DIR_NAME
      ) {
        return json.files[0].id;
      }
      // Filesystem does not exist. Will create
      const makeDirResponse = await (
        await this.uploadFile(
          constants.ENCRYPTED_DIR_NAME,
          new Blob([]),
          [],
          null,
          "application/vnd.google-apps.folder"
        )
      ).json();
      return makeDirResponse.id;
    };
    this.baseDirId = await getBaseDirName();
  }

  checkForInitialization() {
    if (this.baseDirId === null) {
      throw new Error("Cannot use uninitialized GDriveFS. Call init()");
    }
  }

  getAllFileData() {
    this.checkForInitialization();
    const fetchPage = async (token) => {
      const url = new URL("https://www.googleapis.com/drive/v3/files");
      url.searchParams.append(
        "fields",
        "files(name, id, properties, modifiedTime, size)"
      );
      url.searchParams.append("q", `'${this.baseDirId}' in parents`);
      if (token) {
        url.searchParams.append("pageToken", token);
      }
      const res = await fetch(url, {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${window.gapi.auth.getToken().access_token}`,
        }),
      });
      const json = await res.json();
      return json;
    };

    return new Promise((resolve) => {
      const getPage = async (token, res) => {
        const newResponse = await fetchPage(token);
        const files = res.concat(newResponse.files);
        let newToken = null;
        if (newResponse.nextPageToken) {
          newToken = newResponse.nextPageToken;
          getPage(newToken, files);
        } else {
          resolve(files);
        }
      };
      getPage(null, []);
    });
  }

  uploadFile(name, file, parent, properties, mimeType = "octet/stream") {
    if (parent === null) {
      this.checkForInitialization();
    }
    const form = new FormData();
    const metadata = {
      name, // Filename at Google Drive
      parents: parent || [this.baseDirId], // Default to storing inside encrypted dir
      mimeType, // mimeType at Google Drive
      properties,
    };

    form.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], {
        type: "application/json; charset=UTF-8",
      })
    );
    form.append("file", file);

    return fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",
      {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${window.gapi.auth.getToken().access_token}`,
        }),
        body: form,
      }
    );
  }

  async updateFile(name, file, properties, mimeType = "octet/stream") {
    const fileInfo = await this.getFileInfo(name);
    const form = new FormData();
    const metadata = {
      name, // Filename at Google Drive
      mimeType, // mimeType at Google Drive
      properties,
    };

    form.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], {
        type: "application/json; charset=UTF-8",
      })
    );
    form.append("file", file);

    return fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${fileInfo.id}?uploadType=multipart`,
      {
        method: "PATCH",
        headers: new Headers({
          Authorization: `Bearer ${window.gapi.auth.getToken().access_token}`,
        }),
        body: form,
      }
    );
  }

  async deleteFileByName(name) {
    const fileInfo = await this.getFileInfo(name);

    return fetch(`https://www.googleapis.com/drive/v3/files/${fileInfo.id}`, {
      method: "DELETE",
      headers: new Headers({
        Authorization: `Bearer ${window.gapi.auth.getToken().access_token}`,
      }),
    });
  }

  // eslint-disable-next-line class-methods-use-this
  downloadFileById(id) {
    return fetch(`https://www.googleapis.com/drive/v3/files/${id}?alt=media`, {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${window.gapi.auth.getToken().access_token}`,
      }),
    });
  }

  async getFileInfo(name) {
    const baseURL = new URL("https://www.googleapis.com/drive/v3/files");
    baseURL.searchParams.append(
      "q",
      `name = '${name}' and '${this.baseDirId}' in parents`
    );
    baseURL.searchParams.append(
      "fields",
      "files(name, id, properties, modifiedTime)"
    );

    const fileIdQuery = await (
      await fetch(baseURL, {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${window.gapi.auth.getToken().access_token}`,
        }),
      })
    ).json();

    if (fileIdQuery.files.length === 0) {
      throw new FileNotFoundError("File not found");
    }

    return fileIdQuery.files[0];
  }

  async downloadFileByName(name) {
    const file = await this.getFileInfo(name);
    const fileResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
      {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${window.gapi.auth.getToken().access_token}`,
        }),
      }
    );

    return {
      props: file,
      file: await (await fileResponse.blob()).arrayBuffer(),
    };
  }
}

export default GDriveFS;
