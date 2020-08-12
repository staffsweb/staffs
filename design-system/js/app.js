/* global Waypoint, console */

// @TODO: Learn to module bundle properly and manage dependencies with a proper
// package manager 🤦

// These are currently duplicated because we're using gulp-include as a
// replacement for CodeKit, it compiles with both as a fallback becuase it's
// @Sheerman's first time using Gulp.

//@codekit-prepend silent './vendor/jquery.hoverIntent';
//=include vendor/jquery.hoverIntent.js
//@codekit-prepend silent './vendor/smartResize';
//=include vendor/smartResize.js
//@codekit-prepend silent './vendor/slick-1.8.1/slick/slick';
//=include vendor/slick-1.8.1/slick/slick.js
//@codekit-prepend silent './vendor/waypoints/lib/jquery.waypoints.js';
//=include vendor/waypoints/lib/jquery.waypoints.js

// @TODO: at some point, it'd probably be nice if functions sat in
// 'eachIndividualComponentName.js' in each component folder and were imported
// rather than being here, like their Sass files

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
        $('body').removeClass('has-expanded-smallscreen-nav');
      }
      else {
        $(this).addClass('is-toggled');
        megaNav.addClass('is-open');
        $('body').addClass('has-expanded-smallscreen-nav');
      }
    });

    megaNavClose.on('click', function () {
      megaNavToggle.removeClass('is-toggled');
      megaNav.removeClass('is-open');
      $('body').removeClass('has-expanded-smallscreen-nav');
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
      }
      else {
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

        $('.js-slider--variable').slick("setPosition", 0); // how did we end up
                                                           // with tabs of
                                                           // sliders?
      })

      Waypoint.refreshAll(); // tabs' content may change the height of the page, thus these need to be recalculated
    });
  };

  let sliderInit = function () {
    $('.js-slider--tiles').slick({
      slidesToShow: 3.1,
      slidesToScroll: 3,
      infinite: false,
      swipeToSlide: true,
      waitForAnimate: false,
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
        swipeToSlide: true,
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

    $('.js-slider--gallery').each(function () {
      $(this).slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: false,
        adaptiveHeight: true,
        asNavFor: '.js-slider--gallery__nav',
        waitForAnimate: false
      });
    });

    $('.js-slider--gallery__nav').each(function () {
      $(this).slick({
        slidesToShow: 6.5,
        infinite: false,
        asNavFor: '.js-slider--gallery',
        centerMode: false,
        varableWidth: true,
        focusOnSelect: true,
        waitForAnimate: false,
        swipeToSlide: true,
        arrows: false
      });
    });

    Waypoint.refreshAll(); // sliders' content may change the height of the page, thus these need to be recalculated

  };

  let waypointsInit = function () {
    // Potential Refactor: in an ideal world, using Intersection Observer might be better for this

    $('.js-waypoint').each(function () {
      let el = $(this);

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

  let pageNavWaypointsInit = function () {
    // Potential Refactor: in an ideal world, using Intersection Observer might be better for this

    function getRelatedNavigation(targetid) {
      return $('.js-page-nav .page-nav__link[href="#' + targetid + '"]');
    }

    function centerActiveItem(item) {
      let list = $('.page-nav__list')[0];

      function isOverflowing(element) {
        return (element.scrollWidth > element.offsetWidth);
      }

      if (isOverflowing(list)) {
        let inner = $('.page-nav__inner')[0];

        let leftPos = item.position().left;
        let centeredPos = leftPos - ($(inner).width() / 2) + ($(item).width() / 2);

        $(inner).stop().animate({scrollLeft: centeredPos}, 250);
      }
    }

    $('.js-waypoint-page-section').each(function () {
      let el = $(this);

      el.waypoint(function (direction) {
        let activeItem = getRelatedNavigation(el.attr('id'));
        activeItem.toggleClass('is-active', direction === 'down');

        if (activeItem.hasClass('is-active')) {
          centerActiveItem(activeItem);
        }
      }, {
        offset: (window.innerHeight / 5)
      });

      el.waypoint(function (direction) {
        let activeItem = getRelatedNavigation(el.attr('id'));
        activeItem.toggleClass('is-active', direction === 'up');

        if (activeItem.hasClass('is-active')) {
          centerActiveItem(activeItem);
        }
      }, {
        offset: function () {
          return -($(el).height()) + window.innerHeight / 5;
        }
      });
    });

    $('.page-nav__link').on('click', function () {
      let target = $($(this).attr('href'));

      $('html, body').stop().animate({
        scrollTop: (target.offset().top - window.innerHeight / 10)
      }, 250);
    });

    $('#js-page-nav').each(function () {
      let el = $(this);

      el.waypoint(function (direction) {
        if (direction === 'down') {
          el.addClass('is-waypoint-reached');
        }
        else {
          el.removeClass('is-waypoint-reached');
        }
      }, {
        offset: 0
      });
    });
  };

  // --

  $(document).ready(function () {
    megaNavInit();
    tabsInit();
    sliderInit();
    waypointsInit();
    pageNavWaypointsInit();
  });

  $(window).on('load', function () {
    // correct anything loaded on DOM load which might need adjusting (mostly once images have loaded)

    Waypoint.refreshAll();
  });


  $(window).smartResize(function () {
    // events that need to fire after a window resize (or device rotation)
    Waypoint.refreshAll();
  });

})(jQuery);
