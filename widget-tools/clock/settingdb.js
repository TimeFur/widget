var SelectDict = {}
/**
 *
 * wrapperEle
 *  - dbWrapper
 *      - dbSubmitEle
 *      - submitImg
 *  - selectEle
 *  - valueWrapper  
 */
const createSettingDBPage = (storageKey = "") => {
    return new Promise((resolve) => {
        storage = window.localStorage.getItem(storageKey)
        var storageJson = { dbKey: "" }
        if (storage != null)
            storageJson = JSON.parse(storage)

        var wrapperEle = document.createElement('div')
        wrapperEle.id = "settingWrapperId"
        wrapperEle.style.backgroundColor = 'rgba(212,55,33,0.5)'
        wrapperEle.style.backdropFilter = "blur(3px)"
        wrapperEle.style.position = "absolute"
        wrapperEle.style.width = "100%"
        wrapperEle.style.height = "100vh"
        wrapperEle.style.top = "0px"
        wrapperEle.style.display = 'flex'
        wrapperEle.style.flexDirection = "column"
        wrapperEle.style.gap = "1rem"
        wrapperEle.style.justifyContent = "center"
        wrapperEle.style.alignItems = "center"

        //db-input element
        var dbWrapper = document.createElement('div')
        dbWrapper.id = "dbWrapperId"
        var dbEleInput = document.createElement('input')
        dbEleInput.setAttribute('value', storageJson.dbKey)
        var dbSubmitEle = document.createElement('div')
        var submitImg = document.createElement('img')
        submitImg.src = "./static/icons8-enter-24.png"
        submitImg.style.width = "100%"
        dbSubmitEle.style.cursor = "pointer"
        dbSubmitEle.style.objectFit = "cover"
        dbSubmitEle.append(submitImg)
        dbSubmitEle.addEventListener('click', (e) => {
            var dbId = dbEleInput.value
            if (dbId != "") {
                getDBFormatWrapper(dbId, storageKey)
                resolve(dbId)
            }
        })

        dbWrapper.style.display = "flex"
        dbWrapper.append(dbEleInput)
        dbWrapper.append(dbSubmitEle)

        //wrapper element event and append
        wrapperEle.append(dbWrapper)
        wrapperEle.addEventListener('click', (e) => {
            if (e.target.id == "settingWrapperId") {
                var selectPropertyEle = wrapperEle.querySelector("#selectDBItemId")
                var optionEleList = wrapperEle.querySelectorAll("#setValueId")
                var optionData = []
                optionEleList.forEach(ele => {
                    if (ele.checked) {
                        optionData.push(ele.name)
                    }
                })

                if (optionData.length > 0) {
                    var storageDBJson = JSON.parse(window.localStorage.getItem(LOCALSTORAGE_KEY))
                    storageDBJson['property'] = selectPropertyEle.value
                    storageDBJson['options'] = optionData
                    window.localStorage.setItem(storageKey, JSON.stringify(storageDBJson))
                }

                wrapperEle.remove()
            }
        })
        document.body.appendChild(wrapperEle)

        if (storageJson.dbKey != "") {
            getDBFormatWrapper(storageJson.dbKey, storageKey)
        }
    })
}

const updatePropertySelect = (properties = [], defaultProperty = undefined, options = []) => {
    selectList = []
    console.log(properties)

    //get title property
    for (const [name, item] of Object.entries(properties)) {
        var type = item.type
        if (type == "checkbox"
            || type == "multi_select"
            || type == "status")
            selectList.push(name)
        SelectDict[name] = item
    }

    //create select
    const selectEle = document.createElement('select')
    selectList.forEach(item => {
        var optEle = document.createElement('option')
        optEle.textContent = item
        selectEle.append(optEle)
    })
    selectEle.id = "selectDBItemId"
    selectEle.addEventListener('change', (e) => {
        settingValueOptionFunc(selectEle.value, properties)
    })

    // if (defaultProperty != undefined)
    //     selectEle.setAttribute('value', defaultProperty)
    const valueWrapper = settingValueOptionFunc(selectEle.value, options)

    //update default option element

    return { selectEle, valueWrapper }
}
const settingValueOptionFunc = (selectValue, defaultOptions = []) => {
    var type = SelectDict[selectValue].type
    var dataList = []
    var selectType = "single"
    var valueWrapper = document.querySelector("#valueWrapperId")
    if (valueWrapper == undefined) {
        valueWrapper = document.createElement('div')
        valueWrapper.id = "valueWrapperId"
    } else {
        while (valueWrapper.firstChild) {
            valueWrapper.removeChild(valueWrapper.lastChild);
        }
    }

    //select option element
    const createSelect = (list = [], selectType = "single") => {
        var checkedItem = null
        list.forEach(name => {
            var labelEle = document.createElement('label')

            var textEle = document.createElement('div')
            textEle.innerText = name

            var selectEle = document.createElement('input')
            selectEle.type = "checkbox"
            selectEle.name = name
            selectEle.value = name + 'Id'
            selectEle.id = "setValueId"

            labelEle.style.display = "flex"
            labelEle.append(selectEle)
            labelEle.append(textEle)

            //check event
            if (selectType == 'single') {
                selectEle.addEventListener('click', (e) => {
                    if (checkedItem != null)
                        checkedItem.checked = false
                    checkedItem = e.target
                })
            }

            valueWrapper.append(labelEle)
        })
    }

    switch (type) {
        case "checkbox":
            dataList = ['true', 'false']
            break;
        case "multi_select":
            selectType = 'multi'
            SelectDict[selectValue][type].options.forEach(item => {
                dataList.push(item.name)
            })
            break;
        case "status":
            SelectDict[selectValue][type].options.forEach(item => {
                dataList.push(item.name)
            })
            break;
        default:
            break;
    }
    createSelect(dataList, selectType)

    return valueWrapper
}

const getDBFormatWrapper = (dbId, storageKey) => {
    const wrapperEle = document.querySelector('#settingWrapperId')

    getDBFormat(dbId)
        .then((dataList) => {
            var storageDBJson = JSON.parse(window.localStorage.getItem(LOCALSTORAGE_KEY))
            var defaultProperty = storageDBJson['property']
            var defaultOptionList = storageDBJson['options']
            //update select
            var { selectEle, valueWrapper } = updatePropertySelect(dataList.properties,
                defaultProperty,
                defaultOptionList)

            if (wrapperEle.querySelector("#" + selectEle.id) != null)
                wrapperEle.querySelector("#" + selectEle.id).remove()
            wrapperEle.append(selectEle)
            wrapperEle.append(valueWrapper)

            //saving localstorage
            var storageDBJson = { dbKey: dbId }
            window.localStorage.setItem(storageKey, JSON.stringify(storageDBJson))
        })
}