const newEventModal	=	(prop,id)	=>{	

	evtDate		=	"";
	evtTime		=	"";
	evtTitle	=	"";
	evtDescription	=	"";

	mode	=	prop;
	

	
	$("#eventHandler input, #eventHandler textarea").val("");
	
	

	$("#eventHandler").modal("show");	


	if(mode	==	"new"){	render("active",eventList);	$("#eventHandler .modal-title").text("Esemény létrehozása");	objectId	=	"";		}
	else if(mode	==	"edit"	||	mode	==	"view"){

		evtDate			=	eventList[id]["time"].split(" ")[0];
		evtTime			=	eventList[id]["time"].split(" ")[1];
		evtTitle		=	eventList[id]["title"];
		evtDescription	=	eventList[id]["description"];				
		objectId		=	eventList[id].id;
		objectKey		=	id;
			
		
		
		
		$("#eventHandler .title").val(evtTitle);
		$("#eventHandler .description").val(evtDescription);
		$("#eventHandler .datepicker").val(evtDate);
		$("#eventHandler .timepicker").val(evtTime);
		
		$("#eventHandler .modal-title").text("Esemény módosítása");		
		$("#eventHandler .confirm").text("Módosítás");		


	
	
	
	}
	
	if(mode	==	"view"	||	mode	==	"filter"){	$("#eventHandler .modal-title").text("Esemény vizsgálata");	}

}

const saveEvent=	()	=>{
	



	
	msg	=	[];
	


	saveTime	=	evtDate +" "+	evtTime;
	eventId		=	new Date(	saveTime	).getTime();	


	if(	mode	==	"new"){	status	=	"active";	}
	else{

		status	=	eventList[objectKey].status;

	}




	evt	=	{id:eventId,	title:evtTitle,	time:saveTime,	description:evtDescription,	status:status};


	
	if(	chectAvalibleTime(eventId)	==	true && objectId !=	eventId){	msg.push("Az időpont foglalt");	}
	
	
	if(	isNaN(	eventId)	){	msg.push("Hibás dátum");}
	if(	evtTitle.length	<	3	){	msg.push("Rövid név");}
	
	
	if(msg.length>0){	
	
	
	$('.toast .toast-body').html("");
		msg.forEach(function(obj){	$('.toast .toast-body').append('<div>'	+	obj	+	'</div>');})
	
	$('.toast').toast("show");
	
	}//Hibajegyek
	else if(mode	==	"new"){
	
		
	
		eventList.push(evt);
		render("active",eventList);
		$("#eventHandler").modal("hide");
	
	}
	else if(mode	==	"edit"){

	
		$.each(eventList[objectKey],	function(key,val){
		
			eventList[objectKey][key]	=	evt[key];
		
		})
		
		render("active",eventList);
		$("#eventHandler").modal("hide");
	}	
	
	putToLocalStorage(eventList);

}




const putToLocalStorage	=	(obj)	=>{
	
	eventCounters();

	localStorage.setItem('eventList',JSON.stringify(obj));

}



const chectAvalibleTime	=	(timeStamp)	=>{

	error	=	false;
	eventList.forEach(function(obj,key){
	
		if(obj.id	==	timeStamp){
		
			error	=	true;
		
		}
		else{	}
	
	});
	
	return error;
}




const resize	=	()	=>{	$("#renderZone").width(	$(window).width()	-	$(".navMenu").width()	-25);}





const render	=	(status,object)	=>{

	if(typeof status	!=	"undefined"){
	
		lastStatus	=	status;
	
	}


	$("#renderZone").empty();

	object	=	object.sort((a, b) => {    return a.id - b.id;});



	object.forEach(function(obj,key){
	
		if(	obj.status	==	status	||	status	==	"all"		||	status	==	"filter"){
	
	
			if(obj.status	==	"active"){	color	=	"info";}else{	color	=	"danger";}
		
			if(obj.description.length	>	30){	obj.description	=	obj.description.substring(0, 30)	+	"...";	}
		
		
			$("#renderZone").append(
				'<div class="col-12 col-lg-3 eventCard">'	+
					'<div class="card" eventId="'	+	key	+	'">'	+
					  '<div class="card-body">'	+
					  
						'<h5 class="card-title">'	+	obj.title	+	
							'<button class="btn btn-danger fa fa-trash float-right del"></button>'	+
						
						
						'</h5>'	+
						'<h6 class="card-subtitle mb-2 text-'	+	color	+	'">'	+	obj.status	+	'</h6>'	+
						'<p class="card-text">'	+	obj.description		+	'</p>'	+
						'<p class="card-text text-secondary float-right mt-3"><small><em>'	+	obj.time		+	'</em></small></p>'	+
					
					  '</div>'	+
					'</div>'	+
				'</div>'
			
			);
			
			
			if(status	==	"filter"){
				
				
				
				$(".del").remove();
				$("#eventHandler input, #eventHandler textarea").prop("disabled",true);
				$("#eventHandler .confirm").prop("disabled",true);		

			}
		
		}
	
	})
	



}



const checkDate	=	(e)	=>{

	evtDate	=	$(e).val().toString()	;

}

const checkTime	=	(e)	=>{

	evtTime	=	e.toString().split(" ")[4].slice(0,-3);

}

const checkTitle	=	(e)	=>{

	evtTitle	=	$(e).val();

}

const checkDescription	=	(e)	=>{

	evtDescription	=	$(e).val();

}


const searchTrigger	=	()	=>{

	//$(".searchField").fadeToggle();
	$(".searchField").fadeToggle();
	$(".searchField").focus();

}



const searchEvents	=	(input)	=>{
	
	word	=	$(input).val().toLowerCase();
	
	tempArray	=	eventList.filter((obj) => { 
	
		if(	obj.title.toLowerCase().includes(word)	||	obj.description.toLowerCase().includes(word)	||	obj.time.toLowerCase().includes(word)){ return obj;}	
	
	
	} )
	

	render("filter",tempArray);

	
}





const eventCounters	=	()	=>{


	eventCounter	=	{all:0, active:0, inactive:0};

	eventList.forEach(function(obj){	
	
		eventCounter.all++;
		eventCounter[obj.status]++;
	
	})




	$(".allEvents").text(	eventCounter.all );
	$(".activeEvents").text(	eventCounter.active);
	$(".inactiveEvents").text(	eventCounter.inactive);
}	