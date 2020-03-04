// import './vendor/waypoints/lib/jquery.waypoints';
// import './vendor/slick-1.8.1/slick/slick';

(function ($) {

  let initNav = function() {
    $(document).on('click', '#toggle-nav-primary', function(e){
      e.preventDefault();
      $('#superfish-main-toggle').trigger('click'); // horrible way of doing this, but we just want to call all the events that happen when the plugin would perform this action.
    });

    $(document).on('click', '#toggle-site-search, .sf-main > li:last-child > a', function(e){
      // this is a bit of a horrible way of doing this, but it works with superfish
      e.preventDefault();
      $('.sf-main > li:last-child > a').toggleClass('is-active');
      $('#toggle-site-search').toggleClass('is-active');
      $('#site-search').toggle().toggleClass('is-active');
    });
  };

  let initTabs = function(){
    $('.js-tabs').each(function(){
      $(this).find('nav a').each(function(){
        let target = $(this).attr('href');
        $(target).hide();
      });

      let firstTab = $(this).find('li:first-child a').attr('href');
      $(this).find('li:first-child a').parents('li').addClass('is-active');
      $(firstTab).show();
    });

    $('.js-tabs').on('click', 'nav a', function(e){
      e.preventDefault();
      let target = $(this).attr('href');
      let tabs = $(this).parents('.js-tabs').find('.js-tabs__content');

      tabs.hide();
      $(target).show();

      $(this).parents('.js-tabs').find('li').removeClass('is-active');
      $(this).parents('li').addClass('is-active');
    });
  };

  let initDonations = function(){
    $('.js-donate-app').each(function () {
      let donateApp = $(this);
      let giftAid = donateApp.find('.donation-giftaid__optin');
      let inputSingle = donateApp.find('#amount_s');
      let inputMonthly = donateApp.find('#amount_m');

      $('.donate-preview-s').hide();
      $('.donate-preview-m').hide();

      giftAid.each(function () {
        let thisGA = $(this);

        thisGA.find('input[type=checkbox]').on('change', function () {
          let terms = thisGA.find('.donation-giftaid__legal');
          terms.toggle();
        });
      });

      $([inputMonthly, inputSingle]).each(function(){
        $(this).on('focus', function() {
          donateApp.find('input[name="donate-value"]').prop('checked', false);
        });
      });

      $(inputSingle).on('keyup change', function() {
        $('#ga_total_s').html((this.value * 1.25).toFixed(2));
        $('#ga_sub_s').html((this.value * 0.25).toFixed(2));
        if ($("#paypal #amount_p").length) {
          $("#paypal #amount_p").val(this.value);
          replace_custom_value('giftaid_amount',(this.value * 0.25).toFixed(2));
        }
      });

      $('#donate-single input[name=donate-value]').on('change', function() {
        $('.donate-preview-s').hide();
        $('#donate-preview-s-' + this.value).show();
        $('#amount_s').val(this.value);
        $('#ga_total_s').html((this.value * 1.25).toFixed(2));
        $('#ga_sub_s').html((this.value * 0.25).toFixed(2));
      });

      $(inputMonthly).on('keyup change', function() {
        $('#ga_total_m').html((this.value * 1.25).toFixed(2));
        $('#ga_sub_m').html((this.value * 0.25).toFixed(2));
      });

      $('#donate-monthly input[name=donate-value]').on('change', function() {
        $('.donate-preview-m').hide();
        $('#donate-preview-m-' + this.value).show();
        $('#amount_m').val(this.value);
        $('#ga_total_m').html((this.value * 1.25).toFixed(2));
        $('#ga_sub_m').html((this.value * 0.25).toFixed(2));
      });

      if ($('#donate-single input[name=donate-value]:checked').length > 0) {
        var default_donate_amount_s = $('#donate-single input[name=donate-value]:checked').val();
        $('#donate-preview-s-' + default_donate_amount_s).show();
        $('#amount_s').val(default_donate_amount_s);
        $('#ga_total_s').html((default_donate_amount_s * 1.25).toFixed(2));
        $('#ga_sub_s').html((default_donate_amount_s * 0.25).toFixed(2));
      } else {
        $('#amount_s').val(10);
        $('#ga_total_s').html((10 * 1.25).toFixed(2));
        $('#ga_sub_s').html((10 * 0.25).toFixed(2));
      }

      if ($('#donate-monthly input[name=donate-value]:checked').length > 0) {
        var default_donate_amount_m = $('#donate-monthly input[name=donate-value]:checked').val();
        $('#donate-preview-m-' + default_donate_amount_m).show();
        $('#amount_m').val(default_donate_amount_m);
        $('#ga_total_m').html((default_donate_amount_m * 1.25).toFixed(2));
        $('#ga_sub_m').html((default_donate_amount_m * 0.25).toFixed(2));
      } else {
        $('#amount_m').val(5);
        $('#ga_total_m').html((5 * 1.25).toFixed(2));
        $('#ga_sub_m').html((5 * 0.25).toFixed(2));
      }

      $('.has-scroll-behaviour #donate-single input[name=donate-value]').on('click', function() {
        $('.donation-giftaid__optin').removeClass('pulse-once');

        if ($(this).val().length > 0) {
          if ($('#giftaid_s').offset().top > (window.pageYOffset + window.innerHeight/1.2)) {
            $('html, body').animate({
              scrollTop: $('#giftaid_s').offset().top - window.innerHeight / 10
            }, 500, function () {
              if (!($('#edit-vso-donation-giftaid-s').is(':checked'))) {
                $('#giftaid_s .donation-giftaid__optin').addClass('pulse-once');
              }
            });
          }
        }
      });

      $('.has-scroll-behaviour #donate-monthly input[name=donate-value]').on('click', function() {
        $('.donation-giftaid__optin').removeClass('pulse-once');

        if ($(this).val().length > 0) {
          if ($('#giftaid_m').offset().top > (window.pageYOffset + window.innerHeight/1.2)) {
            $('html, body').animate({
              scrollTop: $('#giftaid_m').offset().top - window.innerHeight / 10
            }, 500, function () {
              if (!($('#edit-vso-donation-giftaid-m').is(':checked'))) {
                $('#giftaid_m .donation-giftaid__optin').addClass('pulse-once');
              }
            });
          }
        }
      });

      $('#edit-vso-donation-giftaid').change(function() {
        if (this.checked) {
          replace_custom_value ('giftaid_flag', 1);
          // the checkbox is now checked
        } else {
          replace_custom_value ('giftaid_flag', 0);
          // the checkbox is now no longer checked
        }
      });

      function replace_custom_value (key, newval) {

        if ($("#paypal #custom").length) {

          let oldstr = $("#paypal #custom").val();

          var params = oldstr.split('&');
          var pararray = {};

          $.each(params, function (i, l) {
            var parts = l.split('=');
            pararray[parts[0]] = parts[1];
          });

          pararray[key] = newval;

          // var out = ''; never used
          var out_chunks = [];

          $.each(pararray, function(index, value){
            out_chunks.push(index+'='+value);
          });

          $("#paypal #custom").val(out_chunks.join('&'));
        }
      }

      // function setDefaultAmount(default_amount_selector) {
      //   var default_amount = $(donateApp).find(default_amount_selector).attr('data-default');
      //   $(default_amount_selector).find('input[type="radio"][value="' + default_amount + '"]').click();
      //
      //   $(donateApp, '.donation-tabs__nav a').on('click', function (event) {
      //     var default_amount = $(donateApp).find(event.target.hash + ' .inline-optionbuttons').attr('data-default');
      //     $(event.target.hash + ' .inline-optionbuttons').find('input[type="radio"][value="' + default_amount + '"]').click();
      //   })
      // }
      //
      // function setDefaultAmountForPanelsOnly(default_amount_selector) {
      //   $(default_amount_selector).find('.default-donation-amount .card').click();
      //
      //   $(donateApp, '.donation-tabs__nav a').on('click', function (event) {
      //     $(event.target.hash + ' .grid-card-optionbuttons').find('.default-donation-amount .card').click();
      //   })
      // }

      function setDefaultTab() {
        if ($(donateApp).hasClass('default-monthly')) {
          $(donateApp).find('.donation-tabs__nav a[href="#donate-monthly"]').click();
          // setDefaultAmount('#donate-monthly .inline-optionbuttons');
          // setDefaultAmountForPanelsOnly('#donate-monthly .grid-card-optionbuttons');
        }
        else {
          $(donateApp).find('.donation-tabs__nav a[href="#donate-single"]').click();
          // setDefaultAmount('#donate-single .inline-optionbuttons');
          // setDefaultAmountForPanelsOnly('#donate-single .grid-card-optionbuttons');
        }
      }
      setDefaultTab();
    });
  };

  let initNewsletterToggle = function(){
    $('.js-toggle-newsletter-signup').on('click', function (e) {
      e.preventDefault();

      $('.js-newsletter-signup').slideDown(250, function () {
        $('html, body').stop().animate({
          scrollTop: ($('.js-newsletter-signup').offset().top + 2)
        }, 500);
      });
    });
  };

  $(document).ready(function () {
    initNav();
    initTabs();
    initDonations();
    initNewsletterToggle();
  });

})(jQuery);
