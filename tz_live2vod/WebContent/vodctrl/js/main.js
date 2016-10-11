Utility.setDrawFocusRing(0);
var mp = new MediaPlayer();
var timeControl;
var rtsp;
var voice;
var backurl;
var currentStatus = -1;
var speedAction = 0; //check out whether fast move, 1:fast move forward;-1:fast move rewind
var delaytimer;
var seconds = 0;
var isZeroDuration = false;
var isTCTimerExist = false;
var checkTimer=-1;
var maxSpeed = 32;
var isShowPosition = 0;
var needResetTimeControl = true;
var speed = 0;
var videoEndTime = 0;
var execCount = 0;
var isInitOver = false;
var isStop = true;
var isMove = false;
var isFastMove=true;
var fastTimer;
var isFastTimerExist;
var resourceId = getGlobalVar("resourceId");
var programId = getGlobalVar("programId");

function initPage() {
    setSmartCardId();
    rtsp = decodeURIComponent(getGlobalVar("vod_ctrl_rtsp"));
    if (rtsp == "") gotoHref(1, "100001");
    backurl = getGlobalVar("vod_ctrl_backurl");
    setDisplay(false, false);
    setDisplay_loc(0);
    if (!isCancelQuit()) {
		setGlobalVar("nativePlayerInstanceId", mp.getNativePlayerInstanceId());
        playVedioInit(rtsp); //first play
    } else {
        var nativePlayerInstanceId = getGlobalVar("nativePlayerInstanceId");
        mp.bindNativePlayerInstance(nativePlayerInstanceId);
    }
    delaytimer = setTimeout("init()", 3000); // move to 768 event
}
function checkTimerControl() {
    if (speedAction == 0)
        seconds++;
    if (needResetTimeControl) resetTimerControl();
    if (seconds > 10) {
        var showStatusImg = false;
        if (isPause()) showStatusImg = true;
        setDisplay(false, showStatusImg); // the status image still exist when status is pause.
    }
}
var startTimeOffset = 0;
function getAllTime() {
    var vod_play_type = getGlobalVar("vod_play_type"); //is only view a few seconds.
    //if (vod_play_type == "1") {
    //    var totalTime = getGlobalVar("vod_play_totalTime");
    //     if (totalTime != null && totalTime != "") videoEndTime = parseInt(totalTime, 10);
    //    else videoEndTime = getIntValue(getQueryStr("endTime", rtsp));  // seconds
    //     startTimeOffset = getIntValue(getQueryStr("startTime", rtsp));
    // } else
    videoEndTime = getIntValue(mp.getMediaDuration());  // seconds
    if (isNaN(videoEndTime)) videoEndTime = 0;
    if (!isNaN(videoEndTime)) getMoveParams();
    if (videoEndTime <= 0) isZeroDuration = true;
}
function init() {
    
    var ip=getGlobalVar("ip");
   // var sno=getGlobalVar("sno");
    var catalogId=getGlobalVar("catalogId");
    var channelId=getGlobalVar("channelId");
    setIP(ip);setSNO(sno);
    var VODType=getGlobalVar("VODType");
    if(VODType=="tv"){
        setChannelId(channelId);
    }else{
        setCatalogId(catalogId);
    }
    //==========================end========================
    var isFromCancel = isCancelQuit();
    getAllTime();
    var startTimeFromVedio = mp.getCurrentPlayTime(); //getIntValue(getQueryStr("startTime", rtsp));  // startTime's format is yyyymmddhhmmss from other program , but it is seconds from vod play
    if (startTimeFromVedio > videoEndTime) startTimeFromVedio = 0;
    initTimeControl(0, videoEndTime, startTimeFromVedio); //set time control
    initVoiceControl(); //set voice control
	var disName = decodeURIComponent(getGlobalVar("displayName"));
    $("play_program").innerText = subText(disName,40,0);
    setProgrammeInfo(convertToShowTime(timeControl.allTimes)); //set other information
    if (isFromCancel) { //from other page return
        currentStatus = getIntValue(getQueryStr("currentStatus", LocString));
        initPlayTime = getIntValue(getQueryStr("initPlayTime", LocString));
        setStatusImg(currentStatus);
        resetTimerControl();
    } else {
        setStatusImg(0); //set play status
        execCount++;
        if (execCount >= 2) stopCount();
    }
    clearTimeout(delaytimer);
    isInitOver = true;
    if(rtsp.indexOf("^^^") > 0){
        AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtsp)+"\",\"E2\",\"0\",\"E3\",\"0\",\"E4\",\""+mp.getCurrentPlayTime()+"\",\"E5\",\"1\",\"D1\",\"0003\",\"D2\",\""+encodeURI(decodeURIComponent(getGlobalVar("displayName")))+"\",\"D3\",\"0\",\"T\",\"V\"]}");
    }else{
        AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtsp)+"\",\"E2\",\"0\",\"E3\",\"0\",\"E4\",\""+mp.getCurrentPlayTime()+"\",\"E5\",\"1\",\"D1\",\"0002\",\"D2\",\""+encodeURI(decodeURIComponent(getGlobalVar("displayName")))+"\",\"D3\",\"0\",\"T\",\"V\"]}");
    }

    setInterval('checkAD()',1000);
}
function initTimeControl(bTime, eTime, sTime) {
    timeControl = new TimeControl(265, 690);
    timeControl.init($("main"), bTime, eTime, parseInt(sTime, 10));
    setPlayTime(timeControl.showTime);
}
function initVoiceControl() {
    var defaultVoice = mp.getVolume();
    voice = new Voices(343, 600, 0);
    var realVoice = 0;
    if (!isNaN(defaultVoice)) realVoice = defaultVoice;//Math.round(parseInt(defaultVoice, 10) * voice.maxVoice / 100);
    voice.currentVoice = realVoice;
    voice.currentLen = voice.setVoiceLen(realVoice);
    voice.init($("dv_voice"));
}
function resetTimerControl() {//only set time control and play time display
    if (initPlayTime == -1) return;
    if (videoEndTime <= 0) {
        getAllTime();
        timeControl.resetEndTime(0, videoEndTime);
        setProgrammeInfo(convertToShowTime(timeControl.allTimes));
    }
    var currentPT = mp.getCurrentPlayTime();
    if (isNaN(currentPT) || parseInt(currentPT, 10) < 0) { //this time always must be a plus int.
        //setGlobalVar("reasonCode", currentPT);
        //gotoHref(1, "100003");
        return;
    }

    var disTimes = parseInt(currentPT, 10) - startTimeOffset;  //+ initPlayTime;
    timeControl.resetTC(Math.max(disTimes, 0));
    setPlayTime(timeControl.showTime);
    $("txtInput").focus();
}
function setTimerControl() {//show time control and reset time
    resetTimerControl();
    setDisplay(true, true);
}
function stopCount() {
    if (cControl != null) cControl.stopTimer();
    setDisplay(true, true);
}
/*************************** page init start *******************************/
function setPlayTime(playTime) { $("play_time").innerText = playTime; }
function setProgrammeInfo(eTime) { $("end_time").innerText = eTime; }
function setStatusImg(status) {
    var src = getStatusImgSrc(status);
    var speedStr = "";
    if (status == 1) {
        needResetTimeControl = false;
        isMove = true;
        setPauseTimer(true);
    }else if (status == 3 || status == 4) { speedStr = speed + "X"; isFastMove=false;}
    if (src != "") $("imgStatus").src = src;
    $("g_speed").innerText = speedStr;
    currentStatus = status;
}
function setDisplay(show, imgShow) {//set time control and status image display
    if (show) {
        displayTrack(0);
        voice.voiceDisplay(false);
        $("main").style.visibility = "visible";
    } else { $("main").style.visibility = "hidden"; }
    if (imgShow) {
        $("g_button").style.visibility = "visible";
        $("g_speed").style.visibility = "visible";
    } else {
        $("g_button").style.visibility = "hidden";
        $("g_speed").style.visibility = "hidden";
    }
    if (show && imgShow && !isTCTimerExist) {
       if(checkTimer==-1){
        checkTimer = setInterval("checkTimerControl();", 1000);
        }
        isTCTimerExist = true;
    }
    if (!show && isTCTimerExist) {
        //clearInterval(checkTimer);
        isTCTimerExist = false;
    }
}
/*************************** page init end *******************************/
//check time control whether show
function getDisplay() { return ($("main").style.visibility != "hidden"); }
function isPause() { return (currentStatus == 1); }
function isPlay() { return (currentStatus == 0); }
/*************************** position control start *******************************/
//check position control if show
function getDisplay_loc() { return ($("input_box").style.visibility != "hidden"); }
//set position control display, 1=show, 0=hidden
function setDisplay_loc(isdisplay) {
    if (isdisplay == 1) {
        pSeconds = 0;
        $("input_box").style.visibility = "visible";
        setTimerControl();
        $("txtInput").focus();
        checkPos = setInterval("checkPosition()", 1000);
    } else {
        $("input_box").style.visibility = "hidden";
        $("txtInput").blur();
        setPostionTipDisplay(false, -1);
        isShowPosition = 0;
        clearInterval(checkPos);
    }
}
var pSeconds = 0;
var checkPos;
function checkPosition() {
    pSeconds++;
    if (pSeconds > 15) { setDisplay_loc(0); clearInterval(checkPos); }
}
function setPostionTipDisplay(isdisplay, type) {
    var str = "";
    switch (type) {
        case 0:
            str = "%E8%BE%93%E5%85%A5%E6%97%B6%E9%97%B4%E6%AF%94%E6%80%BB%E6%97%B6%E9%97%B4%E9%95%BF"; //the input time is longer than all time
            break;
        case 1:
            str = "%E8%BE%93%E5%85%A5%E6%97%B6%E9%97%B4%E6%97%A0%E6%95%88"; // the input time is invalidate
            break;
    }
    if (str != "") $("locationTip").innerText = decodeURIComponent(str);
    if (isdisplay && getDisplay_loc()) $("locationTip").style.visibility = "visible";
    else $("locationTip").style.visibility = "hidden";
}
/*************************** media play start *******************************/
var initPlayTime = -1;
var adtime=0;
var showAdtime=0;
var checkstatusTimer;
//var show_Count_t=0;
function playVedioInit(mediaStr) {
    var areaCode = Utility.getSystemInfo("ARC");
    //var areaCode = "121";
    if (areaCode == null || areaCode == "" || isNaN(areaCode) || parseInt(areaCode, 10) < 0) { setGlobalVar("reasonCode", areaCode); gotoHref(1, "100005"); }
    mediaStr = mediaStr.replaceQueryStr(areaCode, "areaCode");
    initPlayTime = 0; //getIntValue(getQueryStr("startTime", rtsp));
    mp.setAllowTrickmodeFlag(0);
    mp.setSingleMedia(mediaStr);
    mp.setCurrentAudioChannel("Stereo"); //set channel to Stereo when start
    mp.playFromStart();
    clearTimeout(checkstatusTimer);
   /* checkstatusTimer = setInterval(function(){
        startShowList();
    },1000);*/
}

/*function startShowList(){
    if(currentStatus == 4 && mp.getCurrentPlayTime() < fewindAdtime+speed){
        currentStatus=0;
        isMove = false;
        isFastMove=true;
        setDisplay(false, false);
        speedAction = 0;
        speed = 0;
        setStatusImg(0);
       // mp.resume();
        mp.playByTime(1, 1 + fewindAdtime+"", 0);
    }
}*/

var Ad_timeFlag=false;
var playAdFlag = false;
function checkAD(){
    var disTimes = mp.getCurrentPlayTime();
//  $('p_msg').innerHTML=disTimes +'=====';
    var adJSON = getGlobalVar("adJSON") || {};
    adJSON = JSON.parse(adJSON);
    var adLength=adJSON.length;
    for (var i = 0; i < adLength; i++) {
        if(adJSON[i].v == 0 && i!=adLength-1){
			if (disTimes > parseInt(adJSON[i].s, 10) & disTimes < parseInt(adJSON[i].e, 10)) {
				if(i==adLength-1) Ad_timeFlag=true;
				show_Count(parseInt(adJSON[i].e, 10));
				break;
			}
      	}else {
            clear_Count();
        }
    }

	for (var i = 0; i < adLength; i++) {
        if(adJSON[i].v == 0){
			if (disTimes > parseInt(adJSON[i].s, 10) & disTimes < parseInt(adJSON[i].e, 10)) {
				playAdFlag = true;
				break;
			}
      	}else{
			playAdFlag = false;
		}
    }
}

//当前播放时间减去广告时间，供拉回时传给OTT当前播放时间使用
function subtractAdTime(){
	var disTimes = parseInt(mp.getCurrentPlayTime(), 10);
    var adJSON = getGlobalVar("adJSON") || {};
    adJSON = JSON.parse(adJSON);
    var adLength=adJSON.length;
	var totleCount = 0;
    for (var i = 0; i < adLength; i++) {
        if(adJSON[i].v == 0 && i!=adLength-1){
			if(disTimes >=  parseInt(adJSON[i].e, 10)){
				totleCount = totleCount + (parseInt(adJSON[i].e, 10) - parseInt(adJSON[i].s, 10));
			}else if (disTimes > parseInt(adJSON[i].s, 10) & disTimes < parseInt(adJSON[i].e, 10)) {
				totleCount = totleCount + (disTimes - parseInt(adJSON[i].s, 10));
				break;
			}
      	}
    }
	return totleCount;
}

function clear_Count()
{
    $("adtime").style.visibility = "hidden";
    $("ad_tip").style.visibility = "hidden";
    $("ad_tiptwo").style.visibility = "hidden";
    Ad_timeFlag=false;
}

//var timeFlag=1;
var fewindAdtime;
var fewindFlag=0;
function show_Count(_adtime)
{
    showAdtime=_adtime;
    if(fewindFlag==0){
        fewindAdtime=showAdtime;
        fewindFlag+=1;
    }
    showAdtime=showAdtime-mp.getCurrentPlayTime();
//    $('p_msg').innerHTML=showAdtime+'==='+mp.getCurrentPlayTime();
    if(showAdtime<=0){
        clear_Count();
    }else {
        $("adtime").style.visibility = "visible";
        if(showAdtime<=5){
            if(!Ad_timeFlag){
                $("ad_tip").style.visibility = "hidden";
                $("ad_tiptwo").style.visibility = "visible";
            }else{
                $("ad_tip").style.visibility = "visible";
                $("ad_showtime").innerHTML=showAdtime;
            }
        }else{
            $("ad_tip").style.visibility = "visible";
            $("ad_showtime").innerHTML=showAdtime;
        }
    }
}
function mpPlay() {//playTime : second
    if (speedAction != 0) {mp.resume();if(rtsp.indexOf("^^^")>0){AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtsp)+"\",\"E2\",\"0\",\"E3\",\"0\",\"E4\",\""+mp.getCurrentPlayTime()+"\",\"E5\",\"2\",\"D1\",\"0003\",\"D2\",\""+encodeURI(decodeURIComponent(getGlobalVar("displayName")))+"\",\"D3\",\"0\",\"T\",\"V\"]}");}else{AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtsp)+"\",\"E2\",\"0\",\"E3\",\"0\",\"E4\",\""+mp.getCurrentPlayTime()+"\",\"E5\",\"2\",\"D1\",\"0002\",\"D2\",\""+encodeURI(decodeURIComponent(getGlobalVar("displayName")))+"\",\"D3\",\"0\",\"T\",\"V\"]}");}}     //fast move resume
    else {
        var timeDis = timeControl.currentTimes + startTimeOffset; // - initPlayTime ;
        mp.playByTime(1, timeDis + "", 0);
    }
}
/************************* voice start *******************************/
function doVoice(val, e) {
    e.preventDefault();
    resetStatic(0);
    voice.voiceSeconds = 0;
    voice.voiceDisplay(true);
    if (val == KEY_VOICEUP || val == REWIND_KEY) type = -1;
    else type = 1;
    voice.UpDown(type);
    //mp.setVolume(parseInt(100 * voice.currentVoice / voice.maxVoice, 10));
    mp.setVolume(parseInt(voice.currentVoice, 10)); 
}
function checkVoiceControl() {
    voice.voiceSeconds++;
    if (voice.voiceSeconds > 5) voice.voiceDisplay(false);
}
/************************* action start ********************************/
function move(type) {
    timeControl.UpDown(type);
    setPlayTime(timeControl.showTime);
    if(rtsp.indexOf("^^^") > 0){
        AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtsp)+"\",\"E2\",\"0\",\"E3\",\"0\",\"E4\",\""+mp.getCurrentPlayTime()+"\",\"E5\",\"5\",\"D1\",\"0003\",\"D2\",\""+encodeURI(decodeURIComponent(getGlobalVar("displayName")))+"\",\"D3\",\"0\",\"T\",\"V\"]}");
    }else{
        AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtsp)+"\",\"E2\",\"0\",\"E3\",\"0\",\"E4\",\""+mp.getCurrentPlayTime()+"\",\"E5\",\"5\",\"D1\",\"0002\",\"D2\",\""+encodeURI(decodeURIComponent(getGlobalVar("displayName")))+"\",\"D3\",\"0\",\"T\",\"V\"]}");
    }
}
function fastmove(val) {
    setDisplay(true, true); // the time control is show when fast move
    if (speed >= maxSpeed && val == FAST_FORWARD_KEY && speedAction == 1)  speed = 0;
    else if (speed >= maxSpeed && val == FAST_REWIND_KEY && speedAction == -1)  speed = 0;
    if ((val == FAST_FORWARD_KEY && speedAction == -1) || (val == FAST_REWIND_KEY && speedAction == 1))  speed = 0;
    if (speed == 0)  speed = 4;  else   speed *= 2;
    if (val == FAST_FORWARD_KEY) {
        speedAction = 1;
        setStatusImg(3);
        mp.fastForward(speed);
        if(rtsp.indexOf("^^^") > 0){
            AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtsp)+"\",\"E2\",\"0\",\"E3\",\"0\",\"E4\",\""+mp.getCurrentPlayTime()+"\",\"E5\",\"3\",\"D1\",\"0003\",\"D2\",\""+encodeURI(decodeURIComponent(getGlobalVar("displayName")))+"\",\"D3\",\"0\",\"T\",\"V\"]}");
        }else{
            AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtsp)+"\",\"E2\",\"0\",\"E3\",\"0\",\"E4\",\""+mp.getCurrentPlayTime()+"\",\"E5\",\"3\",\"D1\",\"0002\",\"D2\",\""+encodeURI(decodeURIComponent(getGlobalVar("displayName")))+"\",\"D3\",\"0\",\"T\",\"V\"]}");
        }

    } else {
        speedAction = -1;
        setStatusImg(4);
        mp.fastRewind(-speed);
        if(rtsp.indexOf("^^^") > 0){
            AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtsp)+"\",\"E2\",\"0\",\"E3\",\"0\",\"E4\",\""+mp.getCurrentPlayTime()+"\",\"E5\",\"4\",\"D1\",\"0003\",\"D2\",\""+encodeURI(decodeURIComponent(getGlobalVar("displayName")))+"\",\"D3\",\"0\",\"T\",\"V\"]}");
        }else{
            AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtsp)+"\",\"E2\",\"0\",\"E3\",\"0\",\"E4\",\""+mp.getCurrentPlayTime()+"\",\"E5\",\"4\",\"D1\",\"0002\",\"D2\",\""+encodeURI(decodeURIComponent(getGlobalVar("displayName")))+"\",\"D3\",\"0\",\"T\",\"V\"]}");
        }
       // if (speedAction != 0 && !isFastTimerExist && startTimeOffset != 0) { //random preplay need to know current play time
            fastTimer = setInterval("checkFastRewind();", 500);
            isFastTimerExist = true;
      //  }
    }
    isMove = true;
}
function checkFastRewind() {
    var currentPT = mp.getCurrentPlayTime();
    if (isNaN(currentPT) || parseInt(currentPT, 10) < 0 || currentStatus != 4) {
        stopfastTimer();
        return;
    }
    var disTimes = parseInt(currentPT, 10) - startTimeOffset;
    if (disTimes <= 0) {
        stopfastTimer();
        beginReplay();
    }
    if(currentStatus == 4 && mp.getCurrentPlayTime() < fewindAdtime+speed){
        stopfastTimer();
        currentStatus=0;
        isMove = false;
        isFastMove=true;
        setDisplay(false, false);
        speedAction = 0;
        speed = 0;
        setStatusImg(0);
        // mp.resume();
        mp.playByTime(1, 2 + fewindAdtime+"", 0);
    }
}
function stopfastTimer() {
    clearInterval(fastTimer);
    isFastTimerExist = false;
}
function enterAction(val) {
    if (getDisplay_loc()) {
        var txtTime = $("txtInput").value.trim();
        if (txtTime == "" || txtTime == null) { setDisplay_loc(0); return; }
        if (isNaN(txtTime)) { setPostionTipDisplay(true, 1); return; }
        var time = getIntValue(txtTime) * 60;
        if (time - timeControl.allTimes > 0) {
            setPostionTipDisplay(true, 0);
        } else {
            timeControl.resetTC(time);
            setPlayTime(timeControl.showTime);
            setDisplay_loc(0);
            mpPlay();
            setStatusImg(0);
        }
        $("txtInput").focus();
    }
    else if (!getDisplay() && isPlay()) {	//when time control not display and in play status, show time control
        if (speedAction != 0) {
            mp.resume();
            setStatusImg(0);
            if(rtsp.indexOf("^^^") > 0){
                AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtsp)+"\",\"E2\",\"0\",\"E3\",\"0\",\"E4\",\""+mp.getCurrentPlayTime()+"\",\"E5\",\"2\",\"D1\",\"0003\",\"D2\",\""+encodeURI(decodeURIComponent(getGlobalVar("displayName")))+"\",\"D3\",\"0\",\"T\",\"V\"]}");
            }else{
                AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtsp)+"\",\"E2\",\"0\",\"E3\",\"0\",\"E4\",\""+mp.getCurrentPlayTime()+"\",\"E5\",\"2\",\"D1\",\"0002\",\"D2\",\""+encodeURI(decodeURIComponent(getGlobalVar("displayName")))+"\",\"D3\",\"0\",\"T\",\"V\"]}");
            }

        }
        setTimerControl();
    } else { //when time control display or not in play status, display and reset time control
        setDisplay(false, false);
        if (isPause()) {
            if (val == PLAY_KEY) {
                if(rtsp.indexOf("^^^") > 0){
                    AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtsp)+"\",\"E2\",\"0\",\"E3\",\"0\",\"E4\",\""+mp.getCurrentPlayTime()+"\",\"E5\",\"2\",\"D1\",\"0003\",\"D2\",\""+encodeURI(decodeURIComponent(getGlobalVar("displayName")))+"\",\"D3\",\"0\",\"T\",\"V\"]}");
                }else{
                    AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtsp)+"\",\"E2\",\"0\",\"E3\",\"0\",\"E4\",\""+mp.getCurrentPlayTime()+"\",\"E5\",\"2\",\"D1\",\"0002\",\"D2\",\""+encodeURI(decodeURIComponent(getGlobalVar("displayName")))+"\",\"D3\",\"0\",\"T\",\"V\"]}");
                }
                mp.resume();
            }else {mpPlay();}
        } else {
            if (isMove) mpPlay(); //play by the time of user choice
        }
        isMove = false;
        isFastMove = true;
        setStatusImg(0);
    }
}
var trackSeconds = 0;
var trackTimeout;
function resetTrack() {
    if (!isPlay()) return; // when is play status
    trackSeconds = 0;
    setDisplay(false, false); // the time control hidden and the status image hidden
    var obj = $("g_track");
    if (obj.style.visibility != "hidden") {
        mp.switchAudioChannel();
    } else {
        obj.style.visibility = "visible";
        if (trackTimeout != null) clearInterval(trackTimeout);
        trackTimeout = setInterval("countTrack()", 1000);
    }
    var trackStr = mp.getCurrentAudioChannel();
    obj.innerText = getTrackStr(trackStr);
}
function countTrack() {
    if (trackSeconds > 5) {
        trackSeconds = 0;
        $("g_track").style.visibility = "hidden";
        clearInterval(trackTimeout);
    } else {
        trackSeconds++;
    }
}

function displayTrack(isPlay) {
    if (isPlay != 0 && _currentDisplayMode != 0 && _currentDisplayMode != isPlay) { removeTrack(); }
    if (isPlay == 1) resetTrack();
    else if (isPlay == 2) resetScreenMatchMode();
    else removeTrack();
    _currentDisplayMode = isPlay;
}
function removeTrack() {
    trackSeconds = 6;
    countTrack();
}
var _currentMatchMode = 0;
var _currentDisplayMode = 0;
function resetScreenMatchMode() {//setScreenMatchMode
    trackSeconds = 0;
    setDisplay(false, false); // the time control hidden and the status image hidden
    var obj = $("g_track");
    if (obj.style.visibility != "hidden") {
        _currentMatchMode = ++_currentMatchMode % 3;
        mp.setMatchMode(_currentMatchMode);
    } else {
        obj.style.visibility = "visible";
        if (trackTimeout != null) clearInterval(trackTimeout);
        trackTimeout = setInterval("countTrack()", 1000);
    }
    _currentMatchMode = parseInt(mp.getMatchMode(), 10);
    obj.innerText = getMatchModeStr(_currentMatchMode);
}
function initStatic() {//static
    var obj = $("g_static");
    var muteFlag = parseInt(mp.getMuteFlag(), 10);
    if (muteFlag == 1) obj.style.visibility = "visible"; // static
    else obj.style.visibility = "hidden"; // voice
}
function resetStatic(muteFlag) {
    if (muteFlag == null) {
        muteFlag = parseInt(mp.getMuteFlag(), 10);
        muteFlag = (++muteFlag) % 2;
    }
    mp.setMuteFlag(muteFlag);
    initStatic();
}

function getEndPlayTimeParmeter() {//getEndPlayTimeParmeter
    var cPlayTime = mp.getCurrentPlayTime();
    var endPlayTime = initPlayTime; //getIntValue(getQueryStr("startTime", rtsp));
    if (!isNaN(cPlayTime)) endPlayTime += parseInt(cPlayTime, 10);
    if (videoEndTime == 0) getAllTime(); //maybe = 0 when quickly click keys from othe page return
    var VODType=getGlobalVar("VODType");
    if(VODType=="tv"){
        return "&endPlayTime=" + endPlayTime;
    }else{
    /***********???????��????????????????***********/
        //?????????��??????????��???��???
    var breakTime=0;
    var newbreakTime="";
    var videoList=getGlobalVar("videoList");//The acquisition of the original playlist
    var Json=getGlobalVar("video");//Get a new playlist
    var Videos=JSON.parse(videoList);
    var videoJson=JSON.parse(Json);
    for(i=0;i<Videos.length;i++)
    {
        if(endPlayTime>=videoJson[i].s&&endPlayTime<=videoJson[i].e && videoJson[i].v==1)
        {
            var newtime=+videoJson[i].e-endPlayTime;
            var breakTime=+Videos[i].e-newtime;
        }
        if(endPlayTime>=videoJson[i].s && endPlayTime<=videoJson[i].e && videoJson[i].v==0 )
        {
            if(i==0 && videoJson[i].v==0)
            {
                breakTime=0;
            }
            if(i>0 && videoJson[i].v==1)
            {
                breakTime=+Videos[i-1].e;
            }
        }
    }
    if(breakTime==0) breakTime=newbreakTime;
    // if (timeControl.allTimes - endPlayTime ) //no break point return when end play time less than 5 minutes to the end.
    if (isPause()) return "&endPlayTime=" + endPlayTime;
    else  return  "&endPlayTime=" + breakTime;
    //return "";
    }
}
var perStepLen = 0;      //per step len, default len
var move_default = 10;
var move_maxlen = -1;    //max len when continue press key, -1: no limit
var move_count = 1;      //continue count
var move_addLen = 0;
function getPerMoveLen() {
    //move_addLen = 0; //(move_count - 1) * move_default;     //increase len when continue press key
    if (move_addLen == 0) return;
    if (move_maxlen > 0 && perStepLen >= move_maxlen) return;
    if (move_count > 1) perStepLen += move_addLen;
    else perStepLen = move_default;
    if (move_maxlen > 0 && perStepLen > move_maxlen) perStepLen = move_maxlen;
}
function getMoveParams() {
    move_default = Math.round(videoEndTime * 0.005);
    move_maxlen = Math.round(videoEndTime * 0.04);
    move_addLen = Math.round(videoEndTime * 0.02);
    perStepLen = move_default;
}

function grabDown(e) {
   // Utility.prinln('!isInitOver=='+!isInitOver);
   // $('p_msg').innerHTML='!isInitOver=='+!isInitOver;
    var FAST_FORWARD_KEY = 3874;
    var FAST_REWIND_KEY = 3873;
    var PAUSE_KEY = 3864;
    var KEY_POSITION = 3880;
    var FORWARD_KEY = 39;
    var REWIND_KEY = 37;
    if (!isInitOver) { e.preventDefault(); return false; } // when init not over, every key doesn't work
    setPostionTipDisplay(false, -1);
    seconds = 0; // time control hidden seconds
    needResetTimeControl = true;
    var val = e.which || e.keyCode;
    var cPlayTime = mp.getCurrentPlayTime();
    var endPlayTime = initPlayTime; //getIntValue(getQueryStr("startTime", rtsp));
    if (!isNaN(cPlayTime)) endPlayTime += parseInt(cPlayTime, 10);
    var Json=getGlobalVar("video");//get new playList
    var videoJson=JSON.parse(Json);//playList bar
    for(var i = 0; i < videoJson.length; i++) {
        if (endPlayTime >= videoJson[i].s && endPlayTime <= videoJson[i].e) {
            if (videoJson[i].t.indexOf("F") >= 0) {
                 FAST_FORWARD_KEY = 0000;
            } else {
                 FAST_FORWARD_KEY = 3874;
            }
            if (videoJson[i].t.indexOf("R") >= 0) {
                 FAST_REWIND_KEY = 0000;
            } else {
                 FAST_REWIND_KEY = 3873;
            }
            if (videoJson[i].t.indexOf("P") >= 0) {
                 PAUSE_KEY = 0000;
            } else {
                 PAUSE_KEY = 3864;
            }
            if (videoJson[i].t.indexOf("D") >= 0) {
                KEY_POSITION = 0000;
                if (getDisplay()) {
                     FORWARD_KEY = 0000;
                    REWIND_KEY = 0000;
                } else {
                     FORWARD_KEY = 39;
                    REWIND_KEY =37;
                }
            } else {
                 KEY_POSITION = 3880;
                FORWARD_KEY = 39;
                REWIND_KEY = 37;
            }
        }
    }
    if ((val != FAST_FORWARD_KEY || val != FAST_REWIND_KEY ) && speedAction==0 ) speed = 0;
    var type;
    // Utility.prinln('val=='+val);
    switch (val) {
        case KEY_VOICEUP:
        case KEY_VOICEDOWN:
            //if (getDisplay_loc()) return; //can't move time controler when position appear
            setDisplay_loc(0);
            setDisplay(false, false); //set all to invisible when click on voice key +-
            //if (!getDisplay()){
            if (!voice.isVoiceDisplay()) {
                e.preventDefault();
                voice.voiceDisplay(true);
                //hiddenAd();
            } else { doVoice(val, e); }
            //}
            break;
        case FORWARD_KEY:
        case REWIND_KEY:
            if (isZeroDuration) return;
            if (getDisplay_loc()) return; //can't move time controler when position appear
            if (getDisplay()) {
                if(isFastMove){
					getPerMoveLen();
					needResetTimeControl = false;
					if (val == FORWARD_KEY) {
						type = perStepLen;
						//setStatusImg(5);
					} else {
						type = -perStepLen;
						//setStatusImg(6);
					}
					move(type);
					//hiddenAd();
					move_count++;
					isMove = true;
				}
            } else {
                e.preventDefault();
                doVoice(val, e);
                //setTimerControl(); //09.11.09,  show time control when left or right key click
            }
            break;
        case FAST_FORWARD_KEY:
        case FAST_REWIND_KEY:
            if (isZeroDuration) return;
            fastmove(val);
            //hiddenAd();
            break;
        case PAUSE_KEY:
            setTimerControl();
            if (isZeroDuration) return;
            if(speedAction !=0){
                setStatusImg(0);
                mp.resume();
                if(rtsp.indexOf("^^^") > 0){
                    AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtsp)+"\",\"E2\",\"0\",\"E3\",\"0\",\"E4\",\""+mp.getCurrentPlayTime()+"\",\"E5\",\"2\",\"D1\",\"0003\",\"D2\",\""+encodeURI(decodeURIComponent(getGlobalVar("displayName")))+"\",\"D3\",\"0\",\"T\",\"V\"]}");
                }else{
                    AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtsp)+"\",\"E2\",\"0\",\"E3\",\"0\",\"E4\",\""+mp.getCurrentPlayTime()+"\",\"E5\",\"2\",\"D1\",\"0002\",\"D2\",\""+encodeURI(decodeURIComponent(getGlobalVar("displayName")))+"\",\"D3\",\"0\",\"T\",\"V\"]}");
                }

                writeTime();
                hiddenAd();//??????
                isMove = false;
                isFastMove=true;
            }else{
                if (!isPause()) {
                    //1.pause
                    setStatusImg(1);
                    mp.pause();
                    if(rtsp.indexOf("^^^") > 0){
                        AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtsp)+"\",\"E2\",\"0\",\"E3\",\"0\",\"E4\",\""+mp.getCurrentPlayTime()+"\",\"E5\",\"6\",\"D1\",\"0003\",\"D2\",\""+encodeURI(decodeURIComponent(getGlobalVar("displayName")))+"\",\"D3\",\"0\",\"T\",\"V\"]}");
                    }else{
                        AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtsp)+"\",\"E2\",\"0\",\"E3\",\"0\",\"E4\",\""+mp.getCurrentPlayTime()+"\",\"E5\",\"6\",\"D1\",\"0002\",\"D2\",\""+encodeURI(decodeURIComponent(getGlobalVar("displayName")))+"\",\"D3\",\"0\",\"T\",\"V\"]}");
                    }

                    keepTime();
                    showAd();//??????
                } else {
                    //2.resume
                    setStatusImg(0);
                    mp.resume();
                    if(rtsp.indexOf("^^^") > 0){
                        AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtsp)+"\",\"E2\",\"0\",\"E3\",\"0\",\"E4\",\""+mp.getCurrentPlayTime()+"\",\"E5\",\"2\",\"D1\",\"0003\",\"D2\",\""+encodeURI(decodeURIComponent(getGlobalVar("displayName")))+"\",\"D3\",\"0\",\"T\",\"V\"]}");
                    }else{
                        AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtsp)+"\",\"E2\",\"0\",\"E3\",\"0\",\"E4\",\""+mp.getCurrentPlayTime()+"\",\"E5\",\"2\",\"D1\",\"0002\",\"D2\",\""+encodeURI(decodeURIComponent(getGlobalVar("displayName")))+"\",\"D3\",\"0\",\"T\",\"V\"]}");
                    }

                    isMove = false;
                    isFastMove=true;
                    writeTime();
                    hiddenAd();//??????
                    //adServiceWeb.adp_request_one_ad('adp');
                }
            }
            break;
        case PLAY_KEY:
        case ENTER_KEY:
            if (voice.isVoiceDisplay()) voice.voiceDisplay(false);
            else {
                if (isZeroDuration) return;
                enterAction(val);
                writeTime();
                hiddenAd();//??????
                //adServiceWeb.adp_request_one_ad('adp');
            }
            break;
        case KEY_POSITION:
            isShowPosition = ++isShowPosition % 2;
            setDisplay_loc(isShowPosition);
            break;
        case KEY_INFORMATION:
        case GREEN_KEY:
            if (getDisplay()) setDisplay(false, false);
            else setTimerControl();
            break;
        case KEY_TRACK:
            e.preventDefault();
            displayTrack(1);
            break;
//        case KEY_STATIC:
//            e.preventDefault();
//            if (voice.isVoiceDisplay()) voice.voiceDisplay(false); // return; //can't set mute when voice is display
//            resetStatic(null);
//            break;
        case KEY_HOMEPAGE:
        case QUIT_KEY:
        case STOP_KEY:
        case RETURN_KEY:
            e.preventDefault();
            if (getDisplay() && (val == QUIT_KEY || val == RETURN_KEY)) { // when showed controler, close controler and resume play
                setDisplay_loc(0);
                setDisplay(false, false);
                return;
            }
            if (val == KEY_HOMEPAGE || val == QUIT_KEY) {
                if(val == QUIT_KEY){
                    setGlobalVar("qflag","0");
                }
				var parameter = "1";
				gotoHref(0, parameter + getEndPlayTimeParmeter()); 
				return; 
			}
            var parameter = "2"; //"0";
            //if (val == RETURN_KEY) parameter = "2";
            gotoHref(0, parameter + getEndPlayTimeParmeter());
            break;
        case KEY_LANGUAGE:
            e.preventDefault();
            break;
        case KEY_SCREENDISPLAY:
            e.preventDefault();
            displayTrack(2);
            break;
        case RED_KEY:
            e.preventDefault();
            //adServiceWeb.hiddenDiv();
            hidden_detail();//
            break;
        case BLUE_KEY:
            e.preventDefault();
            show_detail();//
            break;
        case YELLOW_KEY:
            e.preventDefault();
            writeTime();
            hiddenAd();//??????
            break;
        default:
            break;
    }
    if (val != FAST_FORWARD_KEY && val != FAST_REWIND_KEY) speedAction = 0;
} //end grabDown
var alreadyCount = false;


function grabPress(e) {
    var val = e.which || e.keyCode;
    //alert("mainjs in  grabPress:"+val);  //13 确定键
    switch (val) {
		case 13:  //13 确定键
			cebianlan();
			break;
        case 2205:
            break;
        case 768:
            var ev = Utility.getEvent();
            var errorCode = 0;
            var speedRate = 0;
            var json = jsonParse(ev);
            if (!isNaN(json.error_code)) errorCode = parseInt(json.error_code, 10);
            if (json.type.toUpperCase() == "EVENT_PLAYMODE_CHANGE" && json.new_play_mode == 3 && !isNaN(json.new_play_rate))
                speedRate = parseInt(json.new_play_rate, 10);
            switch (errorCode) {
                case 2205:
                    break;
                case 1: //link error
                case 28: //stop play
                case 31: //invalid program
                case 32: //signal lost
                    setGlobalVar("reasonCode", json.reason_code);
                    setGlobalVar("reasonType", json.type);
                    if (errorCode == 28) waitTimer = setInterval("" +
                        "" +
                        "waitRecover(28);", 1000);
                    else gotoHref(1, errorCode);
                    break;
                case 29: //recover play
                case 33: //recover play
                    clearInterval(waitTimer);
                    waitCount = 0;
                    break;
                case 6: //videol success connect
                case 19: //videol success prepare
                    $("imgProcess").style.visibility = "hidden";
                    if (!alreadyCount) {
                        execCount++;
                        if (execCount >= 2) stopCount();
                        alreadyCount = true;
                    }
//                    var ntpTime=getGlobalVar("ntpTime");
//                    if(ntpTime==0)
//                    {
                        //adPlay();
//                    }
                    break;
                case 8: //play over
                    gotoHref(1, "100000");
                    break;
                case 20: // fast rewind to begin time;
                    beginReplay();
                    break;
            }
            if (speedRate != 0) speedRateRecall(speedRate);
            break;
        case DVB.EVT_TYPE_CA_ALARM: //Card message
            var evt = DVB.getEvent(DVB.EVT_TYPE_CA_ALARM);
            if (evt.msgSubType == 1) pulloutCA(); //Card out
            break;
		case 50503://拖回	
			//广告不允许拖回
			if(!playAdFlag){
				//播放类型，1:VOD点播 2:直播  3:回看 5:广告
				var videoPlayType = getGlobalVar("videoPlayType");
				var channelCode = getGlobalVar("channelCode");
				var startTime = getGlobalVar("startTime");
				var endTime = getGlobalVar("endTime");
				var assetId = getGlobalVar("assetId");
				//var flyResourceCode = getGlobalVar("flyResourceCode");
				//var flyResourceName = getGlobalVar("flyResourceName");
				var totalTime=timeControl.allTimes+3;
				var currTime=parseInt(mp.getCurrentPlayTime(), 10) - subtractAdTime();
				var returnJson = "";
				if(videoPlayType == "1"){
					returnJson = "{\"ResourceInfo\":{\"userCode\":\""+getUserId()+"\",\"subID\":\"51004\",\"resourceName\":\""+getGlobalVar("displayName")+
				"\",\"productCode\":\"dpanci_hc\",\"resourceCode\":\""+assetId+"\",\"playType\":"+videoPlayType+",\"shiftEnd\":0,\"shiftTime\":0,\"delay\":0,\"timeCode\":\""+currTime+"\",\"duration\":" + totalTime +"},\"Status\":{\"Description\":\"pull back ok!\",\"ReturnCode\":100}}";
				}else{
					returnJson = "{\"ResourceInfo\":{\"userCode\":\""+getUserId()+"\",\"subID\":\"51004\",\"resourceName\":\""+getGlobalVar("displayName")+
				"\",\"productCode\":\"dpanci_hc\",\"resourceCode\":\""+channelCode+"\",\"playType\":"+videoPlayType+",\"shiftEnd\":"+endTime+",\"shiftTime\":"+startTime+",\"delay\":0,\"timeCode\":\""+currTime+"\",\"duration\":" + totalTime +"},\"Status\":{\"Description\":\"pull back ok!\",\"ReturnCode\":100}}";
				}
				AppManager.invoke("quanzimessage", "pullback", returnJson);
			   // var returnUrl = getGlobalVar("PORTAL_ADDR");// return home page
				//location.href=returnUrl;
				//gotoHref(0, "1" + getEndPlayTimeParmeter());
			}else{
				var returnJson = "{\"ResourceInfo\":{\"playType\":5},\"Status\":{\"Description\":\"pull back ok!\",\"ReturnCode\":100}}";
				AppManager.invoke("quanzimessage", "pullback", returnJson);
			}
			break;
        default:
            break;
    }
}

/*?????*/
var timeSign = 0;
var timeInterval;
function keepTime(){
    timeSign = 0;
    timeInterval = setInterval(function(){
        timeSign++;
    },100);
}

function writeTime(){
    clearInterval(timeInterval);
    timeSign = timeSign +"00";
    AppManager.invoke("TVRating", "addAction", "{\"action\":\"adp_pause\",\"data\":[\"E1\",\"0010\",\"E2\",\"0\",\"E3\",\"0\",\"E4\",\"1\",\"E5\",\"601\",\"D1\",\"478\",\"D2\",\"334\",\"D3\",\""+timeSign+"\",\"T\",\"A\"]}");
}

var waitCount = 0;
var waitTimer;
function waitRecover(errorCode) {
    waitCount++;
    if (waitCount > 15) { clearInterval(waitTimer); gotoHref(1, errorCode); }
}
function beginReplay() {
    // mp.playFromStart();
    mp.playByTime(1, 1 + startTimeOffset+"", 0);
    isMove = false;
    isFastMove=true;
    setDisplay(false, false);
    speedAction = 0;
    speed = 0;
    setStatusImg(0);
}
function gotoHref(isTip, parame) {
    isStop = false;
    if (initPlayTime == -1) initPlayTime = 0;
    var url = "vod_exit.html?initPlayTime=" + initPlayTime + "&currentStatus=" + currentStatus + "&tipType=" + parame;
    if (isTip == 1) url = "check_out.html?initPlayTime=" + initPlayTime + "&currentStatus=" + currentStatus + "&errorCode=" + parame;
    location.href = url;
}
function speedRateRecall(speedRate) {
    if (speedRate == 0) return;
    // speed = Math.abs(speedRate);
    if (speedRate < 0) { speedAction = -1; setStatusImg(4); }
    else if (speedRate > 0) { speedAction = 1; setStatusImg(3); }
}
function closeVideo() { if (isStop) mp.stop(); }
function pulloutCA() {
    if(rtsp.indexOf("^^^") > 0){
        AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtsp)+"\",\"E2\",\"0\",\"E3\",\"0\",\"E4\",\""+mp.getCurrentPlayTime()+"\",\"E5\",\"6\",\"D1\",\"0003\",\"D2\",\""+encodeURI(decodeURIComponent(getGlobalVar("displayName")))+"\",\"D3\",\"0\",\"T\",\"V\"]}");
    }else{
        AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtsp)+"\",\"E2\",\"0\",\"E3\",\"0\",\"E4\",\""+mp.getCurrentPlayTime()+"\",\"E5\",\"6\",\"D1\",\"0002\",\"D2\",\""+encodeURI(decodeURIComponent(getGlobalVar("displayName")))+"\",\"D3\",\"0\",\"T\",\"V\"]}");
    }
    mp.pause();
    gotoHref(0, "10000" + getEndPlayTimeParmeter());

}
var pauseMinute = 0;
var VOD_MAX_PAUSE_TIME = getMaxPauseTime()-1;
function checkPauseMinute() {
    if (!isPause()) { setPauseTimer(false); return; }
    pauseMinute++;
    if (pauseMinute > VOD_MAX_PAUSE_TIME) { clearInterval(pauseTimer); gotoHref(0, "3" + getEndPlayTimeParmeter()); }
}
function setPauseTimer(isCheck) {
    pauseMinute = 0;
    clearInterval(pauseTimer);
    if (isCheck) pauseTimer = setInterval("checkPauseMinute()", 1000);
}
document.onkeydown = grabDown;
document.onkeypress = grabDown;
document.onkeypress = grabPress;
document.onkeyup = function() {
    move_count = 1;
    perStepLen = move_default;
}
window.addEventListener("unload", closeVideo, false);
var JSON;if(!JSON){JSON={};}
(function(){'use strict';function f(n){return n<10?'0'+n:n;}
    if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+
        f(this.getUTCMonth()+1)+'-'+
        f(this.getUTCDate())+'T'+
        f(this.getUTCHours())+':'+
        f(this.getUTCMinutes())+':'+
        f(this.getUTCSeconds())+'Z':null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}
    var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}
    function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}
        if(typeof rep==='function'){value=rep.call(holder,key,value);}
        switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
            gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}
                v=partial.length===0?'[]':gap?'[\n'+gap+partial.join(',\n'+gap)+'\n'+mind+']':'['+partial.join(',')+']';gap=mind;return v;}
            if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==='string'){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}
            v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}
    if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}
        rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}
        return str('',{'':value});};}
    if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}
        return reviver.call(holder,key,value);}
        text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+
            ('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}
        if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}
        throw new SyntaxError('JSON.parse');};}}());


/*function showAd(){
alert(getIP()+"--------"+getSNO()+"============="+getCatalogId());	
	if($("adp")){
        adServiceWeb.set_adp_user_info(getIP(), getSNO()); // ip????????? 
        adServiceWeb.set_adp_catalog_id(getCatalogId()); // ???id
		adServiceWeb.adp_request_one_ad('adp');
	}
}
//??????????
function getSNO()
{
    //return getGlobalVar("SNO");
	return "111111111111111111";
}*/
