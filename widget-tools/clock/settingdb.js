var SelectDict = {}
const createSettingDBPage = (storageKey = "") => {
    return new Promise((resolve) => {
        var wrapperEle = document.createElement('div')
        wrapperEle.style.backgroundColor = 'rgba(212,55,33,0.5)'
        wrapperEle.style.backdropFilter = "blur(3px)"
        wrapperEle.style.position = "absolute"
        wrapperEle.style.width = "100%"
        wrapperEle.style.height = "100vh"
        wrapperEle.style.top = "0px"
        wrapperEle.style.display = 'flex'
        wrapperEle.style.justifyContent = "center"
        wrapperEle.style.alignItems = "center"

        //db-input element
        var dbWrapper = document.createElement('div')
        var dbEle = document.createElement('input')
        var dbCheckEle = document.createElement('div')
        dbCheckEle.textContent = "Update"
        dbCheckEle.style.cursor = "pointer"
        dbCheckEle.addEventListener('click', (e) => {
            console.log(dbEle.value)
            const dbId = "9a13afce08094487ab65a5065ed7fbd9"
            getDBFormat(dbId)
                .then((dataList) => {
                    //update select
                    var selectEle = updatePropertySelect(dataList.properties)
                    if (dbWrapper.querySelector('#selectDBItemId') != null)
                        dbWrapper.querySelector('#selectDBItemId').remove()
                    dbWrapper.append(selectEle)

                    //saving localstorage
                    var storageDBJson = { dbKey: dbId }
                    window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(storageDBJson))
                })

            resolve(dbId)
        })

        dbWrapper.append(dbEle)
        dbWrapper.append(dbCheckEle)
        //property-select element

        //setval-select element

        wrapperEle.append(dbWrapper)
        document.body.appendChild(wrapperEle)

    })
}

const updatePropertySelect = (properties = []) => {
    selectList = []
    console.log(properties)

    //get title property
    for (const [name, item] of Object.entries(properties)) {
        if (item.type == "checkbox")
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

    return selectEle
}
const updateSettingValue = () => {

}