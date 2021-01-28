let leadGenInit = function() {
    $("#lead-gen__submit-btn").on("click", function(e) {
        e.preventDefault();

        var fields = $(".crm-form--prospectus-request-lead-gen").find("input[data-required='true'], select[data-required='true']:visible, textarea[data-required='true']");

        if(requiredFieldsCompleted(fields)) {
            $("#loading-spinner").show();

            $.post("/api/CrmLeadGen/HandleProspectusRequest", {
                "ADD1": $("#address-1").val(),
                "ADD2": $("#address-2").val(),
                "CITYORTOWN": $("#city-or-town").val(),
                "COURSE_OF_SUBJECT": $("#COURSE_OF_SUBJECT").val(),
                "EMAIL": $("#email").val(),
                "FIRSTNAME": $("#firstname").val(),
                "LANDINGPAGE": $("#LANDINGPAGE").val(),
                "LASTNAME": $("#lastname").val(),
                "MARKETING_CAMPAIGN": $("#MARKETING_CAMPAIGN").val(),
                "MARKETING_MEDIUM": $("#MARKETING_MEDIUM").val(),
                "MARKETING_SOURCE": $("#MARKETING_SOURCE").val(),
                "MOBILENO": $("#mobileno").val(),
                "POSTCODE": $("#postcode").val(),
                "PREF_EMAIL":  $("[name='PREF_EMAIL']:checked").val(),
                "PREF_MAIL":  $("[name='PREF_MAIL']:checked").val(),
                "PREF_SMS": $("[name='PREF_SMS']:checked").val(),
                "PREF_TELEPHONE": $("[name='PREF_TELEPHONE']:checked").val(),
                "SUBJECT": $("#SUBJECT").val(),
                "YEAR_OF_ENTRY":  $("[name='YEAR_OF_ENTRY']:checked").val()
            })
            .done(function(data) {
                $("#loading-spinner").hide();
                // CG: Replace the form fields with the success message
                $(".crm-form--prospectus-request-lead-gen").html("<h2><span><svg xmlns='http://www.w3.org/2000/svg' class='icon icon-tick-green'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-tick-green'></use></svg></span> Thank you</h2><p class='text-center'>Your request has been sent.</p>");
                $(".hide-for-lead-gen").removeClass("visuallyhidden");
                $('.slick-slider').slick('refresh');
                setCookie("HideLeadGenProspectus", 1, 30);
                setTimeout(function () {
                    $("#lead-gen-prospectus, #lead-gen-prospectus__form").remove();
                }, 5000);
            })
            .fail(function() {
                $("#loading-spinner, #lead-gen-form").hide();
                $(".crm-form--prospectus-request-lead-gen").html("<h2>An error occurred</h2><p>Sorry - there was a problem submitting your request. Please try again later.</p>");
            });
        }
    });

    $("#lead-gen__no-btn").on("click", function(e) {
        e.preventDefault();
        $(".lead-gen").slideUp("slow");
        showContentHiddenForLeadGen();
        setCookie("HideLeadGenProspectus", 1, 30);
        hideLeadGenProspectus = 1;
    });

    $("#lead-gen-form__close").on("click", function(e) {
        $("#lead-gen-prospectus__form, #lead-gen-updates__form").hide();
    });
};