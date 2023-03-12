/***********************************
 *             Resource
 ***********************************/
var SystemInst = {
    clockStatus: "start",
    resetHour: "30",
    resetMin: "00",
    countDownInst: null,
    startCountDown: () => { },
    stopCountDown: () => { },
    resetCountDown: () => { },
    //notion data structure
    pagesDict: {}
}
const LOCALSTORAGE_KEY = "WIDGET-CLOCK-26s3a1"
/***********************************
 *              Method
 ***********************************/
window.addEventListener('load', (e) => {
    settingClockEvent()
    createPagesOption()
    toolSetting()

    //check localstoarge, update relative Database
    AccessDBStorageFunc()
})

const settingClockEvent = () => {
    var hourEle = document.querySelector('#hourId')
    var minEle = document.querySelector('#minId')

    hourEle.addEventListener('wheel', (e) => {
        var hour = parseInt(hourEle.textContent)
        if (SystemInst.clockStatus == 'start') {
            if (e.deltaY > 0) {
                hour = hour - 1 < 0 ? (0) : hour - 1
            } else {
                hour = hour + 1 > 59 ? (59) : hour + 1
            }

            hourEle.textContent = ("0" + hour).slice(-2)
        }
    })
    minEle.addEventListener('wheel', (e) => {
        var min = parseInt(minEle.textContent)
        if (SystemInst.clockStatus == 'start') {
            if (e.deltaY > 0) {
                min = min - 1 < 0 ? (0) : min - 1
            } else {
                min = min + 1 > 59 ? (59) : min + 1
            }
            minEle.textContent = ("0" + min).slice(-2)
        }
    })

    //define callback
    const resetCountDown = () => {
        stopCountDown();
        hourEle.textContent = SystemInst.resetHour
        minEle.textContent = SystemInst.resetMin
    }
    const startCountDown = () => {
        if (SystemInst.countDownInst) {
            clearInterval(SystemInst.countDownInst)
            SystemInst.countDownInst = null
        }

        SystemInst.countDownInst = setInterval(() => {
            var hour = parseInt(hourEle.textContent)
            var min = parseInt(minEle.textContent)
            console.log(`${hour}:${min}`)

            if (min - 1 < 0) {
                if (hour - 1 < 0) {
                    //stop timer
                    stopCountDown();
                    timeUpCallback()
                } else {
                    hour -= 1;
                    min = 59
                }
            } else {
                min -= 1;
            }
            hourEle.textContent = ("0" + hour).slice(-2)
            minEle.textContent = ("0" + min).slice(-2)
        }, 1000)
    }
    const stopCountDown = () => {
        if (SystemInst.countDownInst) {
            clearInterval(SystemInst.countDownInst)
            SystemInst.countDownInst = null
        }
    }

    //link prob
    SystemInst.startCountDown = startCountDown
    SystemInst.stopCountDown = stopCountDown
    SystemInst.resetCountDown = resetCountDown
}

const createPagesOption = (options = []) => {
    //get db setting
    const optionWrapperEle = document.querySelector('#pageSelectWrapperId')
    var selectEle = document.createElement('select')
    selectEle.id = "pageOptionId"
    selectEle.style.textOverflow = 'ellipsis'
    options.forEach(item => {
        var optEle = document.createElement('option')
        optEle.textContent = item
        selectEle.append(optEle)
    })

    //append to document
    if (optionWrapperEle.querySelector("#pageOptionId") != null)
        optionWrapperEle.querySelector("#pageOptionId").remove()
    optionWrapperEle.append(selectEle)
}

const toolSetting = () => {
    var settingEle = document.querySelector('.tool-setting')
    var startEle = document.querySelector('.tool-start')
    var resetEle = document.querySelector('.tool-reset')

    startEle.addEventListener('click', (e) => {
        var st = startEle.getAttribute('status')
        var imgEle = startEle.querySelector('img')
        if (st == 'start') {
            startEle.setAttribute('status', 'pause')
            imgEle.src = "./static/icons8-pause-button-30.png"
            SystemInst.clockStatus = "pause"

            SystemInst.startCountDown()
        } else {
            startEle.setAttribute('status', 'start')
            imgEle.src = "./static/icons8-countdown-32.png"
            SystemInst.clockStatus = "start"

            SystemInst.stopCountDown()
        }
    })

    resetEle.addEventListener('click', (e) => {
        SystemInst.resetCountDown()
    })
    settingEle.addEventListener('click', (e) => {
        // var data = {
        //     dbKey: "9a13afce08094487ab65a5065ed7fbd9"
        // }
        // fetch('/getDBFormat', {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json", },
        //     body: JSON.stringify(data)
        // }).then((res) => {
        //     return res.json()
        // }).then((data) => {
        //     console.log(data)
        // })
    })
}

const timeUpCallback = () => {
    const selectEle = document.querySelector('#pageSelectWrapperId').querySelector("#pageOptionId")
    console.log(selectEle)
}

const AccessDBStorageFunc = () => {
    const updatePageSelect = (dbKey) => {
        getDBContent(dbKey)
            .then((dataList) => {
                // console.log(dataList)
                //update select
                var pageOptionList = []
                dataList.forEach(item => {
                    var title = ""
                    for (const [name, dataItem] of Object.entries(item.properties)) {
                        if (dataItem.type == 'title') {
                            title = dataItem[dataItem.type][0].plain_text
                            pageOptionList.push(title)
                        }
                    }
                    //create link
                    SystemInst.pagesDict[title] = item
                })
                createPagesOption(pageOptionList)
            })
    }

    storage = window.localStorage.getItem(LOCALSTORAGE_KEY)
    if (storage == null) {
        //create setting page
        createSettingDBPage(LOCALSTORAGE_KEY).then((dbKey) => {
            updatePageSelect(dbKey)
        })
    } else {
        var storageJson = JSON.parse(storage)
        // const dbKey = storage
        const dbKey = storageJson.dbKey
        updatePageSelect(dbKey)
    }
}