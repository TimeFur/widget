function getAllShoots(iframeAttr = null) {
    function sendBackFunc({ tabId = "", imgTitle = "", imgSrc = "" }) {
        //post to embedded iframe
        if (iframeAttr != null) {
            var widgetEle = document.querySelector(iframeAttr);
            if (widgetEle) {
                widgetEle.contentWindow.postMessage({
                    cmd: "FROM_CONTENT_REPONSE_WIDGET_REQ",
                    data: imgSrc
                }, "*")
            }
        } else {
            //post to current window		
            window.postMessage({
                cmd: "FROM_CONTENT_REPONSE_WIDGET_REQ",
                data: imgSrc,
                tabId: tabId,
                imgTitle: imgTitle,
            }, "*")
        }
    }

    //get all images from all tabs, one by one
    chrome.runtime.sendMessage({
        type: "FROM_CONTENT_GET_ALL_LISTS"
    }, (res) => {
        res.forEach(item => {
            if (item.res != undefined && item.res.length != 0) {
                //{id, title, res:[]}
                item.res.forEach(imgTitle => {
                    chrome.runtime.sendMessage({
                        type: "GET_CONTENT_SHOOT_FROM_CONTENT",
                        tabId: item.id,
                        getItem: imgTitle
                    }, (imgInfo) => {
                        //send back to widget
                        sendBackFunc({ tabId: item.id, title: imgTitle, imgSrc: imgInfo.imgSrc })
                    })
                })
            }
        })
    });
}

const extensionInst = {
    getAllShoots: getAllShoots
}