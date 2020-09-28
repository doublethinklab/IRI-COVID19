var dataBox='<div class="dataBox"><div class="date"><p>01.10</p><div class="line"></div></div><div class="events"></div></div>',gap=100,daysBoxChange=false,settime=false;
var stageInChange=[1573920000000,1577808000000,1579708800000,1580659200000],
	stageEndChange=[1577721600000,1579449600000,1580400000000,1596038400000],
	// stageTxt=["未知階段","調查階段","開始擴散","輿論戰啟動"],
	stageTxt=["Very Early Phase","Investigation Phase","Early Intensification","Altered Narratives"],
	allvalue=[0,0,0,0];//china_days china_case who_days who_case
gsap.registerPlugin(ScrollTrigger);

$(document).ready(function(e){
	getDataFun();
	$(window).on("resize",resizeFun);
	$(window).on("scroll",scrollFun);
	setTimeFun();
})

function scrollFun(e){
	var st=$(window).scrollTop();
	if(st>=$(".timeLineBox").offset().top){
		$(".timeLineBox").removeClass('nonefixed');
	}else{
		$(".timeLineBox").addClass('nonefixed');
	}
}

function resizeFun(e){
	var sw=$(window).width(),sh=$(window).height(),maxW=1250,picW=500,picH=347;
	if(sw<1250 && sw>750){
		sw=maxW;
	}
	$(".kvBox").css({width:sw,height:sh});
	
	var fixedW=$(".fixedBox").width()+$(".fixedBox").offset().left-5;
	$(".line.year").css({width:(sw/2)-fixedW,left:fixedW});
	$(".event .content > iframe").css({width:$(".event").width()*0.9,height:($(".event").width()*0.9/picW)*picH});
	$(".event li iframe").css({width:$(".event li").width()*0.9,height:($(".event li").width()*0.9/picW)*picH});
	if(sw<750){
		gap=50;
		// $(".date .line").css({width:sw*0.06});
		$(".allDatasBox").css({"padding-bottom":sh*0.5 -69});
	}else{
		$(".allDatasBox").css({"padding-bottom":sh*0.72 -69});
	}
	// $(".background .pic").css({height:sh});
	// $(".background,.backgroundMask").css({width:sw,height:sh})
}

function getDataFun(){
	$.ajax({
		url:"json/timelinedata_en.json",
		type: 'GET',
		dataType:"json"
	}).done(function(msg){
		// console.log(msg);
		setDateDataFun(msg.datas);
	}).fail(function(msg){
		console.log(msg);
	})	
}


function setDateDataFun(data){
	$.each(data,function(i,val){
		var _mc=$(dataBox),thisDate=new Date(val.year+"/"+val.date).getTime();
		$(".date p",_mc).text(val.date.replace("/","."));
		$.each(val.events,function(_i,_v){
			if(_v.content!=undefined){
				if(_v.taiwan==true){
					$(".events",_mc).append('<div class="event taiwan"><div class="content">'+_v.content+'</div></div>');
				}else{
					$(".events",_mc).append('<div class="event"><div class="content">'+_v.content+'</div></div>');
				}
			}
		})
		if(val.events.length==1 && val.events[0].content==""){
			$(_mc).addClass("hideEvent");
		}
		$(_mc).attr("d-date",thisDate);
		if(val.countdown!=undefined){
			$(_mc).attr({
				"d-china-cases":val.countdown.china.case,
				"d-china-days":val.countdown.china.days,
				"d-who-cases":val.countdown.who.case,
				"d-who-days":val.countdown.who.days
			});
		}
		$(".allDatasBox").append(_mc);
	})
	setDateGapFun();
}


function setDateGapFun(){
	$(".allDatasBox .dataBox").each(function(i){
		if(i!=0 && i!=$(".allDatasBox .dataBox").length-1){
			var thisD=$(this).attr("d-date"),
				lastD=$(".allDatasBox .dataBox:eq("+String(i+1)+")").attr("d-date"),
				oneDay = 24*60*60*1000,
				ddays=Math.round((lastD-thisD)/oneDay);
			// console.log(Math.round((lastD-thisD)/oneDay));
			if(ddays>4){
				ddays=4;
			}
			$(this).css({"margin-bottom":ddays*gap});
		}
	})
	resizeFun();
	setAnFun();
}
function setAnFun(){
	var dataBoxs=gsap.utils.toArray(".dataBox");
	$.each(dataBoxs,function(i,el){
		var p_num=i,num=p_num%2,l="10",ol=0,_toggleActions="restart none none reset";
		if(num!=0 && !isMobile){
			l="-10";
			// ol=123;
		}
		// if(i<2){
		// 	_toggleActions="restart none none none";
		// }
		var tl=gsap.timeline({
			scrollTrigger:{
				animation:tl,
				trigger: $(el),
			    start: "top bottom-=100px",
			    end: "top+=200px center-=20%",
			    toggleActions:_toggleActions,
				scrub:true,
				// markers: true,
				onEnter:function(progress, direction, isActive){
					// console.log("inn")
					var triggerD=Number($(progress.trigger).attr("d-date"));
					for(var i=stageEndChange.length-1;i>=0;i--){
						if(stageEndChange[i]<=triggerD){
							$(".yearBox p").text(stageTxt[i]);
							// console.log(i);
							break;
						}
					}	
					if(triggerD>=1577808000000){
						$(".yearBox h2").text(2020);
					}else{
						$(".yearBox h2").text(2019);
					}
					if(triggerD>=1579449600000){
						daysBoxChange=true;
						$(".fixedBox").addClass('change');
						$(".organizationBox .days > .txt").text("confirmed cases");
						$(".dividerBox").text("days");
					}else{
						daysBoxChange=false;
						$(".fixedBox").removeClass('change');
						$(".organizationBox .days > .txt").text("days");
						$(".dividerBox").text("confirmed cases");						
					}	
					// console.log("inn",daysBoxChange,triggerD);
				},
				onEnterBack:function(progress, direction, isActive){
					// console.log("back")
					var triggerD=Number($(progress.trigger).attr("d-date"));
					for(var i=stageEndChange.length-1;i>=0;i--){
						if(stageEndChange[i]<=triggerD){
							$(".yearBox p").text(stageTxt[i]);
							// console.log(i);
							break;
						}
					}	
					if(triggerD>=1577808000000){
						$(".yearBox h2").text(2020);
					}else{
						$(".yearBox h2").text(2019);
					}

					if(triggerD>=1579449600000){
						daysBoxChange=true;
						$(".fixedBox").addClass('change');
						$(".organizationBox .days > .txt").text("confirmed cases");
						$(".dividerBox").text("days");
					}else{
						daysBoxChange=false;
						$(".fixedBox").removeClass('change');
						$(".organizationBox .days > .txt").text("days");
						$(".dividerBox").text("confirmed cases");						
					}		
					// console.log("back",daysBoxChange);
				}
			}
		});
		tl.from($(".date",el),1,{scale:0},{scale:1,transformOrigin:"center center"},"eventgo")
			.from($(".date .line",el),1.2,{width:0,opacity:0},"eventgo")
			.fromTo($(".events",el),1.2,{xPercent:l,opacity:0},{xPercent:0,opacity:1},"eventgo")
			.fromTo($(".content",el),0.3,{y:50,opacity:0},{y:0,opacity:1});
		if($(el).attr("d-china-days")!=undefined){
			var tl2=gsap.timeline({
				scrollTrigger:{
					animation:tl2,
					trigger: $(el),
				    start: "top bottom-=100px",
				    end: "top+=200px center-=20%",
					toggleActions:"restart play reverse pause",
					// scrub:true,
					// markers: true,
				},
				onUpdate:function(){
					if(!daysBoxChange){
						$(".organizationBox.china .days > span").text(numberWithCommasFun(Math.floor(allvalue[0])));
						$(".organizationBox.china .cases").text(numberWithCommasFun(Math.floor(allvalue[1])));
						$(".organizationBox.who .days > span").text(numberWithCommasFun(Math.floor(allvalue[2])));
						$(".organizationBox.who .cases").text(numberWithCommasFun(Math.floor(allvalue[3])));		
					}else{
						$(".organizationBox.china .days > span").text(numberWithCommasFun(Math.floor(allvalue[1])));
						$(".organizationBox.china .cases").text(numberWithCommasFun(Math.floor(allvalue[0])));
						$(".organizationBox.who .days > span").text(numberWithCommasFun(Math.floor(allvalue[3])));
						$(".organizationBox.who .cases").text(numberWithCommasFun(Math.floor(allvalue[2])));					
					}
				}
			});
			tl2.to(allvalue,0.5,{"0": $(el).attr("d-china-days")},"go")
				.to(allvalue,0.5,{"1": $(el).attr("d-china-cases")},"go")
				.to(allvalue,0.5,{"2": $(el).attr("d-who-days")},"go")
				.to(allvalue,0.5,{"3": $(el).attr("d-who-cases")},"go");
		}
	})
	
}


function setTimeFun(){
	var nowD=new Date(),
		hour=nowD.getHours(),
		minute = nowD.getMinutes(),
		second = nowD.getSeconds();
	if(hour<10){
		minute="0"+String(hour);
	}
	if(minute<10){
		minute="0"+String(minute);
	}
	if(second<10){
		second="0"+String(second);
	}
	$(".time .hour").text(hour);
	$(".time .minute").text(minute);
	$(".time .second").text(second);
	if(!settime){
		settime=true;
		setInterval(setTimeFun, 1000);
	}
}

function numberWithCommasFun(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}