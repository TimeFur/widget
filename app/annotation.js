const DEFAULT_IMG_SRC = "https://i.pinimg.com/564x/fe/5a/fc/fe5afccd18a0560843f69253c2f2a20f.jpg"
const ImageEditor = (id = null) => {
    var wrapper = document.querySelector(id)
    var svgWrapper = document.querySelector('#editSvgWrapper')

    // updateImgSrc(DEFAULT_IMG_SRC)
}

const clipFunc = () => {
    var wrapper = document.querySelector('#editImageWrapper')
    var cvsWrapper = document.querySelector('#editSvgWrapper')

    const wrapperStyle = wrapper.style

    //presetting
    wrapper.style.background = 'transparent'
    cvsWrapper.style.zIndex = 100

    //download
    html2canvas(wrapper, {
        logging: true, letterRendering: 1, allowTaint: false, useCORS: true,
        backgroundColor: null
    }).then(canvas => {
        var link = document.createElement('a');
        var base64 = canvas.toDataURL('image/png')
        link.download = 'filename.png';
        link.href = base64
        link.click();
        // console.log(base64)
        cvsWrapper.style.zIndex = 0
        wrapper.style = wrapperStyle
    });
}

const createAnnotation = () => {
    var wrapper = document.querySelector('#editImageWrapper')
    var svgWrapper = document.querySelector('#editSvgWrapper')
    createAnnoContainer().then(({ edit, anchor, line }) => {
        wrapper.appendChild(edit)
        wrapper.appendChild(anchor)
        svgWrapper.appendChild(line)

    })
}

const createAnnoContainer = (id = "") => {
    return new Promise((resolve) => {
        var { edit, delBtn } = createEditContainer();
        var line = createSvgLine();
        var anchor = createAnchor()

        //add delete icon
        delBtn.addEventListener('click', (e) => {
            anchor.remove()
            line.remove()
            edit.remove()
        })

        var annoInfo = {
            editMoveFlag: false,
            offsetLeft: 0,
            offsetTop: 0,

            anchorMoveFlag: false,
            anchorOffsetLeft: 0,
            anchorOffsetTop: 0,
        }

        //move event func
        edit.addEventListener('mousedown', (e) => {
            annoInfo.editMoveFlag = true
            annoInfo.offsetLeft = edit.offsetLeft - e.clientX
            annoInfo.offsetTop = edit.offsetTop - e.clientY

            if (line.parentNode)
                line.parentNode.style.zIndex = 1
        })
        anchor.addEventListener('mousedown', (e) => {
            annoInfo.anchorMoveFlag = true
            annoInfo.anchorOffsetLeft = anchor.offsetLeft - e.clientX
            annoInfo.anchorOffsetTop = anchor.offsetTop - e.clientY
            //disable edit editable
            edit.children[0].setAttribute('contenteditable', false)
            edit.children[1].setAttribute('contenteditable', false)
            if (line.parentNode)
                line.parentNode.style.zIndex = 1
        })
        document.addEventListener('mouseup', (e) => {
            annoInfo.editMoveFlag = false
            annoInfo.anchorMoveFlag = false

            edit.children[0].setAttribute('contenteditable', true)
            edit.children[1].setAttribute('contenteditable', true)

            if (line.parentNode)
                line.parentNode.style.zIndex = 0
        })
        document.addEventListener('mousemove', (e) => {
            let mx = e.clientX
            let my = e.clientY
            if (annoInfo.editMoveFlag) {
                const { width, height } = edit.getBoundingClientRect()
                const wrapperLeft = mx + annoInfo.offsetLeft
                const wrapperTop = my + annoInfo.offsetTop
                edit.style.left = wrapperLeft + 'px'
                edit.style.top = wrapperTop + 'px'

                line.setAttribute('x1', wrapperLeft + width / 2);
                line.setAttribute('y1', wrapperTop + height / 2);

                //disable edit editable
                edit.children[0].setAttribute('contenteditable', false)
                edit.children[1].setAttribute('contenteditable', false)
            }

            if (annoInfo.anchorMoveFlag) {
                const { width, height } = anchor.getBoundingClientRect()
                const wrapperLeft = mx + annoInfo.anchorOffsetLeft
                const wrapperTop = my + annoInfo.anchorOffsetTop
                anchor.style.left = wrapperLeft + 'px'
                anchor.style.top = wrapperTop + 'px'

                line.setAttribute('x2', wrapperLeft + width / 2);
                line.setAttribute('y2', wrapperTop + height / 2);
            }
        })

        edit.addEventListener('mouseenter', (e) => {
            delBtn.style.opacity = "100%"
        })
        edit.addEventListener('mouseleave', (e) => {
            delBtn.style.opacity = "0"
        })

        resolve({ edit, anchor, line })
    })
}

const createEditContainer = () => {
    var editWrapper = document.createElement('div')
    var editTitle = document.createElement('div')
    var editContent = document.createElement('div')
    var delBtn = document.createElement('div');

    delBtn.className = "anno-del-btn"

    editTitle.setAttribute('contenteditable', true)
    editTitle.textContent = "Title"

    editContent.setAttribute('contenteditable', true)
    editContent.textContent = "Content"

    editWrapper.appendChild(editTitle)
    editWrapper.appendChild(editContent)
    editWrapper.appendChild(delBtn)

    editWrapper.style.position = "absolute"
    editWrapper.style.left = "0px"
    editWrapper.style.top = "0px"
    editWrapper.style.backgroundColor = "rgba(164,255,239,0.5)"
    editWrapper.style.width = "auto"
    editWrapper.style.height = "auto"
    editWrapper.style.borderRadius = "0.5rem"
    editWrapper.style.padding = "3px"
    editWrapper.style.backdropFilter = "blur(3px)"
    editWrapper.style.fontSize = "1.2rem"
    editWrapper.style.zIndex = 5
    editWrapper.style.userSelect = 'none'

    return { edit: editWrapper, delBtn: delBtn }
}
const createSvgLine = () => {
    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', '0');
    line.setAttribute('y1', '0');
    line.setAttribute('x2', '2');
    line.setAttribute('y2', '2');
    line.setAttribute("stroke", "rgba(22,121,22,0.4)")
    line.setAttribute("stroke-width", "2")

    return line
}

const createAnchor = () => {
    var anchor = document.createElement('div')
    anchor.style.position = 'absolute'
    anchor.style.left = "0px"
    anchor.style.top = "0px"
    anchor.style.width = "20px"
    anchor.style.height = "20px"
    anchor.style.borderRadius = "50%"
    anchor.style.backgroundColor = "rgba(0,255,2,0.4)"
    anchor.style.backdropFilter = "blur(3px)"
    anchor.style.zIndex = 5

    return anchor
}

const registerImgEditWrapper = () => {
    var wrapper = document.querySelector('#imgEditorArea')
    var topCrop = document.querySelector('#wrapTopCrop')
    var bottomCrop = document.querySelector('#wrapBottomCrop')
    var leftCrop = document.querySelector('#wrapLeftCrop')
    var rightCrop = document.querySelector('#wrapRightCrop')
    var info = {
        clientRect: {},
        topEnable: false,
        bottomEnable: false,
        leftEnable: false,
        rightEnable: false,
        clickShiftLeft: 0,
        clickShiftTop: 0,
        clickShiftRight: 0,
        clickShiftBottom: 0,
        offsetTop: 0,
        offsetLeft: 0
    }

    document.addEventListener('mousemove', (e) => {
        var mx = e.clientX
        var my = e.clientY
        const imgWrapperTop = my + info.offsetTop
        var imgWrapperHeight = info.clientRect.bottom - my - info.clickShiftTop
        const imgWrapperLeft = mx + info.offsetLeft
        var imgWrapperWidth = info.clientRect.right - mx - info.clickShiftLeft

        if (info.topEnable) {
            wrapper.style.top = imgWrapperTop + 'px'
            wrapper.style.height = `${imgWrapperHeight}px`
        }
        if (info.leftEnable) {
            wrapper.style.left = imgWrapperLeft + 'px'
            wrapper.style.width = `${imgWrapperWidth}px`
        }
    })
    document.addEventListener('mouseup', (e) => {
        info.topEnable = false;
        info.bottomEnable = false;
        info.leftEnable = false;
        info.rightEnable = false;
    })
    topCrop.addEventListener('mousedown', (e) => {
        info.topEnable = true;
        info.clientRect = wrapper.getBoundingClientRect()
        info.clickShiftTop = wrapper.getBoundingClientRect().top - e.clientY
        info.offsetTop = wrapper.offsetTop - e.clientY
    })
    leftCrop.addEventListener('mousedown', (e) => {
        info.leftEnable = true;
        info.clientRect = wrapper.getBoundingClientRect()
        info.clickShiftLeft = wrapper.getBoundingClientRect().left - e.clientX
        info.offsetLeft = wrapper.offsetLeft - e.clientX
    })
}
const AnnoInst = {
    imageEditor: ImageEditor,
    createAnnotation: createAnnotation,
    clipFunc: clipFunc,
    registerImgEditWrapper: registerImgEditWrapper
}