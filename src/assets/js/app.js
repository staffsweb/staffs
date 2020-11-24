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
//@codekit-prepend silent './vendor/jquery-ui.js';
//=include vendor/jquery-ui.js

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
    var tabCount = 1;

    $('.js-tabs').each(function () {
      let tabs = $(this);
      var tabId = 'tabs-' + tabCount;
      tabs.attr('id', tabId);
      tabCount++;
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
        let targetHref = '#' + tabId + ' ' + $(this).attr('href');

        sections.hide().removeClass('is-expanded');
        $(targetHref).show().addClass('is-expanded');

        links.removeClass('is-selected');
        $(this).addClass('is-selected');

        $('.js-slider--variable').slick("setPosition", 0); // how did we end up
                                                           // with tabs of
                                                           // sliders?
        Waypoint.refreshAll(); // height is liable to change, so we need to refresh these

      });

      Waypoint.refreshAll(); // tabs' content may change the height of the page, thus these need to be recalculated

      // CG: Check if we need to switch to a tab via a URL fragment
      var targetTabId = window.location.hash;

      if (targetTabId == "#courses__postgraduate") {
        $('.tabs__link[href="#courses__postgraduate"]', tabs).trigger('click');
        $("html, body").scrollTop(0);
      }
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
            centerPadding: '0%'
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

    $('.js-slider--responsive').slick({
      infinite: false,
      responsive: [{
        breakpoint: 99999,
        settings: 'unslick'
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1.2,
            slidesToScroll: 1
          }
        }
      ]
    });

    $('.js-slider--generic').slick({
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
      }).on('afterChange', function (){
        Waypoint.refreshAll(); // height is liable to change, so we need to refresh these
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
      }).on('afterChange', function (){
        Waypoint.refreshAll(); // height is liable to change, so we need to refresh these
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

  let sliderReInit = function (sliderCssSelector) {
    var slider = $(sliderCssSelector);
    if(slider) {
      slider.slick('reinit');
    }
  }

  let waypointsInit = function () {
    // CG Apply the "highlight" and "tail" styles to the appropriate headings in the page body automatically, ready for the animation to be added
    $("#page-body__content > h2, #page-body__content section h2, .mini-template-grid__column:first-child > h2, .slab > .wrap > h2").wrap("<div class='title  title--has-tail  js-waypoint'></div>").addClass("title__highlight");
    $(".mini-template-grid__column:not(:first-child) > h2").wrap("<div class='title'></div>").addClass("title__highlight");

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

  let autocompleteInit = function() {
    $.widget("custom.courseautocomplete", $.ui.autocomplete, {
      _create: function() {
        this._super();
        this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
      },
      _renderMenu: function( ul, items ) {
        var that = this,
          currentCategory = "";
        $.each( items, function( index, item ) {
          var li;
          if ( item.cat != currentCategory ) {
            ul.append( "<li class='course-search__category ui-autocomplete-category'>" + item.cat + "</li>" );
            currentCategory = item.cat;
          }
          li = that._renderItemData( ul, item );
          if ( item.cat ) {
            li.attr( "aria-label", item.cat + " : " + item.disp );
          }
        });
      },
      _renderItemData: function( ul, item) {
            var label = item.disp.replace(new RegExp('('+ $("#course-search__keywords").val() + ')', 'i'), '<strong>$1</strong>');
            ul.data('ui-autocomplete-item', item);
            return $("<li>")
              .data('ui-autocomplete-item', item )
              .append( "<div>" + label + "</div>" )
              .addClass('ui-menu-item ui-menu-item__course')
              .appendTo( ul );
        }
    });

    $("#course-search__keywords").courseautocomplete({
      source: function(request, response) {
        $.ajax({
            url: "https://search.staffs.ac.uk/s/search.html",
            dataType: "json",
            data: {
              meta_t_trunc : request.term.toLowerCase(), // CG: Accounts for mobile devices using sentence caps when doing autocorrect
              collection : 'staffordshire-coursetitles',
              profile : 'auto-completion',
              form : 'qc',
              meta_V_and: $("#course-search__level").find(":selected").val(),
              sort : 'dmetaV' // CG: Sorts by level of study, with UG first
            },
            success: function(data) {
                response(data);
            }
        });
      },
      minLength: 3,
      delay: 300,
      select: function(event, ui) {
        // CG: Redirect to the relevant course page
        window.location = ui.item.action;
        return false;
      }
    });

    $("#global-search__keywords--courses").courseautocomplete({
      source: function(request, response) {
        $.ajax({
            url: "https://search.staffs.ac.uk/s/search.html",
            dataType: "json",
            data: {
              meta_t_trunc : request.term.toLowerCase(), // CG: Accounts for mobile devices using sentence caps when doing autocorrect
              collection : 'staffordshire-coursetitles',
              profile : 'auto-completion',
              form : 'qc',
              sort : 'dmetaV' // CG: Sorts by level of study, with UG first
            },
            success: function(data) {
                response(data);
            }
        });
      },
      minLength: 3,
      delay: 300,
      select: function(event, ui) {
        // CG: Redirect to the relevant course page
        window.location = ui.item.action;
        return false;
      }
    });
  };

  let searchInit = function() {
    // CG: Show / hide the global search as appropriate
    $("#btn-search--desktop, #global-search__close").on("click", function(e) {
      $("#global-search").toggleClass("global-search--open");
    });

    $(document).on("keyup", function (e) {
      if(e.keyCode == 27) {
        $("#global-search").removeClass("global-search--open");
      }
    });

    // CG: Show / hide the appropriate global search field
    $("#global-search__options .global-search__scope").on("change", function(e) {
      var scope = $("#global-search__options .global-search__scope:checked").val();
      
      if(scope == "courses") {
        // Show the course search field
        $("#global-search__keywords--courses").removeClass("visually-hidden");
        $("#global-search__keywords--whole-site").addClass("visually-hidden");
      } else {
        $("#global-search__keywords--whole-site").removeClass("visually-hidden");
        $("#global-search__keywords--courses").addClass("visually-hidden");
      }
    });


    /* CG: Build search URLs */
    function courseSearchUrl(query, collection = "staffordshire-coursetitles", level = null) {

      if(level == "postgraduate") {
          return "https://search.staffs.ac.uk/s/search.html?collection=" + collection + "&f.Level%7CV=postgraduate+(taught)&f.Level%7CV=postgraduate+(research)&query=" + query;
      } else if (level == "undergraduate") {
          return "https://search.staffs.ac.uk/s/search.html?collection=" + collection + "&f.Level%7CV=undergraduate&query=" + query;
      }
      return "https://search.staffs.ac.uk/s/search.html?collection=" + collection + "&query=" + query;
    }

    function siteSearchUrl(query) {
      return "https://search.staffs.ac.uk/s/search.html?collection=staffordshire-main&query=" + query;
    }

    $("#global-search__keywords--whole-site").keyup(function (e) {

      // CG: Detect ENTER being pressed
      var keycode = (e.keyCode ? e.keyCode : e.which);
      if (keycode == '13') {
          $('#form1').on('submit', function (e) {
              e.preventDefault();
          });
          e.stopImmediatePropagation();

          window.location.href = siteSearchUrl($(this).val());
        }
        e.preventDefault();
    });

    $("#global-search__keywords--courses").keyup(function (e) {

      // CG: Detect ENTER being pressed
      var keycode = (e.keyCode ? e.keyCode : e.which);
      if (keycode == '13') {
          $('#form1').on('submit', function (e) {
              e.preventDefault();
          });
          e.stopImmediatePropagation();

          window.location.href = courseSearchUrl($(this).val());

        }
        e.preventDefault();
    });

    $("#course-search__submit").on("click", function(e) {
      $('#form1').on('submit', function (e) {
        e.preventDefault();
      });

      var searchTerm = $("#course-search__keywords").val();

      // CG: Check if the level is in a SELECT or a hidden field
      var level = $("#course-search__level").prop("tagName") == "OPTION" ? $("#course-search__level").find(":selected").val() : $("#course-search__level").val();

      window.location.href = courseSearchUrl(searchTerm, "staffordshire-coursetitles", level);

      e.preventDefault();

    });

    $("#course-search__keywords").keyup(function (e) {
      // CG: Do a course search when ENTER is pressed

      // CG: Detect ENTER being pressed
      var keycode = (e.keyCode ? e.keyCode : e.which);
      if (keycode == '13') {
        $('#form1').on('submit', function (e) {
            e.preventDefault();
        });
        e.stopImmediatePropagation();

        var searchTerm = $(this).val();
        var level = $("#course-search__level").prop("tagName") == "OPTION" ? $("#course-search__level").find(":selected").val() : $("#course-search__level").val();

        window.location.href = courseSearchUrl(searchTerm, "staffordshire-coursetitles", level);
      }
      e.preventDefault();
    });

    $("#megaNav-course-search__submit").on("click", function(e) {
      $('#form1').on('submit', function (e) {
        e.preventDefault();
      });
  
      var searchTerm = $("#megaNav-course-search__keywords").val();
  
      window.location.href = courseSearchUrl(searchTerm);
  
      e.preventDefault();
  
    });
  
    $("#megaNav-course-search__keywords").keyup(function (e) {
  
      var keycode = (e.keyCode ? e.keyCode : e.which);
      if (keycode == '13') {
        $('#form1').on('submit', function (e) {
            e.preventDefault();
        });
        e.stopImmediatePropagation();
  
        var searchTerm = $(this).val();
  
        window.location.href = courseSearchUrl(searchTerm);
      }
      e.preventDefault();
    });
  };

  let removeExistingSvgFills = function(parentClass) {
    var pathElms = document.querySelectorAll(parentClass + " svg path");

    if (pathElms && pathElms !== undefined && pathElms.length !== 0) {
        for (var x = 0; x < pathElms.length; x++) {
            pathElms[x].style.removeProperty('fill');
        }
    }
  };
  
  var modal = function modal() {
    var modalTriggers = document.querySelectorAll('[data-modal-trigger]');

    var count = 1;

    modalTriggers.forEach(function (trigger) {

      var modalTrigger = trigger.dataset.modalTrigger;
      var modal = document.querySelector("[data-modal=\"".concat(modalTrigger, "\"]"));

      trigger.setAttribute('data-modal-trigger', modalTrigger + "-" + count);
      modal.setAttribute('data-modal', modalTrigger + "-" + count);
      count++;

      trigger.addEventListener('click', function (event) {
        document.body.classList.add('modal__is-open');
        var modalTrigger = trigger.dataset.modalTrigger;
        var modal = document.querySelector("[data-modal=\"".concat(modalTrigger, "\"]"));

        modal.classList.add('is-open');
        
        var video = modal.querySelector("[data-video-src]"); 
        var hasVideo = video && video != undefined;

        if(hasVideo) {
          video.setAttribute('src', video.dataset.videoSrc);
        }

        modal.querySelector('[data-modal-close]').addEventListener('click', function () {
          modal.classList.remove('is-open');
          document.body.classList.remove('modal__is-open');
          
          if(hasVideo) {
            video.removeAttribute('src');
          }

        });
        
        event.preventDefault();
        var isSliderRefreshed = parseInt(modal.dataset.sliderIsrefreshed);
        if(isSliderRefreshed === 0) {
          sliderReInit("[data-modal=\"".concat(modalTrigger, "\"] .modal-slider"));
          modal.setAttribute("data-slider-isrefreshed", 1);
        }
      });
    });
  };

  $(document).ready(function () {
    megaNavInit();
    tabsInit();
    sliderInit();
    waypointsInit();
    pageNavWaypointsInit();
    searchInit();
    autocompleteInit();
    modal();
  });
  $(window).on('DOMContentLoaded', function () {
    // event triggers once DOM is loaded but before stylesheets are applied
    removeExistingSvgFills('.card--ksp');
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
