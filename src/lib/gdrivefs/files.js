const randomDate = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const fakeGDrive = [
  {
    kind: "drive#file",
    id: "1oXgaMh2RKxmjv6j-nJwp4z7r3Grc-Lr2",
    name: "manifest1.json",
    mimeType: "application/json",
  },
  {
    kind: "drive#file",
    id: "1NHb9HDItqq1BpELJSAKsoBj3TQNlOA5z",
    name: "fileee.txt",
    mimeType: "text/plain",
  },
];

const getAllFileData = async () => {
  const files = await window.gapi.client.drive.files.list();
  return files.result.files;
};

const formatFiles = async (files) => {
  const f = [];
  for (let i = 0; i < files.length; i += 1) {
    f.push({
      name: files[i].name,
      sum: "d8837d6a773331f74705ad54e4f17c220acd89d28dd33e99451ba282fce9f8f9",
      lastModTime: randomDate(new Date(2021, 1, 1), new Date()),
    });
  }
  return f;
};

/**
 * Uploads a Blob object to google drive with the given name
 *
 * TODO: Accept directory to place file in
 *
 * @param {string} name
 * @param {Blob} file
 * @returns Promise from fetch API call
 */
const uploadFile = async (name, file) => {
  const form = new FormData();
  const metadata = {
    name, // Filename at Google Drive
    mimeType: "octet/stream", // mimeType at Google Drive
  };
  form.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" })
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
};

/**
 * Downloads a file from google drive, given the file ID.
 * This function will NOT convert the response to blob or string format.
 * It is the callers job to take the response and convert it into a different format.
 * For example: pulling the arraybuffer so that the file may be decrypted
 * like `await res.arrayBuffer()`
 *
 * @param {string} fileId
 * @returns Promise from fetch API call
 */
const downloadFile = async (fileId) =>
  fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    method: "GET",
    headers: new Headers({
      Authorization: `Bearer ${window.gapi.auth.getToken().access_token}`,
    }),
  });

export { fakeGDrive, formatFiles, getAllFileData, uploadFile, downloadFile };
