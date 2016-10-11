function countControl() {
    this.imgs = [];
    this.counter = 1;
    this.timmer;
    this.isCount = false;
    var imgWaitElement = "";
    var intervalTime = 1000;
    this.maxCount = 9;
    if (this.isCount) {
        this.imgs = ["pic_00.png","pic_1.png","pic_2.png","pic_3.png","pic_4.png","pic_5.png","pic_6.png","pic_7.png","pic_8.png"];
        imgWaitElement = "<img id=\"countdown\" src=\"images/pic_00.png\" align=\"middle\" width=\"81\" height=\"81\" />";
    } else {
        this.imgs = ["0.png","1.png", "2.png","3.png","4.png","5.png","6.png","7.png","7.png"];
        imgWaitElement = "<img id=\"countdown\" src=\"images/0.png\" align=\"middle\" width=\"114\" height=\"102\" />";
        intervalTime = 500;
        this.maxCount = 18;
    }
    var hl = "<div id=\"imgBj\" style=\"position:absolute;left:0px;top:0px;\"><img src=\"images/wait.jpg\" width=\"1280\" height=\"720\" /></div><div id=\"imgProcess\">" + imgWaitElement + "</div>";
    document.write(hl);
    this.timmer = setInterval("cControl.show()", 1000);
}
countControl.prototype.show = function() {
    var cdimg = document.getElementById("countdown");
    cdimg.src = "images/" + this.imgs[this.counter];
    if (this.counter >= this.maxCount) {
        this.stopTimer();
        location.href = "check_out.html?errorCode=100002";
    }
    this.counter++;
}
countControl.prototype.stopTimer = function() {
    clearInterval(this.timmer);
    this.imgDisplay(false);
}
countControl.prototype.imgDisplay = function(isShow) {
    var cDiv = document.getElementById("imgProcess");
    var bjDiv = document.getElementById("imgBj");
    if (isShow) {
        bjDiv.innerHTML = "<img src=\"images/wait.jpg\" width=\"1280\" height=\"720\" />";
        cDiv.style.visibility = "visible";
    } else {
        bjDiv.innerHTML = "";
        cDiv.style.visibility = "hidden";
    }
}
var ipt = "-1";
function isCancelQuit() {
    ipt = getQueryStr("initPlayTime", LocString);
    if (ipt == "" || ipt == "-1") return false;
    return true;
}
var cControl = null;
if (!isCancelQuit()) cControl = new countControl();