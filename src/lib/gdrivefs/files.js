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

export { fakeGDrive, formatFiles, getAllFileData };
