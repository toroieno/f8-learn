function Validator(options){
    var formElement = document.querySelector(options.form)

    if (formElement){
        options.rules.forEach(function (rule) {
            var inputElement = document.querySelector(rule.selector)
            var formMessage = inputElement.parentElement.querySelector(options.errorMessage)

            //hàm thực hiện validate
            function validate(inputElement, rule){
                var errorMessage = rule.test(inputElement.value)

                if (errorMessage) {
                    formMessage.innerText = errorMessage
                    inputElement.parentElement.classList.add('invalid')
                } else {
                    formMessage.innerText = ''
                    inputElement.parentElement.classList.remove('invalid')
                }
            }

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
                    formMessage.innerText = ''
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
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
            return value.trim() ? undefined : message || 'Vui lòng nhập vào trường này!'
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