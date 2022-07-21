

function Validator(options){

    function getParent(element, selector){
        while (element.parentElement){
            if (element.parentElement.matches(selector)){
                return element.parentElement
            }
            element = element.parentElement
        }
    }

    var selectorRules = {}
    //hàm thực hiện validate
    function validate(inputElement, rule){
        // var formMessage = getParent(inputElement, '.form-group')
        var formMessage = getParent(inputElement, options.formGroupSelector).querySelector(options.errorMessage)
        var errorMessage

        //Lấy ra các rules của selector
        var rules = selectorRules[rule.selector]

        //Lặp qua các rules, lấy ra rule đầu
        for (var i = 0; i < rules.length; i++){
            switch (inputElement.type){
                case 'checkbox':
                case 'radio':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    )
                    break
                default:
                    errorMessage = rules[i](inputElement.value)
            }
            if (errorMessage) break
        }

        if (errorMessage) {
            formMessage.innerText = errorMessage
            getParent(inputElement, options.formGroupSelector).classList.add('invalid')
        } else {
            formMessage.innerText = ''
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
        }

        return !errorMessage
    }

    var formElement = document.querySelector(options.form)
    
    if (formElement){
        //Xử lý khi nhấn submit
        formElement.onsubmit = function(e){
            e.preventDefault()

            var isFormValid = true

            options.rules.forEach(function (rule) {
                var inputElement = document.querySelector(rule.selector)
                var isValid = validate(inputElement, rule)
                if (!isValid){
                    isFormValid = false
                }
            })

            if (isFormValid){
                // console.log('không có lỗi')
                //Trường hợp lấy thông tin submit FE
                if (typeof options.onSubmit === 'function'){
                    var enableInputs = formElement.querySelectorAll('[name]:not([disable])')
                    var formValues = Array.from(enableInputs).reduce(function(values, input){
                        switch(input.type){
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="'+ input.name +'"]:checked').value
                                break
                            case 'checkbox':
                                if (!input.matches(':checked')) {
                                    if (!Array.isArray(values[input.name])){
                                        values[input.name] = ''
                                    }
                                    return values
                                }
                                if (!Array.isArray(values[input.name])){
                                    values[input.name] = []
                                }
                                values[input.name].push(input.value)
                                break
                            case 'file':
                                values[input.name] = input.files
                                break
                            default:
                                values[input.name] = input.value
                        }
                        return values
                    }, {})

                    options.onSubmit(formValues)
                }
                //Trường hợp lấy thông tin submit BE
                else {
                    formElement.submit()
                }
            } 
        }

        //Xử lý lặp qua mỗi rule và xử lý (blur, input, ...)
        options.rules.forEach(function (rule) {

            //Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test]
            }

            var inputElements = document.querySelectorAll(rule.selector)

            Array.from(inputElements).forEach(function(inputElement) {
                //lấy element của form
                if (inputElement){
                    //xử lý trường hợp người dùng blur khỏi input
                    inputElement.onblur = function(){
                        //value: inputElement.value
                        //test func: rule.test
                        validate(inputElement, rule)
                    }

                    //xử lý trường hợp người dùng nhập vào input
                    inputElement.oninput = function(){
                        var formMessage = getParent(inputElement, options.formGroupSelector).querySelector(options.errorMessage)
                        formMessage.innerText = ''
                        getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
                    }
                }
            })
        })
    }

}   

// Định nghĩa các rule
//Nguyên tắc của rule: 
// - khi có lỗi, trả ra message lỗi
// - khi không có lỗi, không trả về gì

//Không được bỏ trống
Validator.isRequired = function (selector, message){
    return {
        selector: selector, 
        test: function(value){
            return value ? undefined : message || 'Vui lòng nhập vào trường này!'
        }
    }
}

//check regex email
Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function(value){
            var regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
            return regex.test(value) ? undefined : message || 'Vui lòng nhập email hợp lệ!'
        }
    }
}

//kí tự tối thiểu
Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function(value){
            return value.length >= min ? undefined : message || `Vui lòng nhập ít nhất ${min} kí tự!`
        }
    }
}

//check lại mật khẩu
Validator.isConfirmed = function (selector, rePassword, message) {
    return {
        selector: selector,
        test: function(value){
            return value === rePassword() ? undefined : message || "Giá trị nhập lại không hợp lệ!"
        }
    }
}