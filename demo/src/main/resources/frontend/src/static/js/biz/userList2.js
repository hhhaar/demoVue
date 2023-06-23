"use strict"
var oData, areaData, interval, oFilter,sFilter,initCheck;
var initialize = function(){
    console.log(getBrowserType());
    initCheck = false;
    //$("#chkRefresh").on("change",(e)=>{  e.preventDefault();setGridInterval(); });
    $("#retrieve").on("click",(e)=>{ e.preventDefault(); getGridData(); });
    $("#export-excel").on("click",(e)=>{e.preventDefault(); exportXls(); });
    
    //getGridData();
    //setGridInterval();
    // getFormatDate();
    dialogInit();
    //getUserListAll();
    //setTimeout(() => location.replace("/"), 60*60*1000);
};
var dialogInit = ()=>{
    $( "#dialog" ).dialog({ autoOpen: false,
        height: 900,
        width: 1200,
        modal: true 
    });
};
var getUserListAll = ()=>{
    $.ajax({
        url         : "/v1/user/db/userall",
        method        : "GET",
        dataType    : "json",
        success     : (data) =>{
            if(data) {
				console.info(data);
//                $.each(data,(i,d)=>{
//                    $("#sel-area").append("<option value='"+d.AREA_NAME+"'>"+d.AREA_NAME+"</option>");
//                });
                //if(!initCheck) $("#retrieve").trigger("click");
            }
        }
    });
};
var getGridData = ()=>{
	sLoad();
    var areaName    = $("#sel-area").val();
    var status  = $("#sel-state").val();
    var userId = $("#userId").val();
    $.ajax({
        url         : "/v1/user/db/user",
        method      : "GET",
        dataType    : "json",
        data        : {userId:userId},
        success     : (data) =>{
            tblDataReset();
            oData = null;
            oData = data;
            setTopCount(data);
            setGridData(data);
            hLoad();
        }, error 		: () =>{
			setTopCount(null);
			hLoad();
		}
    });
};
var getGridDetailData = (p)=>{
    $.ajax({
        url         : "/serverDetailList",
        method        : "GET",
        dataType    : "json",
        // data        : {hostIp:p.hostIp,remoteIp:p.remoteIp,remotePort:p.remotePort},
        data        : p,
        success     : (data) =>{
            $("#tbl-detail-data tr:gt(0)").remove();
            setPopupDetailData(data);
        },
        error 		: () =>{
			
		}
        
    });
};

var setGridData = (data)=>{
    var rowTr   = $("#row-tmp").text();
    var gridTr  = "";

    $.each(data, (i, d)=>{
        gridTr += rowTr   .replace(/#IDX#/gi,   	i+1 )
                        .replace(/#BFNAMEPK#/gi,   	d.BFNAMEPK )
                        .replace(/#BFUSERTYPE#/gi,	d.BFUSERTYPE )
                        .replace(/#BFIDPK#/gi,		d.BFIDPK )
                        .replace(/#BFCLIENTIP#/gi,	d.BFCLIENTIP )
                        .replace(/#CREATEDATE#/gi,	d.CREATEDATE )
        ;
    });
    $("#tbl-data").append(gridTr);
//    $("#tbl-data button").off("click").on("click",function(e){
//        e.preventDefault();
//        var tdObj = $(this).parent().siblings();
//        var param = {hostIp:$(tdObj[3]).text(),remoteIp:$(tdObj[5]).text(),remotePort:$(tdObj[6]).text()};
//        //getGridDetailData(param); 
//    });
};

var setPopupDetailData = (data)=>{
    var rowTr   = $("#row-detail-tmp").text();
    var tmpTr   = "";
    
    $.each(data, (i, d)=>{
        tmpTr = rowTr   .replace(/#IDX#/gi,         i+1 )
                        .replace(/#CHECK_DATE#/gi,  d.CHECK_DATE )
                        .replace(/#AREA_NAME#/gi,   d.AREA_NAME )
                        .replace(/#HOST_NAME#/gi,   d.HOST_NAME )
                        .replace(/#HOST_IP#/gi,     d.HOST_IP )
                        .replace(/#REMOTE_NAME#/gi, d.REMOTE_NAME )
                        .replace(/#REMOTE_IP#/gi,   d.REMOTE_IP )
                        .replace(/#REMOTE_PORT#/gi, d.REMOTE_PORT )
                        .replace(/#CONNECT#/gi,     d.CONNECT_YN)
                        .replace(/#RETURN_CODE#/gi,     d.RETURN_CODE)
        ;
        if(d.CONNECT_YN == "N") tmpTr = tmpTr.replace(/<tr>/gi, "<tr class='w3-red'>");
        $("#tbl-detail-data").append(tmpTr);
    });
    $("#dialog").dialog("option", "title", "Last 100 Server Status ["+data[0].HOST_IP+"] ");
    $("#dialog").dialog( "open" );
};

var setAreaSelect = (d)=>{
    $("#sel-area").children('option:not(:first)').remove();
    areaData = null;
    areaData = new Array();
    $.each(d,(i,v)=>{
        if(areaData.indexOf(v.AREA_NAME) == -1 ) areaData.push(v.AREA_NAME);
    });

    $.each(areaData,(i,v)=>{
        $("#sel-area").append("<option value='"+v+"'>"+v+"</option>");
    });
};

var  setTopCount = (data)=>{
	var count = 0;
	$("#sub-error, #sub-connect").hide();
	if(data && data.length > 0){
		count = data[0].TOTAL;
		$("#sub-total").text(count);
		$("#sub-connect").show();
	}else{
		$("#sub-connect").hide();
	}
};

var setGridInterval = ()=>{
    var chk = $("#chkRefresh").is(":checked");
    if(chk){
        var cTime = Number($("#refTime").val());
        interval= setInterval(()=>{   getGridData();  }, cTime*1000);
    } 
    else clearInterval(interval);  
};

var tblDataReset = ()=>{
    $("#tbl-data tr:gt(0)").remove();
};
var exportXls = () => {
    sLoad();
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = (s)=>{
            return window.btoa(unescape(encodeURIComponent(s)))
        },
        format = (s, c)=> {
            return s.replace(/{(\w+)}/g, function (m, p) {
                return c[p];
            })
        }
    var toExcel = document.getElementById("tbl-data").innerHTML;//$("#tbl-data").html();//
    var ctx = { worksheet: name || '', table: toExcel };
    var l = document.getElementById("excelDown");
    l.download = getFormatDate()+"_user_list.xls";
    l.href = uri + base64(format(template, ctx))
    l.click();
    hLoad();
   //document.createElement("a");
};
var exportAllXls = () => {
    var tmpTr       = "",toExcel     = "";
    var tmpTbl     = $("#tbl-all-excel-tmp").text();
    var rowTr       = $("#row-all-excel-tmp").text();

    $.ajax({
        url         : "/serverList",
        thpe        : "GET",
        dataType    : "json",
        success     : (data) =>{
            $.each(data, (i, d)=>{
                tmpTr = rowTr   .replace(/#IDX#/gi,         i+1 )
                                .replace(/#AREA_NAME#/gi,   d.AREA_NAME )
                                .replace(/#HOST_NAME#/gi,   d.HOST_NAME )
                                .replace(/#HOST_IP#/gi,     d.HOST_IP )
                                .replace(/#REMOTE_NAME#/gi, d.REMOTE_NAME )
                                .replace(/#REMOTE_IP#/gi,   d.REMOTE_IP )
                                .replace(/#REMOTE_PORT#/gi, d.REMOTE_PORT )
                                .replace(/#CONNECT#/gi,     d.CONNECT_YN)
                                .replace(/#CHECK_DATE#/gi,  d.CHECK_DATE)
                ;
                if(d.CONNECT_YN == "N") tmpTr = tmpTr.replace(/<tr>/gi, "<tr style='background-color:red;color:white;font-weight:bold;'>");
                toExcel+=tmpTr;
            });
            toExcel = tmpTbl.replace(/#APPEND_ROW#/gi,   toExcel );
            var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
            base64 = (s)=>{
                return window.btoa(unescape(encodeURIComponent(s)))
            },
            format = (s, c)=> {
                return s.replace(/{(\w+)}/g, function (m, p) {
                    return c[p];
                });
            };
            var ctx = { worksheet: name || '', table: toExcel };
            var l = document.getElementById("excelDown");
            l.download = getFormatDate()+"_server_dashboard.xls";
            l.href = uri + base64(format(template, ctx))
            l.click();
            ctx     = null;
            l       = null;
            toExcel = null;
        }
    });
   //document.createElement("a");
};
var saveAsBlob = (s)=>{ 
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;    
};
var exportXlsx = ()=>{ 
    var wb = XLSX.utils.book_new();
    var newWorksheet = exportXlsxHandler.getWorksheet();
    XLSX.utils.book_append_sheet(wb, newWorksheet, exportXlsxHandler.getSheetName());
    var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
    saveAs(new Blob([saveAsBlob(wbout)],{type:"application/octet-stream"}), exportXlsxHandler.getExcelFileName());
};
var exportXlsxHandler = {
    getExcelFileName : ()=>{ return getFormatDate()+"_server_dashboard.xlsx"; },
    getSheetName : ()=>{ return 'Table Test Sheet'; },
    getExcelData : ()=>{ return document.getElementById('tbl-data'); },
    getWorksheet : ()=>{ return XLSX.utils.table_to_sheet(this.getExcelData());}
};
var getFormatDate = ()=>{
    var d = new Date();
    // var date_format_str = d.getFullYear().toString()+"-"+((d.getMonth()+1).toString().length==2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+"-"+(d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString())+" "+(d.getHours().toString().length==2?d.getHours().toString():"0"+d.getHours().toString())+":"+((parseInt(d.getMinutes()/5)*5).toString().length==2?(parseInt(d.getMinutes()/5)*5).toString():"0"+(parseInt(d.getMinutes()/5)*5).toString())+":00";
    return d.getFullYear().toString()+((d.getMonth()+1).toString().length==2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+(d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString());
};
var getBrowserType = ()=>{ 
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