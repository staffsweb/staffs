/* global jQuery */

// import './vendor/waypoints/lib/jquery.waypoints';
// import './vendor/slick-1.8.1/slick/slick';

// import './../../components/megaNav/megaNav';

(function ($) {

  let megaNavInit = function (){
    let megaNav = $('#megaNav');
    let controls = megaNav.find('.megaNav__controls');

    $('.has-children', megaNav).on('click', function (e) {
      e.preventDefault();
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
