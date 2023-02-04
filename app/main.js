window.addEventListener('load', () => {
    var clockEle = document.querySelector('#clockId')
    timerFunc(clockEle)
})

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