import isString from 'lodash/isString'

export default {
    exportCanvasAsPNG(canvas, fileName) {
        let canvasElement = canvas
        let imgURL = ''
        var MIME_TYPE = "image/png";

        if(isString(canvas)) {
            imgURL = canvas
        } else {
            imgURL = canvasElement.toDataURL(MIME_TYPE);
        }

        // console.log(canvasElement)
        // var blob = canvasElement.msToBlob();
        // window.navigator.msSaveBlob(blob, filename);
        var dlLink = document.createElement('a');
        dlLink.download = fileName;
        dlLink.href = imgURL;
        dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');
    
        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);
    }
}