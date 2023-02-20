const createImageWrapper = (imgSrc = "") => {
    var { imgWrapper, imgEle, cropTop, cropLeft, cropBottom, cropRight, delBtn } = createImgWrapperLayout(imgSrc)

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

    //setting wrapper width and height
    // imgWrapper.style.width = imgEle.getBoundingClientRect().width + 'px'
    // imgWrapper.style.height = imgEle.getBoundingClientRect().height + 'px'
    // imgEle.style.width = imgEle.getBoundingClientRect().width + 'px'
    // imgEle.style.height = imgEle.getBoundingClientRect().height + 'px'
    // imgEle.style.width = '80%'
    // imgEle.style.height = 'auto'
    imgWrapper.style.width = '80%'
    imgWrapper.style.height = '80%'

    //event listener
    imgWrapper.addEventListener('mouseenter', (e) => {
        var eleList = document.querySelectorAll('.crop-anchor-style')
        eleList.forEach(ele => { ele.style.opacity = '100%' })
        delBtn.style.opacity = '100%'
    })
    imgWrapper.addEventListener('mouseleave', (e) => {
        var eleList = document.querySelectorAll('.crop-anchor-style')
        eleList.forEach(ele => { ele.style.opacity = '0' })
        delBtn.style.opacity = '0'
    })

    imgWrapper.addEventListener('mousedown', (e) => {
        info.moveFlag = true
        info.offsetLeft = imgWrapper.offsetLeft - e.clientX
        info.offsetTop = imgWrapper.offsetTop - e.clientY
        info.clickShiftLeft = imgWrapper.getBoundingClientRect().left - e.clientX
        info.clickShiftTop = imgWrapper.getBoundingClientRect().top - e.clientY
        info.clickShiftRight = imgWrapper.getBoundingClientRect().right - e.clientX
        info.clickShiftBottom = imgWrapper.getBoundingClientRect().bottom - e.clientY
    })

    //disable drag hover
    imgWrapper.addEventListener('dragstart', (e) => { e.preventDefault() })

    //scale image
    imgWrapper.addEventListener('wheel', function (e) {
        var preHeight = imgWrapper.getBoundingClientRect().height
        var preWidth = imgWrapper.getBoundingClientRect().width
        var ratio = preHeight / preWidth

        //fix height to width ratio
        var w = preWidth + ((Math.floor(e.deltaY) < 0) ? -32 : 24);
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

    // document event listener
    document.addEventListener('mouseup', (e) => {
        info.moveFlag = false;
        info.cropInfo.cropTopFlag = false;
        info.cropInfo.cropLeftFlag = false;
        info.cropInfo.cropBottomFlag = false;
        info.cropInfo.cropRightFlag = false;
    })

    //move and crop image function
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
                + (info.cropInfo.imgEle.right - info.cropInfo.imgWrapper.right)

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

    //crop event trigger
    cropTop.addEventListener('mousedown', (e) => {
        info.cropInfo.cropTopFlag = true
        info.cropInfo.imgWrapper = imgWrapper.getBoundingClientRect()
        info.cropInfo.imgEle = imgEle.getBoundingClientRect()
    })
    cropLeft.addEventListener('mousedown', (e) => {
        info.cropInfo.cropLeftFlag = true
        info.cropInfo.imgWrapper = imgWrapper.getBoundingClientRect()
        info.cropInfo.imgEle = imgEle.getBoundingClientRect()
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

    delBtn.addEventListener('click', (e) => {
        imgWrapper.remove()
    })
    return { imgWrapper, imgEle }
}

/*--------------------------------------------------------
<div id="imgWrapperId" class="img-wrapper">
    <img id="imgId" src="" alt="">
    <div class="img-crop-top crop-anchor-style"></div>
    <div class="img-crop-bottom crop-anchor-style"></div>
    <div class="img-crop-left crop-anchor-style"></div>
    <div class="img-crop-right crop-anchor-style"></div>
</div>
--------------------------------------------------------*/
const createImgWrapperLayout = (imgSrc = "") => {
    var imgWrapper = document.createElement('div')
    imgWrapper.id = 'imgWrapperId'
    imgWrapper.className = "img-wrapper"

    var imgEle = document.createElement('img')
    imgEle.id = "imgId"
    imgEle.src = imgSrc
    imgEle.style.userSelect = 'none'

    var cropTop = document.createElement('div')
    cropTop.className = "img-crop-top"
    cropTop.classList.add('crop-anchor-style')

    var cropLeft = document.createElement('div')
    cropLeft.className = "img-crop-left"
    cropLeft.classList.add('crop-anchor-style')

    var cropBottom = document.createElement('div')
    cropBottom.className = "img-crop-bottom"
    cropBottom.classList.add('crop-anchor-style')

    var cropRight = document.createElement('div')
    cropRight.className = "img-crop-right"
    cropRight.classList.add('crop-anchor-style')

    var delBtn = document.createElement('div')
    delBtn.className = "img-del-btn"
    //create append
    imgWrapper.appendChild(imgEle)
    imgWrapper.appendChild(cropTop)
    imgWrapper.appendChild(cropLeft)
    imgWrapper.appendChild(cropBottom)
    imgWrapper.appendChild(cropRight)
    imgWrapper.appendChild(delBtn)

    return { imgWrapper, imgEle, cropTop, cropLeft, cropBottom, cropRight, delBtn }
}

/*********************
 * Export interface
 ********************/
const imgEditInst = {
    createImageWrapper: createImageWrapper,
}