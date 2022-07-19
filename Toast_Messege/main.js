const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

var btnSuccess = $('.btn--success')
var btnError = $('.btn--error')

function toast({
    title = '' , 
    message = '', 
    type = 'info', 
    duration = 3000
})
{
    const main = $('#toast')
    if (main){
        var toast = document.createElement('div')
        var typeToast = `toast--${type}`
        const icons = {
            success: 'fa-solid fa-circle-check',
            info: 'fa-solid fa-circle-info',
            warning: 'fa-solid fa-circle-exclamation',
            error: 'fa-solid fa-triangle-exclamation'
        }
        var icon = icons[type]
        var delay = (duration / 1000).toFixed(0)
        
        var removeToast = setTimeout(function(){
            main.removeChild(toast)
        }, duration + 1000)

        toast.onclick = function(e){
            if (e.target.closest('.toast__close')){
                main.removeChild(toast)
                clearTimeout(removeToast)
            }
        }

        toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`
        toast.classList.add('toast', typeToast)
        toast.innerHTML = `
            <div class="toast__icon">
                <i class="${icon}"></i>
            </div>
            <div class="toast__body">
                <h3 class="toast__title">
                    ${title}
                </h3>
                <p class="toast__content">
                    ${message}
                </p>
            </div>
            <div class="toast__close">
                <i class="fa-solid fa-xmark"></i>
            </div>
        `
        main.appendChild(toast)
    }
}


function showToastSuccess(){
    toast({
        title: 'Thành công!',
        message: 'Bạn đã đăng ký tài khoản thành công.',
        type: 'success',
        duration: 3000
    })
}
function showToastError(){
    toast({
        title: 'Thất bại!',
        message: 'Có lỗi xảy ra vui lòng liên hệ quản trị viên.',
        type: 'error',
        duration: 3000
    })
}