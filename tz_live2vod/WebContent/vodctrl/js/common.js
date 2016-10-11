String.prototype.trim = function() { return this.replace(/(^\s*)|(\s*$)/g, "");}
function jsonParse(text) {
	try {
		return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(
				text.replace(/"(\\.|[^"\\])*"/g, ''))) &&
			eval('(' + text + ')');
	} catch (e) { return false;}
}
var epgUrl = "/iPG/T-nsp/";
var FORWARD_KEY = 39; 
var REWIND_KEY = 37;
var FAST_FORWARD_KEY = 3874;
var FAST_REWIND_KEY = 3873; 
var PAUSE_KEY = 3864;//暂停
var ENTER_KEY = 13;
var RETURN_KEY = 640;//);8;//
var PLAY_KEY = 3862;//播放
var QUIT_KEY = 27;
var KEY_PAGEUP = 33//49;
var KEY_PAGEDOWN = 34//50; 
var YELLOW_KEY = 405;//113;//音量加
var GREEN_KEY = 404;//114;
var BLUE_KEY = 406;//音量减
var STOP_KEY = 3863;
var KEY_VOICEUP = 448; 
var KEY_VOICEDOWN = 447; 
var KEY_POSITION = 3880;
var KEY_TRACK = 407;
var KEY_STATIC = 449;
var KEY_HOMEPAGE =  468;//( ||)3856;//
var KEY_INFORMATION =  457;
var KEY_LANGUAGE =  35;
var KEY_SCREENDISPLAY = 42;
var RED_KEY = 403;
var prefix = "";//vodctrl/
var LocString = String(window.document.location.href);
//function getUserId() {  return "6501821";  }
//function getSmartCardId() {  return "2001235536";}
function getUserId() { try { return Utility.getSystemInfo("UID"); } catch (e) { return 0; } }
function getSmartCardId() { try { return Utility.getSystemInfo("SID");  } catch (e) { return 0; } }
function setSmartCardId(){ try { setGlobalVar("currentSmartCardId", getSmartCardId()); } catch (e) {} }
function $(id){	return document.getElementById(id);}
function getQueryStr(qs, allStr){
	var rs = new RegExp("(^|)"+qs+"=([^\&]*)(\&|$)","gi").exec(allStr), tmp;
	if(tmp = rs) return tmp[2];
	return "";
}
function getMaxPauseTime() {
    var time = Utility.getSystemInfo("SaServiceInfo.VOD_MAX_PAUSE_TIME");
    if (time != "") return parseInt(time, 10);
    return 300; 
}
String.prototype.replaceQueryStr = function(replaceVal, searchStr) {
    var restr = searchStr + "=" + replaceVal;
    var rs = new RegExp("(^|)" + searchStr + "=([^\&]*)(\&|$)", "gi").exec(this), tmp;
    var val = null;
    if (tmp = rs) val = tmp[2];
    if (val == null) {
        if (this.lastIndexOf("&") == this.length - 1) return this + restr;
        else if (this.lastIndexOf("?") >= 0) return this + "&" + restr;
        return this + "?" + restr;
    }
    var shs = searchStr + "=" + val;
    if (this.lastIndexOf("?" + shs) >= 0) return this.replace("?" + shs, "?" + restr);
    return this.replace("&" + shs, "&" + restr);
}
function setGlobalVar(sName, sValue) {
	try{ Utility.setEnv(sName, sValue);}catch(e){ document.cookie = escape(sName) + "=" + escape(sValue);}
}
function getGlobalVar(sName){
	var result = null;
	try{ 
		result = Utility.getEnv(sName);
	}catch(e){
		var aCookie = document.cookie.split("; ");
		for (var i = 0; i < aCookie.length; i++){
			var aCrumb = aCookie[i].split("=");
			if (escape(sName) == aCrumb[0]){
				result = unescape(aCrumb[1]);
				break;
			}
		}
	}
	return result;
}
function addZero(val){	
	if (val < 10) return "0" + val;
	return val;
}
function removeZero(val){	
	if (val.length > 1 && val.indexOf("0") == 0) return parseInt(val.substr(1), 10);
	return parseInt(val, 10);
}
function getDateStr(seconds){	
	if (isNaN(seconds)) seconds= 0;
	var time = new Date(seconds * 1000);
	return (time.getYear() + getExactYearDis()) + addZero((time.getMonth() + 1)) + addZero(time.getDate()) + addZero(time.getHours()) + addZero(time.getMinutes()) + addZero(time.getSeconds());
}
function convertToDate(val){//val: yymmddhhmmss
	var darr = new Array(6);	
	var index = 4;
	for(var i = 0; i < 6; i ++){
		darr[i] = parseInt(removeZero(val.substr(0,index)), 10);
		val = val.substr(index);
		index = 2;
	}
	return darr;
}


function subText(str, sub_length, num) {//汉字与字符都都在时截取长度
    var temp1 = str.replace(/[^\x00-\xff]/g, "**");
    var temp2 = temp1.substring(0, sub_length);
    var x_length = temp2.split("\*").length - 1;
    var hanzi_num = x_length / 2;
    sub_length = sub_length - hanzi_num;
    //实际需要sub的长度是总长度-汉字长度
    var res = str.substring(0, sub_length);
    if(num == 0) {
        if(sub_length < str.length)
            res = res + "...";
        return res;
    }else if(num == 1){
        if(sub_length < str.length) {
            return "<marquee scrollLeft='1' behavior='scroll' direction='left' scrollamount='6' scrolldelay='100'>" + str + "</marquee>";
        } else {
            return str;
        }
    }else{
		return res;
	}
}

function convertToShowTime(second){
	if (isNaN(second) || second < 0) second = 0;	 
	var hh = parseInt(second / 3600);
	var mm = parseInt((second % 3600) / 60); //must be round
	var ss = (second % 3600) % 60;
	return addZero(hh) + ":" + addZero(mm) + ":" + addZero(ss);
}
function getIntValue(val){
	if (val != null && val != "" && !isNaN(val)) return parseInt(val, 10);
	return 0;
}
function getStatusImgSrc(status){
	var src = "";
	switch(status){
		case 0: //play
			src = prefix + "images/button_q.png";
			break;
		case 1: //pause
			src = prefix + "images/button_s.png"; 
			break;
		case 3: //fast forward
			src = prefix + "images/button_g.png";//button_qb.png";
			break;
		case 4: //fast rewind
			src = prefix + "images/button_b.png";//button_go.png";
			break;
		case 5: //forward
			//src = prefix + "images/button_q.png";//button_g.png";
			break;
		case 6: //rewind
			//src = prefix + "images/button_q.png";//button_b.png";
			break;	
	}
	return src;
}
function getTrackStr(val){
	var str = "";
	switch(val.toUpperCase()){
		case "LEFT": 
			str = "%E5%B7%A6%E5%A3%B0%E9%81%93";
			break;
		case "RIGHT": 
			str = "%E5%8F%B3%E5%A3%B0%E9%81%93";
			break;
		case "STEREO": 
			str = "%E7%AB%8B%E4%BD%93%E5%A3%B0";//"%E5%85%A8%E5%A3%B0%E9%81%93";
			break;
	}
	return decodeURIComponent(str);
}
function getMatchModeStr(val) {
    var str = "";
    switch (val){
        case 0: //PanScan
            str = "%E8%87%AA%E9%80%82%E5%BA%94";
            break;
        case 1: //LetterBox
            str = "%E5%8F%98%E7%84%A6";
            break;
        //case 2: //ComBined
           // str = "ComBined";
            //break;
        case 2: //Ignore
            str = "%E5%85%A8%E5%B1%8F";
            break;   
    }
    return decodeURIComponent(str);
}
function getExactYearDis(){	return 1900;}
function getDateObj(){	return new Date();}

var mainPmId=getGlobalVar("mainPmId");
var resourceId=getGlobalVar("resourceId");
function saveBookMark(breakPoint){//保存书签
    var url = epgUrl + "BookMark.do?pmId=" + mainPmId + "&subId=" + resourceId + "&userId=" + getUserId() + "&invoke=save&timePosition=" + breakPoint;
    ajax(url, ""); 
}

function deleteBookMark(){//删除书签
    var url = epgUrl + "BookMark.do?pmId=" + mainPmId + "&subId=" + resourceId + "&userId=" + getUserId() + "&invoke=delete";
    ajax(url, "");
}

function ajax(url, handler) {//ajax请求
    var xmlHttp;
    if (window.XMLHttpRequest) xmlHttp = new XMLHttpRequest();
    else if (window.ActiveXObject) xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4) {// 已收到响应
            if (xmlHttp.status == 200 || xmlHttp.status == 0) {// 请求成功
                handler(xmlHttp.responseText);
            } else {
               // showInfo("");
            }
        }
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}
