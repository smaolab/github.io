/**
 * Anonymous class to begin the work
 * @class
 * @author Pirhoo <pierre.romera@gmail.com>
 * @version 1.0
 */
;(function($, window, undefined) {

    var site = {}, scrollDuration = 0, scrollOptions = { offset: 38};

    /**
     * Event when we try to filter the list
     * @function
     * @public
     */
    site.filterList = function(event) {

        event.preventDefault();

        var target = $(this).attr('href').replace('#', '');

        site.el.$filters.find('a').removeClass('selected');
        $(this).addClass('selected');

        // if we wanna show every vignette
        if(target === 'all') {
            // show every vignette
            site.el.$vignette.removeClass('hidden');
            // update the layout of every vignette
            site.el.$works.masonry('reload');
            // stops here
            return;
        }

        // tests every vignette
        site.el.$vignette.each(function(i, vignette) {

            var $vignette = $(vignette);

            if($vignette.data('type') === target)
                $vignette.removeClass('hidden');
            else
                $vignette.addClass('hidden');

        });


        // update the layout of every vignette
        site.el.$works.masonry('reload');
        //  ajust the scroll
        site.el.$menu.find('a[href="#works"]').trigger('click');
    };



    /**
     * DOM ready function
     *
     * @function
     * @public
     */
    $(window).load(site.ready = function() {

        site.el = {
            $content  : $('#content'),
            $overflow : $('#content > .overflow'),
            $cascade  : $('.cascade'),
            $works    : $('#works'),
            $vignette : $('#works .vignette'),
            $filters  : $('.filters'),
            $menu     : $('menu:first'),
            $subMenu  : $('#sub-menu'),
            $tracker  : $('#tracker')
        };

        // Open link in a new window
        $('a').each(function() {
           var a = new RegExp('/' + window.location.host + '/');
           if(!a.test(this.href)) {
               $(this).click(function(event) {
                   event.preventDefault();
                   event.stopPropagation();
                   window.open(this.href, '_blank');
               });
           }
        });

        // initializes masonry to define the layout of each vignette
        site.el.$cascade.masonry({
            // options
            itemSelector : '.vignette:not(.hidden)',
             // except with css transition
            isAnimated: false
        });

        // initializes the Meny menu
        var meny = window.Meny.create({
            menuElement: site.el.$menu[0],
            contentsElement: site.el.$content[0],
            position: 'left',
            width: 211
        });/**/

        // the user wanna filter the list
        site.el.$filters.find('li a').bind('click touchend', function(e) { site.filterList.call(this, e); });

        $('menu h2 a').bind('click touchend', function(event) {

            event.preventDefault();
            $('menu h2 a').removeClass('active').filter(this).addClass('active');

            var target = $(this).attr('href');
            // Prevent scroll queing
            window.jQuery.scrollTo.window().queue([]).stop();
            site.el.$overflow._scrollable().stop(true);
            // Avoid a scroll delay when we scroll to the bottom
            site.el.$overflow.scrollTo('100%');
            //  ajust the scroll
            site.el.$overflow.scrollTo( target, scrollDuration, scrollOptions);

        });

        $('#sub-menu li').bind('click touchend', function() {
            var target = '#' + $(this).data('target');
            site.el.$menu.find('h2 a[href="'+target+'"]').trigger('click');
        });

        // The same for all waypoints
        site.el.$overflow.delegate('.screen', 'waypoint.reached', function(event, direction) {

            var $this = $(this);
            // if we are going up, selects the previous screen
            if (direction === 'up') {
                $this = $this.prev();
                // check if there is a previous element
                if( $this.length === 0 ) $this = $(this);
            }
            var id = $this.attr('id');

            // update the menu
            site.el.$menu.find('h2 a').removeClass('active').filter('[href="#' + id + '"]').addClass('active');
            site.el.$subMenu.find('li').removeClass('active').filter('[data-target=' + id +']').addClass('active');

            // update the tracker
            site.el.$tracker.empty().html( $this.find('h1').html() );
            // update the window url
            if(window.Modernizr.history) window.history.pushState('home', '', '#' + $this.attr('id') );
        });

        // Register each screen as a waypoint.
        site.el.$overflow.find('.screen').waypoint({
            context: site.el.$overflow,
            offset: '50%',
            continuous: false
        }); /**/

        // Scroll to the right element
        if(window.location.hash !== '') {
            // Prevent scroll queing
            window.jQuery.scrollTo.window().queue([]).stop();
            site.el.$overflow._scrollable().stop(true);
            // Avoid a scroll delay when we scroll to the bottom
            site.el.$overflow.scrollTo('100%');

            site.el.$overflow.scrollTo( window.location.hash, 0, scrollOptions);
        }
    });


})(window.jQuery, window);

// shim layer with setTimeout fallback
// (Paul Irish method http://paulirish.com/2011/requestanimationframe-for-smart-animating/)
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();
