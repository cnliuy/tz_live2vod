//*************************************
function showAd()
{
	if($("adp")){
        adServiceWeb.set_adp_user_info(getIP(), getSNO()); // ip�����ܿ��� 
        adServiceWeb.set_adp_catalog_id(getCatalogId()); // ��Ŀid
		adServiceWeb.adp_request_one_ad('adp');
	}
}
function hiddenAd()
{
	if($("adp")){
		adServiceWeb.hidden_ad_and_detail("adp","display", "none");
	}
}

//��ʾ���飨���������ã�
function show_detail(){
	if($("adp") && $("adp").style.display == "block"){
		adServiceWeb.adp_jump_to_link_url("adp");
	}
}

//��������
function hidden_detail(){
	adServiceWeb.hiddenDetail();
}

//���û�����ip
function setIP(stbIp)
{
    setGlobalVar("IP",stbIp);
}
//��ȡ������ip
function getIP()
{
    return getGlobalVar("IP");
}
//�������ܿ���
function setSNO(smartId)
{
	var sno=getSmartCardId();
    setGlobalVar("SNO",sno);
}
//��ȡ���ܿ���
function getSNO()
{
    return getGlobalVar("SNO");
}
//������Ŀid
function setCatalogId(id)
{
    setGlobalVar("CATALOGID",id);
}
//��ȡ��Ŀid
function getCatalogId()
{
    return getGlobalVar("CATALOGID");
}

//����Ƶ��id
function setChannelId(id)
{
    setGlobalVar("CHANNELID",id);
}
//��ȡƵ��id
function getChannelId()
{
    return getGlobalVar("CHANNELID");
}







