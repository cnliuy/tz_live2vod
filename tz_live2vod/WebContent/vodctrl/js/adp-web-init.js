/********************************* adp init begin *********************************/

/*******设置用户信息  start          ********/
adServiceWeb.set_adp_user_info("", getSNO()); // ip和智能卡号
/*******设置用户信息  end          ********/

adServiceWeb.set_adp_catalog_id(getCatalogId()); // 栏目id
adServiceWeb.set_adp_channel_id(getChannelId()); // 频道id

/*******设置一些请求参数  start          ********/
adServiceWeb.set_hidden_default_ad(true); // 初始化时隐藏默认广告 .true:隐藏;false:不隐藏
adServiceWeb.set_time_out(3); // 超时设定，默认3秒
/*******设置一些请求参数  end          ********/

/*******注册广告位  start          ********/
//点播暂停广告
var adp_obj_601 = adServiceWeb.adp_register_ad( 
    { 
        adp_slot_id:601, 
        adp_web_type:"1", 
        adp_marquee:"0", 
        adp_width:478, 
        adp_height:334 
    } 
); 
//回看暂停广告
var adp_obj_602 = adServiceWeb.adp_register_ad( 
    { 
        adp_slot_id:602, 
        adp_web_type:"1", 
        adp_marquee:"0", 
        adp_width:478, 
        adp_height:334 
    } 
); 
/*******注册广告位  end          ********/


/*******关联广告  start          ********/
var VODType = getGlobalVar("VODType");

// VODType == "tv"为回看节目
if(VODType == "tv")
{
	adServiceWeb.adp_relevance_ad(adp_obj_602, 'adp', "menu_1");
}
else
{
	adServiceWeb.adp_relevance_ad(adp_obj_601, 'adp', "menu_1");
}
/*******关联广告   end         ********/


/******* 切换广告间隔时间设置：默认不控制  start    *******/   //切换与menu_1关联的广告的时间设置：200ms
adServiceWeb.set_change_control_all(200); //所有广告切换的时间设置：200ms
/******* 切换广告间隔时间设置  end     *******/


/******* 广告和详情提示框设置  start  ********/
adServiceWeb.adp_set_ad_div_con("adp", "vodMidDiv");

//广告提示框设置，参数1是广告位id，参数2是提示框图片标签id
adServiceWeb.adp_set_ad_tip("adp", "vodMidTip");

//广告详情提示框设置
adServiceWeb.adp_set_detail_tip("adp", "btmRight", 100, 32, "images/red-close.png", "");
/******* 广告和详情提示框设置  end ********/
/********************************* adp init end *********************************/

//智能卡号自动适配接口
var getSmartCardID = function () {
	// 自动适配接口（根据不同浏览器添加）
	// OpenClound_V100R001（版本:V1.2.1）
	if (typeof(SuanTongSmcInfo) !== "undefined") {
		if (typeof(SuanTongSmcInfo.number) !== "undefined") {
			return SuanTongSmcInfo.number;
		}
	}
	// 天威视讯（TW/TD-TS-200900x）
	if (typeof(Utility) !== "undefined") {
		if (typeof(Utility.getSystemInfo) == "function") {
			return Utility.getSystemInfo("SID");
		}
	}
	return;
}

//获取网络IP地址
var getNetworkIPAddress = function () {
	// 自动适配接口（根据不同浏览器添加）
	// OpenClound_V100R001（版本:V1.2.1）
	if (typeof(Network) !== "undefined") {
		if (typeof(Network.ethernets) !== "undefined") {
			if (typeof(Network.ethernets.MACAddress)) {
				return Network.ethernets[0].IPs[0];
			}
		}
	}
	// 天威视讯（TW/TD-TS-200900x）
	if (typeof(Network) !== "undefined") {
		if (typeof(Network.getEthMacAddress) == "function") {
			// 返回的是JSON字符串
			var sJson = Network.getEthMacAddress();
			var jsonData = eval('(' + sJson + ')');
			if (jsonData.length > 0) {
				return jsonData[0].mac;
			}
		}
	}
	
	return;
}
