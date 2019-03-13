$(document).ready(function () {


    $(".activate").click(function(){
        var id = $(this).attr('id')
        var makeadmin = $('#check'+id).is(':checked')
        console.log(id)
        console.log($(this))
        console.log($('#check'+id))
        $.ajax({
            url: '/ajax/activate_account',
            dataType : "json",
            contentType: 'application/json',
            data: JSON.stringify({
                uid : id,
                make_admin: makeadmin
            }),
            type: 'POST',
            success: function(response) {
                console.log(response);
                if(response['code']==200)
                {
                    console.log(response)
                    $('#row'+id).remove()
                    
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
    })
    
});