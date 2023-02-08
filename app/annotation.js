const DEFAULT_IMG_SRC = "https://i.pinimg.com/564x/fe/5a/fc/fe5afccd18a0560843f69253c2f2a20f.jpg"
const ImageEditor = (id = null) => {
    var wrapper = document.querySelector(id)

    updateImgSrc(DEFAULT_IMG_SRC)


    //create annotationBox
    var annoBox = createAnnoBox()
    wrapper.appendChild(annoBox)

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
}

const createAnnoBox = (id = "") => {
    var editWrapper = document.createElement('div')
    var editTitle = document.createElement('div')
    var editContent = document.createElement('div')
    var annoInfo = {
        moveFlag: false,
        offsetLeft: 0,
        offsetTop: 0,
    }
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
    editWrapper.style.width = "100px"
    editWrapper.style.height = "auto"
    editWrapper.style.borderRadius = "0.5rem"
    editWrapper.style.padding = "3px"
    editWrapper.style.backdropFilter = "blur(3px)"
    editWrapper.style.fontSize = "1.2rem"
    //move event func
    editWrapper.addEventListener('mousedown', (e) => {
        annoInfo.moveFlag = true
        annoInfo.offsetLeft = editWrapper.offsetLeft - e.clientX
        annoInfo.offsetTop = editWrapper.offsetTop - e.clientY
    })
    document.addEventListener('mouseup', (e) => {
        annoInfo.moveFlag = false
    })
    document.addEventListener('mousemove', (e) => {
        if (annoInfo.moveFlag) {
            let mx = e.clientX
            let my = e.clientY

            editWrapper.style.left = mx + annoInfo.offsetLeft + 'px'
            editWrapper.style.top = my + annoInfo.offsetTop + 'px'
        }
    })

    return editWrapper
}