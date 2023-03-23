/***********************************
 *             Resource
 ***********************************/
var SystemInst = {
    clockStatus: "start",
    resetHour: "25",
    resetMin: "00",
    countDownInst: null,
    startCountDown: () => { },
    stopCountDown: () => { },
    resetCountDown: () => { },
    //notion data structure
    pagesDict: {}
}
const LOCALSTORAGE_KEY = "WIDGET-FOLD-CARD-2216qw"
// { ques: "who is the best man?", choice: ["1", "2", "3"], ans: "1" }
/***********************************
 *              Method
 ***********************************/
window.addEventListener('load', (e) => {
    // settingClockEvent()
    createGroupOption()
    // toolSetting()

    // //check localstoarge, update relative Database
    AccessDBStorageFunc().then((flipList) => {
        // flipList = [
        //     { ques: "who is the best man?", choice: ["1", "2", "3"], ans: "1" },
        //     { ques: "which stock is hot today?", choice: ["s1", "s2", "s3"], ans: "s2" },
        // ]
        createFoldCard(flipList)
    })
})

const settingClockEvent = () => {


    //link prob
    // SystemInst.startCountDown = startCountDown
    // SystemInst.stopCountDown = stopCountDown
    // SystemInst.resetCountDown = resetCountDown
}

const createGroupOption = (options = [1, 2]) => {
    //get db setting
    const optionWrapperEle = document.querySelector('#groupSelectWrapperId')
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

const createFoldCard = (flipList = []) => {
    var foldcardWrapper = document.querySelector("#foldWrapperId")

    flipList.push({ ques: "Finish~", choice: ["Your score:"], ans: 0 })

    var questionEleList = []
    var score = 0
    var totalQuestion = flipList.length - 1

    //card create
    const createNextLabel = ({ text = "", top = 0 }) => {
        var card = document.createElement('div')
        var cardText = document.createElement('div')
        var step = 0

        card.id = "flipCard"
        cardText.textContent = text
        cardText.className = "choice-style"
        card.className = "card-style"

        card.classList.add("transition-style")
        cardText.classList.add("transition-style")
        card.append(cardText)

        var qCard = null
        card.addEventListener('click', (e) => {
            if (flipList.length == 0 || step != 0)
                return
            if (card.classList.contains("transition-style") == false) {
                card.classList.toggle("transition-style")
                cardText.classList.toggle("transition-style")
            }
            step = 1
            var quesition = flipList[0].ques
            //create next question in its background
            qCard = document.createElement('div')
            qCard.textContent = quesition
            qCard.className = "ques-card-style"

            //
            questionEleList.forEach(ele => {
                if (ele.classList.contains("transition-style"))
                    ele.classList.toggle("transition-style")
                ele.style = "transform: translate(0px, 0px)"
            })
            foldcardWrapper.insertBefore(qCard, foldcardWrapper.firstChild)

            questionEleList.push(qCard)

            //trigger rotate
            card.style = "transform:rotateX(1deg)"
        })
        card.addEventListener("transitionend", (e) => {
            if (e.target.id == "flipCard") {
                if (step == 1) {
                    step = 2;
                    card.style = "transform:rotateX(90deg)"
                    cardText.style = "transform:rotate3d(1, 0, 0, 90deg)"
                    questionEleList.forEach(ele => {
                        var height = ele.getBoundingClientRect().height
                        if (ele.classList.contains("transition-style") == false)
                            ele.classList.toggle("transition-style")
                        ele.style = `transform: translate(0, ${height / 2}px)`
                    })
                } else if (step == 2) {
                    step = 3
                    card.style = "transform:rotateX(180deg)"
                    cardText.style = "transform:rotate3d(1, 0, 0, 180deg)"
                    questionEleList.forEach(ele => {
                        var height = ele.getBoundingClientRect().height
                        ele.style = `transform: translate(0px, ${height}px)`
                    })
                    //next choice
                    var choiceList = flipList[0].choice
                    var ans = flipList[0].ans
                    cardText.innerHTML = ""
                    if (choiceList.length == 1) {
                        var itemEle = document.createElement('div')
                        var percent = (score / totalQuestion) * 100
                        itemEle.className = "choice-item-style"
                        itemEle.textContent = `${percent.toFixed(2)} %`
                        cardText.append(itemEle)

                        itemEle.addEventListener('click', () => {
                            console.log("Send back to notion")
                        })
                    } else {
                        choiceList.forEach(item => {
                            var itemEle = document.createElement('div')
                            itemEle.className = "choice-item-style"
                            itemEle.textContent = item

                            itemEle.addEventListener('click', (e) => {
                                var questionEle = foldcardWrapper.firstChild
                                if (questionEle.classList.contains("correct-style")
                                    || questionEle.classList.contains("incorrect-style")) {
                                    return
                                }
                                if (item == ans) {
                                    questionEle.classList.add("correct-style")
                                    score += 1
                                } else {
                                    questionEle.classList.add("incorrect-style")
                                }
                            })
                            cardText.append(itemEle)
                        })
                    }
                } else if (step == 3) {
                    flipList.shift()

                    card.classList.toggle("transition-style")
                    cardText.classList.toggle("transition-style")
                    card.style = "transform:rotateX(0deg)"
                    cardText.style = "transform:rotateX(0deg)"

                    step = 0;
                }
            }
        })

        if (foldcardWrapper.firstChild)
            foldcardWrapper.insertBefore(card, foldcardWrapper.firstChild)
        else
            foldcardWrapper.append(card)
    }

    createNextLabel({ text: "Click to start", top: 0 })
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
        createSettingDBPage(LOCALSTORAGE_KEY).then((dbKey) => {
            getQuestionListFromDB(dbKey)
        })
    })
}

const timeUpCallback = () => {
    //restorage status
    var startEle = document.querySelector('.tool-start')
    var imgEle = startEle.querySelector('img')
    startEle.setAttribute('status', 'start')
    imgEle.src = "./static/icons8-countdown-32.png"
    SystemInst.clockStatus = "start"

    //get select page id
    const selectEle = document.querySelector('#pageSelectWrapperId').querySelector("#pageOptionId")
    if (selectEle.options[selectEle.selectedIndex] != undefined) {
        var pageName = selectEle.options[selectEle.selectedIndex].text;
        var item = SystemInst.pagesDict[pageName]

        var storage = window.localStorage.getItem(LOCALSTORAGE_KEY)
        var data = JSON.parse(storage)

        setPageData(item.page, data)
    }
}

const getQuestionListFromDB = (dbKey) => {
    return new Promise((resolve, reject) => {
        getDBContent(dbKey)
            .then((dataList) => {
                var questionList = []
                dataList.forEach(item => {
                    var card = { ques: "?", choice: ["1", "2", "3"], ans: "1" }
                    for (const [name, dataItem] of Object.entries(item.properties)) {
                        if (name == "Question") {
                            card.ques = dataItem[dataItem.type][0].plain_text
                        }
                        if (name == "Answer") {
                            card.ans = dataItem[dataItem.type][0].plain_text
                            card.choice[0] = dataItem[dataItem.type][0].plain_text
                        }
                        if (name == "choice1") {
                            card.choice[1] = dataItem[dataItem.type][0].plain_text
                        }
                        if (name == "choice2") {
                            card.choice[2] = dataItem[dataItem.type][0].plain_text
                        }
                        // if (dataItem.type == 'title') {
                        //     title = dataItem[dataItem.type][0].plain_text
                        //     pageOptionList.push(title)
                        // }
                    }
                    //create link
                    questionList.push(card)
                })

                resolve(questionList)
            })
    })
}
const AccessDBStorageFunc = () => {
    return new Promise((resolve, reject) => {
        //get storage-key from server
        storage = window.localStorage.getItem(LOCALSTORAGE_KEY)
        if (storage == null) {
            //create setting page
            createSettingDBPage(LOCALSTORAGE_KEY).then((dbKey) => {
                getQuestionListFromDB(dbKey).then((questionList) => {
                    console.log(questionList)
                    resolve(questionList)
                })
            })
        } else {
            var storageJson = JSON.parse(storage)
            // console.log(storageJson)
            // const dbKey = storage
            const dbKey = storageJson.dbKey
            getQuestionListFromDB(dbKey).then((questionList) => {
                console.log(questionList)
                resolve(questionList)
            })
        }
    })

}