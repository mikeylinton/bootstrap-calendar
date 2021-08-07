const today = new Date();
var checkIn = new Date();
var checkOut = new Date();
var unavailableDates = [21,22,28];


function getMonthArray(date) {
	month=date.getMonth();
	year=date.getFullYear();
	prevMonthCount = new Date(year,month,0).getDate();
	currMonthCount = new Date(year,month+1,0).getDate();
	nextMonthCount = new Date(year,month+2,0).getDate();
	startMonthDay = new Date(year,month,1).getDay();
	endMonthDay = new Date(year,month+1,0).getDay();
	return [prevMonthCount-startMonthDay+1,prevMonthCount,currMonthCount,6-endMonthDay];
}

function getMonthName(i) {
	var monthArray = [
		'January',
		'Febuary',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	return monthArray[i];
}

function getShortDate(date) {
	var shortDate=""
	if (date.getDate()<10) { shortDate+=0 }
	shortDate+=date.getDate()+"/"
	if (date.getMonth()<9) { shortDate+=0 }
	shortDate+=date.getMonth()+1+"/"+date.getFullYear()
	return shortDate;
}

function genCalendar(calendarButton,date) {
	var calendarType="";
	if (calendarButton.id=="calendarCheckInButton") { calendarType="Check in"; }
	else if (calendarButton.id=="calendarCheckOutButton") { calendarType="Check out"; }
	var monthArray=getMonthArray(date);
	var pageItemStatus="";
	if (date.getFullYear()==today.getFullYear() && date.getMonth()<=today.getMonth()) { pageItemStatus=" disabled"; }
	var calendarBody=`
		<ul class="pagination justify-content-center">
			<li id="calendarPrevMonthButton" class="page-item`+pageItemStatus+`">
				<a class="page-link" href="#" aria-label="Previous">
					<span aria-hidden="true">&laquo;</span>
				</a>
			</li>
			<li class="page-item"><a class="page-link" href="#">`+getMonthName(date.getMonth())+` `+date.getFullYear()+`</a></li>
			<li id="calendarNextMonthButton" class="page-item">
				<a class="page-link" href="#" aria-label="Next">
					<span aria-hidden="true">&raquo;</span>
				</a>
			</li>
		</ul>
		<div class="row calendar-weekdays">
			<div class="col">Sun</div>
			<div class="col">Mon</div>
			<div class="col">Tue</div>
			<div class="col">Wed</div>
			<div class="col">Thu</div>
			<div class="col">Fri</div>
			<div class="col">Sat</div>
		</div>
		<div class="row calendar-row">
	`;
	var d=0

	for (i=monthArray[0];i<=monthArray[1];i++) {
		d++;
		calendarBody+='<div class="col"><div class="calendar-date unavailable">'+i+'</div></div>';
		if (d%7==0) { calendarBody+='</div><div class="row calendar-row">'; }
	}

	var j=0;
	for (i=1;i<=monthArray[2];i++) {
		d++;
		if (i==unavailableDates[j]) { availability="unavailable";j++; }
		else if (date == today && i < today.getDate()) { availability="unavailable"; }
		else { availability="available" }
		calendarBody+='<div class="col"><div id="'+i+'" class="calendar-date '+availability+'">'+i+'</div></div>';
		if (d%7==0) {
                        calendarBody+='</div>';
                        if (i<monthArray[2]) {calendarBody+='<div class="row calendar-row">';}
                }
	}

	for (i=1;i<=monthArray[3];i++) {
		d++;
		calendarBody+='<div class="col"><div class="calendarDate unavailable">'+i+'</div></div>';
		if (d%7==0) {
                        calendarBody+='</div>';
                	if (i<monthArray[3]) {calendarBody+='<div class="row calendar-row">';}
                }
	}
	document.getElementById("calendarBody").innerHTML=calendarBody;
	
	if (calendarType+": "+getShortDate(date)==calendarButton.innerHTML) { 
		if (calendarButton.id=="calendarCheckInButton") { 
			document.getElementById(date.getDate()).style.background="lightblue"; 
		}
		else if (calendarButton.id=="calendarCheckOutButton") {
			for (j=checkIn.getDate();j<=date.getDate();j++) { document.getElementById(j).style.background="lightblue"; }
		}
	}
	if (calendarButton.id=="calendarCheckOutButton") {
		document.getElementById(checkIn.getDate()).style.background="lightblue";
	}
	/* 
	else if (calendarButton.id=="calendarCheckOutButton" && calendarType+": "+getShortDate(checkIn)==document.getElementById("calendarCheckInButton").innerHTML) {
		document.getElementById(checkIn.getDate()).style.background="lightblue";
	}
	*/
	else { document.getElementById("calendarTitle").innerHTML=calendarButton.innerHTML; }
	
	document.getElementById("calendarPrevMonthButton").addEventListener("click", function() {
		if (date.getMonth()>today.getMonth() || date.getFullYear()>today.getFullYear()) {  
			date.setMonth(date.getMonth()-1);
			genCalendar(calendarButton,date);
		}
	});

	document.getElementById("calendarNextMonthButton").addEventListener("click", function() {
		date.setMonth(date.getMonth()+1);
		genCalendar(calendarButton,date);
	});

	var calendarDateAvailable = document.getElementsByClassName("calendar-date available");
	for (i=0;i<calendarDateAvailable.length;i++) {
		calendarDateAvailable[i].addEventListener("click", function() {
				if (calendarButton.id=="calendarCheckInButton") { 
					document.getElementById(date.getDate()).style.background="#FFF";
					this.style.background="lightblue"; 
				}
				else if (calendarButton.id=="calendarCheckOutButton") {
					for (j=checkIn.getDate();j<=checkOut.getDate();j++) { document.getElementById(j).style.background="#FFF"; }
					for (j=checkIn.getDate();j<=this.innerHTML;j++) { document.getElementById(j).style.background="lightblue"; }
				}
				date.setDate(this.innerHTML);
				document.getElementById("calendarTitle").innerHTML=calendarType+": "+getShortDate(date);
				
		});
	}
	document.getElementById("calendarConfirmButton").addEventListener("click", function() { 
		calendarButton.innerHTML=calendarType+": "+getShortDate(date);

		if (calendarButton.id=="calendarCheckInButton" && document.getElementById("calendarCheckInButton").innerHTML=="Check in: "+getShortDate(checkIn)) { document.getElementById("calendarCheckOutButton").disabled = false; }
		else if (document.getElementById("calendarCheckOutButton").innerHTML=="Check out: "+getShortDate(checkOut) && document.getElementById("calendarCheckInButton").innerHTML=="Check in: "+getShortDate(checkIn)) { 
			document.getElementById("calendarConfirmBookingButton").disabled = false; 
		}
	});
}

document.getElementById("calendarCheckInButton").addEventListener("click", function() { genCalendar(this,checkIn); });

document.getElementById("calendarCheckOutButton").addEventListener("click", function() { genCalendar(this,checkOut); });
