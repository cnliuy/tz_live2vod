
/*
zjl 2009 @ coship
*/

var list = [
	     	   {'num':'0','url':''},
			   { 'num': '1', 'url': 'list.html?type=0' },
			   { 'num': '2', 'url': 'list.html?type=1' },
			   { 'num': '3', 'url': 'list.html?type=2' },
			   { 'num': '4', 'url': 'list.html?type=3' },
			   { 'num': '5', 'url': 'list.html?type=4' },
			   { 'num': '6', 'url': 'list.html?type=5' }
			];

var pic = [
          { url: 'rtsp://172.030.080.188:554/5023^^^?&startTime=&endTime=&areaCode=&resgroupId=&userId=111111&sessionId=1624&sessionType=0&payType=1&sessionSignature=f21a2ff1ef02d5a8eec226de70abb9b1&productId=925&sessionSign=1249577150ac66ffdb137cb569ae71fb6119a3718b&displayName=�赸����-��1��& ', smallPic: 'images/wdsj_small.jpg', bigPic: 'images/wdsj_big.jpg'},
          { url: 'rtsp://172.030.080.188:554/5001^^^?&startTime=&endTime=&areaCode=&resgroupId=&userId=111111&sessionId=1582&sessionType=0&payType=1&sessionSignature=b7cee35779d9ef72095e97b32b81876e&productId=925&sessionSign=124961310302ffe84cfb3cd16bcf07c5480954374d&displayName=2008���˻ῪĻʽ', smallPic: 'images/pic_2.jpg', bigPic: 'images/pic2.jpg'},
          { url: "rtsp://172.030.080.188:554/5012^^^?&startTime=&endTime=&areaCode=&resgroupId=&userId=111111&sessionId=1581&sessionType=0&payType=1&sessionSignature=d52ca79848db933a82b7b15b1f70f48f&productId=925&sessionSign=12496130824c390862535333411bf0dfa98579660a&displayName=��Ƥ"
, smallPic: 'images/pic_3.jpg', bigPic: 'images/pic3.jpg'},
          { url: 'rtsp://172.030.080.188:554/5022^^^?&startTime=&endTime=&areaCode=&resgroupId=&userId=111111&sessionId=1623&sessionType=0&payType=1&sessionSignature=2df3f8b67ce5d0ebbc678baf084c94b1&productId=925&sessionSign=12495771291c24a47eb1f5dc34d42df0f73e46414c&displayName=�����Ų����й�-��1��&', smallPic: 'images/sjyczzg_small.jpg', bigPic: 'images/sjyczzg_big.jpg'},
          { url: 'rtsp://172.030.080.188:554/5024^^^?&startTime=&endTime=&areaCode=&resgroupId=&userId=111111&sessionId=1622&sessionType=0&payType=1&sessionSignature=bebdcc5918050972ccdd20507b698a2b&productId=925&sessionSign=124957697006c29bd430306b209154718e7dd100b7&displayName=Ұ�����������-��1��&', smallPic: 'images/yssj_small.jpg', bigPic: 'images/yssj_big.jpg'}
];
var currentPos = 0;
var outTime;

var canvas;
var control = new EffectControl();
var image1;
var image2;
var image3;
var imageEffect;

var menuFocus=1; //��ǰ�м�λ�ö�Ӧ������
var menuLength=3; //��ʾ�ĳ���
var menuSum = pic.length; 
var menuElement; //�˵�����
var midPosIndex; //xml�����м�λ�ö�Ӧ����������xml�е�λ�ã���0��ʼ
var premenuFocus; //ǰһ�������м�λ�õĲ˵�����

var menuEffectLeft; //����Ч
var menuEffectRight; //���Ҷ�Ч
var menuEffectLeftHidden; //�������ض�Ч
var menuEffectRightHidden; //�������ض�Ч
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
var menuHiddenEffect;   //��ִ�е����ض�Ч
var hiddenIndex;        //���ز˵���Ӧ������
var bigIndex;           //��һ�������м�λ�õ�����

/****  onload�м��صķ���  ****/
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
	menuEffectLeft = new Array(menuLength);//��¼�������Ч
	menuEffectRight = new Array(menuLength);//��¼���ҵ���Ч
	
	midPosIndex = Math.floor((menuLength - 1) / 2);
    //alert("midPosIndex= "+midPosIndex);
	var posOffset = 0;
	if (menuFocus != midPosIndex){
		//֤���м�λ�÷�����ƫ��
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
		//��Ч			
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
		
		//����
		if (i == midPosIndex){
			//�м����ڷŴ��			
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
	
	//����Ԫ����Ч	
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

	//menuԪ�ص���Ч
	control.beginParallel();
	for(var i=0; i< menuLength; i++){
		if(type == -1) //left
			menuElement[i].setEffect(menuEffectLeft[i]);
		else  //right
			menuElement[i].setEffect(menuEffectRight[i]);
		
		if ( bigIndex != i)
			menuElement[i].doEffect();

	}
	
	//����Ԫ�ص���Ч
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

//��Ч��Ҫ��������ͼƬ����
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
		//�м�Ŵ��
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

//ң������ֵ
//ͨ�ü�ֵ
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

//��ֵ1 
var NEXTPAGE1 = 34;	//��һҳ
var PREVPAGE1 = 33;	//��һҳ  		
var LEFT1 = 37;		//��
var RIGHT1 = 39;	//��
var UP1 = 38;		//��
var DOWN1 = 40;		//��
var ENTER1 = 13;		//ȷ��
var RETURN1 = 8;	//����
var RETURN2 = 107;	//���ء����ҵ�+ ks

//��ֵ2
var NEXTPAGE = 302;	//��һҳ
var PREVPAGE = 301;	//��һҳ
var LEFT = 271;		//��
var RIGHT = 272;	//��
var UP = 269;		//��
var DOWN = 270;		//��
var ENTER = 13;		//ȷ��

var RETURN = 283;	//����

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
//ȥ��ҳ��list�Ļƿ�
try{
	Coship.setDrawFocusRing(1);
}catch(e){
}


window.onload = function()
{
	outTime = setTimeout("init()",500);
}

function $(id)
{
	 return document.getElementById(id);
}


//0-6ң�ذ�ť����
function show(num)
{
	num = num-48;
	window.location = list[num].url;
}

//7-9ң�ذ�ť����
function remoteShow(num)
{
	var URL;
	num = num-48;
	if(num==7)
	{
		URL = pic[currentPos].url;
		//play(pic[currentPos].id);
	}
	if(num==8)
	{
		//play(pic[(currentPos+1)%pic.length].id);
		URL = pic[(currentPos+1)%pic.length].url;
	}
	if(num==9)
	{	//play(pic[(currentPos+2)%pic.length].id);
		URL = pic[(currentPos+2)%pic.length].url;
	}
	//alert(URL);
	if(URL==""||URL==null)
	return;
	
	location.href = URL;
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
	//����
function play(pmId){

 //alert(pmId);
 var UID = getGlobalVar('userId');
 var url = "/iEPG/T-nsp/Play.do?userId="+UID+"&svstype=mov&isHd=1&pmId="+pmId;
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
