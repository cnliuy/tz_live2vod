var KEY_DOWN = 40;
var KEY_UP = 38;
var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var KEY_PAGEUP = 33;
var KEY_PAGEDOWN = 34;
try{Coship.setDrawFocusRing(1);} catch (e){}
var $ = function(id) { return 'string' == typeof id ? document.getElementById(id) : id; };
var New = function(aClass, params)
{
    function _new()
    {
        this.Type = aClass;
        if (aClass.initialize)
        {
            aClass.initialize.apply(this, params);
        }
    }
    _new.prototype = aClass;
    return new _new();
}
Object.prototype.extend = function(destination, source)
{
    for (var property in source)
    {
        destination[property] = source[property];
    }
    return destination;
}
var menu =
{
    initialize: function(menuID, listID, options)
    {
        this.menuID = menuID;
        this.listID = listID;
        this.setOptions(options);
        this.mainPageSize = this.options.mainPageSize;
        this.listPageSize = this.options.listPageSize;
        this.page = 0;
        this.pageCount = 0;
        this.datas = this.options.datas;
        this.centerIndex = this.options.centerIndex;
        this.globalMenu = this.options.globalMenu;
        this.listdatas = this.datas[this.globalMenu].getElementsByTagName('list');
        if (this.datas.length < this.centerIndex)
        {
            this.globalindex = this.globalMenu;
        }
        else if ((this.globalMenu - this.centerIndex) >= 0)
        {
            this.globalindex = this.globalMenu - this.centerIndex;
        }
        else if ((this.globalMenu - this.centerIndex) < 0)
        {
            this.globalindex = (this.datas.length) - (this.centerIndex - this.globalMenu);
        }
        this.listIndex = this.options.globalList;
        this.renderMenus(this.menuID, this.globalindex, this.datas, this.mainPageSize, this.centerIndex);
    },
    setOptions: function(options)
    {
        this.options =
        {
            datas: [],
            listdatas: [],
            mainPageSize: 5,
            listPageSize: 8,
            centerIndex: 2,
            globalMenu: 0,
            globalList: 0
        }
        Object.prototype.extend(this.options, options);
    },
    rendMenu: function(menuID, globalindex, datas, pagesize)
    {
        var count = datas.length;
        var pageIndex = globalindex % pagesize;
        var all = menuID + pageIndex;
        left = count - globalindex + pageIndex;
        var rendLength = (pagesize > left) ? left : pagesize;
        for (var i = 0; i < rendLength; i++)
        {
            var rendIndex = globalindex - pageIndex + i;
            if (rendIndex < 9)
            {
                $(menuID + i).innerHTML = (('0' + (rendIndex + 1)) + " &nbsp;" + datas[rendIndex].getAttribute("title"));
            }
            else
            { $(menuID + i).innerHTML = ((rendIndex + 1) + " &nbsp;" + datas[rendIndex].getAttribute("title")); }
        }
        for (var j = rendLength; j < (pagesize); j++)
        {
            $(menuID + j).innerHTML = '';
        }
        this.setMessage(globalindex, datas);
        this.ControlPages();
        $(all).style.backgroundImage = 'url(images/list_menu_bg.png)';
    },
    renderMenus: function(emnuID, globalIndex, datas, pagesize, centerIndex)
    {
        var length = datas.length;
        if (length == 1)
        {
            for (var i = 0; i < pagesize; i++)
            {
                $(emnuID + i).innerHTML = '&nbsp;';
            }
            $(emnuID + 2).innerHTML = datas[0].getAttribute("title");
        }
        else if (length == 2)
        {
            for (var i = 0; i < pagesize; i++)
            {
                $(emnuID + i).innerHTML = '&nbsp;';
            }
            for (var i = 0; i < 2; i++)
            {
                var index = (globalIndex + i);
                if (index >= length)
                {
                    index = Math.abs(length - index);
                }
                $(emnuID + (i + 1)).innerHTML = datas[index].getAttribute("title");
            }
        }
        else if (length > centerIndex)
        {
            for (var i = 0; i < pagesize; i++)
            {
                var index = (globalIndex + i);
                if (index >= length)
                {
                    index = Math.abs(length - index);
                }
                $(emnuID + i).innerHTML = datas[index].getAttribute("title");
            }
            $(emnuID + centerIndex).cssClass = 'yellow';
        }
        this.rendMenu(this.listID, this.listIndex, this.listdatas, this.listPageSize);
    },
    moveDatas: function(type)
    {
        if (this.datas.length == 1) { return }
        this.globalindex = this.globalindex + type;
        this.globalMenu = this.globalMenu + type;

        if (this.globalindex > this.datas.length - 1) { this.globalindex = 0; }
        else if (this.globalindex < 0) { this.globalindex = this.datas.length - 1; }

        if (this.globalMenu == this.datas.length) { this.globalMenu = 0; }
        else if (this.globalMenu < 0) { this.globalMenu = this.datas.length - 1; }
        this.listdatas = this.datas[this.globalMenu].getElementsByTagName('list');
        this.displayBackGround();
        this.listIndex = 0;
        this.renderMenus(this.menuID, this.globalindex, this.datas, this.mainPageSize, this.centerIndex);
    },
    subUpDown: function(type)
    {
        this.moveFocus(type, this.listID, 'red', this.listIndex, this.listPageSize, this.listdatas);
    },
    moveFocus: function(KEY, name, backgroundImage, globalIndex, pagesize, datas)
    {
        var KEY_VALUE;
        if (KEY == 'up') { KEY_VALUE = -1; } else if (KEY == 'down') { KEY_VALUE = 1; }
        var focusWay = (KEY_VALUE < 0);
        var datacount = datas.length;
        var previousRowGlobaLIndex = globalIndex;
        globalIndex = globalIndex + KEY_VALUE;
        if (globalIndex < 0)
        {
            globalIndex = datacount - 1;
        }
        if (globalIndex == (datacount))
        {
            globalIndex = 0;
        }
        this.listIndex = globalIndex;
        var newPageIndex = globalIndex % pagesize;
        var oldPageIndex = previousRowGlobaLIndex % pagesize;
        var pageUpdate = false;
        if (focusWay)
            pageUpdate = (oldPageIndex == 0);
        else
            pageUpdate = (newPageIndex == 0);
        $(name + oldPageIndex).style.backgroundImage = '';
        if (!pageUpdate)
        {
            var allName = name + newPageIndex;
            this.setMessage(globalIndex, datas);
            $(allName).style.backgroundImage = 'url(images/list_menu_bg.png)';
        }
        else
        {
            this.rendMenu(name, this.listIndex, this.listdatas, this.listPageSize);
        }
    },
    setMessage: function(globalIndex, datas)
    {
        $('message').innerHTML = "<marquee scrollLeft='1' behavior='scroll' direction='up' scrollamount='1' scrolldelay='3' style='line-height:40px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ datas[globalIndex].firstChild.data +"</marquee> " 
        $('director').innerHTML = datas[globalIndex].getAttribute('director');
        $('title').innerHTML = datas[globalIndex].getAttribute('title');
        $('producer').innerHTML = datas[globalIndex].getAttribute('producer');
        $('popularity').innerHTML = datas[globalIndex].getAttribute('popularity');
        $('producer').innerHTML = datas[globalIndex].getAttribute('producer');
        $('pic').src = datas[globalIndex].getAttribute('pic');
    },
    ControlPages: function()
    {
        this.page = ((this.listIndex % this.listPageSize) > 1) ? parseInt(this.listIndex / this.listPageSize) : (parseInt(this.listIndex / this.listPageSize) + 1);
        if (this.listIndex == 0) { this.page = 1; }
        this.pageCount = ((this.listdatas.length % this.listPageSize) == 0) ? parseInt(this.listdatas.length / this.listPageSize) : (parseInt(this.listdatas.length / this.listPageSize) + 1);
        $('list_page').innerHTML = this.page + "/" + this.pageCount + "页  [ 上页/下页 ]翻页";
    },
    pageDownOrUp: function(type)
    {
        if (this.pageCount == 1) { return; }
        else if (this.page == this.pageCount && type == "pageDown") { return; }
        else if (this.page == 1 && type == "pageUp") { return; }
        this.displayBackGround();
        var value = (type == "pageDown") ? 1 : -1;
        this.page = this.page + value;
        if (value == 1)
            this.listIndex = this.page * (this.listPageSize - 1) - (this.listPageSize - 2);
        else if (value == -1)
            this.listIndex = this.page * (this.listPageSize - 1) - (this.listPageSize - 1);
        this.rendMenu(this.listID, this.listIndex, this.listdatas, this.listPageSize);
    },
    displayBackGround: function()
    {
        for (var i = 0; i < this.listPageSize; i++)
        {
            $(this.listID + i).style.backgroundImage = '';
        }
    }
}
var xmlHttp
var Url
function ajaxUrl(url, callbackfun)
{
    Url = url;
    xmlHttp = GetXmlHttpObject(eval(callbackfun))
    xmlHttp.open("GET", url, true)
    xmlHttp.send(null)
}
function GetXmlHttpObject(handler)
{
    var objXmlHttp = null
    if (navigator.userAgent.indexOf("MSIE") >= 0)
    {
        var strName = "Msxml2.XMLHTTP"
        if (navigator.appVersion.indexOf("MSIE 5.5") >= 0)
        {
            strName = "Microsoft.XMLHTTP"
        }
        try
        {
            objXmlHttp = new ActiveXObject(strName)
            objXmlHttp.onreadystatechange = handler
            return objXmlHttp
        }
        catch (e)
        {
            alert("Error. Scripting for ActiveX might be disabled")
            return
        }
    }
    else
    {
        objXmlHttp = new XMLHttpRequest()
        objXmlHttp.onload = handler
        objXmlHttp.onerror = handler
        return objXmlHttp
    }
}
var request =
{
    QueryString: function(val)
    {
        var uri = window.location.search;
        var re = new RegExp("" + val + "=([^&?]*)", "ig");
        return ((uri.match(re)) ? (uri.match(re)[0].substr(val.length + 1)) : null);
    }
}
var xmlFile = request.QueryString("type");
var globalmenu = request.QueryString("menuId") == null ? 0 : request.QueryString("menuId");
var listglobal = request.QueryString("listId") == null ? 0 : request.QueryString("listId");

//var globalmenu = 0;
//var listglobal = 0;
var xmlUrl = 'xml/datas' + xmlFile + '.xml';
ajaxUrl(xmlUrl, 'initNews');
var xmlroot;
var xmlLen;


function initNews()
{
    if (xmlHttp.readyState == 4 || xmlHttp.readyState == "complete")
    {
        xmlroot = xmlHttp.responseXML.getElementsByTagName("data");
        $('list_title').innerHTML = xmlroot[0].getAttribute('title');
        alertdata();
    }
}
function alertdata()
{
    var menus = xmlroot[0].getElementsByTagName("menu");
    var listdatas = menus[globalmenu].getElementsByTagName('list');
    var theater = New(menu, ['menu', 'list', { datas: menus, mainPageSize: 5, listdatas: listdatas, globalMenu: globalmenu, globalList: listglobal}]);
    document.onsystemevent = grabEvent;
    document.onirkeypress = grabEvent;
    document.onkeypress = grabEvent;
    function grabEvent(event)
    {
        var keycode = event.keyCode | event.which;
        switch (keycode)
        {
            case KEY_UP:
                theater.subUpDown('up');
                break;
            case KEY_DOWN:
                theater.subUpDown('down');
                break;
            case KEY_LEFT:
                theater.moveDatas(-1);
                break;
            case KEY_RIGHT:
                theater.moveDatas(1);
                break;
            case KEY_PAGEUP:
                theater.pageDownOrUp('pageUp');
                break;
            case KEY_PAGEDOWN:
                theater.pageDownOrUp('pageDown');
                break;
			default:			
				break;
        };
    }
}