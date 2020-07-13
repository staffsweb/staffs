

// @TODO: Learn to module bundle properly and manage dependencies with a proper package manager 🤦
//@codekit-prepend silent './vendor/jquery.hoverIntent';
//@codekit-prepend silent './vendor/smartResize';
//@codekit-prepend silent './vendor/slick-1.8.1/slick/slick';
//@codekit-prepend silent './vendor/waypoints/lib/jquery.waypoints.js';

/* global Waypoint */

// @TODO: at some point, it'd probably be nice if functions sat in 'eachIndividualComponentName.js'
// in each component folder and were imported rather than being here, like their Sass files

(function ($) {

  let megaNavInit = function () {

    let megaNav = $('#megaNav');
    let megaNavToggle = $('#toggle-megaNav');
    let megaNavClose = $('#megaNav__close');
    let megaNavFullBreakpoint = window.matchMedia('(min-width: 70rem)');

    megaNavToggle.on('click', function () {
      var navIsOpen = megaNav.hasClass('is-open');

      if (navIsOpen) {
        $(this).removeClass('is-toggled');
        megaNav.removeClass('is-open');
      } else {
        $(this).addClass('is-toggled');
        megaNav.addClass('is-open');
      }
    });

    megaNavClose.on('click', function () {
      var navIsOpen = megaNav.hasClass('is-open');

      if (navIsOpen) {
        megaNavToggle.removeClass('is-toggled');
        megaNav.removeClass('is-open');
      } else {
        megaNavToggle.addClass('is-toggled');
        megaNav.addClass('is-open');
      }
    });

    function updateMegaNavBreakpointClass() {
      if (megaNavFullBreakpoint.matches) {
        megaNav.addClass('is-largescreen');
        megaNav.removeClass('is-smallscreen');

        $('#megaNav.is-largescreen, .megaNav__topLevel-item.has-children, .megaNav__secondLevel-item.has-children, #megaNav.is-smallscreen .has-children > a').unbind();

        $('#megaNav.is-largescreen').hoverIntent({
          over: function () {
            let item = $(this);
            expandChildren(item);
            let secondLevelItem = $('.megaNav__secondLevel-item.has-children', item).eq(0);
            expandChildren(secondLevelItem);
          },
          out: function () {
            $(this).closest('.is-expanded').removeClass('is-expanded');
          },
          selector: '.megaNav__topLevel-item.has-children',
          sensitivity: 25,
          timeout: 200
        });

        $('#megaNav.is-largescreen').hoverIntent({
          over: function () {
            let item = $(this);
            expandChildren(item);
            let thirdLevelItem = $('.megaNav__thirdLevel-item.has-children', item).eq(0);
            expandChildren(thirdLevelItem);
          },
          out: function () {
            // $(this).closest('.is-expanded').removeClass('is-expanded');
          },
          selector: '.megaNav__secondLevel-item.has-children',
          sensitivity: 75
        });

        $('#megaNav.is-largescreen').hoverIntent({
          over: function () {
            $('body').addClass('has-expanded-nav');
          },
          out: function () {
            $('.is-expanded', megaNav).removeClass('is-expanded');
            $('body').removeClass('has-expanded-nav');
          },
          timeout: 200
        });

        $('.has-expanded-nav').on('click', function () { 
          $('.is-expanded', megaNav).removeClass('is-expanded');
          $('body').removeClass('has-expanded-nav');
        });

      }
      else {
        $('body, #megaNav.is-largescreen, .megaNav__topLevel-item.has-children, .megaNav__secondLevel-item.has-children, #megaNav.is-smallscreen .has-children > a').unbind();

        megaNav.removeClass('is-largescreen');
        megaNav.addClass('is-smallscreen');

        $(document).on('click', '#megaNav.is-smallscreen .has-children > a', function (e) {
          e.preventDefault();
          expandChildren($(this).parent());
        });

        $('.megaNav__closeLevel', megaNav).on('click', function (e) {
          e.preventDefault();
          $(this).closest('.is-expanded').removeClass('is-expanded');
          $('.megaNav__topLevel').scrollTop(0);
        });
      }
    }

    updateMegaNavBreakpointClass();

    $(window).smartResize(function () {
      megaNavFullBreakpoint = window.matchMedia('(min-width: 70rem)');
      updateMegaNavBreakpointClass();
    });

    function expandChildren(item) {
      let siblings = item.siblings();

      $('.is-expanded', siblings).removeClass('is-expanded');
      $(siblings).removeClass('is-expanded');

      $('.megaNav__topLevel').scrollTop(0);

      $(item).addClass('is-expanded');
    }



    // @TODO: Check keyboard focus - could it be handled better?

  };

  let tabsInit = function () {
    // @TODO: check accessibility - add AIRA/keyboard if needed
    // @TODO: consider using history.pushState?
    // @TODO: perhaps add something to handle switching to a tab when its ID is the URL hash?

    $('.js-tabs').each(function () {
      let tabs = $(this);
      let links = $('.tabs__link', tabs);
      let sections = $('.tabs__section', tabs);
      let defaultTab = $('.tabs__link.is-selected', tabs).attr('href');

      sections.hide();

      if (defaultTab) {
        $(defaultTab).show();
      } else {
        $(links[0]).addClass('is-selected');
        $(sections[0]).show().addClass('is-expanded');
      }

      links.on('click', function (e) {
        e.preventDefault();
        let targetHref = $(this).attr('href');

        sections.hide().removeClass('is-expanded');
        $(targetHref).show().addClass('is-expanded');

        links.removeClass('is-selected');
        $(this).addClass('is-selected');

        $('.js-slider--variable').slick("setPosition", 0); // how did we end up with tabs of sliders?
      })
    });
  };

  let sliderInit = function () {
    $('.js-slider--tiles').slick({
      slidesToShow: 3.1,
      slidesToScroll: 3,
      infinite: false,
      responsive: [
        {
          breakpoint: 1000,
          settings: {
            slidesToShow: 2.1,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 700,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: true,
            centerPadding: '5%'
          }
        }
      ]
    });

    $('.js-slider--event-cards').slick({
      slidesToShow: 3.1,
      slidesToScroll: 3,
      infinite: false,
      responsive: [
        {
          breakpoint: 1000,
          settings: {
            slidesToShow: 2.5,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1.25,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 360,
          settings: {
            slidesToShow: 1.1,
            slidesToScroll: 1
          }
        }
      ]
    });

    $('.js-slider--accolades').slick({
      slidesToShow: 5,
      slidesToScroll: 5,
      infinite: false,
      responsive: [
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 3.25,
            slidesToScroll: 3
          }
        },
        {
          breakpoint: 500,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 360,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: true,
            centerPadding: '5%'
          }
        }
      ]
    });

    $('.js-slider--variable').each(function () {
      $(this).slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: false,
        centerMode: true,
        centerPadding: '10%',
        adaptiveHeight: true,
        variableWidth: true,
        responsive: [
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      });
    });


  };

  let waypointsInit = function () {
    $('.js-waypoint').each(function () {
      var el = $(this);

      el.waypoint(function (direction) {
        if (direction === 'down') {
          el.addClass('is-waypoint-reached');
        }
        else {
          el.removeClass('is-waypoint-reached');
        }
      }, {
        offset: (Waypoint.viewportHeight() - (window.innerHeight / 50))
      });
    });
  };

  // --

  $(document).ready(function () {
    megaNavInit();
    tabsInit();
    sliderInit();
    waypointsInit();
  });

})(jQuery);
