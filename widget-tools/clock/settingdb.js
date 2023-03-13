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

        var dbEleInput = document.createElement('input')
        dbEleInput.setAttribute('value', storageJson.dbKey)
        var dbSubmitEle = document.createElement('div')
        var submitImg = document.createElement('img')
        submitImg.src = "./static/icons8-enter-24.png"
        submitImg.style.width = "100%"
        dbSubmitEle.style.cursor = "pointer"
        dbSubmitEle.style.objectFit = "cover"
        dbSubmitEle.append(submitImg)
        // icons8-enter-24
        dbSubmitEle.addEventListener('click', (e) => {
            var dbId = dbEleInput.value
            if (dbId == "")
                return
            getDBFormat(dbId)
                .then((dataList) => {
                    //update select
                    var { selectEle, valueWrapper } = updatePropertySelect(dataList.properties)
                    if (dbWrapper.querySelector('#selectDBItemId') != null)
                        dbWrapper.querySelector('#selectDBItemId').remove()
                    wrapperEle.append(selectEle)
                    wrapperEle.append(valueWrapper)

                    //saving localstorage
                    var storageDBJson = { dbKey: dbId }
                    window.localStorage.setItem(storageKey, JSON.stringify(storageDBJson))
                })

            resolve(dbId)
        })

        dbWrapper.style.display = "flex"
        dbWrapper.append(dbEleInput)
        dbWrapper.append(dbSubmitEle)
        //property-select element

        //set val-select element

        //wrapper element event and append
        wrapperEle.append(dbWrapper)
        wrapperEle.addEventListener('click', (e) => {
            if (e.target.id == "settingWrapperId") {
                wrapperEle.remove()
            }
        })
        document.body.appendChild(wrapperEle)
    })
}

const updatePropertySelect = (properties = []) => {
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
    const valueWrapper = settingValueOptionFunc(selectEle.value)

    //update default option element

    return { selectEle, valueWrapper }
}
const settingValueOptionFunc = (selectValue) => {
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

    console.log(selectValue, SelectDict[selectValue][type])

    //select option element
    const createSelect = (list = [], selectType = "single") => {
        var checkedItem = null
        list.forEach(name => {
            var labelEle = document.createElement('label')

            var textEle = document.createElement('div')
            textEle.innerText = name

            var selectEle = document.createElement('input')
            selectEle.type = "checkbox"
            selectEle.name = name + 'Id'
            selectEle.value = name + 'Id'

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
