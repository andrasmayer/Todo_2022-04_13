$(window).resize(function(){	resize();	})






$(document).ready(function(){



	eventList = localStorage.getItem('eventList');
	if(eventList	== null){
	
		eventList	=	'[]';
	
	
	}
	
	eventList	=	JSON.parse(eventList);



	$.datepicker.setDefaults( $.datepicker.regional[ "hu" ] );
	$(".datepicker").datepicker({   dateFormat: 'yy-mm-dd'});
	
	 $('.timepicker').timepicker({  timeFormat: 'HH:mm',zindex: 9999999,change:checkTime});

	resize();

	

	$("body").on("click",".eventCard .card",function(e){
	
		if(	$(e.target).hasClass("del")	==	false){
		
			if($(this).parent().find(".del").length	==	0){	mode	=	"view";}else{	mode	=	"edit";	}
		
			newEventModal(mode,	$(this).attr("eventId")		);
			
			
		
		}
		else{
			
			
		
			
			if(	eventList[$(this).attr("eventId")].status	==	"active"	){
			
				eventList[$(this).attr("eventId")].status	=	"inactive";
			
			
			}
			else{
			
				eventList.splice($(this).attr("eventId")	, 1);
				
				$(this).parent().remove();
				
			
				
				
			}
			
			render(lastStatus,eventList);
			putToLocalStorage(eventList);
		
		}
	
	})


	$(".searchField").on("focusout",function(){	$(this).hide();	$(this).val("");})



})
