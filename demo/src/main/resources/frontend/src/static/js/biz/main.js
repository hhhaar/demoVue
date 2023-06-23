"user strict"
let $util = {
	ajax:{},
	grid:{},
	mask:{},
	popup:{},
	validation:{},
	loadingBar:{}
};
let $main = {};
let currentPath = "";
let loadingBarCnt = 0;

$(()=>{
	$util.ajax.init();
	// 로딩바 생성
	$util.loadingBar.create();
	// Grid Theme
	$util.grid.theme();
	// Main Event
	$main.event();
	// 초기 페이지 이동
	$main.pageMove("/userMgt");
});

$util.loadingBar.create = ()=>{
	var maskHeight = window.innerHeight; 
    var maskWidth = window.innerWidth; 
    var mask = "<div id='mask' style='position:absolute; z-index:999; background-color:#333333; display:none; left:0; top:0;'></div>";
    var loadingImg = ""; 
        loadingImg += "<div id='loadingImg' style='position:absolute; left:50%; top:40%; display:none; z-index:10000;'>"; 
        loadingImg += " <img src='/static/img/loading2.gif'/>"; 
        loadingImg += "</div>"; 
        $("#mask").remove();
        $("body").append(mask).append(loadingImg); 
        $("#mask").css({ "width" : maskWidth , "height": maskHeight , "opacity" : "0.9" }); 
        $("#mask").hide(); 
        $("#loadingImg").hide(); 
};
$util.loadingBar.show = ()=>{ 
	$("#mask, #loadingImg").show(); 
};
$util.loadingBar.hide = ()=>{ 
	$("#mask, #loadingImg").hide();
};
$util.mask.show = ()=>{ 
	$("#mask").show(); 
};
$util.mask.hide = ()=>{ 
	if( loadingBarCnt > 0) return false;
	$("#mask").hide(); 
};

$util.getBrowserType = ()=>{ 
    var agt = navigator.userAgent.toLowerCase(); 
    if (agt.indexOf("chrome") != -1) {      return 'Chrome'; } 
    if (agt.indexOf("opera") != -1) {       return 'Opera'; } 
    if (agt.indexOf("staroffice") != -1) {  return 'Star Office'; } 
    if (agt.indexOf("webtv") != -1) {       return 'WebTV'; } 
    if (agt.indexOf("beonex") != -1) {      return 'Beonex'; } 
    if (agt.indexOf("chimera") != -1) {     return 'Chimera'; } 
    if (agt.indexOf("netpositive") != -1) { return 'NetPositive'; } 
    if (agt.indexOf("phoenix") != -1) {     return 'Phoenix'; } 
    if (agt.indexOf("firefox") != -1) {     return 'Firefox'; } 
    if (agt.indexOf("safari") != -1) {      return 'Safari'; } 
    if (agt.indexOf("skipstone") != -1) {   return 'SkipStone'; } 
    if (agt.indexOf("msie") != -1) {        return 'Internet Explorer'; } 
    if (agt.indexOf("rv:11.0") != -1) {     return 'Internet Explorer'; } 
    if (agt.indexOf("netscape") != -1) {    return 'Netscape'; } 
    if (agt.indexOf("mozilla/5.0") != -1) { return 'Mozilla'; } 
};
$util.popup.show = s =>{
	$util.mask.show();
	$("#popup").html(s).show();
};
$util.popup.hide = ()=>{
	$util.mask.hide();
	$("#popup").empty().hide();
};
$util.grid.theme = ()=>{
	let options ={
		selection: {
			background: '#4daaf9',
	    	border: '#004082'
	  	},
	  	scrollbar: {
	    	background: '#f5f5f5',
	    	thumb: '#d9d9d9',
	    	active: '#c1c1c1'
	  	},
	  	row: {
	    	even: {
	      		background: '#eee'
	    	},
	    	hover: {
	      	background: '#ccc'
	    	}
	  	},
	  	cell: {
	    	normal: {
	      		background: '#fbfbfb',
	      		border: '#000',
	      		showVerticalBorder: true
	    	},
	    	header: {
	      		background: '#eee',
	      		border: '#000',
	      		showVerticalBorder: true
	    	},
	    	rowHeader: {
	      		border: '#000',
	      		showVerticalBorder: true
	    	},
	    	editable: {
	      		background: '#fbfbfb'
	    	},
	    	selectedHeader: {
	      		background: '#d8d8d8'
	    	},
	    	focused: {
	      		border: '#418ed4'
	    	},
	    	disabled: {
	      		text: '#b0b0b0'
	    	}
	  	}
	};
	 tui.Grid.applyTheme('default', options);
};
$util.isEmpty = (v)=>{
  	if( v == "" || v == null || v == undefined || ( v != null && typeof v == "object" && !Object.keys(v).length ) ){
    	return true;
  	}
  	return false;
};
// async 		: 요청을 비동기로 처리할지 여부를 나타내는 참거짓. 기본값: true
// beforeSend (xhr) : 요청을 보내기 전에 실행할 함수.
// cache 		: 브라우저가 요청 된 페이지를 캐시해야하는지 여부를 나타내는 참거짓.  기본값: true
// complete(xhr, status) : 요청이 완료 될 때 (성공 및 오류 기능 후) 실행되는 함수.
// contentType : 서버에 데이터를 보낼 때 사용되는 내용 유형.  기본값: "application / x-www-form-urlencoded"
// context 	: 모든 AJAX 관련 콜백 함수에 대한 "this"값을 지정.
// data 		: 서버에 보낼 데이터를 지정.
// dataFilter 	: (data, type) XMLHttpRequest의 원시 응답 데이터를 처리하는 데 사용되는 함수.
// dataType 	: 서버 응답에 필요한 데이터 유형.
// error		: (xhr, status, error) : 요청이 실패 할 경우 실행할 함수.
// global 		: 요청에 대해 전역 AJAX 이벤트 핸들을 촉발할지 여부를 지정하는 참거짓.  기본값: true
// ifModified 	: 마지막 요청 이후에 응답이 변경된 경우에만 요청이 성공하는지 여부를 지정하는 참거짓  기본값: false
// jsonp		: jsonp 요청에서 콜백 함수를 기각하는 문자열
// jsonpCallback : jsonp 요청에서 콜백 함수의 이름을 지정.
// password 	: HTTP 액세스 인증 요청에 사용될 암호를 지정.
// processData : 요청과 함께 전송 된 데이터를 쿼리 문자열로 변환해야하는지 여부를 지정하는 참거짓.  기본값: true
// scriptCharset : 요청에 대한 문자 집합을 지정.
// success 	: (result, status, xhr) : 요청이 성공했을 때 실행할 함수.
// timeout 	: 요청에 대한 로컬 시간 초과 1000분의 1초 형식으로 표현. (1초 = 1000)
// traditional : 전통적인 스타일의 param serialization을 사용할지 여부를 지정하는 참거짓.
// type 		: 요청의 유형을 지정. (GET 또는 POST)
// url 		: 요청을 보낼 URL을 지정.  기본값: 현재 페이지
// username 	: HTTP 액세스 인증 요청에 사용할 사용자 이름을 지정.
// xhr 		: XMLHttpRequest 객체를 만드는 데 사용되는 함수.

$util.ajax.init = ()=>{
	$.ajaxSetup({
		global		: false,
		cache		: false,
		beforeSend 	: () =>{
			$util.loadingBar.show();
		},
		error		: (xhr, status, error) =>{
			var errorMsg = "code:"+xhr.status+"\n"+"message:"+xhr.responseText+"\n"+"error:"+error;
			alert(errorMsg);
			console.error("code:"+xhr.status+"\n"+"message:"+xhr.responseText+"\n"+"error:"+error);
			$util.loadingBar.hide();
		},
		complete	: (xhr, status) =>{
			$util.loadingBar.hide();
		}
	});
};
$util.ajax.postForm = (f,a) =>{
	var rtnArray = {};
	for (var i = 0; i < f.length; i++) {
		rtnArray[f[i]["name"]] = f[i]["value"];
	}
	if(!$util.isEmpty(a)){
		rtnArray[a.name] = a.value;
	}
	return rtnArray;
};
$util.validation.email = mail=>{
	var email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
	if(!email_regex.test(mail)){ 
		return false; 
	}
	
	return true;
};
$main.pageMove = _path =>{ 
	$("#contents").load(_path);
};
$main.event = () =>{
    // 햄버거 버튼 클릭
	$("#btnMenuOpen").click((e)=>{
		if( $("#btnMenuOver").is(":visible")) {
	        $("#leftMenu,#btnMenuOver").css("display", "none");
	    } else {
	        $("#leftMenu,#btnMenuOver").css("display", "block");
	    }
	});
	$("#btnMenuOver").click((e)=>{
		$("#leftMenu, #btnMenuOver").css("display", "none");
	});
	// 메뉴 클릭
	$("#leftMenu a").click(function(e){
		e.preventDefault();
		$("#leftMenu, #btnMenuOver").css("display", "none");
		var _path=$(this).data("path");
		if(_path == currentPath) return false;
        currentPath = _path;
       	$("#contents").children().remove();
        $main.pageMove(_path);
	});
};

$main.removeElement= ()=>{
	//특정 객체 아이디 설정 실시 
	var parentTag = document.getElementById("contents");
	var beafore_count = parentTag.childElementCount;
	console.log("[clickFunction] [beafore child count] : " + beafore_count);
	//반복문을 돌면서 포함된 자식 순차적 제거
	while ( parentTag.hasChildNodes() ) { 
		parentTag.removeChild( parentTag.firstChild ); 
	};
	//자식 제거 후 컨테이너 포함 자식 재확인 실시 
	var after_count = parentTag.childElementCount;
	console.log("[clickFunction] [after child count] : " + after_count);
};

$util.date = ()=>{
	return new Date(+new Date() + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '');
};