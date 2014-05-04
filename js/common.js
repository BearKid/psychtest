//自动更新窗口大小，全局变量
var WIN_WIDTH,WIN_HEIGHT;
$(function(){
	var winJq = $(window);
	WIN_WIDTH = winJq.width();
	WIN_HEIGHT = winJq.height();
	winJq.resize(function(){
		var winJq = $(window);
		WIN_WIDTH = winJq.width();
		WIN_HEIGHT = winJq.height();
	});
});
/*动画*/
//持续淡入淡出
function keepFadeToggle(){
	var sourceJq = $(this);
	sourceJq.fadeToggle(4000,keepFadeToggle);
}
//随机浮动
function randomFloat(){
	var sourceJq = $(this);//动画操作对象
	var sourceWidth = sourceJq.width();//操作对象的宽度
	var sourceHeight = sourceJq.height();//操作对象的高度
	var rangeWidth = WIN_WIDTH - sourceWidth/2;//可活动总范围_宽度
	var rangeHeight = WIN_HEIGHT - sourceHeight;//可活动总范围_高度
	var maxHStep = rangeWidth;//每次移动水平方向最大偏移量[影响浮动的密集范围]
	var maxVStep = rangeHeight;//每次移动垂直方向最大偏移量[影响浮动的密集范围]
	var unitMilliTime = 5;//单位移动所经历时间(毫秒/px)
	var duration;//每趟用时
	var topVal,rightVal;//坐标值
	var topValTmp,rightValTmp;//缓存旧坐标值

	//当前坐标
	var offset = sourceJq.offset();
	topVal = topValTmp = offset.top;
	rightVal = rightValTmp = WIN_WIDTH - offset.left;

	//步进值
	var topStep = (Math.random()*2*maxVStep)-maxVStep;
	var rightStep = (Math.random()*2*maxHStep)-maxHStep;
	//新的坐标
	topVal += topStep;
	rightVal += rightStep;
	//校正坐标，防止溢出
	//topVal = topVal>0 ? (topVal>rangeHeight ? rangeHeight : topVal): 0;
	//rightVal = rightVal>0 ? (rightVal>rangeWidth ? rangeWidth : rightVal) : 0;
	if(topVal<0){
		topVal = 0;
		topStep = topValTmp;//(topValTmp-0)
	} else if(topVal > rangeHeight){
		topVal = rangeHeight;
		//topStep = rangeHeight - topValTmp;
	}
	if(rightVal < 0){
		rightVal = 0;
		rightStep = rightValTmp;//(rightValTmp-0)
	} else if(rightVal > rangeWidth){
		rightVal = rangeWidth;
		//rightStep = rangeWidth - rightValTmp;
	}
	//步进量绝对值
	topStep = Math.abs(topVal-topValTmp);
	rightStep = Math.abs(rightVal-rightValTmp);
	//根据偏移距离按比例设定每趟用时
	duration = Math.floor(Math.sqrt((Math.pow(topStep,2) + Math.pow(rightStep,2)))*unitMilliTime);
	//confirm(topStep + " " + rightStep + " " + duration)

	sourceJq.animate({top:topStep+"px",right:rightStep+"px"},duration,randomFloat); 
}

//实现高亮导航栏中被点击的项，有且仅有该项的样式被设为.active
function navActive(sourceObj){
	var sourceJq = $(sourceObj);
	sourceJq.parent().children(".active").removeClass("active");
	sourceJq.addClass("active");
}
//实现页切换
function switchPage(curId,newId){
	$('#'+curId).hide();
	$('#'+newId).show();
}
/****************************************************/
/*@bug:最多一个问题可视的[autoNext && prev]式问卷*/
function Questionnaire (prevButtonId){
	this.prevButtonId = prevButtonId;
}
//切换至下一题
Questionnaire.prototype.nextQ = function (curId,nextId){
	//切换至下一题
	switchPage(curId,nextId);
	var prevQ = this.prevQ;
	//设置点击[上一题]按钮事件
	$("#" + this.prevButtonId).one("click",function(){
		prevQ(nextId,curId);
	});
};
//切换至上一题
Questionnaire.prototype.prevQ = function (curId,prevId){
	switchPage(curId,prevId);
	//this.clearAllChoice(curId);
};
Questionnaire.prototype.clearAllChoice = function (curId){
	var radiosJq = $('#' + curId + " input");
	for(var c in radiosJq) c.attr("checked",false);
};
/**************************************************/
/*最多一个问题可视的可返回式问卷*/
function Questionnaire1 (firstQuestionId,prevButtonId){
	this.prevButtonId = prevButtonId;
	this.curId = firstQuestionId;//当前题目id
	this.prevIdStack= new Array();//@important:题目呈现历史栈,用于回溯
	$('.question').hide();
	$('#'+firstQuestionId).show();
	var thisObj = this;
	$('#'+prevButtonId).click(function(){
		thisObj.prevQ();
	});
}
//切换至下一题
Questionnaire1.prototype.nextQ = function (nextId){
	var curId = this.curId;
	this.curId = nextId;

	switchPage(curId,nextId);
	this.prevIdStack.push(curId);
};
//切换至上一题
Questionnaire1.prototype.prevQ = function (){
	var curId = this.curId;
	var prevId = this.prevIdStack.pop();
	if(prevId == null) return;
	this.curId = prevId;
	switchPage(curId,prevId);
	$('#' + curId).find("input").attr("checked",false);
};
/**************************************************/
//问卷类型:题目渐进式呈现，可视题目量递增,可回滚
function Questionnaire2(firstQuestionId){ 
	$('.question').hide();
	$('#'+firstQuestionId).show();
}
Questionnaire2.prototype.nextQ = function (doneId,nextId){
	var nextAllQuestionsJq = $('#'+ doneId).nextAll();
	nextAllQuestionsJq.each(function(){
		$(this).css("display","none");
		$(this).find('input').prop("checked",false);
	});
	$('#' + nextId).css("display","block");
}
/**************************************************/
//@bug:更新框架高度
//function syncFrameSize(frameId){
//	var frame = $('#'+frameId);
//	var bodyObj = frame.contents().find('body');
//	frame.height(bodyObj.height()+30); 
//	//frame.width(bodyObj.width()+30); 
//}
//在加载页面时#leftPart框架自适应高度
//$(function(){
//	$(window).load(function(){
//		syncFrameSize('leftPart');
//		syncFrameSize('mainPart');
//		syncFrameSize('rightPart');
//	})
//	$(window).resize(function(){
//		syncFrameSize('leftPart');
//		syncFrameSize('mainPart');
//		syncFrameSize('rightPart');
//	})
//})
