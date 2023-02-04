window.addEventListener('load', () => {
    var extBtn = document.querySelector("#extensionBtnId")
    var clockEle = document.querySelector('#clockId')
    timerFunc(clockEle)

    extBtn.addEventListener('click', (e) => {
        console.log("extension click")
        window.postMessage({ cmd: "FROM_WIDGET_GET_SHOOT_IMAGES" }, "*")
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
            break;
    }
})

const getExtensionResponse = (cmd, data) => {
    switch (cmd) {
        case "FROM_CONTENT_REPONSE_WIDGET_REQ":
            var extImg = document.querySelector('#extImgId')
            extImg.src = data
            break;
    }
    // extImgId
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