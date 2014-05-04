/*
 * Author:卢伟标
 * English-Name:Bill
 * Date:2014/04/16
 */
function KissSlider(mySliderId){
	var winJq = $(window);
	var _thisObj = this;

	this.prevBtnId = "prev-btn";
	this.nextBtnId = "next-btn";

	this.sliderViewPort = $("#" + mySliderId);
	this.sliders = this.sliderViewPort.children();
	this.sliderNum = this.sliders.length;
	this.sliderLine = $("<div></div>").append(this.sliders.detach()).appendTo(this.sliderViewPort);//sliderLine 用于包裹所有slider,对用户是透明的,仅作为功能实现的辅助

	this.curIndex = 0;
	this.direction = "x";
	this.speed = 1000;

	this.viewWidth = winJq.width();//view-port height //chnage to $(window).width() for condition of full page;
	this.viewHeight = winJq.height();//view-port height //chnage to $(window).height() for condition of full page;
	this.sliderWidth = this.viewWidth;//don't set "auto",a fixed value is needed
	this.unactivatedSliderWidth = this.viewWidth;//the height of unactived slider.Normally, just keep default value(viewHeight)
	this.sliderHeight = this.viewHeight;//this.viewHeight;//change to "auto" for condition of slider with variable height greater than view-port height
	this.unactivatedSliderHeight = this.viewHeight;//the height of unactived slider.Normally, just keep default value(viewHeight)
	this.unactivatedSliderWidth = this.viewWidth;//the width of unactived slider.Normally, just keep default value(viewWidth)
	this.isFixedView = true;//view-port is height-fixed or not
	this.isXCenter = false; 
	this.isVCenter = false;

	this.activatedSliderCss = { };
	this.unactivatedSliderCss = { };


	return this;
}
/*
 * property settter
 */
/* @public */
KissSlider.prototype.setPrevBtn= function(prevBtnId){
	this.prevBtnId = "prev-btn";
	$("#" + prevBtnId).click(function(){
		this.prev();
	});
}
/* @public */
KissSlider.prototype.setNextBtn= function(nextBtnId){
	this.nextBtnId = "next-btn";
	$("#" + nextBtnId).click(function(){
		this.next();
	});
}
/* @public */
KissSlider.prototype.setViewWidth = function(width){
	this.viewWidth = width;
	this.sliderWidth = width;
	this.unactivatedSliderWidth = width;
	return this;
}
/*
 * "auto" is deprecated,use setFixedView(false) if you want a view-port of unfixed height to fit slider 
 * @public
 */
KissSlider.prototype.setViewHeight = function(height){
	this.viewHeight = height;
	this.sliderHeight = height;
	this.unactivatedSliderHeight = height;
	return this;
}
/* @public */
KissSlider.prototype.setSliderWidth = function(width){
	this.sliderWidth = width;
	this.unactivatedSliderWidth = this.sliderWidth;
	return this;
}
/* @public */
KissSlider.prototype.setSliderHeight = function(height){
	this.sliderHeight = height;
	if(height == "auto") this.unactivatedSliderHeight = this.viewHeight;
	else this.unactivatedSliderHeight = this.sliderHeight;
	return this;
}
/*
 * set the width of unactive sliders
 * this can help you make a better animation when switching sliders in "y-direction"
 * @public
 */
KissSlider.prototype.setUnactivatedSliderWidth = function(unactivatedSliderWidth){
	this.unactivatedSliderWidth= unactivatedSliderWidth;
	return this;
}
/*
 * set the height of unactive sliders
 * this can help you make a better animation when switching sliders in "x-direction"
 * @public
 */
KissSlider.prototype.setUnactivatedSliderHeight = function(unactivatedSliderHeight){
	this.unactivatedSliderHeight = unactivatedSliderHeight;
	return this;
}
/* @public */
KissSlider.prototype.setSpeed = function(speed){
	this.speed = speed;
	return this;
}
/* @public */
KissSlider.prototype.setCurIndex = function(curIndex){
	this.curIndex = curIndex;
	return this;
}
/* @public */
KissSlider.prototype.setDirection = function(direction){
	this.direction = direction;
	return this;
}
/* 
 * if false is set,setViewHeight() will be ignored
 * @public 
 */
KissSlider.prototype.setFixedView = function(isFixedView){
	this.isFixedView = isFixedView;
	if(!isFixedView) this.sliderHeight = "auto";
	return this;
}
//Align the activated or unactivated sliders horizontal center and vertical center or not in the viewport
//in order to see the effect,usually:
//in "x-sliders" condition,viewport should wider than activated slider/viewport should higher than unactivated sliders
//in "y-sliders" condition,viewport should higher than activated slider/viewport should width than unactivated sliders
KissSlider.prototype.setCenterSlider = function(isXCenter,isVCenter){
	this.isXCenter = isXCenter;
	this.isVCenter = isVCenter;
	return this;
}

/*
 * 使KissSlider及其子元素样式生效
 * @public
 */
KissSlider.prototype.validate = function (){
	this.alignCenter();

	//init the viewport
	this.sliderViewPort.css({
		"width":this.viewWidth,
		"height":this.viewHeight,
		"overflow":"hidden",
	});
	//init the slider line
	if(this.direction == "x") {
		var maxWidth = this.sliderWidth >this.unactivatedSliderWidth ? this.sliderWidth:this.unactivatedSliderWidth;
		this.sliderLine.css("width",this.sliderNum * maxWidth);
	} else this.sliderLine.css("width",this.sliderWidth);
	this.sliderLine.css("height","auto");
	//init the sliders
	this.sliders.addClass("slider")
		.css({
			"width":this.unactivatedSliderWidth,
			"height":this.unactivatedSliderHeight,
			"overflow":"hidden",
		});
	if(this.direction == "x") this.sliders.css("float","left");
	else this.sliders.css("float","none");
	this.sliders.eq(this.curIndex).css({
		"width":this.sliderWidth,
		"height":this.sliderHeight,
	}).addClass("active");

	
	//statically locate to the specified current slider
	if(this.direction == "x"){
	var marginLeft = -(this.curIndex * this.unactivatedSliderWidth);
		this.sliderLine.css({"margin-left": marginLeft});
	} else{
		var marginTop = -(this.curIndex * this.unactivatedSliderHeight);
		this.sliderLine.css({"margin-top": marginTop});
	}
	
	//this.move(this.curIndex);//dynamically locate to the specified current slider
	return this;
}
/*
* 分别决定在视口中是否让激活的滑块居中于视口，以及非激活的滑块在水平或垂直方向居中对齐当前激活的滑块
* Align the activated or unactivated sliders horizontal center and vertical center or not in the viewport
* in order to see the effect,usually:
* in "x-sliders" condition,viewport should wider than activated slider OR activated slider should higher than unactivated sliders
* in "y-sliders" condition,viewport should higher than activated slider OR activated slider should width than unactivated sliders
* @private
*/
KissSlider.prototype.alignCenter = function(){
	//the function make the align effect by changing the padding and margin of viewport,activated slider and unactivated sliders
	//激活和非激活滑块的css样式分别记录在activatedSliderCss和unactivatedSliderCss里
	if(this.direction == "x"){//"x" horizontal sliders
		if(this.isXCenter){
			this.viewWidth = (this.viewWidth + this.sliderWidth)/2;//NOTE:due to the effect of padding-left,viewWidth should be recalculated
			var xStep = this.viewWidth - this.sliderWidth;
			this.sliderViewPort.css("padding-left",xStep);
		} else { /* no padding-left effect,just keep default -> this.viewWidth = this.viewWidth; */ }
		if(this.isVCenter){
			var vStep = (this.sliderHeight - this.unactivatedSliderHeight)/2;//if sliderHeight is "auto",it won't work.There is no reason to support "auto",I think noboy want to align the unactivated slider center when activated slider is height-variable
			$.extend(this.activatedSliderCss,{"margin-top":0});
			$.extend(this.unactivatedSliderCss,{"margin-top":vStep});
			for(var i=0; i<this.sliderNum; i++ ){
				if(i != this.curIndex)
					this.sliders.eq(i).css(this.unactivatedSliderCss);
			}
		}
	}else{//"y" vertical sliders
		if(this.isXCenter){
			var xStep = (this.sliderWidth - this.unactivatedSliderWidth)/2;
			$.extend(this.activatedSliderCss,{"margin-left":0});
			$.extend(this.unactivatedSliderCss,{"margin-left":xStep});
			for(var i=0; i<this.sliderNum; i++){
				if(i != this.curIndex)
					this.sliders.eq(i).css("margin-left",xStep);
			}
		}
		if(this.isVCenter){
			this.viewHeight = (this.viewHeight + this.sliderHeight)/2;//NOTE:due to the effect of padding-left,viewHeight should be recalculated
			var vStep = this.viewHeight - this.sliderHeight;
			this.sliderViewPort.css("padding-top",vStep);
		} else { 
			/*no padding-left effect,just keep default -> this.viewHeight = this.viewHeight;*/
		}
	}
	return this;
}
/* 移动到指定索引值对应的滑块(滑块链移动n个滑块大小的距离)
 * @public
 */
KissSlider.prototype.move = function (nextCurIndex,fn){
	var _thisObj = this;
	//if(nextCurIndex == this.curIndex) return nextCurIndex;
	if(nextCurIndex < 0) nextCurIndex = this.sliderNum - 1;
	else if(nextCurIndex > this.sliderNum - 1) nextCurIndex = 0; 
	//change height && width of current slider 
	$.extend(this.unactivatedSliderCss,{"height":this.unactivatedSliderHeight,"width":this.unactivatedSliderWidth});
	this.sliders.eq(this.curIndex).removeClass("active").animate(this.unactivatedSliderCss,this.speed);

	//change height&&width of next slider
	var nextJq = this.sliders.eq(nextCurIndex).addClass("active");
	var nextCurHeight = nextJq.height();
	var nextNextHeight;
	if(this.sliderHeight == "auto"){//"auto" is invalid in function animate()
		nextNextHeight = nextJq.css("height","auto").height();
		$.extend(this.activatedSliderCss,{"height": nextNextHeight,"width":this.sliderWidth});
		nextJq.height(nextCurHeight).animate(this.activatedSliderCss,this.speed);
	} else {
		nextNextHeight = this.sliderHeight;
		$.extend(this.activatedSliderCss,{"height": nextNextHeight,"width":this.sliderWidth});
		nextJq.animate(this.activatedSliderCss,this.speed);
	}
	if(!this.isFixedView){ this.sliderViewPort.height(nextNextHeight);}//change the height of view-port to fit the active slider

	//move slider-line to the specified slider
	if(this.direction == "x"){
		var marginLeft = -(nextCurIndex * this.unactivatedSliderWidth);
		this.sliderLine.animate({"margin-left": marginLeft},this.speed,function(){
			try{
				fn.call(_thisObj);
			}catch(err){}
		});
	} else{
		var marginTop = -(nextCurIndex * this.unactivatedSliderHeight);
		this.sliderLine.animate({"margin-top": marginTop},this.speed,function(){
			try{
				fn.call(_thisObj);
			}catch(err){}
		});
	}
	this.curIndex = nextCurIndex;
	return this;
}
//下一张 next page
KissSlider.prototype.prev = function (fn){
	var nextCurIndex = this.curIndex - 1;
	return this.move(nextCurIndex,fn);
}
//上一张 previou page
KissSlider.prototype.next = function (fn){
	var nextCurIndex = this.curIndex + 1;
	return this.move(nextCurIndex,fn);
}

//CHOICE: suport this feature or not?
//on window resize
//if(this.responsiveFullPage){
//	winJq.resize(function(){//for condition of responsive full page
//			_thisObj.resize();
//	});
//}
//窗口改变,执行更新
//KissSlider.prototype.resize = function(){
//	var winJq = $(window);
//	this.viewWidth = winJq.width(); 
//	this.viewHeight = winJq.height(); 
//	this.sliderWidth = this.viewWidth;
//	this.sliderHeight = (this.sliderHeight =="auto")? "auto":this.viewHeight;//"auto" for condition of slider with variable height greater than view-port height
//	this.unactivatedSliderHeight = this.viewHeight;
//	this.validate();
//}
