
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

const uploadFile = async () => {
    const boundary='foo_bar_baz'
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";
    var fileName='samplefile';
    var fileData='sample data';
    var contentType='text/plain'
    var metadata = {
        'name': fileName,
        'mimeType': contentType
    };

    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n\r\n' +
        fileData+'\r\n'+
        close_delim;

    console.log(multipartRequestBody);
    var request = window.gapi.client.request({
        'path': 'https://www.googleapis.com/upload/drive/v3/files',
        'method': 'POST',
        'params': {'uploadType': 'multipart'},
        'headers': {
            'Content-Type': 'multipart/related; boundary=' + boundary + ''
        },
        'body': multipartRequestBody});
    request.execute(function(file) {
        console.log(file)
    });
}

export { getAllFileData, uploadFile }
