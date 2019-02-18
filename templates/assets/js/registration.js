$(document).ready(function(){

    $('#reg_form').submit(function(e) {
        e.preventDefault();
        validate();    
      });
    
      function validate(){
        var username = $('#username').val();
        var name = $('#name').val();
        var email = $('#email').val();
        var age = $('#age').val();
        var branch = $('#branch').val();
        var semester = $('#semester').val();
        var phone = $('#phone').val();
        var password1 = $('#password1').val();
        var password2 = $('#password2').val();
        var address= $('#address').val();
    
        var usernamereg = /^[a-zA-Z0-9]+$/;
        var stringReg = /^[A-Za-z]+$/;
        var numberReg =  /^[0-9]+$/;
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    
        $(".error").remove();
     
        if (username.length < 1) {
          $('#username').after('<span class="error">This field is required</span>');
        }
        else if (!usernamereg.test(username)){
            $('#username').after('<span class="error">username can have only aplhanumeric characters</span>');
        }
        if (name.length < 1) {
          $('#name').after('<span class="error">This field is required</span>');
        }
        else if (!stringReg.test(name)){
            $('#name').after('<span class="error">invalid name</span>');
        }
        if (email.length < 1) {
          $('#email').after('<span class="error">This field is required</span>');
        }
        else if (!emailReg.test(email)){
            $('#email').after('<span class="error">invalid email</span>');
        }
        if (password1.length < 8) {
            $('#password1').after('<span class="error">Password must be at least 8 characters long</span>');
            $("#password1").val('');
            $("#password2").val('');
        }
        else if (password2 != password1) {
            $('#password2').after('<span class="error">Passwords don\'t match</span>');
            $("#password1").val('');
            $("#password2").val('');
        }
        if(age.length<1){
            $("#age").after('<span class="error">this field is required</span>');
        }
        else if(age<0 || age > 100 || !numberReg.test(age)){
            $("#age").after('<span class="error">invalid age</span>');
        }
        if(phone.length<1){
            $("#phone").after('<span class="error">This field is required</span>');
        }
        else if(phone.length>10||!numberReg.test(phone)){
            $("#phone").after('<span class="error">invalid phone number</span>');
        }
        if(address.length<1){
            $("#address").after('<span class="error">this field is required</span>');
        }
    
    }
    // $(".input100").change(function(){
    //     validate();
    // })
    
     


})

