
const getAllFileData = (callback) => {
    /**
     * IDK if this even works. Not been tested. Straight from the tutorial
     */
    const getPage = (req, res) => {
        req.execute((resp) => {
            res = res.concat(resp.items)
            var nextToken = resp.nextPageToken
            if (nextToken) {
                req = window.gapi.client.drive.files.list({
                    'pageToken': nextToken
                })
                getPage(req, res)
            } else {
                callback(res)
            }
        })
    }
    getPage(window.gapi.client.drive.files.list(), [])
}

export { getAllFileData }