window.onload = function(){
	document.getElementById('footCompany').outerHTML = "All information submitted on " + document.location.host
};

$(document).ready(function(){
	window.currentStep = 1;
	window.totalSteps = 1;
	window.sessionId = Math.random().toString(36).slice(2);



	function clearAll(classname){
		$("."+classname).each(function(){
			while($(this).hasClass('selected')){
				$(this).removeClass('selected');
			}
		})
	}


	function getValue(elem){
		return elem.data('value')
	}


	
	$("#submitBtn").click(function(e){
		e.preventDefault();
		
		if($("#phone").val().replace(/\D/g, '').length == 10 || ($("#phone").val().replace(/\D/g, '').length == 11 && $("#phone").val().replace(/\D/g, '')[0] == "1" ) ){
			markProgress("phone", "phoneError", "", false)
			$("#form").submit();
		}else{
			markProgress("phone", "phoneError", "Invalid phone number", true)
		}
	})

	var getUrlParameter = function getUrlParameter(sParam) {
		var sPageURL = window.location.search.substring(1),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;
	
		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');
	
			if (sParameterName[0] === sParam) {
				return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
			}
		}
		return '';
	};

	let name = getUrlParameter("name") || getUrlParameter("fullname") || getUrlParameter("fullName") || "";
	if (!name) {
		const
			fname = getUrlParameter("fname") || getUrlParameter("first_name") || "",
			lname = getUrlParameter("lname") || getUrlParameter("last_name") || "";
		if (fname) name = fname + " ";
		if (lname) name += lname;
	}
	
	$("#phone").val(getUrlParameter("phone"));
	$("#uid").val(getUrlParameter("id"));

	function markProgress(id, errorId, message, show){
		if(show){
			// show means error
			if( !$("#"+id).hasClass("error") ) $("#"+id).addClass("error")
			$("#" + errorId).text(message)
		}else{
			if( $("#"+id).hasClass("error") ) $("#"+id).removeClass("error")
			$("#" + errorId).text("")
		}
	}
})
