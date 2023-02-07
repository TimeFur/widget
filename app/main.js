window.addEventListener('load', () => {
    var extBtn = document.querySelector("#extensionBtnId")
    var clockEle = document.querySelector('#clockId')
    timerFunc(clockEle)

    extBtn.addEventListener('click', (e) => {
        console.log("extension click-1")
        //iframe to parent
        window.top.postMessage({ cmd: "FROM_WIDGET_GET_SHOOT_IMAGES" }, "*")
    })
})

window.addEventListener('message', (e) => {
    if (e.data == null || e.data == undefined)
        return;

    var cmd = e.data.cmd
    var data = e.data.data
    switch (cmd) {
        case "FROM_CONTENT_REPONSE_WIDGET_REQ":
            getExtensionResponse(cmd, data)
            break;
        default:
            console.log("missing cmd:", cmd)
            break;
    }
})
/*********************************************************
 *                  Local methods
 *********************************************************/
const getExtensionResponse = (cmd, data) => {
    switch (cmd) {
        case "FROM_CONTENT_REPONSE_WIDGET_REQ":
            // var extImg = document.querySelector('.ext-img-style')
            // extImg.src = data
            insertImgToList(data)
            break;
    }
    // extImgId
}

const insertImgToList = (imgSrc) => {
    var listWrapper = document.querySelector("#imgListId")

    //create img-html
    var imgEle = document.createElement("img")
    imgEle.src = imgSrc
    imgEle.className = "ext-img-style"

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