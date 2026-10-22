'use strict';
(function (Drupal, w, doc) {

  /****************************** CONSTANTS ***********************************/

  /****************************** VARIABLES ***********************************/

  // Decalring the HTML elements used in the following scripts.
  var tabsView, columnsView, contentSection, nav, navButtons, columns,
      navPointer, columnsViewContent, links, tabs, tabsView, mainMenu;

  var columnsViewLoaded = false;

  /****************************** FUNCTIONS ***********************************/

  /**
   * Scrolls to the index given in the hash.
   */
  var goToHash = function () {
    if (columnsViewLoaded && location.hash.length >= 2) {
      var i = location.hash.slice(1);
      var column = isNaN(i) ? 0 : columns.item(i);
      // Only continue if an item is found in columns with the index i.
      if (column && i > 0) {
        column.scrollTo();
      }
    }
  };

  var TabLinkResize = function () {
    var idWidth, nameWidth, animationAdjust;
    idWidth = this.getElementsByClassName(
        'tab-id').item(0).offsetWidth;
    nameWidth = this.getElementsByClassName(
        'name').item(0).offsetWidth;
    animationAdjust = nameWidth * 1.2 / 200;
    this.style.transitionDuration = animationAdjust + 's';
    this.style.width = idWidth + 'px';
  };


  var TabLinkMouseOver = function () {
    var idWidth, nameWidth, width;
    idWidth = this.getElementsByClassName(
        'tab-id').item(0).offsetWidth;
    nameWidth = this.getElementsByClassName(
        'name').item(0).offsetWidth;
    width = (idWidth + nameWidth) * 1.2;
    this.style.width = width + 'px';
  };

  var TabLinkMouseOut = function () {
    var idWidth = this.getElementsByClassName(
        'tab-id').item(0).offsetWidth;
    this.style.width = idWidth + 'px';
  };

  var columnsViewContentResize = function () {
    if (w.innerWidth > 720) {
      var width = 10, height = 10;
      forEach(columns, function (column, columnIndex) {
        width += column.clientWidth;
        if (columnIndex === columns.length - 1) {
          column.style.paddingLeft = '0';
          width += Math.max(columnsView.clientWidth - column.clientWidth,
              0);
          column.style.paddingLeft = '';
        }
        height = Math.max(height, column.clientHeight);
      });
      columnsViewContent.style.width = width + 'px';
      columnsViewContent.style.height = height + 'px';
      columnsView.dispatchEvent(new Event('load'));
    }
  };

  var forEach = [].forEach.call.bind([].forEach);
  
  /**
   * Returns a searchable HTML element.
   * Either the context or the main Document element.
   * @param HTMLElement context
   * @returns HTMLElement
   */
  var getContext = function(context) {
    return context.getElementsByClassName ? context : doc;
  };

  /****************************** Behaviors ***********************************/
  
  Drupal.behaviors.graphicallyTouch = {
    attach: function(context/*, settings*/) {
      context = getContext(context);
      var elements = context.getElementsByTagName("*");
      forEach(elements, function(element) {
        element.addEventListener('touchstart', function() {
          element.dataset.touch = 'start';
        });
        element.addEventListener('touchmove', function() {
          element.dataset.touch = 'move';
        });
        element.addEventListener('touchend', function() {
          if (element.dataset.touch === 'start') {
            element.dispatchEvent(new Event('tap'));
          }
          element.dataset.touch = null;
        });
      });
    }
  };
  
  Drupal.behaviors.graphicallyMenu = {
    attach: function (context/*, settings*/) {
//      #block-system-main-menu ul.menu li.expandable
      context = getContext(context);
      mainMenu = mainMenu || doc.getElementById('block-system-main-menu');
      var expandable = mainMenu.getElementsByClassName('expandable');
      forEach(expandable, function(listItem) {
        var link = listItem.children.item(0);
        var submenu = listItem.children.item(1);
        var height = 0;
        var submenuResize = function() {
          height = 0;
          forEach(submenu.children, function(child) {
            height += child.clientHeight;
          });
        };
        submenuResize();
        if (listItem.classList.contains('active-trail')) {
          submenu.style.height = height + 'px';
        }
        w.addEventListener('resize', submenuResize);
        link.addEventListener('click', function() {
          if (submenu.style.height === '') {
            submenu.style.height = height + 'px';
          }
          else {
            submenu.style.height = '';
          }
        });
      });
    }
  };
  
  Drupal.behaviors.graphicallyNavBar = {
    attach: function (context/*, settings*/) {
      context = getContext(context);
      // Get the tabs view, the content section and the columns view.
      tabsView = tabsView || context.getElementsByClassName(
          'view-display-id-tabs').item(0);
      contentSection = contentSection || context.getElementById('content');
      columnsView = columnsView || contentSection.getElementsByClassName(
          'view-display-id-columns').item(0);
      // Create a scroller object.
      var scroller = new Scroller(1000, contentSection)
          .easing(Scroller.EASING.easeInQuad);

      // Continue if both the tabs and the columns are available.
      if (columnsView && tabsView) {
        // Get the nav buttons and columns.
        nav = nav || tabsView.getElementsByClassName('nav').item(0);
        navButtons = navButtons || nav.getElementsByClassName('nav-button');
        columns = columns || columnsView.getElementsByClassName('views-row');

        forEach(columns, function (column/*, index*/) {
          if (!column.firstElementChild) {
            return;
          }
          // Add a scrolling method to each column
          column.scrollTo = function () {
            var left = column.firstElementChild.offsetLeft - contentSection.offsetLeft,
                top = column.firstElementChild.offsetTop - contentSection.offsetTop;
            scroller.to(left, top);
          };
        });

        // This load event is triggered at the end of 
        // Drupal.behaviors.graphicallyColumns after the width calculation of
        // each column.
        columnsView.addEventListener('load', function () {
          if (!columnsViewLoaded) {
            columnsViewLoaded = true;
            goToHash();
          }
        });

        w.addEventListener('hashchange', goToHash);

        // Add a click listener to all the nav buttons.
        forEach(navButtons, function (navButton, index) {
          var column = columns.item(index);
          if (column) {
            navButton.addEventListener('click', column.scrollTo);
          }
        });

        navPointer = navPointer || nav.getElementsByClassName(
            'nav-pointer').item(0);
        contentSection.addEventListener('scroll', function () {
          var currentColumn = columns.item(0), currentColumnIndex = 0,
              nextColumn = false;
          forEach(columns, function (column, index) {
            if (column.offsetLeft < contentSection.scrollLeft + contentSection.offsetLeft) {
              currentColumn = column;
              currentColumnIndex = index;
            }
            else if (!nextColumn) {
              nextColumn = column;
            }
          });
          var currentNavButton = navButtons.item(currentColumnIndex);
          var left = currentNavButton.offsetLeft;
          if (nextColumn) {
            var columnsLeftDiff = nextColumn.offsetLeft - currentColumn.offsetLeft;
            var columnsTravel = contentSection.scrollLeft + contentSection.offsetLeft - currentColumn.offsetLeft;
            var partial = columnsTravel / columnsLeftDiff;
            var currentNavButton = navButtons.item(currentColumnIndex);
            var nextNavButton = navButtons.item(currentColumnIndex + 1);
            left += partial * (nextNavButton.offsetLeft - currentNavButton.offsetLeft);
          }
          navPointer.style.left = left + "px";
        });
      }
    }
  };

  Drupal.behaviors.graphicallyColumns = {
    attach: function (context/*, settings*/) {
      context = getContext(context);
      columnsView = columnsView || context.getElementsByClassName(
          'view-display-id-columns').item(0);
      if (columnsView) {
        columnsViewContent = columnsViewContent || columnsView.getElementsByClassName(
            'view-content').item(0);
        columns = columns || columnsViewContent.getElementsByClassName(
            'views-row');
        forEach(columns, function (column) {
          var images = column.getElementsByTagName('img');
          forEach(images, function (image) {
            image.addEventListener('load', columnsViewContentResize);
          });
        });
        doc.addEventListener('DOMContentLoaded', columnsViewContentResize);
        w.addEventListener('resize', columnsViewContentResize);
        columnsViewContentResize();
      }
    }
  };

  Drupal.behaviors.graphicallyTabs = {
    attach: function (context/*, settings*/) {
      context = getContext(context);
      tabsView = tabsView || context.getElementsByClassName(
          'view-display-id-tabs').item(0);
      if (tabsView) {
        tabs = tabs || tabsView.getElementsByClassName('views-row');
        forEach(tabs, function (tab) {
          if (!tab.classList.contains('active')) {
            var tabLink = tab.children.item(0).getElementsByTagName('a').item(
                0);

            TabLinkResize.bind(tabLink)();
            w.addEventListener('resize', TabLinkResize.bind(tabLink));

            tabLink.addEventListener('mouseover', TabLinkMouseOver.bind(
                tabLink));
            tabLink.addEventListener('mouseout', TabLinkMouseOut.bind(
                tabLink));
          }
        });
      }
    }
  };

  Drupal.behaviors.fakeLinks = {
    attach: function (context/*, settings*/) {
      context = getContext(context);
      links = links || context.getElementsByTagName('a');
      forEach(links, function (link) {
        if (link.classList.contains('fake')) {
          link.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
          });
          var linkParent = link.parentNode;
          if (linkParent.classList.contains('fake')) {
            linkParent.addEventListener('click', function (e) {
              if (e.target === link) {
                linkParent.classList.toggle('expanded');
              }
            });
          }
        }
      });
    }
  };

})(Drupal, window, document);
