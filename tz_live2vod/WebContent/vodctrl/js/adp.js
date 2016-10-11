//*************************************
function showAd()
{
	if($("adp")){
        adServiceWeb.set_adp_user_info(getIP(), getSNO()); // ip和智能卡号 
        adServiceWeb.set_adp_catalog_id(getCatalogId()); // 栏目id
		adServiceWeb.adp_request_one_ad('adp');
	}
}
function hiddenAd()
{
	if($("adp")){
		adServiceWeb.hidden_ad_and_detail("adp","display", "none");
	}
}

//显示详情（按蓝健调用）
function show_detail(){
	if($("adp") && $("adp").style.display == "block"){
		adServiceWeb.adp_jump_to_link_url("adp");
	}
}

//隐藏详情
function hidden_detail(){
	adServiceWeb.hiddenDetail();
}

//设置机顶盒ip
function setIP(stbIp)
{
    setGlobalVar("IP",stbIp);
}
//获取机顶盒ip
function getIP()
{
    return getGlobalVar("IP");
}
//设置智能卡号
function setSNO(smartId)
{
	var sno=getSmartCardId();
    setGlobalVar("SNO",sno);
}
//获取智能卡号
function getSNO()
{
    return getGlobalVar("SNO");
}
//设置栏目id
function setCatalogId(id)
{
    setGlobalVar("CATALOGID",id);
}
//获取栏目id
function getCatalogId()
{
    return getGlobalVar("CATALOGID");
}

//设置频道id
function setChannelId(id)
{
    setGlobalVar("CHANNELID",id);
}
//获取频道id
function getChannelId()
{
    return getGlobalVar("CHANNELID");
}







