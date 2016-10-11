
/*
zjl 2009 @ coship
*/

var list = [
	     	   {'num':'0','url':''},
			   { 'num': '1', 'url': 'list.html?type=xpsd-dydb' },
			   { 'num': '2', 'url': 'list.html?type=bzrb-dydb' },
			   { 'num': '3', 'url': 'list.html?type=ypcd-dydb' },
			   { 'num': '4', 'url': 'list.html?type=yplx-dydb' }
			];

var pic = [
          { url: 'list.html?type=bzrb-dydb&menuId=0&listId=0', smallPic: 'images/pic_1.jpg', bigPic: 'images/pic1.jpg',id:'2278'},
          { url: 'list.html?type=bzrb-dydb&menuId=0&listId=1', smallPic: 'images/pic_2.jpg', bigPic: 'images/pic2.jpg',id:'2270' },
          { url: 'list.html?type=bzrb-dydb&menuId=0&listId=2', smallPic: 'images/pic_3.jpg', bigPic: 'images/pic3.jpg',id:'2274'},
          { url: 'list.html?type=bzrb-dydb&menuId=0&listId=3', smallPic: 'images/pic_4.jpg', bigPic: 'images/pic4.jpg',id:'2265' },
          { url: 'list.html?type=bzrb-dydb&menuId=0&listId=4', smallPic: 'images/pic_5.jpg', bigPic: 'images/pic5.jpg',id:'295' }
];
var currentPos = 0;
var outTime;

var canvas;
var control = new EffectControl();
var image1;
var image2;
var image3;
var imageEffect;

var menuFocus=1; //当前中间位置对应的索引
var menuLength=3; //显示的长度
var menuSum = pic.length; 
var menuElement; //菜单对象
var midPosIndex; //xml处于中间位置对应的索引，在xml中的位置，从0开始
var premenuFocus; //前一个处于中间位置的菜单索引

var menuEffectLeft; //向左动效
var menuEffectRight; //向右动效
var menuEffectLeftHidden; //向左隐藏动效
var menuEffectRightHidden; //向右隐藏动效
var menuTime = 0;
var menuCount = 10;
var endLeft;
var startLeft=3;
var menuLeft;
var menuTop = 43;
var menuWidth = 247;
var menuHeight = 355;
var menuMWidth = 299;
var menuMHeight = 426;
var menuMTop = 3;
var menuMLeft = 293;
var hMDis = 340;
var hDis = 315;
var menuHiddenEffect;   //待执行的隐藏动效
var hiddenIndex;        //隐藏菜单对应的索引
var bigIndex;           //下一个到达中间位置的索引

/****  onload中加载的方法  ****/
function init(){
	canvas = new Canvas(304,115,881,430);
	canvas.bgImage= "images/canvas_bg.jpg";
	
	initMenu();

	canvas.refresh();
	clearTimeout(outTime);

}//end init

function initMenu(){
	menuElement = new Array(menuLength);
	menuElementContent = new Array(menuLength);
	menuEffectLeft = new Array(menuLength);//记录向左的特效
	menuEffectRight = new Array(menuLength);//记录向右的特效
	
	midPosIndex = Math.floor((menuLength - 1) / 2);
    //alert("midPosIndex= "+midPosIndex);
	var posOffset = 0;
	if (menuFocus != midPosIndex){
		//证明中间位置发生了偏移
		posOffset = menuFocus - midPosIndex;
	}
	//alert("posOffset="+posOffset);
	var realMenuPos;
	var tempDis;
	var tempRealIndex;
	menuLeft = startLeft;
	for(var i=0; i< menuLength; i++){	
		realMenuPos = ((menuSum + posOffset + i) % menuSum);	
		//alert("realMenuPos="+realMenuPos);
		//特效			
		if(i == 0){
			menuEffectLeft[i] = new Effect("cutout","left",menuTime,menuCount);
			menuEffectRight[i] = new Effect("zoom",menuLeft,menuTop, menuWidth, menuHeight, menuMLeft, menuMTop,menuMWidth,menuMHeight, menuTime,menuCount);
			
		}else if( i == menuLength - 1 ){
			menuEffectLeft[i] = new Effect("zoom", menuLeft,menuTop, menuWidth, menuHeight, menuLeft - hMDis, menuMTop,menuMWidth,menuMHeight, menuTime,menuCount);
			menuEffectRight[i] = new Effect("cutout","right", menuTime, menuCount);
			
		}else{		
			menuEffectLeft[i] = new Effect("zoom",menuMLeft, menuMTop,menuMWidth,menuMHeight, menuLeft - hDis, menuTop, menuWidth, menuHeight, menuTime,menuCount);
			menuEffectRight[i] = new Effect("zoom",menuMLeft, menuMTop,menuMWidth,menuMHeight, menuLeft + hDis, menuTop, menuWidth, menuHeight, menuTime,menuCount);			
		}
		
		//对象
		if (i == midPosIndex){
			//中间属于放大的			
			tempDis = hMDis;
			tempRealIndex = realMenuPos;
		}else{
			tempDis = hDis;
			
			menuElement[i] = new ImageElement(menuLeft, menuTop, menuWidth, menuHeight, pic[realMenuPos].smallPic);
			canvas.add(menuElement[i]);		
		}
		menuLeft += hDis;//tempDis;	
	//alert("menuLeft="+menuLeft)
	}
	endLeft = menuLeft - hDis;
	menuElement[i] = new ImageElement(endLeft, menuTop, menuWidth, menuHeight, "");
	//alert("endLeft="+endLeft)
	menuElement[i].visible = false;
	canvas.add(menuElement[i]);	
	
	//隐藏元素特效	
	menuEffectLeftHidden = new Effect("cutin","right",menuTime,menuCount);
	menuEffectRightHidden = new Effect("cutin","left",menuTime,menuCount);
	
	menuElement[midPosIndex] = new ImageElement(menuMLeft, menuMTop, menuMWidth, menuMHeight, pic[tempRealIndex].bigPic);
	canvas.add(menuElement[midPosIndex]);	
	
	/**/
    image1 = new ImageElement(3, 347, 64, 51, "images/num_7.png");
    image2 = new ImageElement(293, 378, 64, 51, "images/num_8.png");
    image3 = new ImageElement(633, 347, 64, 51, "images/num_9.png");
	canvas.add(image1);
	canvas.add(image2);
	canvas.add(image3);
	imageEffect = new Effect("transparent",100,100,0,10);
}

function KeyLeftandRight(type){
	premenuFocus = menuFocus;

	if (type == 1){ //right
	     //
  	     currentPos = currentPos-1;
         if(currentPos == -1) {
           currentPos = pic.length-1;
         }
	
		menuFocus -= 1;
		if (menuFocus < 0) menuFocus = menuSum - 1;
		
		menuHiddenEffect = menuEffectRightHidden;
		hiddenIndex = ((menuSum + (premenuFocus - midPosIndex)) % menuSum) - 1;
		bigIndex = midPosIndex - 1;
		
		menuElement[menuLength].x = startLeft;
	}else{ //left
	     //
  	     currentPos = currentPos+1;
         if(currentPos == pic.length) {
           currentPos = 0;
         }
	
		menuFocus += 1;
		//alert("menuFocus="+menuFocus);
		//alert("menuSum="+menuSum);
		if (menuFocus >= menuSum ) menuFocus = 0;
		
		menuHiddenEffect = menuEffectLeftHidden;
		//alert("midPosIndex="+midPosIndex);
		hiddenIndex = ((menuLength + (premenuFocus - midPosIndex) + (menuSum - 1)) % menuSum) + 1;
		//alert("premenuFocus="+premenuFocus);
		//alert("hiddenIndex="+hiddenIndex);
		bigIndex = midPosIndex + 1;
		//alert("bigIndex="+bigIndex);
		menuElement[menuLength].x = endLeft;	
		//alert("endLeft="+endLeft);

	}	
	if (hiddenIndex < 0) hiddenIndex = menuSum - 1;
	else if (hiddenIndex > menuSum - 1) hiddenIndex = 0;
		
}

function menuEffect(type){
	//alert("effect");
	menuElement[midPosIndex].image = pic[premenuFocus].smallPic;	
	//alert("menuElement["+midPosIndex+"].image="+menuElement[midPosIndex].image);
	canvas.refresh();
	menuElement[menuLength].image = pic[hiddenIndex].smallPic;	
	menuElement[bigIndex].image = pic[menuFocus].bigPic;
	menuElement[bigIndex].width = menuMWidth;
	menuElement[bigIndex].height = menuMHeight;

	//menu元素的特效
	control.beginParallel();
	for(var i=0; i< menuLength; i++){
		if(type == -1) //left
			menuElement[i].setEffect(menuEffectLeft[i]);
		else  //right
			menuElement[i].setEffect(menuEffectRight[i]);
		
		if ( bigIndex != i)
			menuElement[i].doEffect();

	}
	
	//隐藏元素的特效
	menuElement[menuLength].setEffect(menuHiddenEffect);
	menuElement[menuLength].doEffect();	
	menuElement[bigIndex].doEffect();

	
	image1.setEffect(imageEffect);
	image1.doEffect();
	image2.setEffect(imageEffect);
	image2.doEffect();
	image3.setEffect(imageEffect);
	image3.doEffect();
	control.endParallel();
	
	resetElement(type);	
	canvas.refresh();

}

//特效后要重新排序图片对象
function resetElement(type){

	var tempElement;
	menuLeft = startLeft;
	//alert("menuLeft="+menuLeft);
	if(type == -1){ 	//left	
		tempElement = menuElement[0].image;
	    //alert("tempElement="+tempElement);
		for(var i=0; i< menuLength; i++){
			menuElement[i].image = menuElement[i+1].image;
		}
		menuElement[menuLength].image = tempElement;
	}else{	//right	
		tempElement = menuElement[menuLength].image;
		for(var i= menuLength; i>0; i--){
			menuElement[i].image = menuElement[i-1].image;
		}
		menuElement[0].image = tempElement;
	}

	for(var i=0; i< menuLength; i++){
		//中间放大的
		if (i == midPosIndex){
			menuElement[i].x = menuMLeft;
			menuElement[i].y = menuMTop;
			menuElement[i].width= menuMWidth;
			menuElement[i].height = menuMHeight;
		}else{
			menuElement[i].x = menuLeft;
			menuElement[i].y = menuTop;
			menuElement[i].width = menuWidth;
			menuElement[i].height = menuHeight;			
		}
		menuLeft += hDis;
		//alert("menuLeft="+menuLeft);
	}

	menuElement[menuLength].visible = false;			
}

//遥控器键值
//通用键值
var ZERO = 48;   //0
var ONE = 49;
var TWO = 50;
var THREE = 51;
var FOUR = 52;
var FIVE = 53;
var SIX = 54;
var SEVEN = 55;
var EIGHT = 56; 
var NINE = 57;

//键值1 
var NEXTPAGE1 = 34;	//下一页
var PREVPAGE1 = 33;	//上一页  		
var LEFT1 = 37;		//左
var RIGHT1 = 39;	//右
var UP1 = 38;		//上
var DOWN1 = 40;		//下
var ENTER1 = 13;		//确定
var RETURN1 = 8;	//返回
var RETURN2 = 107;	//返回　最右的+ ks

//键值2
var NEXTPAGE = 302;	//下一页
var PREVPAGE = 301;	//上一页
var LEFT = 271;		//左
var RIGHT = 272;	//右
var UP = 269;		//上
var DOWN = 270;		//下
var ENTER = 13;		//确定

var RETURN = 283;	//返回

//document.onkeydown = grabEvent;
document.onkeypress = grabEvent;

function grabEvent(e)
{
	e = (e)?e:window.event;
	var val = e.which || e.keyCode;

	switch(val)
	{	
	        //0-6
			case ZERO:
   		        location.href = Coship.getGlobalVar("PORTAL_ADDR");
                break;
			case ONE:
			case TWO:
			case THREE:
			case FOUR:
//			case FIVE:
//			case SIX:
				show(val);
				break;	
			//7-9
			case SEVEN:	
			case EIGHT:	
			case NINE:	
				remoteShow(val);
				break;
			//left
			case LEFT:
			case LEFT1:
			    KeyLeftandRight(-1);	
			    menuEffect(-1);
				break;
			//right
			case RIGHT:
			case RIGHT1:
			     KeyLeftandRight(1);	
			     menuEffect(1);
				break;
			default:			
				break;
	}
}
/*****************************************************/
//去掉页面list的黄框
try{
	Coship.setDrawFocusRing(1);
}catch(e){
}


window.onload = function()
{
	outTime = setTimeout("init()",100);
}

function $(id)
{
	 return document.getElementById(id);
}


//0-6遥控按钮控制
function show(num)
{
	num = num-48;
	window.location = list[num].url;
}

//7-9遥控按钮控制
function remoteShow(num)
{
	var URL;
	num = num-48;
	if(num==7)
	{
		//URL = pic[currentPos].url;
		play(pic[currentPos].id);
	}
	if(num==8)
	{
		play(pic[(currentPos+1)%pic.length].id);
		//URL = pic[(currentPos+1)%pic.length].url;
	}
	if(num==9)
	{	play(pic[(currentPos+2)%pic.length].id);
		//URL = pic[(currentPos+2)%pic.length].url;
	}
	//window.location = URL;
}
function getGlobalVar(sName) 
{
	var result = null;
	try
	{
		result = iPanel.getGlobalVar(sName);
	}
	catch(e)
	{
		var aCookie = document.cookie.split("; ");
		for (var i = 0; i < aCookie.length; i++) 
		{
			var aCrumb = aCookie[i].split("=");
			if (escape(sName) == aCrumb[0]) 
			{
				result = unescape(aCrumb[1]);		
				break;
			}
		}		
	}
	return result;
}
	//播放
function play(pmId){

 //alert(pmId);
 var UID = getGlobalVar('userId');
 var url = "/iEPG/T-nsp/Play.do?userId="+UID+"&svstype=mov&pmId="+pmId;
 //alert(url);
 ajaxUrl(url, "ajaxCallBack");

 
}
function GetXmlHttpObject(handler)

{ 
	var objXmlHttp=null;
	if (navigator.userAgent.indexOf("MSIE")>=0)
	{ 

		var strName="Msxml2.XMLHTTP"
		if (navigator.appVersion.indexOf("MSIE 5.5")>=0)

		{
			strName="Microsoft.XMLHTTP"
		} 

		try

		{ 
			objXmlHttp=new ActiveXObject(strName)
			objXmlHttp.onreadystatechange=handler 
			return objXmlHttp

		} 
		catch(e)
		{ 
			alert("Error. Scripting for ActiveX might be disabled") 
			return 
		} 
	}
	else
	{

		objXmlHttp=new XMLHttpRequest()
		if (objXmlHttp.overrideMimeType) 

		{
			objXmlHttp.overrideMimeType('text/xml'); 

		}	

		objXmlHttp.onload=handler
		objXmlHttp.onerror=handler 
		return objXmlHttp

	}

}
function ajaxUrl(url,callbackfun)

{
	xmlHttp=GetXmlHttpObject(eval(callbackfun));
	xmlHttp.open("GET", url , true);
	xmlHttp.send(null);
}

function ajaxCallBack(){
	
	if (xmlHttp.readyState==4 || xmlHttp.readyState=="complete")

	{	
		
		var resText = xmlHttp.responseText;
		//alert(resText);
 if(resText.indexOf("^_^") == 0){
	   location.href=resText.substring(3);
 }
		}
 
}
