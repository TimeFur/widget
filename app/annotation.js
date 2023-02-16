const DEFAULT_IMG_SRC = "https://i.pinimg.com/564x/fe/5a/fc/fe5afccd18a0560843f69253c2f2a20f.jpg"
const ImageEditor = (id = null) => {
    var wrapper = document.querySelector(id)
    var svgWrapper = document.querySelector('#editSvgWrapper')

    // updateImgSrc(DEFAULT_IMG_SRC)

    //create annotationBox
    createAnnoContainer().then(({ edit, anchor, line }) => {
        wrapper.appendChild(edit)
        wrapper.appendChild(anchor)
        svgWrapper.appendChild(line)
        //download
        // html2canvas(wrapper, {
        //     logging: true, letterRendering: 1, allowTaint: false, useCORS: true
        // }).then(canvas => {
        //     var link = document.createElement('a');
        //     link.download = 'filename.png';
        //     link.href = canvas.toDataURL('image/jpeg')
        //     link.click();
        //     // console.log(canvas.toDataURL('image/jpeg'))
        // });
    })
}

const updateImgSrc = (src = "") => {
    const imgEditPanel = document.querySelector('#imgEditorArea')
    var imgWrapper = document.querySelector('#imgWrapperId')
    var imgEle = document.querySelector('#imgId')
    var cropTop = document.querySelector('.img-crop-top')
    var cropLeft = document.querySelector('.img-crop-left')
    var cropBottom = document.querySelector('.img-crop-bottom')
    var cropRight = document.querySelector('.img-crop-right')
    var registerFlag = (imgEle.getAttribute('src') == "") ? true : false

    imgEle.src = src
    imgEle.style.userSelect = 'none'
    var info = {
        moveFlag: false,
        offsetLeft: 0,
        offsetTop: 0,
        clickShiftLeft: 0,
        clickShiftTop: 0,
        clickShiftRight: 0,
        clickShiftBottom: 0,
        cropInfo: {
            cropTopFlag: false,
            cropLeftFlag: false,
            cropBottomFlag: false,
            cropRightFlag: false,
            imgWrapper: {},
            imgEle: {}
        }
    }

    if (registerFlag == false)
        return
    //setting wrapper width and height
    imgWrapper.style.width = imgEle.getBoundingClientRect().width + 'px'
    imgWrapper.style.height = imgEle.getBoundingClientRect().height + 'px'
    imgEle.style.width = imgEle.getBoundingClientRect().width + 'px'
    imgEle.style.height = imgEle.getBoundingClientRect().height + 'px'
    // imgEle.style.left = 0 + 'px'
    // imgEle.style.top = 0 + 'px'

    //event listener
    imgWrapper.addEventListener('mousedown', (e) => {
        info.moveFlag = true
        info.offsetLeft = imgWrapper.offsetLeft - e.clientX
        info.offsetTop = imgWrapper.offsetTop - e.clientY
        info.clickShiftLeft = imgWrapper.getBoundingClientRect().left - e.clientX
        info.clickShiftTop = imgWrapper.getBoundingClientRect().top - e.clientY
        info.clickShiftRight = imgWrapper.getBoundingClientRect().right - e.clientX
        info.clickShiftBottom = imgWrapper.getBoundingClientRect().bottom - e.clientY

        console.log(info.offsetLeft, info.offsetTop)
    })
    document.addEventListener('mouseup', (e) => {
        info.moveFlag = false;
        info.cropInfo.cropTopFlag = false;
        info.cropInfo.cropLeftFlag = false;
        info.cropInfo.cropBottomFlag = false;
        info.cropInfo.cropRightFlag = false;
    })
    document.addEventListener('mousemove', (e) => {
        let mx = e.clientX
        let my = e.clientY
        const { cropTopFlag, cropLeftFlag, cropRightFlag, cropBottomFlag } = info.cropInfo
        if (cropTopFlag || cropLeftFlag || cropRightFlag || cropBottomFlag) {

            //crop align vertical
            const imgWrapperTop = my + info.offsetTop
            var imgWrapperHeight = info.cropInfo.imgWrapper.bottom - my - info.clickShiftTop
            const imgEleTop = imgWrapperHeight - info.cropInfo.imgEle.height
                + (info.cropInfo.imgEle.bottom - info.cropInfo.imgWrapper.bottom)

            const imgWrapperLeft = mx + info.offsetLeft
            var imgWrapperWidth = info.cropInfo.imgWrapper.right - mx - info.clickShiftLeft
            const imgEleLeft = imgWrapperWidth - info.cropInfo.imgEle.width
                + (info.cropInfo.imgEle.width - info.cropInfo.imgWrapper.width)

            //avoid over img range
            if (cropTopFlag && imgEleTop > 0)
                return
            if (cropLeftFlag && imgEleLeft > 0)
                return

            if (cropTopFlag) {
                imgWrapper.style.top = imgWrapperTop + 'px'
                imgWrapper.style.height = `${imgWrapperHeight}px`
                imgEle.style.top = `${imgEleTop}px`
            }
            if (cropLeftFlag) {
                imgWrapper.style.left = imgWrapperLeft + 'px'
                imgWrapper.style.width = `${imgWrapperWidth}px`
                imgEle.style.left = `${imgEleLeft}px`
            }
            if (cropRightFlag) {
                imgWrapperWidth = mx - info.cropInfo.imgWrapper.left + info.clickShiftRight
                if (imgWrapperWidth + info.cropInfo.imgWrapper.left > info.cropInfo.imgEle.right)
                    imgWrapperWidth = info.cropInfo.imgEle.right - info.cropInfo.imgWrapper.left
                imgWrapper.style.width = `${imgWrapperWidth}px`
            }
            if (cropBottomFlag) {
                imgWrapperHeight = my - info.cropInfo.imgWrapper.top + info.clickShiftBottom
                if (imgWrapperHeight + info.cropInfo.imgWrapper.top > info.cropInfo.imgEle.bottom)
                    imgWrapperHeight = info.cropInfo.imgEle.bottom - info.cropInfo.imgWrapper.top
                imgWrapper.style.height = `${imgWrapperHeight}px`
            }
            imgEle.style.width = `${info.cropInfo.imgEle.width}px`
            imgEle.style.height = `${info.cropInfo.imgEle.height}px`
        } else if (info.moveFlag) {
            const wrapperLeft = mx + info.offsetLeft
            const wrapperTop = my + info.offsetTop
            imgWrapper.style.left = wrapperLeft + 'px'
            imgWrapper.style.top = wrapperTop + 'px'
        }
    })
    imgWrapper.addEventListener('wheel', function (e) {
        var preHeight = imgWrapper.getBoundingClientRect().height
        var preWidth = imgWrapper.getBoundingClientRect().width
        var ratio = preHeight / preWidth

        //fix height to width ratio
        var w = preWidth + Math.floor(e.deltaY);
        var h = ratio * w;

        if (w > 10 && h > 10) {
            this.style.width = `${w}px`;
            this.style.height = `${h}px`;

            //after scale image, shift 
            const wrapperTop = this.offsetTop + (preHeight - h) / 2
            const wrapperLeft = this.offsetLeft + (preWidth - w) / 2
            imgWrapper.style.top = wrapperTop + 'px'
            imgWrapper.style.left = wrapperLeft + 'px'

            //fix relative imgEle position
            imgEle.style.top = `${imgEle.offsetTop * (h / preHeight)}px`
            imgEle.style.left = `${imgEle.offsetLeft * (w / preWidth)}px`
            imgEle.style.width = `${imgEle.getBoundingClientRect().width * (w / preWidth)}px`
            imgEle.style.height = `${imgEle.getBoundingClientRect().height * (h / preHeight)}px`
        }

        //avoid background page scroll
        e.preventDefault();
    });

    //crop event
    cropTop.addEventListener('mousedown', (e) => {
        info.cropInfo.cropTopFlag = true
        info.cropInfo.imgWrapper = imgWrapper.getBoundingClientRect()
        info.cropInfo.imgEle = imgEle.getBoundingClientRect()
    })
    cropLeft.addEventListener('mousedown', (e) => {
        info.cropInfo.cropLeftFlag = true
        info.cropInfo.imgWrapper = imgWrapper.getBoundingClientRect()
        info.cropInfo.imgEle = imgEle.getBoundingClientRect()

        console.log("Crop ledt click:", info.cropInfo.imgWrapper, info.cropInfo.imgEle)
    })
    cropBottom.addEventListener('mousedown', (e) => {
        info.cropInfo.cropBottomFlag = true
        info.cropInfo.imgWrapper = imgWrapper.getBoundingClientRect()
        info.cropInfo.imgEle = imgEle.getBoundingClientRect()
    })
    cropRight.addEventListener('mousedown', (e) => {
        info.cropInfo.cropRightFlag = true
        info.cropInfo.imgWrapper = imgWrapper.getBoundingClientRect()
        info.cropInfo.imgEle = imgEle.getBoundingClientRect()
    })

    //disable drag hover
    imgWrapper.addEventListener('dragstart', (e) => { e.preventDefault() })
}

const createAnnoContainer = (id = "") => {
    return new Promise((resolve) => {
        var edit = createEditContainer();
        var line = createSvgLine();
        var anchor = createAnchor()

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

        resolve({ edit, anchor, line })
    })
}

createEditContainer = () => {
    var editWrapper = document.createElement('div')
    var editTitle = document.createElement('div')
    var editContent = document.createElement('div')

    editTitle.setAttribute('contenteditable', true)
    editTitle.textContent = "Title"

    editContent.setAttribute('contenteditable', true)
    editContent.textContent = "Content"

    editWrapper.appendChild(editTitle)
    editWrapper.appendChild(editContent)

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

    return editWrapper
}
createSvgLine = () => {
    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', '0');
    line.setAttribute('y1', '0');
    line.setAttribute('x2', '2');
    line.setAttribute('y2', '2');
    line.setAttribute("stroke", "rgba(22,121,22,0.4)")
    line.setAttribute("stroke-width", "2")

    return line
}

createAnchor = () => {
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

const AnnoInst = {
    imageEditor: ImageEditor,
    updateImgSrc: updateImgSrc
}