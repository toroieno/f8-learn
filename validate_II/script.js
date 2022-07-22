
function Validator(formSelector) {
    //Lấy thẻ cha 
    function getParent(element, selector){
        while (element.parentElement){
            if (element.parentElement.matches(selector)){
                return element.parentElement
            }
            element = element.parentElement
        }
    }

    var formRules = {}

    /**
     * Quy ước rules
     * Nếu có lỗi thì return `errorMessage`
     * Nếu không có lỗi return undefined
     */
    var validatorRules = {
        required: function(value) {
            return value ? undefined : 'Vui lòng nhập trường này!'
        },
        email: function(value) {
            var regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
            return regex.test(value) ? undefined : 'Nhập không hợp lệ!'
        },
        min: function(min) {
            return function(value) {
                return value.length >= min ? undefined : `Nhập ít nhất ${min} kí tự!`
            }
        },
        max: function(max) {
            return function(value) {
                return value.length <= max ? undefined : `Nhập nhiều nhất ${max} kí tự!`
            }
        },
        // confirmPassword: function(value){

        // }
    }

    //Lấy ra form element trong DOM `formSelector`
    var formElement = document.querySelector(formSelector)

    //Chỉ xử lí khi có element trong DOM
    if (formElement) {
        var inputs = formElement.querySelectorAll('[name][rules]')

        for (var input of inputs) {
            var rules = input.getAttribute('rules').split('|')

            for (var rule of rules){
                //gọi hàm validate thông thường 
                var ruleFunc = validatorRules[rule]

                //gặp validate min/max: kí tự - đặc biệt có truyền tham số vào
                if (rule.includes(':')){
                    var ruleArray = rule.split(':')

                    rule = ruleArray[0]
                    ruleFunc = validatorRules[rule](ruleArray[1])
                }                

                //thêm các hàm validate
                if (Array.isArray(formRules[input.name])){
                    formRules[input.name].push(ruleFunc)
                } else {
                    formRules[input.name] = [ruleFunc]
                }
            }

            //Lắng nghe các sự kiện (blur, change, ...)
            input.onblur = handleValidate;
            input.oninput = handleClearError;
        }

        //Hàm thực hiện validate
        function handleValidate(e){
            var rules = formRules[e.target.name]
            var errorMessage;

            for (var rule of rules){
                var errorMessage = rule(e.target.value)
                if (errorMessage) break
            }

            //Nếu có lỗi thì hiển thị message error ra UI
            var formGroup = getParent(e.target, '.form-group')
            if (errorMessage){
                if (formGroup){
                    var formMessage = formGroup.querySelector('.errorMessage')
                    if (formMessage){
                        formMessage.innerText = errorMessage
                        formGroup.classList.add('invalid')
                    }
                }
            }

            return !errorMessage
        }

        //Hàm clear error
        function handleClearError(e){
            var formGroup = getParent(e.target, '.form-group')
            if (formGroup.classList.contains('invalid')){
                formGroup.classList.remove('invalid')
            }
            var formMessage = formGroup.querySelector('.errorMessage')
                if (formMessage){
                    formMessage.innerText = ''
                }
        }
    }

    // xử lý hành vi submit form
    formElement.onsubmit = function(e){
        e.preventDefault()
        var isValid = true

        var inputs = formElement.querySelectorAll('[name][rules]')
        for (var input of inputs) {
            if (!handleValidate({target: input})){
                isValid = false
            }
        }

        //Khi không có lỗi thì submit form
        if (isValid){
            formElement.submit()
        }
    }
}