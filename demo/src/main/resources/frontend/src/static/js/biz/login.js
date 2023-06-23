"use strict"
$(()=>{ $("#userId, #password").keydown(function(key) { if (key.keyCode == 13) { login();} }); })
var login = () => {
    if($("#userId").val()== "" ){
        alert("ID가 입력 되지 않았습니다.");
        return false;
    }
    if($("#password").val()== "" ){
        alert("Password가 입력 되지 않았습니다.");
        return false;
    }

    $.ajax({
        url: "/loginUser",
        method: "POST",
        dataType: "json",
        data : $("#fm").serialize(),
        success: (data) => {
            if(data.LOGIN=="Y") location.replace("/");
            else if(data.LOGIN=="N") alert("ID 또는 패스워드가 틀립니다.");
            else if(data.LOGIN=="B") alert("접근 권한이 없습니다.");
        }, error: (request, status, error) => {
            console.error("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        }
    });
};