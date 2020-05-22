/* global jQuery */

// @codekit-prepend quiet './vendor/jquery.hoverIntent';
// @codekit-prepend quiet './vendor/smartResize';


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

  // --

  $(document).ready(function () {
    megaNavInit();
  });

})(jQuery);
