const list = document.getElementById('list');
const add = document.getElementById('add');

function showMessage(txt, color='#009688'){
    this.timer && clearTimeout(this.timer);
    var oDiv = document.getElementById('messageInfo');
    if(!oDiv){
      oDiv = document.createElement('div');
      oDiv.className = 'messageInfo';
      oDiv.id = 'messageInfo';
      document.body.appendChild(oDiv);
    }
    oDiv.innerHTML = '<span>'+txt+'</span>';
    oDiv.offsetWidth; 
    oDiv.style.setProperty('--color', color);
    oDiv.classList.add('show');
    this.timer = setTimeout(function(){
      oDiv.classList.remove('show');
    },2000)
}

const temp = (el={}) => `<div class="items-color">
        <div class="color-current" tabindex="-1">
            <div class="color-list">
                ${
                    colors.map(color => '<button class="color-pane" style="--color: '+color+'"></button>').join('')
                }
            </div>
        </div>
    </div>
    <div class="items-name">
        <input class="input" required data-type="name" placeholder="name" value="${el.name||''}">
    </div>
    <div class="items-match">
        <div class="input" placeholder="host-name">${el.matches||''}</div>
    </div>
    <div class="items-preview">
        <div class="icon">
            <strong class="env">${el.name||''}</strong>
        </div>
    </div>
    <a class="del">移除</a>`

chrome.storage.local.get('options', ({options=default_options}) => {
    list.innerHTML = options.map(el => `<div class="items" style="--color: ${el.color}">
        ${temp(el)}
    </div>`).join('')
})

list.addEventListener('click', function(ev){
    if (ev.target.className === 'color-pane') {
        const item = ev.target.closest('.items');
        item.style.setProperty('--color', ev.target.style.getPropertyValue('--color'))
    }
    if (ev.target.className === 'del') {
        const item = ev.target.closest('.items');
        item.remove();
    }
})

list.addEventListener('input', function(ev){
    if (ev.target.dataset.type === 'name') {
        ev.target.parentNode.parentNode.querySelector('.env').innerText = ev.target.value;
    }
    ev.target.toggleAttribute('invalid', false);
})

add.addEventListener('click', function(){
    const items = document.createElement('div');
    items.className = 'items';
    items.style.setProperty('--color', colors[list.childElementCount%colors.length])
    items.innerHTML = temp({
        name: 'e'+list.childElementCount
    });
    list.appendChild(items)
})

save.addEventListener('click', function(){
    const invalidElAll = [...document.querySelectorAll('input.input:invalid, div.input:empty')];
    if (invalidElAll.length) {
        invalidElAll.forEach(el => {
            el.toggleAttribute('invalid', true)
        })
        invalidElAll[0].focus();
        showMessage('⚠️ 内容不能为空', '#f44336')
    } else {
        const items = [...list.querySelectorAll('.items')];
        const options = items.map(item => {
            const color = item.style.getPropertyValue('--color');
            const name = item.querySelector('input.input').value;
            const matches = item.querySelector('div.input').innerText.split(',').map(el => el.trim());
            return {color, name, matches}
        })
        chrome.storage.local.set({options}, () => {
            console.log(options)
            showMessage('🎉 保存成功~')
        })
    }
})