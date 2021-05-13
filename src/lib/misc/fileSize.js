const getReadableFileSizeString = (fileSizeInBytes) => {
  let i = -1;
  let fs = fileSizeInBytes;
  const byteUnits = [" kB", " MB", " GB", " TB", "PB", "EB", "ZB", "YB"];
  do {
    fs /= 1024;
    i += 1;
  } while (fs > 1024);

  return Math.max(fs, 0.1).toFixed(1) + byteUnits[i];
};

// eslint-disable-next-line import/prefer-default-export
export { getReadableFileSizeString };
