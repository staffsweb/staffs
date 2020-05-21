/* global jQuery */

// @codekit-prepend quiet './vendor/jquery.hoverIntent';
// @codekit-prepend quiet './vendor/smartResize';


(function ($) {

  let megaNavInit = function (){
    let megaNav = $('#megaNav');
    let megaNavFullBreakpoint = window.matchMedia('(min-width: 70rem)');

    function updateMegaNavBreakpointClass(){
      if (megaNavFullBreakpoint.matches) {
        megaNav.addClass('is-full-breakpoint');
      } else {
        megaNav.removeClass('is-full-breakpoint');
      }
    }

    updateMegaNavBreakpointClass();

    $(window).smartResize(function(){
      megaNavFullBreakpoint = window.matchMedia('(min-width: 70rem)');
      updateMegaNavBreakpointClass();
    });

    // let controls = megaNav.find('.megaNav__controls');

    $('.has-children', megaNav).on('click', function (e) {
      e.preventDefault();
      let item = $(this).parent();
      let siblings = item.siblings();


      $(siblings).find('.is-expanded').removeClass('is-expanded');
      $(siblings).removeClass('is-expanded')

      $(this).parent().addClass('is-expanded');
    });

    $('.megaNav__closeLevel', megaNav).on('click', function (e) {
      e.preventDefault();
      $(this).closest('.is-expanded').removeClass('is-expanded');
    });
  };

  // --

  $(document).ready(function () {
    megaNavInit();
  });

})(jQuery);
