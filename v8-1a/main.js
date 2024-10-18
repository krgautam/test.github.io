$(document).ready(function(){
	$.get("/toggleCaller").then( function(res){
		$("#toggle").val(res.enabled)
	})

	window.currentStep = 1;
	window.totalSteps = 2;
	window.sessionId = Math.random().toString(36).slice(2);

	$('#form').bind('keypress keydown keyup', function(e){
       if(e.keyCode == 13) { 
       	e.preventDefault(); 
       	if(window.currentStep < 3){
       		$("#step"+window.currentStep + " .nextBtnMain").trigger("click");
       	}else{
       		$("#submitBtn").trigger("click");
       	}
       }
    });

	function initCash(){
		let start = 0;
		let step = 25000;
		let found = false;

		while(start < 2000000){
			let addon = '';
			if(!found){
				if(start == 25000){
					addon = 'selected';
					found = true
				}
			}
			// add the item
			$("#cashout").append('<option ' + addon + ' value="' + start + '">$' + (start == 0 ? 0 : start/1000) + 'k</option>')
			start += step;
		}
	}

	function initDownPayment(){
		let start = 0;
		let step = 10000;
		let found = false;
		let homeVal = parseInt($("#homeValue").val());
		while(start < 300000){
			// add the item
			let addon = '';
			if(!found){
				if(start >= (homeVal*0.2)){
					addon = 'selected';
					found = true
				}
			}

			$("#downPayment").append('<option ' + addon + ' value="' + start + '">$' + (start == 0 ? 0 : start/1000) + 'k</option>')
			start += step;
		}
	}

	initDownPayment();
	//initCash();

	function clearAll(classname){
		$("."+classname).each(function(){
			while($(this).hasClass('selected')){
				$(this).removeClass('selected');
			}
		})
	}

	function logStep(step){
		var page = window.location.href.split("?")[0];

		if(step == window.totalSteps || step == window.totalSteps.toString()){
			step = "submit"
		}

		var obj = {"sessionId": window.sessionId, "xxTrustedFormCertUrl": $("#xxTrustedFormCertUrl_0").val(), "universal_leadid": $("#leadid_token").val(), "step": step, "s1": $("#s1").val(), "s2": $("#s2").val(), "s3": $("#s3").val(), "page": page};
		/*if(step == "1"){
			obj['loan_type'] = $("#refiPurchase").val();
			obj['phone'] = $("#phone").val();
			obj['token'] = $("#token").val();
			obj['toggle'] = $("#toggle").val();
		}*/
		if(step == "1"){
			obj['loan_type'] = 'Refinance';
			obj['phone'] = $("#phone").val();
			obj['token'] = $("#token").val();
			obj['toggle'] = $("#toggle").val();

			obj['fullName'] = $("#fullName").val();
			obj['email'] = $("#email").val();
			obj['address'] = $("#address").val();
			obj['state'] = $("#state").val();
			obj['zip'] = $("#zipCode").val();
		}
		/*if(step == "3"){
			obj['loan_type'] = $("#refiPurchase").val();
		}*/
		// if(step == "2"){
			/*obj['f_homeB'] = $("#f_homeB").val();
			obj['purchase_time_frame'] = $("#purchase_time_frame").val();
			obj['downPaymentB'] = $("#downPayment").val();
			obj['bankruptcyB'] = $("#fhaBankForeclosure").val();
			obj['ANNUAL_VERIFIABLE_INCOME'] = $("#annualVeriableIncome").val();
			obj['loanTypeB'] = $("#loanType").val();
			obj['NUM_MORTGAGE_LATES'] = $("#numMortgageLates").val();
			obj['VA_STATUS'] = $("#vaStatus").val();*/
		// }
		/*if (step == "4") {
			// Optional values step
			obj['propertyPurpose'] = $("#propertyPurpose").val();
			obj['prefCalltime'] = $("#prefCalltime").val();
			obj['language'] = $("#language").val();
			obj['occupationalStatus'] = $("#occupationalStatus").val();
			obj['bankruptcyInPastTwoYears'] = $("#bankruptcyInPastTwoYears").val();
			obj['consumerComments'] = $("#consumerComments").val();

			obj['firstTimeBuyer'] = $("#firstTimeBuyer").val();
			obj['signedPurchasedContract'] = $("#signedPurchasedContract").val();
		}*/
		if(step == "submit"){
			obj['propType'] = $("#propertyDescription").val();
			obj['homeValue'] = $("#homeValue").val();
			obj['loanValue'] = $("#loanValue").val();
			obj['cash_out_amount'] = $("#cashout").val();
			obj['is_military'] = $("#vaStatus2").val();
			obj['cRating'] = $("#creditProfile").val();
		}
		$.ajax({
			url: 'https://wf.lftrkr.com/t_step',
			type: 'POST',
			contentType: 'application/x-www-form-urlencoded',
			data: obj,
			success: function( data, textStatus, jQxhr ){
				console.log('ok');
			},
			error: function( jqXhr, textStatus, errorThrown ){
				console.log( errorThrown );
			}
		});
	}

	function getValue(elem){
		return elem.data('value')
	}

	/*
	$('#refiPurchase').change(function() {
		if ($(this).val() === "Refinance") {
			$("#refiArea").removeClass("hidden");
			$('#stateBlock').addClass('hidden');
			$("#purchaseArea").addClass("hidden");
			// $("#HPBlock").addClass("hidden");
			markProgress("refiPurchase", "loanTypeError", "", false)
		} else if ($(this).val() === "Purchase") {
			$("#refiArea").addClass("hidden");
			$('#stateBlock').removeClass('hidden');
			$("#purchaseArea").removeClass("hidden");
			// $("#HPBlock").removeClass("hidden");
			markProgress("refiPurchase", "loanTypeError", "", false)
		} else {
			$('#stateBlock').addClass('hidden');
			$("#refiArea").addClass("hidden");
			$("#purchaseArea").addClass("hidden");
			// $("#HPBlock").addClass("hidden");
			markProgress("refiPurchase", "loanTypeError", "Please select your desired loan type", true)
		}
	})
	$('#refiPurchase').val('Refinance');
	$('#refiPurchase').trigger('change');
	*/

	$(".nextBtnMain").click(function(){		
		$("#headline").hide()
		let errors = 0;
		let step = $(this).attr("data-step")
		logStep(step)
		/*if(step == "1"){
			if($("#refiPurchase").val().length){
				markProgress("refiPurchase", "loanTypeError", "", false)				
			}else{
				errors += 1
				markProgress("refiPurchase", "loanTypeError", "Please select your desired loan type", true)
			}
			
			if($("#phone").val().replace(/\D/g, '').length == 10 || $("#phone").val().replace(/\D/g, '').length == 11){
				markProgress("phone", "phoneError", "", false)
			}else{
				errors += 1
				markProgress("phone", "phoneError", "Invalid phone number", true)
			}

			if (!errors) {
				$("#headline").hide()
			}
		}*/

		if(step == "1"){
			if(validateFullInfo() == false){
				errors += 1
			}
		}

		/*if(step == "3"){
			if($("#refiPurchase").val() == "Refinance"){
				$("#refiArea").removeClass("hidden")
			}else{
				$("#purchaseArea").removeClass("hidden")
			}
		}*/

		if(errors == 0){
			$("#step" + step).slideUp();
			let next = parseInt(step)+1
			$("#step" + next).slideDown(500).css("display", "grid")
			window.currentStep = next;

			if(step == "2"){
				setTimeout(function(){
					$('html, body').animate({
		                scrollTop: $("#step2").offset().top
		            }, 50);
				}, 500);
			}else{
				setTimeout(function(){
					$('html, body').animate({
		                scrollTop: $("body").offset().top
		            }, 100);
				}, 601);	
			}	
		}
	})

	$("#submitBtn").click(function(e){
		e.preventDefault();
		logStep("2");
		$("#submitBtn").children("svg").removeClass('hidden');
		$("#submitBtn").attr('disabled', 'disabled');
		$("#submitBtn").addClass('cursor-not-allowed');	
		setTimeout(function(){
			$("#form").submit();
		}, 600)
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
		return "";
	};
	$("#s1").val(getUrlParameter("s1"));
	$("#s2").val(getUrlParameter("s2"));
	$("#s3").val(getUrlParameter("s3"));
	$("#token").val(getUrlParameter("token"));
	if($("#token").val().length > 0){
		let phone = getUrlParameter("phone");
		if(phone.length == 11){
			phone = phone.substr(1)
		}
		$("#phone").val(phone);
	}
	$("#page").val(window.location.href.split("?")[0]);
	
	const rand = Math.random();

	logStep("0");

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

	function IsEmail(email) {
		var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if(!regex.test(email)) {
		  return false;
		}else{
		  return true;
		}
	}

	function validateFullName(fullName){
		var parts = fullName.split(" ");
		var longParts = 0;
		for(var counter = 0; counter < parts.length; counter++){
			if(parts[counter].trim().length > 0) longParts += 1
		}
		return longParts >= 2
	}

	function validateFullInfo(){
		var errors = 0;

		/*if ($('#refiPurchase').val() === "PP_NEWHOME") {
			// validate state
			if ($("#state").val().length == 2) {
				// it's ok
				markProgress("state", "stateError", "", false)
			} else if (!$("#state").val().length) {
				// mark issue
				errors += 1
				markProgress("state", "stateError", "State is required", true)
			} else {
				// mark issue
				errors += 1
				markProgress("state", "stateError", "Invalid state. Only US state abbrivations allowed", true)
			}
		}*/

		if($("#phone").val().replace(/\D/g, '').length == 10 || $("#phone").val().replace(/\D/g, '').length == 11){
			// it's ok
			markProgress("phone", "phoneError", "", false)
		}else{
			// mark issue
			errors += 1
			markProgress("phone", "phoneError", "Invalid phone number", true)
		}

		if($("#zipCode").val().replace(/\D/g, '').length == 5 ){
			// it's ok
			markProgress("zipCode", "zipError", "", false)
		}else{
			// mark issue
			errors += 1
			markProgress("zipCode", "zipError", "Invalid zip code", true)
		}

		// validate address
		if($("#address").val().length > 0){
			markProgress("address", "addressError", "", false)
		}else{
			// mark issue
			errors += 1
			markProgress("address", "addressError", "Address is required", true)
		}

		// validate first name
		if(validateFullName($("#fullName").val())){
			markProgress("fullName", "fullNameError", "", false)
		}else{
			errors += 1;
			markProgress("fullName", "fullNameError", "Full name is required", true)
		}

		// validate email
		if(IsEmail($("#email").val())){
			markProgress("email", "emailError", "", false)
		}else{
			errors += 1
			markProgress("email", "emailError", "Invalid email address", true)
		}

		return errors == 0;
	}

    let clickSent = false;
    function initCall() {
        if (clickSent) return;

        clickSent = true;
        if ($("#phone").val().length > 0 && $("#token").val().length > 0) {
            console.log('sent at:', new Date());
            var obj = {
                phone: $("#phone").val(),
                token: $("#token").val(),
                page: $("#page").val(),
                s1: $("#s1").val(),
                s2: $("#s2").val(),
                s3: $("#s3").val(),
                product: "Refinance",
                universal_leadid: $('#leadid_token').val()
            }
            $.ajax({
                url: '/sClick',
                type: 'POST',
                contentType: 'application/x-www-form-urlencoded',
                data: obj,
                success: function( data, textStatus, jQxhr ){
                    console.log('ok');
                },
                error: function( jqXhr, textStatus, errorThrown ){
                    console.log( errorThrown );
                }
            });
        }
    }

	// disabling sClick
	/*
	// check every second if universal_leadid is populated
    let uid = null;
    const uid_Interval = setInterval(() => {
        uid = $('#leadid_token').val();
        if (uid) {
            initCall();
            clearInterval(uid_Interval);
        }
    }, 1000);

    // adding 8 seconds delay so if universal_leadid was not populated then send click wihtout it
    setTimeout(() => {
        if (!uid) initCall();
    }, 8000);
	*/
})