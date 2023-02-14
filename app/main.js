var ImageDict = {}
window.addEventListener('load', () => {
    var extBtn = document.querySelector("#extensionBtnId")
    var clipBtn = document.querySelector('#clipBtnId')
    extBtn.addEventListener('click', (e) => {
        console.log("extension click-1")
        //iframe to parent
        window.top.postMessage({ cmd: "FROM_WIDGET_GET_SHOOT_IMAGES" }, "*")
    })

    clipBtn.addEventListener('click', (e) => {
        var wrapper = document.querySelector("#editImageWrapper")
        // navigator.clipboard.writeText("https://i.pinimg.com/236x/32/26/3c/32263c697d9f55a81aa60f77aebc1165.jpg")

        AnnoInst.imageEditor("#editImageWrapper")
    })
})

window.addEventListener('message', (e) => {
    if (e.data == null || e.data == undefined)
        return;

    var cmd = e.data.cmd
    var imgSrc = e.data.data
    var tabId = e.data.tabId
    switch (cmd) {
        case "FROM_CONTENT_REPONSE_WIDGET_REQ":
            getExtensionResponse(cmd, imgSrc, tabId)
            break;
        default:
            console.log("missing cmd:", cmd)
            break;
    }
})
/*********************************************************
 *                  Local methods
 *********************************************************/
const getExtensionResponse = (cmd, imgSrc, tabId) => {
    const h = genHashCode(imgSrc)

    if (ImageDict[tabId] == undefined)
        ImageDict[tabId] = {}

    if (ImageDict[tabId][h] == undefined) {
        insertImgToList(imgSrc)
        ImageDict[tabId][h] = imgSrc
    }
}

const insertImgToList = (imgSrc) => {
    var listWrapper = document.querySelector("#imgListId")

    //create img-html
    var imgEle = document.createElement("img")
    imgEle.src = imgSrc
    imgEle.className = "ext-img-style"

    imgEle.addEventListener('click', (e) => {
        console.log("click")
        AnnoInst.updateImgSrc(imgSrc)
    })

    listWrapper.appendChild(imgEle)
}
const timerFunc = (ele = null) => {
    if (ele == null) return
    ele.textContent = 0

    setInterval(() => {
        var curTime = 0
        if (ele.textContent != "")
            curTime = parseInt(ele.textContent)
        ele.textContent = curTime + 1
    }, 1000)
}

function genHashCode(string) {
    //set variable hash as 0
    var hash = 0;
    // if the length of the string is 0, return 0
    if (string.length == 0)
        return hash;
    for (i = 0; i < string.length; i++) {
        ch = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + ch;
        hash = hash & hash;
    }
    return hash
}