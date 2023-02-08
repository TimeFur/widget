const DEFAULT_IMG_SRC = "https://i.pinimg.com/564x/fe/5a/fc/fe5afccd18a0560843f69253c2f2a20f.jpg"
const ImageEditor = (id = null) => {
    var wrapper = document.querySelector(id)
    var svgWrapper = document.querySelector('#editSvgWrapper')

    updateImgSrc(DEFAULT_IMG_SRC)

    //create annotationBox
    createAnnoContainer().then(({ edit, anchor, line }) => {
        wrapper.appendChild(edit)
        wrapper.appendChild(anchor)
        svgWrapper.appendChild(line)
    })

    //create circle[canvas]
    // var cv = document.querySelector('#canvas')
    // context = cv.getContext('2d')

    //image to canvas
    var base_img = new Image()
    base_img.src = DEFAULT_IMG_SRC
    base_img.onload = () => {
        //draw at ori_x, ori_y
        // context.drawImage(base_img, 100, 50)

        // console.log(cv.toDataURL())
    }

    //download
    // html2canvas(wrapper, {
    //     logging: true, letterRendering: 1, allowTaint: false, useCORS: true
    // }).then(canvas => {
    //     var link = document.createElement('a');
    //     link.download = 'filename.png';
    //     link.href = canvas.toDataURL('image/jpeg')
    //     link.click();
    // });
}

const updateImgSrc = (src = "") => {
    var imgEle = document.querySelector('#imgId')
    imgEle.src = src
    imgEle.style.userSelect = 'none'
    var info = {
        moveFlag: false,
        offsetLeft: 0,
        offsetTop: 0
    }

    //event listener
    imgEle.addEventListener('mousedown', (e) => {
        info.moveFlag = true
        info.offsetLeft = imgEle.offsetLeft - e.clientX
        info.offsetTop = imgEle.offsetTop - e.clientY
    })
    document.addEventListener('mouseup', (e) => {
        info.moveFlag = false
    })
    document.addEventListener('mousemove', (e) => {
        if (info.moveFlag) {
            let mx = e.clientX
            let my = e.clientY
            const wrapperLeft = mx + info.offsetLeft
            const wrapperTop = my + info.offsetTop
            imgEle.style.left = wrapperLeft + 'px'
            imgEle.style.top = wrapperTop + 'px'
        }
    })
    imgEle.addEventListener('wheel', function (e) {
        var w = this.width + Math.floor(e.deltaY);
        if (w > 0)
            this.width = w;
        e.preventDefault();
    });
    //disable drag hover
    imgEle.addEventListener('dragstart', (e) => { e.preventDefault() })
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

        })
        anchor.addEventListener('mousedown', (e) => {
            annoInfo.anchorMoveFlag = true
            annoInfo.anchorOffsetLeft = anchor.offsetLeft - e.clientX
            annoInfo.anchorOffsetTop = anchor.offsetTop - e.clientY
            //disable edit editable
            edit.children[0].setAttribute('contenteditable', false)
            edit.children[1].setAttribute('contenteditable', false)

        })
        document.addEventListener('mouseup', (e) => {
            annoInfo.editMoveFlag = false
            annoInfo.anchorMoveFlag = false

            edit.children[0].setAttribute('contenteditable', true)
            edit.children[1].setAttribute('contenteditable', true)
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