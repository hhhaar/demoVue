var grid = null;

$(()=>{
	gridInitialize();
	
	$("#templateDown").click((e)=>{
		e.preventDefault();
		getExcelTemplate();
	});
	$("#importExcel").click((e)=>{
		e.preventDefault();
		$("#excelFile").click();
	});
	$("#regUser").click((e)=>{
		e.preventDefault();
		regUser();
	});
});
var gridInitialize = ()=>{
	var totalSize = $("#contents").height();
	var cal = totalSize - 200;
	
	grid = new tui.Grid({
		el: document.getElementById("grid"),
		//scrollX: false,
		//scrollY: true,
		rowHeight: 30,
		minRowHeight:20,
		rowHeaders: ["rowNum"],
		header: { height: 30 },
		bodyHeight : cal,
		columns: [
			{ header: "ID", 		name: "userId", rowHeight:20,	sortable: true},
			{ header: "Password", 	name: "password", rowHeight:20	},
			{ header: "Name", 		name: "name", rowHeight:20, sortable: true},
			{ header: "Email", 		name: "email", rowHeight:20, sortable: true},
			{ header: "Mobile", 	name: "mobile", rowHeight:20}
		]
	});
};
var regUser = ()=>{
	var gridData = grid.getData();
	if($util.isEmpty(gridData)){
		alert("등록할 사용자가 존재 하지 않습니다.");
		return false;
	}
	
	if( !userDupChk(gridData) ) return false;
	var sendData = [];
	var validPass = false;
	$.each(gridData,(i,x)=>{
		if($.trim(x.userId) == "") {
			focus(x.rowKey, "userId", true);
			alert(x._attributes.rowNum+" Row의 ID를 입력 하세요.");
			return false;
		}
		if($.trim(x.password) == ""){
			focus(x.rowKey, "password", true);
			alert(x._attributes.rowNum+" Row의 비밀번호를 입력 하세요.");
			return false;
		}
		if($.trim(x.name) == ""){
			focus(x.rowKey, "name", true);
			alert(x._attributes.rowNum+" Row의 이름을 입력 하세요.");
			return false;
		}
		if($.trim(x.email) == ""){
			focus(x.rowKey, "email", true);
			alert(x._attributes.rowNum+" Row의 이메일을 입력 하세요.");
			return false;
		}
		if(!$util.validation.email( $.trim(x.email))){
			focus(x.rowKey, "email", true);
			alert(x._attributes.rowNum+" Row의 이메일은 형식에 맞지 않습니다.");
			return false;
		}
		if($.trim(x.mobile) == ""){
			focus(x.rowKey, "mobile", true);
			alert(x._attributes.rowNum+" Row의 전화번호를 입력 하세요.");
			return false;
		}
		if(!$.isNumeric(x.mobile)){
			focus(x.rowKey, "mobile", true);
			alert(x._attributes.rowNum+" Row의 전화번호에는 숫자만 입력 하세요.");
			return false;
		}
			
		sendData.push({
			userId:x.userId,
			password:x.password ,
			name:x.name ,
			email:x.email ,
			mobile:x.mobile});
		validPass = true;
	});
	if(!validPass) return false;
	
	if(!confirm("입력한 사용자를("+sendData.length+") 등록 하시겠습니까?")) return false;
	
	$.ajax({
        url         : "/v1/user/excel",
        method      : "POST",
        contentType	: 'application/json',
        dataType    : "json",
        data        : JSON.stringify(sendData),
        success     : (data) =>{
			if(data.success) {
				alert(sendData.length+"건 등록 되었습니다.");
				grid.resetData([]);
			}
        }
    });
};

var importExcel = ()=>{
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function () {
        let data = reader.result;
        let workBook = XLSX.read(data, { type: 'binary' });
        var jsonExcel
        let rows;
        workBook.SheetNames.forEach(function (sheetName) {
//            console.log('SheetName: ' + sheetName);
           	rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
//            console.log(rows);
            //jsonExcel = JSON.stringify(rows);
        })
		grid.resetData(rows);
    };
    reader.readAsBinaryString(input.files[0]);
};

// [s2ab 메소드 정의 : 바이너리 데이터 만듦]
function s2ab(s) { 
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;    
};

function getExcelTemplate(){ 
    // step 1. workbook 생성
    var wb = XLSX.utils.book_new();
    // step 2. 시트 만들기 
    var newWorksheet = excelHandler.getWorksheet();
    // step 3. workbook에 새로만든 워크시트에 이름을 주고 붙인다.  
    XLSX.utils.book_append_sheet(wb, newWorksheet, excelHandler.getSheetName());
    // step 4. 엑셀 파일 만들기 
    var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
    // step 5. 엑셀 파일 내보내기 
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), excelHandler.getExcelFileName());
}
var excelHandler = {
	getExcelFileName : function(){
	    return $util.date()+'_template.xlsx';
	},
	getSheetName : function(){
		return 'Sheet';
	},
	getExcelData : function(){
		return [
			["userId","password","email","name","mobile"],
//			["1","p1","e1@email.com","n1","m1"],
//			["2","p2","e2@email.com","n2","m2"],
//			["3","p3","e3@email.com","n3","m3"],
//			["4","p4","e4@email.com","n4","m4"],
//			["5","p5","e5@email.com","n5","m5"]
		];
	},
	getWorksheet : function(){
		return XLSX.utils.aoa_to_sheet(this.getExcelData());
	}
};

var userDupChk = gd =>{
	var	dupChkArray = [];
	$.each(gd,(i,x)=>{
		dupChkArray.push(x.userId);
	});
	
	var rtnData;
	$.ajax({
        url         : "/v1/user/db/dupchk",
        method      : "GET",
        contentType	: 'application/json',
        dataType    : "json",
        data        : {users:dupChkArray},
        async 		: false,
        success     : (data) =>{
//			console.log(data);	
			if(data.success) {
				rtnData = data;
			}
        }
    });
    if(rtnData.list && rtnData.list.length > 0){
		var userList = "중복 사용자가 존재 합니다.\n";
		$.each(rtnData.list,(i,x)=>{
			userList += "     ["+ x.BFNAMEPK+"]\n";
		});
		alert(userList);
		return false;
	}else{
		return true;
	}
};
