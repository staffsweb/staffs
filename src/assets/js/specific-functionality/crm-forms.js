let crmFormsInit = function() {
    $("#consent-to-all-btn").on("click", function(e) {
		e.preventDefault();
		// CG: Set all buttons to "yes"
		$("#pref-sms-yes, #pref-email-yes, #pref-mail-yes, #pref-tel-yes").prop("checked", true);
	});
};