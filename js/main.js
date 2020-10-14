var dataBox='<div class="dataBox"><div class="date"><p>01.10</p><div class="line"></div></div><div class="events"></div></div>',gap=100,daysBoxChange=false,settime=false,bookTL=null,clickback=false,$body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
var	stageStartChange=[1573920000000,1577808000000,1579449600000,1580659200000],
	url=location.protocol+'//'+location.host+location.pathname,lastTL=null,indeTL=null,
	html_lang=document.documentElement.lang,
	stageTxt={
		"en":["Unknown","Investigation","Propaganda Start","Altered Narratives"],
		"zh":["未知階段","調查階段","開始擴散","輿論戰啟動"]
	},
	allvalue=[0,0,0,0];//china_days china_case who_days who_case
gsap.registerPlugin(ScrollTrigger);

$(document).ready(function(e){
	if(html_lang=="zh-TW"){
		html_lang="zh";
	}
	if(p_type=="research"){
		bookTL=gsap.timeline();
		bookTL.from($(".booksBox"),0.5,{bottom:-500}).pause();
		$(".booksBox .btn").on("click",function(e){
			var thisIndex=$(this).index();
			$body.animate({scrollTop: $(".researchBox .book").eq(thisIndex).offset().top}, 600)
		})
	}
	if(p_type=="index"){
		getDataFun();
		setTimeFun();
		resizeFun();
		$('.kvImg').imagesLoaded(function(){
	  		setIndexAnFun();
		});
	}else{
		resizeFun();
		scrollFun();
	}
	$(window).on("resize",resizeFun);
	$(window).on("scroll",scrollFun);
	$(".backtop").on("click",backtopFun);

	// $(".kv_txt").on("click",function(e){
	// 	document.location.href="index.html";
	// })
})

function setIndexAnFun(){
	indeTL=gsap.timeline();
	indeTL.from($(".avirus1"),0.1,{top:"2.5%",yoyo:true,repeat:-1},"avirus")
	.from($(".avirus2"),0.1,{top:"31%",yoyo:true,repeat:-1},"avirus")
	.from($(".avirus3"),0.1,{bottom:"-1.5%",yoyo:true,repeat:-1},"avirus")
	.from($(".avirus1"),1,{right:"-13%",ease:"bounce.out",yoyo:true,repeat:-1,repeatDelay:0.1},"avirus")
	.from($(".avirus2"),1,{right:"2%",yoyoEase:"bounce.out",yoyo:true,repeat:-1,repeatDelay:0.1,delay:1},"avirus")
	.from($(".avirus3"),0.4,{left:"-8%",ease:"bounce.out",yoyo:true,repeat:-1,repeatDelay:0.1},"avirus")
	.fromTo($(".people"),0.5,{rotate:-5},{rotate:5,yoyo:true,repeat:-1},"avirus");
	gsap.to(".loading",{duration:0.5,autoAlpha:0,delay:3});
}
$(window).on('beforeunload', function() {
    $(window).scrollTop(0); 
});

function backtopFun(e){
	clickback=true;
	$body.animate({scrollTop: 0}, 600,function(){clickback=false;});
	$(this).hide();
}
function scrollFun(e){
	var st=$(window).scrollTop(),sh=$(window).height();
	if(p_type=="index"){
		if(st>=$(".timeLineBox").offset().top){
			$(".timeLineBox").removeClass('nonefixed');
		}else{
			$(".timeLineBox").addClass('nonefixed');
		}		
	}else if(p_type=="research"){
		var book1ImgBottom=$(".book:eq(0) img").offset().top+$(".book:eq(0) img").height(),
			book2ImgBottom=$(".book:eq(1) img").offset().top+$(".book:eq(1) img").height();

		if(st>=book1ImgBottom && (st+sh+200)<=$("#wapper").height()){
			bookTL.play();
		}else{
			bookTL.reverse();
		}

		if(st>=$(".book:eq(1) img").offset().top){
			$(".booksBox .btn:eq(1)").addClass('active').siblings().removeClass('active');
		}else if(st>=$(".book:eq(0) img").offset().top){
			$(".booksBox .btn:eq(0)").addClass('active').siblings().removeClass('active');
		}
	}
	if(!clickback){
		if(st>=800){
			$(".backtop").show();
		}else{
			$(".backtop").hide();
		}		
	}
}

function resizeFun(e){
	var sw=$(window).width(),sh=$(window).height(),maxW=1250,picW=500,picH=347,kvW=703;
	if(sw<1250 && sw>750){
		sw=maxW;
	}
	if(sh<700 && sw>750){
		sh=700;
	}
	
	if(p_type=="index"){
		var fixedW=$(".fixedBox").width()+$(".fixedBox").offset().left-5;
		$(".line.year").css({width:(sw/2)-fixedW,left:fixedW});
		$(".event .content > iframe").css({width:$(".event").width(),height:($(".event").width()/picW)*picH});
		$(".event li iframe").css({width:$(".event li").width(),height:($(".event li").width()/picW)*picH});
		if(sw<750){
			gap=50;
			var dw=roundDecimal(sw/1903,2)+0.23;
			$(".kvImg").css({"transform":"scale("+dw+")"});
			// $(".kvImg").css({"transform":"scale("+dw+")"})
			// $(".date .line").css({width:sw*0.06});
			$(".allDatasBox").css({"padding-bottom":sh*0.9 - 66});
			$(".nowBox").css({bottom:sh/2});
		}else{
			var dw=roundDecimal(sw/1903,2);
			$(".kvImg").css({"transform":"scale("+dw+")",right:sw*0.14*dw,"margin-top":-$(".kvImg").height()/2*dw-30});
			$(".allDatasBox").css({"padding-bottom":sh*0.72 -66});
			$(".nowBox").attr("style","");
		}
		
		$(".kvBox").css({height:sh});
		$(".titleBox").css({height:sh});
		$(".dataBox").last().css({"margin-bottom":sh/2});
	}

	// $(".background .pic").css({height:sh});
	// $(".background,.backgroundMask").css({width:sw,height:sh})
}
function getNowCaseFun(){
	$.ajax({
		url:"https://api.covid19api.com/summary",
		type: 'GET',
		dataType:"json"
	}).done(function(msg){
		// console.log(msg);
		var thisDate=new Date().getTime();
		$(".nowBox").attr({
			"d-china-cases":findChinaCaseFun(msg["Countries"]),
			"d-china-days":setChinaDdayFun(thisDate),
			"d-who-cases":msg["Global"]["TotalConfirmed"],
			"d-who-days":setWhoDdayFun(thisDate)
		}).appendTo('.allDatasBox');
		setDateGapFun();
	}).fail(function(msg){
		console.log(msg);
	})		
}



function findChinaCaseFun(array){
	var casesNum=0;
	$.each(array,function(i,val){
		if(val["CountryCode"]=="CN"){
			casesNum=val["TotalConfirmed"];
			return false;
		}
	})
	// console.log(casesNum);
	return casesNum;
}




function getDataFun(){
	$.ajax({
		url:"json/timelinedata.json",
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
		var _mc=$(dataBox),
			thisDate=new Date(val.year+"/"+val.date).getTime(),
			thisEvents=val[html_lang+"_events"];

		$(".date p",_mc).text(val.date.replace("/","."));
		$.each(thisEvents,function(_i,_v){
			if(_v.content!=undefined){
				if(_v.taiwan==true){
					$(".events",_mc).append('<div class="event taiwan"><div class="content">'+_v.content+'</div></div>');
				}else{
					$(".events",_mc).append('<div class="event"><div class="content">'+_v.content+'</div></div>');
				}
			}
		})
		if(thisEvents.length==1 && thisEvents[0].content==""){
			$(_mc).addClass("hideEvent");
		}
		$(_mc).attr("d-date",thisDate);
		if(val.countdown!=undefined){
			$(_mc).attr({
				"d-china-cases":val.countdown.china.case,
				"d-china-days":setChinaDdayFun(thisDate),
				"d-who-cases":val.countdown.who.case,
				"d-who-days":setWhoDdayFun(thisDate)
			});
		}
		if(i==0){
			allvalue=[setChinaDdayFun(thisDate),val.countdown.china.case,setWhoDdayFun(thisDate),val.countdown.who.case];		
		}
		$(".allDatasBox").append(_mc);
	})
	getNowCaseFun();
}
function setChinaDdayFun(thisDate){
	return Math.round((thisDate - new Date(Date.parse("2020/1/20"))) / (24 * 60 * 60 * 1000));
}
function setWhoDdayFun(thisDate){
	return Math.round((thisDate - new Date(Date.parse("2020/3/11"))) / (24 * 60 * 60 * 1000));
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
					for(var i=stageStartChange.length-1;i>=0;i--){
						if(stageStartChange[i]<=triggerD){
							$(".yearBox p").text(stageTxt[html_lang][i]);
							// console.log(i);
							break;
						}
					}	
					if(triggerD>=1577808000000){
						$(".yearBox h2").text(2020);
					}else{
						$(".yearBox h2").text(2019);
					}
					// if(triggerD>=1579449600000){
					// 	daysBoxChange=true;
					// 	$(".fixedBox").addClass('change');
					// 	$(".organizationBox .days > .txt span").text("cases");
					// 	$(".dividerBox span").text("days");
					// }else{
					// 	daysBoxChange=false;
					// 	$(".fixedBox").removeClass('change');
					// 	$(".organizationBox .days > .txt span").text("days");
					// 	$(".dividerBox span").text("Confirmed cases");						
					// }	
					// console.log(daysBoxChange);
					// console.log("inn",daysBoxChange,triggerD);
				},
				onEnterBack:function(progress, direction, isActive){
					// console.log("back");
					// console.log($(progress.trigger).prev());
					var triggerD=Number($(progress.trigger).attr("d-date"));
					for(var i=stageStartChange.length-1;i>=0;i--){
						if(stageStartChange[i]<=triggerD){
							$(".yearBox p").text(stageTxt[html_lang][i]);
							// console.log(i);
							break;
						}
					}	
					if(triggerD>=1577808000000){
						$(".yearBox h2").text(2020);
					}else{
						$(".yearBox h2").text(2019);
					}

					// if(triggerD>=1579449600000){
					// 	daysBoxChange=true;
					// 	$(".fixedBox").addClass('change');
					// 	$(".organizationBox .days > .txt span").text("cases");
					// 	$(".dividerBox span").text("days");
					// }else{
					// 	daysBoxChange=false;
					// 	$(".fixedBox").removeClass('change');
					// 	$(".organizationBox .days > .txt span").text("days");
					// 	$(".dividerBox span").text("Confirmed cases");						
					// }		
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
					toggleActions:"restart complete reverse complete",//onEnter onLeave onEnterBack onLeaveBack
					scrub:true,
					// markers: true,
					onLeave:function(progress, direction, isActive){
						// if(!daysBoxChange){
							$(".organizationBox.china .days > span").text(numberWithCommasFun(Math.floor(allvalue[0])));
							$(".caseBox .cases.china").text(numberWithCommasFun(Math.floor(allvalue[1])));
							$(".organizationBox.who .days > span").text(numberWithCommasFun(Math.floor(allvalue[2])));
							$(".caseBox .cases.who").text(numberWithCommasFun(Math.floor(allvalue[3])));		
						// }else{
						// 	$(".organizationBox.china .days > span").text(numberWithCommasFun(Math.floor(allvalue[1])));
						// 	$(".caseBox .cases.china").text(numberWithCommasFun(Math.floor(allvalue[0])));
						// 	$(".organizationBox.who .days > span").text(numberWithCommasFun(Math.floor(allvalue[3])));
						// 	$(".caseBox .cases.who").text(numberWithCommasFun(Math.floor(allvalue[2])));					
						// }
					},
					// onLeaveBack:function(){
					// 	console.log("onLeaveBack")
					// }
				},
				onUpdate:function(){
					// if(!daysBoxChange){
						$(".organizationBox.china .days > span").text(numberWithCommasFun(Math.floor(allvalue[0])));
						$(".caseBox .cases.china").text(numberWithCommasFun(Math.floor(allvalue[1])));
						$(".organizationBox.who .days > span").text(numberWithCommasFun(Math.floor(allvalue[2])));
						$(".caseBox .cases.who").text(numberWithCommasFun(Math.floor(allvalue[3])));		
					// }else{
						// $(".organizationBox.china .days > span").text(numberWithCommasFun(Math.floor(allvalue[1])));
						// $(".caseBox .cases.china").text(numberWithCommasFun(Math.floor(allvalue[0])));
						// $(".organizationBox.who .days > span").text(numberWithCommasFun(Math.floor(allvalue[3])));
						// $(".caseBox .cases.who").text(numberWithCommasFun(Math.floor(allvalue[2])));					
					// }
				}
			});
			tl2.to(allvalue,{"0": Number($(el).attr("d-china-days"))+1},"go")
				.to(allvalue,{"1": Number($(el).attr("d-china-cases"))},"go")
				.to(allvalue,{"2": Number($(el).attr("d-who-days"))+1},"go")
				.to(allvalue,{"3": Number($(el).attr("d-who-cases"))},"go");
		}
	})
	
	var tl3=gsap.timeline({
		scrollTrigger:{
			animation:tl3,
			trigger: $(".nowBox"),
		    start: "top bottom-=100px",
		    end: "top+=100px center-=20%",
			toggleActions:"restart complete reverse complete",//onEnter onLeave onEnterBack onLeaveBack
			scrub:false,
			// markers: true,
			// onEnter:function(){
			// 	console.log(allvalue);
			// }
		},
		onUpdate:function(){
			// if(daysBoxChange){
				// $(".organizationBox.china .days > span").text(numberWithCommasFun(Math.floor(allvalue[1])));
				// $(".caseBox .cases.china").text(numberWithCommasFun(Math.floor(allvalue[0])));
				// $(".organizationBox.who .days > span").text(numberWithCommasFun(Math.floor(allvalue[3])));
				// $(".caseBox .cases.who").text(numberWithCommasFun(Math.floor(allvalue[2])));			
			// }
			$(".organizationBox.china .days > span").text(numberWithCommasFun(Math.floor(allvalue[0])));
			$(".caseBox .cases.china").text(numberWithCommasFun(Math.floor(allvalue[1])));
			$(".organizationBox.who .days > span").text(numberWithCommasFun(Math.floor(allvalue[2])));
			$(".caseBox .cases.who").text(numberWithCommasFun(Math.floor(allvalue[3])));	
		},
	})
	// console.log($(".nowBox").attr("d-china-days"),$(".nowBox").attr("d-china-cases"),$(".nowBox").attr("d-who-days"),$(".nowBox").attr("d-who-cases"));
	tl3.to(allvalue,{"0": Number($(".nowBox").attr("d-china-days"))+1},"go")
		.to(allvalue,{"1": $(".nowBox").attr("d-china-cases")},"go")
		.to(allvalue,{"2": Number($(".nowBox").attr("d-who-days"))+1},"go")
		.to(allvalue,{"3": $(".nowBox").attr("d-who-cases")},"go");
}
function setTimeFun(){
	var nowD=new Date(),
		hour=nowD.getHours(),
		minute = nowD.getMinutes(),
		second = nowD.getSeconds();
	if(hour<10){
		hour="0"+String(hour);
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

function roundDecimal(val, precision) {
  return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
}