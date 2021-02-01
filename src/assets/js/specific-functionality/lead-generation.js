let leadGenInit = function() {
    var leadGenActive = $("#lead-gen").length > 0 ? true : false; // CG: Only if lead gen is present on the page

    $(document).on("scroll", function(e) {
        // CG: Limit scrolling past entry requirements
        if(leadGenActive) {
            var dontScrollPast = $("#scroll-limit").offset().top;
            var windowScrollTop = $(document).scrollTop();
            if(windowScrollTop >= dontScrollPast) {
                $("#lead-gen").slideDown("slow");
                $(document).scrollTop(dontScrollPast);
            } 
            
            if(windowScrollTop < dontScrollPast - 10) {
                $("#lead-gen").slideUp("slow");
            }
        }
    });

    $("#lead-gen__submit-btn").on("click", function(e) {
        e.preventDefault();
        var requiredFieldsCompleted = true;

        // CG: Validate each field in turn
        if($("#address-1").val() == null) { requiredFieldsCompleted = false; }
        if($("#address-2").val() == null) { requiredFieldsCompleted = false; }
        if($("#city-or-town").val() == null) { requiredFieldsCompleted = false; }
        if($("#email").val() == null) { requiredFieldsCompleted = false; }
        if($("#firstname").val() == null) { requiredFieldsCompleted = false; }
        if($("#lastname").val() == null) { requiredFieldsCompleted = false; }
        if($("#mobileno").val() == null) { requiredFieldsCompleted = false; }
        if($("#postcode").val() == null) { requiredFieldsCompleted = false; }
        if($("[name='PREF_EMAIL']:checked").val() == null) { requiredFieldsCompleted = false; }
        if($("[name='PREF_MAIL']:checked").val() == null) { requiredFieldsCompleted = false; }
        if($("[name='PREF_SMS']:checked").val() == null) { requiredFieldsCompleted = false; }
        if($("[name='PREF_TELEPHONE']:checked").val() == null) { requiredFieldsCompleted = false; }
        if($("[name='YEAR_OF_ENTRY']:checked").val() == null) { requiredFieldsCompleted = false; }

        if(requiredFieldsCompleted) {
            $("#loading-spinner--lead-gen").show();

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
                $("#loading-spinner--lead-gen").hide();
                // CG: Replace the form fields with the success message
                $("#lead-gen__form").html("<h2>Thank you</h2><p class='text-center'>Your request has been sent.</p>");
                $('.slick-slider').slick('refresh');
                setCookie("HideLeadGen", 1, 30);
                setTimeout(function () {
                    $("#lead-gen").remove();
                }, 5000);
            })
            .fail(function() {
                $("#loading-spinner--lead-gen").hide();
                $("#lead-gen__form").html("<h2>An error occurred</h2><p>Sorry - there was a problem submitting your request. Please try again later.</p>");
            });
        } else {
            alert("Please check that you have completed all required fields.");
        }
    });

    $("#lead-gen__no-btn").on("click", function(e) {
        e.preventDefault();
        $(".lead-gen").slideUp("slow");
        setCookie("HideLeadGen", 1, 30);
        leadGenActive = false;
    });

    $("#lead-gen-form__close").on("click", function(e) {
        $("#lead-gen-prospectus__form, #lead-gen-updates__form").hide();
    });
};