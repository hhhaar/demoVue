"use strict"
var grid = null;

$(()=>{
	gridInitialize();
	
	$("#retrieve").click((e)=>{
		e.preventDefault();
		getUserList();
	});
	$("#regist").click((e)=>{
		e.preventDefault();
		//regPopup();
		userPopup["reg"]();
	});
	$("#delete").click((e)=>{
		e.preventDefault();
		delUser();
	});
	$("#userCnt").text(0);
});
var gridInitialize = ()=>{
//	console.log( "## contents height : "+$("#contents").height() );
//	console.log( "## userList_top height : "+$("#userList_top").height() );
//	console.log( "## userList_count height : "+$("#userList_count").height() );		
//	console.log( "## userList_cond height : "+$("#userList_cond").height() );
//	
	var totalSize = $("#contents").height();
	var top = $("#userList_top").height();
	var count = $("#userList_count").height();
	var cond = $("#userList_cond").height();
	var cal = totalSize - top - count - cond - 100;
	
	grid = new tui.Grid({
		el: document.getElementById("grid"),
		//scrollX: false,
		//scrollY: true,
		rowHeight: 30,
		minRowHeight:20,
		rowHeaders: ["checkbox"],
		header: { height: 30 },
		bodyHeight : cal,
		columns: [
			{ header: "No", 			name: "NO" ,align:"center",  width:10, rowHeight: 20, sortable: true},
			{ header: "ID", 		name: "BFNAMEPK", rowHeight:20,	sortable: true},
			{ header: "Type", 			name: "BFUSERTYPE", rowHeight:20,	sortable: true},
			//{ header: "Connect Key", 	name: "BFIDPK", rowHeight:20 },
			{ header: "Connect IP", 	name: "BFCLIENTIP", rowHeight:20 },
			{ header: "Create Date", 	name: "CREATEDATE", rowHeight:20,	sortable: true}
		]
	});
	
	grid.on("check", function(ev) {
		//console.log("check", ev);
    });

    grid.on("uncheck", function(ev) {
 		//console.log("uncheck", ev);
	});
	
	 grid.on("click", function(ev) {
 		var colName = ev.columnName;
 		if(!$util.isEmpty(colName) && colName != "_checked" ){
			 userPopup["mod"](ev.rowKey);
		}
	});
};

var getUserList = ()=>{
//	const gridData = [
//		{ NO:1, BFNAMEPK: 'USERID01', BFUSERTYPE: 'S', BFIDPK: "?sdfjkl231#@)$",BFCLIENTIP:"127.0.0.1",CREATEDATE:"2023-04-05"  },
//	];
//	grid.resetData(gridData);
//	return;
    var userId = $("#conUserId").val();
    $.ajax({
        url         : "/v1/user/db",
        method      : "GET",
        dataType    : "json",
        data        : {userId:userId},
        success     : (data) =>{
			if(data && data.length > 0){
	            $("#userCnt").text(data[0].TOTAL_COUNT);
	            grid.resetData(data);
            }
        }, error 		: () =>{
			$("#userCnt").text("");
		}
    });
};
var getUserInfo = (_id)=>{
	if($util.isEmpty(_id)){
		alert("사용자 ID가 없습니다.");
		return false;
	}
	var rtnResult=null;
    $.ajax({
        url         : "/v1/user/ldap/id/"+_id,
        method      : "GET",
        dataType    : "json",
        async		: false,
        success     : (data) =>{
			console.log(data);
			if(data && data.success){
				rtnResult = data;
            }
        }
    });
    return rtnResult ;
};

var userPopup = {
	reg(){
		$util.popup.show($("#regTemplate").text());
		$("#btnReg").off("click").on("click",(e)=>{
			e.preventDefault();
			regUser();
		});
		$(".popClose").off("click").on("click",(e)=>{
			e.preventDefault();
			$util.popup.hide();
		});
		$("#mobile").off("keyup").on("keyup",function(){
		    $(this).val($(this).val().replace(/[^0-9]/g, ""));
		});
	},
	mod(_rowKey){
		var rowData = grid.getRow(_rowKey);
		var rowUserId = rowData.BFNAMEPK;
		var ladpUserData = getUserInfo(rowUserId);
		var modTemp = $("#modTemplate").text();
		
		$util.popup.show(modTemp);
		
		$("#popup #modUserId").val(ladpUserData.data.cn);
		$("#popup #modUserName").val(ladpUserData.data.givenName);
		$("#popup #modEmail").val(ladpUserData.data.mail);
		$("#popup #modMobile").val($util.isEmpty(ladpUserData.data.mobile)?"":ladpUserData.data.mobile);
		
		$("#btnPopMod").off("click").on("click",(e)=>{
			e.preventDefault();
			modUser();
		});
		$(".popClose").off("click").on("click",(e)=>{
			e.preventDefault();
			$util.popup.hide();
		});
		$("#modMobile").off("keyup").on("keyup",function(){
		    $(this).val($(this).val().replace(/[^0-9]/g, ""));
		});
	}
}

var regUser = ()=>{
	var id = $("#userId").val();
	var pwd1 = $("#password").val();
	var pwd2 = $("#password2").val();
	var nm = $("#name").val();
	var email = $("#email").val();
	var mobile = $("#mobile").val();
	
	if($.trim(id) == "") {
		alert("ID를 입력 하세요.");
		$("#userId").focus();
		return false;
	}
	if($.trim(pwd1) == ""){
		alert("비밀번호를 입력 하세요.");
		$("#password").focus();
		return false;
	}
	if($.trim(pwd2) == ""){
		alert("비밀번호 재확인을 입력 하세요.");
		$("#password2").focus();
		return false;
	}
	if($.trim(pwd1) != $.trim(pwd2)){
		alert("비밀번호가 일치 하지 않습니다.");
		$("#password").focus();
		return false;
	}
	if($.trim(nm) == ""){
		alert("이름을 입력 하세요.");
		$("#name").focus();
		return false;
	}
	if($.trim(email) == ""){
		alert("이메일을 입력 하세요.");
		$("#email").focus();
		return false;
	}
	if(!$util.validation.email( $.trim(email))){
		alert("이메일 형식에 맞지 않습니다.");
		$("#email").focus();
		return false;
	}
	if($.trim(mobile) == ""){
		alert("전화번호를 입력 하세요.");
		$("#mobile").focus();
		return false;
	}
	
	if(!confirm("입력한 사용자를 등록 하시겠습니까?")) return false;
	
	var formData = $util.ajax.postForm($("#regForm").serializeArray());
	$.ajax({
        url         : "/v1/user",
        method      : "POST",
        contentType	: 'application/json',
        dataType    : "json",
        data        : JSON.stringify(formData),
        success     : (data) =>{
			if(data.success) {
				//console.log(data.data.status);
				if(data.data.status > 210 ){
					var errorJson = data.data.causes[0];
					var errorMsg = "["+errorJson.code+"] ";
					errorMsg+=errorJson.message;
					alert(errorMsg);
					return false;
				}else{
					getUserList();
					$util.popup.hide();
					alert("등록 되었습니다.");
				}
			}
        }
    });
};
var modUser = ()=>{
	var pwd1 = $("#modPassword").val();
	var pwd2 = $("#modPassword2").val();
	var nm = $("#modUserName").val();
	var email = $("#modEmail").val();
	var mobile = $("#modMobile").val();
	
	if($.trim(pwd1) == ""){
		alert("비밀번호를 입력 하세요.");
		$("#modPassword").focus();
		return false;
	}
	if($.trim(pwd2) == ""){
		alert("비밀번호 재확인을 입력 하세요.");
		$("#modPassword2").focus();
		return false;
	}
	if($.trim(pwd1) != $.trim(pwd2)){
		alert("비밀번호가 일치 하지 않습니다.");
		$("#modPassword").focus();
		return false;
	}
	if($.trim(nm) == ""){
		alert("이름을 입력 하세요.");
		$("#modUserName").focus();
		return false;
	}
	if($.trim(email) == ""){
		alert("이메일을 입력 하세요.");
		$("#modEmail").focus();
		return false;
	}
	if(!$util.validation.email( $.trim(email))){
		alert("이메일 형식에 맞지 않습니다.");
		$("#modEmail").focus();
		return false;
	}
	if($.trim(mobile) == ""){
		alert("전화번호를 입력 하세요.");
		$("#modMobile").focus();
		return false;
	}
	
	if(!confirm("수정 하시겠습니까?")) return false;
	var addUser={ name:"modUserId", value:$("#modUserId").val()};
	var formData = $util.ajax.postForm($("#modForm").serializeArray(),addUser);
	$.ajax({
        url         : "/v1/user",
        method      : "PUT",
        contentType	: 'application/json',
        dataType    : "json",
        data        : JSON.stringify(formData),
        success     : (data) =>{
			console.log(data);
			if(data.success) {
				if(data.data.update == "N"){
					alert("수정에 실패 하였습니다.\n 관리자에게 문의 하세요!");
				}else{
					$util.popup.hide();
					alert("수정 되었습니다.");
				}
			}
        }
    });
};
var delUser = ()=>{
	var delRows = grid.getCheckedRows();
	
	if($.isEmptyObject(delRows)){
		alert("선택한 항목이 없습니다.");
		return false;
	}
	if(!confirm("해당 사용자를 삭제 하시겠습니까?")){
		return false;
	}
	var delArray = [];
	$.each(delRows,(i,x)=>{
		delArray.push(x.BFNAMEPK);
	});
	
	$.ajax({
        url         : "/v1/user",
        method      : "DELETE",
        contentType	: 'application/json',
        dataType    : "json",
        data        : JSON.stringify(delArray),
        success     : (data) =>{
			if(data.success) {
				getUserList();
				alert(delArray.length+" 건 삭제 되었습니다.");
			}
        }
    });
};