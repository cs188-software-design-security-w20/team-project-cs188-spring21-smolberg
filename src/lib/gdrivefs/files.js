const getAllFileData = (callback) => {
  /**
   * IDK if this even works. Not been tested. Straight from the tutorial
   */
  const getPage = (req, res) => {
    req.execute((resp) => {
      const newRes = res.concat(resp.items);
      const nextToken = resp.nextPageToken;
      if (nextToken) {
        const newReq = window.gapi.client.drive.files.list({
          pageToken: nextToken,
        });
        getPage(newReq, newRes);
      } else {
        callback(res);
      }
    });
  };
  getPage(window.gapi.client.drive.files.list(), []);
};

// eslint-disable-next-line import/prefer-default-export
export { getAllFileData };
