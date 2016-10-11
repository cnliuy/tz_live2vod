var obj = {};
var obj2, focusObj;
var s, l;
var Onespace = 10; //一个单位间距等于10px
var y_max = 50; //布局中垂直方向有多少个格子
var focusNum = 0;
var page = 0;
var num = 0;
var div_width = 1100;
var div_height = 530;
var errorRange=3;
var a = new Array();
for(var i = 0; i < 50; i++) {
	a[i] = new Array();
	for(var j = 0; j < 2; j++) {
		a[i][j] = new Array();
		for(var ij = 0; ij < 2; ij++) {
			a[i][j][ij] = 0;
		}
	}
}

var b = new Array();
for(var i = 0; i < 50; i++) {
	b[i] = new Array();
	for(var j = 0; j < 4; j++) {
		b[i][j] = -100;
	}
}

var layoutDescf = "layout/layout.json";
var vasListUrl = "data/Vas_List.json";

/*
      三种焦点模式 ：
      focusNum = 0：greenyellow；
      focusNum = 1：yellow；
      focusNum = 2：red。
 */
var focusCfg = '[\
	{\
		"border": " 5px solid greenyellow",\
		"textcolor": "greenyellow"\
	}, {\
		"border": " 5px solid yellow",\
		"textcolor": "yellow"\
	}, {\
		"border": " 5px solid red",\
		"textcolor": "red"\
	}\
]';

focusObj = eval("(" + focusCfg + ")");

function startTime() {
	var today = new Date();
	var h = today.getHours();
	var m = today.getMinutes();
	var ss = today.getSeconds();
	// add a zero in front of numbers<10
	m = checkTime(m);
	ss = checkTime(ss);
	document.getElementById('time').innerHTML = h + ":" + m;
	t = setTimeout('startTime()', 500);
}

function checkTime(i) {
	if(i < 10) {
		i = "0" + i;
	}
	return i;
}

function syncRequestLayout() {
	var xmlhttp;
	if(window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	} else { // code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var result = xmlhttp.responseText;
			LayoutObj = eval("(" + result + ")");
		}
	}

	xmlhttp.open("GET", layoutDescf, false);
	xmlhttp.send();
}

function asyncRequestContent() {
	var xmlhttp;
	if(window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	} else { // code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var result = xmlhttp.responseText;
			obj = eval("(" + result + ")");
			l = obj.length;
			s = LayoutObj.itemNum;
			var x = 0,
				y = 0,
				max = 0,
				k = 0;
			for(var i = 0; i < s; i++) {
				var div = document.createElement('div');
				div.id = "div" + i;
				document.getElementById("mid").appendChild(div);
				div.style.position = "absolute"
				var width = LayoutObj.items[i].x_num * Onespace;
				var height = LayoutObj.items[i].y_num * Onespace;
				var left = LayoutObj.items[i].space_left * Onespace + (x + k) * Onespace;
				var top = LayoutObj.items[i].space_top * Onespace + y * Onespace;
				div.style.width = width + "px";
				div.style.height = height + "px";
				div.style.left = left + "px";
				div.style.top = top + "px";
				a[i][0][0] = left;
				a[i][0][1] = top;
				a[i][1][0] = left + width;
				a[i][1][1] = top + height;
				max = LayoutObj.items[i].max;
				if(k + LayoutObj.items[i].x_num < max - 3) {
					//console.log(k + LayoutObj.items[i].x_num)
					k += LayoutObj.items[i].x_num;
				} else {
					y += LayoutObj.items[i].y_num;
					k = 0;
				}
				if(y > y_max) {
					//console.log(y + LayoutObj.items[i].y_num)
					y = 0;
					k = 0;
					x += max;
				}
				var image = document.createElement('img');
				image.id = "image" + i;
				//alert(width);alert(height);
				image.style.width = width + "px";
				image.style.height = height + "px";
				div.appendChild(image);
				var p = document.createElement('p');
				p.id = "p" + i;
				p.style.position = "absolute";
				p.style.width = "100%";
				p.style.height = "35px";
				p.style.color = "white";
				p.style.backgroundImage = "url(img/transparent.png)";
				p.style.fontSize = "22px";
				p.style.textAlign = "center";
				p.style.lineHeight = "35px";
				p.style.bottom = 0;
				p.style.overflow = "hidden";
				div.appendChild(p);
			}
			focusRelations();
			for(var i = 0; i < s; i++) {
				document.getElementById("image" + i).src = obj[i].iconurl;
				document.getElementById("p" + i).innerHTML = obj[i].name;
				if(obj[i].displayname == '0')
					document.getElementById("p" + i).style.display = "none";
				else
					document.getElementById("p" + i).style.display = "block";
			}
			document.getElementById("div0").style.border = focusObj[focusNum].border;
			document.getElementById("p0").style.backgroundColor = focusObj[focusNum].textcolor;
			document.getElementById("bottom").innerHTML="1/" + Math.ceil(l/s);
			for(var i=0;i<Math.ceil(l/s);i++)
			{
				var div = document.createElement('div');
				div.id="li"+i;
				div.style.width="10px";
				div.style.height="10px";
				div.style.mozBorderRadius="5px";
				div.style.borderRadius="5px";
				div.style.backgroundImage="url(img/transparent.png)";
				div.style.float="left";
				div.style.margin="5px";
				document.getElementById("bottom1").appendChild(div);
				if(i==0)
				  div.style.backgroundColor="greenyellow";
			}
		}
		if(LayoutObj.bottomStyle==1)
		{
			document.getElementById("bottom").style.display="block";
			document.getElementById("bottom1").style.display="none";
		}
		else  if(LayoutObj.bottomStyle==2)
		{
			document.getElementById("bottom").style.display="none";
			document.getElementById("bottom1").style.display="block";
		}
		else{
			document.getElementById("bottom").style.display="block";
			document.getElementById("bottom1").style.display="none";
		}
	}
	xmlhttp.open("GET", vasListUrl, true);
	xmlhttp.send();
}

function init() {
	//alert("init ...");
	syncRequestLayout();
	asyncRequestContent();
}

function focusRelations() {
	var x1_max;
	var y1_max;
	var x2_max;
	var y2_max;
	var move_div1;
	var move_div2;
	//向右移动的焦点关系
	for(var i = 0; i < s; i++) {
		var max_distance = 0;
		if(a[i][1][0] + errorRange * Onespace > div_width) {
			move_div1 = a[i][0][0] + errorRange * Onespace - div_width;
			move_div2 = a[i][1][0] + errorRange * Onespace - div_width;
		} else {
			move_div1 = a[i][0][0] + errorRange * Onespace;
			move_div2 = a[i][1][0] + errorRange * Onespace;
		}
		for(var j = 0; j < s; j++) {
			if(i == j)
				continue;
			x1_max = move_div1 > a[j][0][0] ? move_div1 : a[j][0][0];
			y1_max = a[i][0][1] > a[j][0][1] ? a[i][0][1] : a[j][0][1];
			x2_min = move_div2 < a[j][1][0] ? move_div2 : a[j][1][0];
			y2_min = a[i][1][1] < a[j][1][1] ? a[i][1][1] : a[j][1][1];
			var distance = (x1_max - x2_min) * (x1_max - x2_min) + (y1_max - y2_min) * (y1_max - y2_min);
			if(x1_max < x2_min && y1_max < y2_min && distance > max_distance) {
				if(move_div1 > 0)
					b[i][2] = j;
				else {
					if(j == 0)
						b[i][2] = -0.1;
					else
						b[i][2] = -j;
				}
				max_distance = distance;
			}

		}
		if(b[i][2] == -100) {
			if(i == 0)
				b[i][2] = -0.1;
			else
				b[i][2] = -i;
		}
	}
	//向左移动的焦点关系
	for(var i = 0; i < s; i++) {
		var max_distance = 0;
		if(a[i][0][0] - errorRange * Onespace < 0) {
			move_div1 = a[i][0][0] - errorRange * Onespace + div_width;
			move_div2 = a[i][1][0] - errorRange * Onespace + div_width;
		} else {
			move_div1 = a[i][0][0] - errorRange * Onespace;
			move_div2 = a[i][1][0] - errorRange * Onespace;
		}
		for(var j = 0; j < s; j++) {
			if(i == j)
				continue;
			x1_max = move_div1 > a[j][0][0] ? move_div1 : a[j][0][0];
			y1_max = a[i][0][1] > a[j][0][1] ? a[i][0][1] : a[j][0][1];
			x2_min = move_div2 < a[j][1][0] ? move_div2 : a[j][1][0];
			y2_min = a[i][1][1] < a[j][1][1] ? a[i][1][1] : a[j][1][1];
			var distance = (x1_max - x2_min) * (x1_max - x2_min) + (y1_max - y2_min) * (y1_max - y2_min);
			if(x1_max < x2_min && y1_max < y2_min && distance > max_distance) {
				if(move_div2 < div_width)
					b[i][0] = j;
				else {
					if(j == 0)
						b[i][0] = -0.1;
					else
						b[i][0] = -j;
				}
				max_distance = distance;
			}
		}
		if(b[i][0] == -100) {
			if(i == 0)
				b[i][0] = -0.1;
			else
				b[i][0] = -i;
		}
	}
	//向下移动的焦点关系
	for(var i = 0; i < s; i++) {
		var max_distance = 0;
		if(a[i][1][1] + errorRange * Onespace > div_height) {
			move_div1 = a[i][0][1] + errorRange * Onespace - div_height;
			move_div2 = a[i][1][1] + errorRange * Onespace - div_height;
		} else {
			move_div1 = a[i][0][1] + errorRange * Onespace;
			move_div2 = a[i][1][1] + errorRange * Onespace;
		}
		for(var j = 0; j < s; j++) {
			if(i == j)
				continue;
			x1_max = a[i][0][0] > a[j][0][0] ? a[i][0][0] : a[j][0][0];
			y1_max = move_div1 > a[j][0][1] ? move_div1 : a[j][0][1];
			x2_min = a[i][1][0] < a[j][1][0] ? a[i][1][0] : a[j][1][0];
			y2_min = move_div2 < a[j][1][1] ? move_div2 : a[j][1][1];
			var distance = (x1_max - x2_min) * (x1_max - x2_min) + (y1_max - y2_min) * (y1_max - y2_min);
			if(x1_max < x2_min && y1_max < y2_min && distance > max_distance) {
				if(move_div1 > 0)
					b[i][3] = j;
				else {
					if(j == 0)
						b[i][3] = -0.1;
					else
						b[i][3] = -j;
				}
				max_distance = distance;
			}
		}
		if(b[i][3] == -100) {
			if(i == 0)
				b[i][3] = -0.1;
			else
				b[i][3] = -i;
		}
	}
	//向上移动的焦点关系
	for(var i = 0; i < s; i++) {
		var max_distance = 0;
		if(a[i][0][1] - errorRange * Onespace < 0) {
			move_div1 = a[i][0][1] - errorRange * Onespace + div_height;
			move_div2 = a[i][1][1] - errorRange * Onespace + div_height;
		} else {
			move_div1 = a[i][0][1] - errorRange * Onespace;
			move_div2 = a[i][1][1] - errorRange * Onespace;
		}
		for(var j = 0; j < s; j++) {
			if(i == j)
				continue;
			x1_max = a[i][0][0] > a[j][0][0] ? a[i][0][0] : a[j][0][0];
			y1_max = move_div1 > a[j][0][1] ? move_div1 : a[j][0][1];
			x2_min = a[i][1][0] < a[j][1][0] ? a[i][1][0] : a[j][1][0];
			y2_min = move_div2 < a[j][1][1] ? move_div2 : a[j][1][1];
			var distance = (x1_max - x2_min) * (x1_max - x2_min) + (y1_max - y2_min) * (y1_max - y2_min);
			if(x1_max < x2_min && y1_max < y2_min && distance > max_distance) {
				if(move_div2 < div_height)
					b[i][1] = j;
				else {
					if(j == 0)
						b[i][1] = -0.1;
					else
						b[i][1] = -j;
				}
				max_distance = distance;
			}
		}
		if(b[i][1] == -100) {
			if(i == 0)
				b[i][1] = -0.1;
			else
				b[i][1] = -i;
		}
	}

}

var active = function(num1, page1) {
	var start = page1 * s;
	if(start + s < l) {
		for(var i = start; i < start + s; i++) {
			document.getElementById("div" + i % s).style.display = "inline";
			document.getElementById("p" + i % s).style.display = "inline";
			document.getElementById("image" + i % s).src = obj[i].iconurl;
			document.getElementById("p" + i % s).innerHTML = obj[i].name;
			if(obj[i].displayname == '0')
				document.getElementById("p" + i % s).style.display = "none";
			else
				document.getElementById("p" + i % s).style.display = "block";
		}
	} else {
		for(var j = start; j < l; j++) {
			document.getElementById("image" + j % s).src = obj[j].iconurl;
			document.getElementById("p" + j % s).innerHTML = obj[j].name;
			if(obj[j].displayname == '0')
				document.getElementById("p" + j % s).style.display = "none";
			else
				document.getElementById("p" + j % s).style.display = "block";
			for(var i = l; i < start + s; i++) {
				document.getElementById("div" + i % s).style.display = "none";
				document.getElementById("p" + i % s).style.display = "none";

			}
		}
	}
	if(num1 == -0.1)
		num1 = 0;
	else
		num1 = Math.abs(num1);
	num = num1;
	for(var i = 0; i < s; i++) {
		if(num1 == i) {
			if(document.getElementById("div" + num1).style.display == "none") {
				num = 0;
				document.getElementById("div0").style.border = focusObj[focusNum].border;
				document.getElementById("p0").style.backgroundColor = focusObj[focusNum].textcolor;
			} else {
				document.getElementById("div" + i).style.border = focusObj[focusNum].border;
				document.getElementById("p" + i).style.backgroundColor = focusObj[focusNum].textcolor;
			}
		} else {
			document.getElementById("div" + i).style.border = " 0px solid greenyellow";
			document.getElementById("p" + i).style.backgroundColor = "transparent";
		}
	}
	document.getElementById("bottom").innerHTML=(page+1) +"/" + Math.ceil(l/s);
	for(i=0;i<Math.ceil(l/s);i++)
	{
		if(page==i)
		   document.getElementById("li"+i).style.backgroundColor="greenyellow";
		else
		  document.getElementById("li"+i).style.backgroundColor="transparent";
	}
}

function setGlobalVar(sName, sValue) {
	try{ Utility.setEnv(sName, sValue);}catch(e){ document.cookie = escape(sName) + "=" + escape(sValue);}
}

Date.prototype.Format = function(fmt) 
{ //author: meizz 
  var o = { 
    "M+" : this.getMonth()+1,                 //月份 
    "d+" : this.getDate(),                    //日 
    "h+" : this.getHours(),                   //小时 
    "m+" : this.getMinutes(),                 //分 
    "s+" : this.getSeconds(),                 //秒 
    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
    "S"  : this.getMilliseconds()             //毫秒 
  }; 
  if(/(y+)/.test(fmt)) 
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  for(var k in o) 
    if(new RegExp("("+ k +")").test(fmt)) 
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
  
  return fmt; 
}

function prepareProgram(_name, _channelid) {
	//alert("_name:"+_name);
	//alert("_channelid:"+_channelid);
	var rtspurl1="rtsp://10.80.0.51:554/";
	var temp = "^^^?&amp;startTime=";
	var rtspurl2="&amp;endTime=&amp;areaCode=";
	var rtspurl3="&amp;resgroupId=&amp;userId=";
	var rtspurl4="&amp;sessionId=0&amp;sessionType=null&amp;productId=0&amp;displayName=&amp;provider=coship&amp;ssId=2010863&amp;vcrInfo=&amp;";


	var backUrl = location.href;
	var areaCode = Utility.getSystemInfo("ARC");
	var userId = Utility.getSystemInfo("UID");
	var nowDate = new Date();
	var date = (new Date(nowDate.getTime()-60*1000)).Format("yyyyMMddhhmmss");
	
	var playUrl = rtspurl1+_channelid+temp+date+rtspurl2+areaCode+rtspurl3+userId+rtspurl4;
	alert("playUrl:"+playUrl);
	
	Utility.println("***** will play: "+_name +" and rtsp: "+playUrl);
	
	setGlobalVar("vod_ctrl_backurl", backUrl);
	
	setGlobalVar("vod_ctrl_rtsp", playUrl);
	
	setGlobalVar("displayName", _name);
	
}

function prepareProgramly(_name, _channelid) {
	
	init();
	//alert("_channelid:"+_channelid);
	//alert("_name:"+_name);	
	var rtspurl1="rtsp://10.80.0.51:554/";
	var temp = "^^^?&amp;startTime=";
	var rtspurl2="&amp;endTime=&amp;areaCode=";
	var rtspurl3="&amp;resgroupId=&amp;userId=";
	var rtspurl4="&amp;sessionId=0&amp;sessionType=null&amp;productId=0&amp;displayName=&amp;provider=coship&amp;ssId=2010863&amp;vcrInfo=&amp;";


	var backUrl = location.href;
	var areaCode = Utility.getSystemInfo("ARC");
	var userId = Utility.getSystemInfo("UID");
	var nowDate = new Date();
	var date = (new Date(nowDate.getTime()-60*1000)).Format("yyyyMMddhhmmss");	
	var playUrl = rtspurl1+_channelid+temp+date+rtspurl2+areaCode+rtspurl3+userId+rtspurl4;
	//alert("playUrl:"+playUrl);
	
	Utility.println("***** will play: "+_name +" and rtsp: "+playUrl);
	
	setGlobalVar("vod_ctrl_backurl", backUrl);
	//alert("backUrl:"+backUrl);
	
	setGlobalVar("vod_ctrl_rtsp", playUrl);
	//alert("playUrl2:"+playUrl);
	setGlobalVar("displayName", _name);
	//alert("displayName:"+_name);
	var url="../vodctrl/vodplay.htm"
    window.location.href = url;
	//alert("url:"+url);
	//break;
	
}

function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

//function prepareProgramly2(_name, _channelid) {
function prepareProgramly2() {
	init();
	//alert("lname="+GetQueryString("lname"));
	//alert("lchannelid="+GetQueryString("lchannelid"));
	//alert("Url:"+window.location.href);
	var _name = GetQueryString("lname");
	var _channelid= GetQueryString("lchannelid");
	//alert("_channelid:"+_channelid);
	//alert("_name:"+_name);	
	var rtspurl1="rtsp://10.80.0.51:554/";
	var temp = "^^^?&amp;startTime=";
	var rtspurl2="&amp;endTime=&amp;areaCode=";
	var rtspurl3="&amp;resgroupId=&amp;userId=";
	var rtspurl4="&amp;sessionId=0&amp;sessionType=null&amp;productId=0&amp;displayName=&amp;provider=coship&amp;ssId=2010863&amp;vcrInfo=&amp;";


	var backUrl = location.href;
	var areaCode = Utility.getSystemInfo("ARC");
	var userId = Utility.getSystemInfo("UID");
	var nowDate = new Date();
	var date = (new Date(nowDate.getTime()-60*1000)).Format("yyyyMMddhhmmss");	
	var playUrl = rtspurl1+_channelid+temp+date+rtspurl2+areaCode+rtspurl3+userId+rtspurl4;
	//alert("playUrl:"+playUrl);
	
	Utility.println("***** will play: "+_name +" and rtsp: "+playUrl);
	
	setGlobalVar("vod_ctrl_backurl", backUrl);
	//alert("backUrl:"+backUrl);	
	setGlobalVar("vod_ctrl_rtsp", playUrl);
	//alert("playUrl2:"+playUrl);
	setGlobalVar("displayName", _name);
	//alert("displayName:"+_name);
	//?lname="+_name+"&lchannelid="+_channelid
	var url="../vodctrl/vodplay.htm";
    window.location.href = url;
	//alert("url:"+url);
	//break;
	
}


document.onkeydown = function(ev) {
	//alert("key down");
	var oEvent = ev || event;
	switch(oEvent.keyCode) {
		case 37:
			//alert("37");
			if(b[num][0] >= 0) {
				if(document.getElementById("div" + b[num][0]).style.display == "none")
					return;
				else num = b[num][0];
			} else {
				if(page - 1 < 0)
					return;
				else {
					/*page = page - 1;
					num = b[num][0];*/
				}
			}
			active(num, page);
			break;
		case 38:
			//alert("38");
			if(b[num][1] >= 0) {
				if(document.getElementById("div" + b[num][1]).style.display == "none")
					return;
				else num = b[num][1];
			} else {
				if(page - 1 < 0)
					return;
				else {
					page = page - 1;
					num = b[num][1];
				}
			}
			active(num, page);
			break;
		case 39:
			//alert("39");
			if(b[num][2] >= 0) {
				if(document.getElementById("div" + b[num][2]).style.display == "none")
					return;
				else num = b[num][2];
			} else {
				if(page + 1 >= Math.ceil(l / s))
					return;
				else {
					/*page = page + 1;
					num = b[num][2];*/
				}
			}
			active(num, page);
			break;
		case 40:
			//alert("40");
			if(b[num][3] >= 0) {
				if(document.getElementById("div" + b[num][3]).style.display == "none")
					return;
				else num = b[num][3];
			} else {
				if(page + 1 >= Math.ceil(l / s))
					return;
				else {
					page = page + 1;
					num = b[num][3];
				}
			}
			active(num, page);
			break;
		case 13:
			//alert("13");
			var url=obj[page*s+num].url;
		    var name = obj[page*s+num].name;
			var channelid = obj[page*s+num].channelid;
			
			prepareProgram(name, channelid);
			//alert("url:"+url);//var url="../vodctrl/vodplay.htm"
            window.location.href = url;
            break;
		default:
			break;
	}
}