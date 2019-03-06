$(document).ready(function(){


    
    var username_allowed = false;

    $('#reg_form').submit(function(e) {
        e.preventDefault();
        validate();    
      });

    function isDate(txtDate)
    {
        console.log(currVal);
        var currVal = txtDate;
        if(!currVal)
            return false;
        if(currVal == '')
            return false;
        
        var rxDatePattern = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/; //Declare Regex
        var dtArray = currVal.match(rxDatePattern); // is format OK?
        
        if (dtArray == null) 
            return false;
        
        //Checks for yyyy/mm/dd format.
        dtMonth = dtArray[3];
        dtDay= dtArray[5];
        dtYear = dtArray[1];        
        
        if (dtMonth < 1 || dtMonth > 12) 
            return false;
        else if (dtDay < 1 || dtDay> 31) 
            return false;
        else if ((dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31) 
            return false;
        else if (dtMonth == 2) 
        {
            var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
            if (dtDay> 29 || (dtDay ==29 && !isleap)) 
                    return false;
        }
        return true;
    }

    
      function validate(){
        var username = $('#username').val();
        var name = $('#name').val();
        var email = $('#email').val();
        var dob = $('#dob').val();
        var f_name = $('#f_name').val()
        var m_name = $('#m_name').val()
        var branch = $('#branch').val();
        var semester = $('#semester').val();
        var phone = $('#phone').val();
        var password1 = $('#password1').val();
        var password2 = $('#password2').val();
        var address= $('#address').val();
        var age = $('#age').val();
        var state = $('#state').val();
        var city = $('#city').val();
        var pincode = $('#pincode').val();
        var country = $('#country').val();
    
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
        
        else if (name.length < 1) {
            $('#name').after('<span class="error">This field is required</span>');
        }
        else if (!stringReg.test(name)){
            $('#name').after('<span class="error">invalid name</span>');
        }
        else if (f_name.length < 1) {
            $('#f_name').after('<span class="error">This field is required</span>');
        }
        else if (!stringReg.test(f_name)){
            $('#f_name').after('<span class="error">invalid father name</span>');
        }
        else if (m_name.length < 1) {
            $('#m_name').after('<span class="error">This field is required</span>');
        }

        else if (!stringReg.test(m_name)){
            $('#m_name').after('<span class="error">invalid mother name</span>');
        }
        else if (email.length < 1) {
          $('#email').after('<span class="error">This field is required</span>');
        }
        else if (!emailReg.test(email)){
            $('#email').after('<span class="error">invalid email</span>');
        }
        else if (password1.length < 8) {
            $('#password1').after('<span class="error">Password must be at least 8 characters long</span>');
            $("#password1").val('');
            $("#password2").val('');
        }
        else if (password2 != password1) {
            $('#password2').after('<span class="error">Passwords don\'t match</span>');
            $("#password1").val('');
            $("#password2").val('');
        }
        else if(phone.length<1){
            $("#phone").after('<span class="error">This field is required</span>');
        }
        else if(phone.length>10||!numberReg.test(phone)){
            $("#phone").after('<span class="error">invalid phone number</span>');
        }
        else if(pincode.length<1){
            $("#pincode").after('<span class="error">This field is required</span>');
        }
        else if(pincode.length>6||!numberReg.test(pincode)){
            $("#pincode").after('<span class="error">invalid pin number</span>');
        }
        else if(address.length<1){
            $("#address").after('<span class="error">this field is required</span>');
        }
        else if(city.length<1){
            $("#address").after('<span class="error">this field is required</span>');
        }
        else if(!isDate(dob)){
            
            $("#dob").after('<span class="error">invalid date</span>');
        }
        else{
            if(username_allowed){
                register();
            }
            else if(check_username_exist()){
                register();
            }
        }


        
    
    }

    function check_username_exist(){

        var username = $('#username').val();

        username_allowed = false;
        $.ajax({
            url: '/ajax/get/usernameexists',
            dataType : "json",
            contentType: 'application/json',
            data: JSON.stringify({
                username : username
            }),
            type: 'POST',
            success: function(response) {
                console.log(response);
                if(response['code']==200)
                {
                    console.log(response)
                    if(response['exist']===0){
                        username_allowed = true
                        return true
                    }
                    else{
                        $('#username').after('<span class="error">username already exists</span>');
                        return(false)
                    }
                    
                }
                else{
                    alert('internal server error')
                }

            },
            error: function(error) {
                console.log(error);
                alert('error occured try again later')
            }
        });


    }

    function register(){

        var username = $('#username').val();
        var name = $('#name').val();
        var email = $('#email').val();
        var dob = $('#dob').val();
        var g_name = $('#guardian_name').val()
        var branch = $('#branch').val();
        var semester = $('#semester').val();
        var phone = $('#phone').val();
        var password1 = $('#password1').val();
        var password2 = $('#password2').val();
        var address= $('#address').val();
    


        $.ajax({
            url: 'ajax/post/registeruser',
            dataType : "json",
            contentType: 'application/json',
            data: JSON.stringify({
                username : username,
                name : name,
                email : email,
                dob : dob,
                f_name : f_name,
                m_name : m_name,
                phone : phone,
                branch : branch,
                password1 : password1,
                password2 : password2,
                address : address
            }),

            //data:{id:username,def:email},
            type: 'POST',
            success: function(response) {
                console.log(response);
                if(response['code']==200)
                {
                    alert('successfully registered');
                    username_allowed=false;
                }
                else{
                    alert('intenal server error');
                }

            },
            error: function(error) {
                console.log(error);
                alert('error occured try again later')
            }
        });

    }
    // $(".input100").change(function(){
    //     validate();
    // })


    $('#fileToUpload').change(function(){
        fileValidation();
    })


    function fileValidation(){
        console.log('hello')
        var fileInput = document.getElementById('fileToUpload');
        var filePath = fileInput.value;
        var exts = ['.jpg', '.gif', '.png'];
        if(!new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$').test(filePath)){
            alert('Please upload file having extensions .jpeg/.jpg/.png/.gif only.');
            fileInput.value = '';
            console.log(fileInput.value)
            document.getElementById('imagePreview').innerHTML = "";
            return false;
            
        }else{
            //Image preview
            if (fileInput.files && fileInput.files[0]) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('imagePreview').innerHTML = '<img src="'+e.target.result+'"/>';
                };
                reader.readAsDataURL(fileInput.files[0]);
            }
        }
    }


    function inline_validate(s){
        var username = $('#username').val();
        var name = $('#name').val();
        var email = $('#email').val();
        var dob = $('#dob').val();
        var f_name = $('#f_name').val()
        var m_name = $('#m_name').val()
        var branch = $('#branch').val();
        var semester = $('#semester').val();
        var phone = $('#phone').val();
        var password1 = $('#password1').val();
        var password2 = $('#password2').val();
        var address= $('#address').val();
        var age = $('#age').val();
        var state = $('#state').val();
        var city = $('#city').val();
        var pincode = $('#pincode').val();
        var country = $('#country').val();
    
        var usernamereg = /^[a-zA-Z0-9]+$/;
        var stringReg = /^[A-Za-z]+$/;
        var numberReg =  /^[0-9]+$/;
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/; 
    
        
        
        
        
        switch(s){
            case "username":{
                $('#username ~ span:first').remove()
                if (username.length < 1) {
                $('#username').after('<span class="error">This field is required</span>');
                }
                else if (!usernamereg.test(username)){
                    $('#username').after('<span class="error">username can have only aplhanumeric characters</span>');
                }
                check_username_exist()
                break;
            }
            case "name":{
                $('#name ~ span:first').remove()
                if (name.length < 1) {
                $('#name').after('<span class="error">This field is required</span>');
                }
                else if (!stringReg.test(name)){
                    $('#name').after('<span class="error">invalid name</span>');
                }
                break
            }
            case "f_name":{
                console.log(f_name)
                $('#f_name ~ span:first').remove()
                if (f_name.length < 1) {
                $('#f_name').after('<span class="error">This field is required</span>');
                }
                else if (!stringReg.test(f_name)){
                    $('#f_name').after('<span class="error">invalid father name</span>');
                }
                break
            }
            case "mother_name":{
                $('#m_name ~ span:first').remove()
                if (m_name.length < 1) {
                $('#m_name').after('<span class="error">This field is required</span>');
                }
                else if (!stringReg.test(m_name)){
                    $('#m_name').after('<span class="error">invalid mother name</span>');
                }
                break
            }
            case "dob":{
                $('#dob ~ span:first').remove()
                if (!isDate(dob)) {
                $('#dob').after('<span class="error">invalid date</span>');
                }
                break
            }
            

            case "email":{
                $('#email ~ span:first').remove()
                if (email.length < 1) {
                $('#email').after('<span class="error">This field is required</span>');
                }
                else if (!emailReg.test(email)){
                    $('#email').after('<span class="error">invalid email</span>');
                }
                break
            }
            
            case "password1":{
                $('#password1 ~ span:first').remove()
                if (password1.length < 8) {
                    $('#password1').after('<span class="error">Password must be at least 8 characters long</span>');
                }
                break
            }
            
            case "password2":{
                $('#password2 ~ span:first').remove()
                if (password2 != password1) {
                    $('#password2').after('<span class="error">Passwords don\'t match</span>');
                }
                break
            }   
            case "phone":{
                $('#phone ~ span:first').remove()
                if(phone.length<1){
                    $("#phone").after('<span class="error">This field is required</span>');
                }
                else if(phone.length>10||!numberReg.test(phone)){
                    $("#phone").after('<span class="error">invalid phone number</span>');
                }
                break
            }
            case "pincode":{
                $('#pincode ~ span:first').remove()
                if(pincode.length<1){
                    $("#pincode").after('<span class="error">This field is required</span>');
                }
                else if(pincode.length>10||!numberReg.test(pincode)){
                    $("#pincode").after('<span class="error">invalid pincode number</span>');
                }
                break
            }
            
            case "address":{
                $('#adress ~ span:first').remove()
                if(address.length<1){
                    $("#address").after('<span class="error">this field is required</span>');
                }
                break
            }
            case "city":{
                $('#city ~ span:first').remove()
                if (name.length < 1) {
                $('#city').after('<span class="error">This field is required</span>');
                }
                else if (!stringReg.test(name)){
                    $('#city').after('<span class="error">invalid name</span>');
                }
                break
            }
                
        
    
        }

    }
    // function nextstep() {
    //     var x = document.getElementById("next_step");
    //     if (x.style.display === "none") {
    //       x.style.display = "block";
    //     } else {
    //       x.style.display = "none";
    //     }
    //   }




    $(".input100").focusout(function(){
        console.log($(this).attr('id'))
        inline_validate($(this).attr('id'));
    })
    
     

})


