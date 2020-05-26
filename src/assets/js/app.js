/* global jQuery */

// @codekit-prepend quiet './vendor/jquery.hoverIntent';
// @codekit-prepend quiet './vendor/smartResize';


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
      }
      else {
        megaNav.removeClass('is-largescreen');
        megaNav.addClass('is-smallscreen');
      }
    }

    updateMegaNavBreakpointClass();

    $(window).smartResize(function () {
      megaNavFullBreakpoint = window.matchMedia('(min-width: 70rem)');
      updateMegaNavBreakpointClass();
    });

    function expandChildren(link) {
      let item = $(link).parent();
      let siblings = item.siblings();

      $(siblings).find('.is-expanded').removeClass('is-expanded');
      $(siblings).removeClass('is-expanded')

      $(link).parent().addClass('is-expanded');
    }

    $(document).on('click', '#megaNav.is-smallscreen .has-children', function (e) {
      e.preventDefault();
      expandChildren($(this));
    });

    $(document).on('click', '#megaNav.is-largescreen .has-children', function (e) {
      e.preventDefault();
      expandChildren($(this));
    });

    $('#megaNav.is-largescreen').hoverIntent({
      over: function () {
        expandChildren($(this));
        let item = $(this).parent();
        let secondLevelLink = $('.megaNav__secondLevel-link.has-children', item).eq(0);
        expandChildren(secondLevelLink);
      },
      out: function () {
        // $(this).closest('.is-expanded').removeClass('is-expanded');
      },
      selector: '.megaNav__topLevel-link.has-children',
      sensitivity: 25
    });

    $('#megaNav.is-largescreen').hoverIntent({
      over: function () {
        expandChildren($(this));
        let item = $(this).parent();
        let thirdLevelLink = $('.megaNav__thirdLevel-link.has-children', item).eq(0);
        expandChildren(thirdLevelLink);
      },
      out: function () {
        // $(this).closest('.is-expanded').removeClass('is-expanded');
      },
      selector: '.megaNav__secondLevel-link.has-children',
      sensitivity: 75
    });

    $('#megaNav.is-largescreen').hoverIntent({
      over: function () {
      },
      out: function () {
        $('.is-expanded', megaNav).removeClass('is-expanded');
      },
      timeout: 250
    });

    $('.megaNav__closeLevel', megaNav).on('click', function (e) {
      e.preventDefault();
      $(this).closest('.is-expanded').removeClass('is-expanded');
    });


    // @TODO: HANDLE KEYBOARD FOCUS BETTER!

  };

  let tabsInit = function () {
    // @TODO: check accessibility - add AIRA/keyboard if needed

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

      links.on('click', function () {
        let targetHref = $(this).attr('href');

        sections.hide().removeClass('is-expanded');
        $(targetHref).show().addClass('is-expanded');

        links.removeClass('is-selected');
        $(this).addClass('is-selected');
      })
    });
  };

  // --

  $(document).ready(function () {
    megaNavInit();
    tabsInit();
  });

})(jQuery);
