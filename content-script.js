function img2Base64(url) {
    return new Promise(resolve => {
        let canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        img = new Image();
        img.crossOrigin = 'anonymous';//解决Canvas.toDataURL 图片跨域问题
        img.onload = () => {
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            let dataURL = canvas.toDataURL("image/png");
            resolve(dataURL);
            canvas = null;
        };
        img.onerror = () => {
            resolve("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzODQgNTEyIj4gPHBhdGggZmlsbD0iIzRFNTA1NSIgZD0iTTIyNCAxMzZWMEgyNEMxMC43IDAgMCAxMC43IDAgMjR2NDY0YzAgMTMuMyAxMC43IDI0IDI0IDI0aDMzNmMxMy4zIDAgMjQtMTAuNyAyNC0yNFYxNjBIMjQ4Yy0xMy4yIDAtMjQtMTAuOC0yNC0yNHptMTYwLTE0LjF2Ni4xSDI1NlYwaDYuMWM2LjQgMCAxMi41IDIuNSAxNyA3bDk3LjkgOThjNC41IDQuNSA3IDEwLjYgNyAxNi45eiI+PC9wYXRoPiA8L3N2Zz4=");
        }
        img.src = url;
    })
}

function getLink(){
    const link = document.querySelector('link[rel~="icon"]');
    if (link) {
        return link
    } else {
        const link = document.createElement('link');
        link.rel = "icon";
        link.href = "/favicon.ico"
        document.head.append(link);
        return link
    }
}
async function setFavicon(env, color) {
    const link = getLink();
    const icon = await img2Base64(link.href);
    const favicon = `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><foreignObject x="0" y="0" width="100%" height="100%"><body xmlns="http://www.w3.org/1999/xhtml">
        <style>
            html,body{
                height: 100%;
                margin: 0;
                text-align: center;
            }
            img{
                display: block;
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
            strong{
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                text-transform: uppercase;
                background-color: ${color};
                color: #fff;
                padding: 0px 2px;
                border-radius: 2px;
                font-size: 12px;
                box-sizing: border-box;
                max-width: 100%;
                width: max-content;
                height: 16px;
                line-height: 16px;
                word-break: break-all;
                overflow: hidden;
            }
        </style>
        <strong>${env}</strong>
        <img src='${icon}'></img>
    </body></foreignObject></svg>`.replace(/\n/g, '').replace(/\t/g, '').replace(/#/g, '%23')
    link.href= favicon;
}

chrome.storage.sync.get('options', ({options=default_options}) => {
    let isMatch = false;
    options.forEach(option => {
        option.matches.forEach(reg => {
            const pattern = new URLPattern({
                hostname: reg
            })
            if (pattern.test(location.href) && !isMatch) {
                isMatch = true;
                setFavicon(option.name, option.color);
            }
        })
    })
})

