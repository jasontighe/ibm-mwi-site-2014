var IBMMasters = IBMMasters || {};

/**
 * Namespace function, safely creates a namespace without clobbering existing objects
 * @param {String} namespace A string in the form of 'IBMMobileFirst.SE.package.subpackage'
 * @returns {Object}
 */
IBMMasters.namespace = function(namespaceString) {
    var parts = namespaceString.split('.'),
        parent = window,
        currentPart = '';
    for (var i = 0, length = parts.length; i < length; i++) {
        currentPart = parts[i];
        parent[currentPart] = parent[currentPart] || {};
        parent = parent[currentPart];
    }
    return parent;
};


(function($) {
      	
    var that = this;
        
    IBMMasters.namespace('IBMMasters.homepage');
    IBMMasters.homepage = {

    	init: function() {
    		console.log('IBMMasters.homepage.init');
    		this.getSiteJson('./stories/js/app/json/site.json');
	    },

      getSiteJson: function(jsonFileUrl) {
        console.log('IBMMasters.homepage.getSiteJson: '+jsonFileUrl);
        var that = this;
        $.ajax({
          dataType: "json",
          url: jsonFileUrl,
          success: that.onSiteJsonLoaded,
          error: that.onJsonLoadError
        });
      },

      onSiteJsonLoaded: function(responseObj, statusText, xhr) {
        console.log('IBMMasters.homepage.onSiteJsonLoaded');
        console.log('statusText = '+statusText);
        console.log('site JSON',responseObj);
        // store site json to use in template
        IBMMasters.homepage.siteJson = responseObj;

        // MAKE GLOBAL VARS Start.
        var i = 0;
        var I = IBMMasters.homepage.siteJson.length;
        for( i; i < I; i++)
        {
          var id = IBMMasters.homepage.siteJson[i].id;
          if( id === "globalVars")
          {
            IBMMasters.homepage.learn_more_label = IBMMasters.homepage.siteJson[ i ].learn_more_label;
            IBMMasters.homepage.cloud = IBMMasters.homepage.siteJson[ i ].cloud;
            IBMMasters.homepage.data = IBMMasters.homepage.siteJson[ i ].data;
            IBMMasters.homepage.mobile = IBMMasters.homepage.siteJson[ i ].mobile;
            IBMMasters.homepage.social = IBMMasters.homepage.siteJson[ i ].social;
            IBMMasters.homepage.watson = IBMMasters.homepage.siteJson[ i ].watson;
          }
        }
        // MAKE GLOBAL VARS End.




        // load stories JSON
        IBMMasters.homepage.getJson('./stories/js/app/json/stories.json');
      },

	    getJson: function(jsonFileUrl) {
	    	console.log('IBMMasters.homepage.getJson: '+jsonFileUrl);
	    	var that = this;
	    	$.ajax({
          dataType: "json",
          url: jsonFileUrl,
          success: that.onJsonLoaded,
          error: that.onJsonLoadError
			  });
	    },

	    onJsonLoaded: function(responseObj, statusText, xhr) {
	    	console.log('IBMMasters.homepage.onJsonLoaded');
	    	console.log('statusText = '+statusText);
	    	console.log('JSON',responseObj);
        // store json to sort tiles by filter later
        IBMMasters.homepage.json = responseObj;
        // render json into tiles and init filter menu
        IBMMasters.homepage.onReady();
	    },

	    onJsonLoadError: function(jqXHR, textStatus, errorThrown) {
	    	console.log('IBMMasters.homepage.onJsonLoadError');
	    	console.log('jqXHR Obj',jqXHR);
			  console.log('textStatus = '+textStatus);
			  console.log('errorThrown = '+errorThrown);
	    },

      onReady: function() {
        $(document).ready(function() {
          console.log('IBMMasters.homepage.onReady');
          // render site.json data templates
          IBMMasters.homepage.renderSidebarNav(IBMMasters.homepage.siteJson);
          IBMMasters.homepage.renderFiltersMenu(IBMMasters.homepage.siteJson);
          IBMMasters.homepage.renderHeaderCarousel(IBMMasters.homepage.siteJson);
          IBMMasters.homepage.renderFooter(IBMMasters.homepage.siteJson);
          // render all tiles in stories.json data
          IBMMasters.homepage.renderTiles(IBMMasters.homepage.json);
          // initialize filter menu
          IBMMasters.homepage.filterMenu.init();
          // initialize sidebar nav
          IBMMasters.sidebarNav.init();
        });
      },

      renderSidebarNav : function(data) {
        console.log('IBMMasters.homepage.renderSidebarNav')

        var sourcePrimary   = $("#sidebar-nav-primary-template").html();
        var templatePrimary = Handlebars.compile(sourcePrimary);
        var contextPrimary  = data[1]; // nav object in json
        var htmlPrimary     = templatePrimary(contextPrimary);
        $('ul.iscrollee').append(htmlPrimary);

        var sourceSecondary   = $("#sidebar-nav-secondary-template").html();
        var templateSecondary = Handlebars.compile(sourceSecondary);
        var contextSecondary  = data[2]; // links object in json
        var htmlSecondary     = templateSecondary(contextSecondary);
        $('ul.iscrollee').append(htmlSecondary);
      },

	renderHeaderCarousel : function(data) {
        console.log('IBMMasters.homepage.renderHeaderCarousel')

        var sourceCarousel   = $("#home-page-carousel-template").html();
        var templateCarousel = Handlebars.compile(sourceCarousel);
        var contextCarousel  = data[3]; // home_slides object in json
        
        console.log(contextCarousel);
        var htmlCarousel     = templateCarousel(contextCarousel);
        $('div.header').append(htmlCarousel);
        
        var version = $.browser.version; // 10.0
	    var versionInt = Math.floor(version);
	    if ($.browser.msie && versionInt <= 10) { // IE cinemagraph render glitch
	      $('#slide1-bg').attr('data-src', 'img/slides/slide1-bg.jpg');
	      console.log('MSIE = '+$.browser.msie);
	      console.log('version = '+versionInt);
	    } else {
	      $('#slide1-bg').attr('data-src', 'img/slides/slide1-bg.gif');
	    }

    

	    FastClick.attach(document.body);

    function isMobile() {
      var userAgent = navigator.userAgent || navigator.vendor || window.opera;
      return ((/iPhone|iPod|Android|BlackBerry|Opera Mini|IEMobile/).test(userAgent));
    }
    
    /* Add mobile carousel header images */
    if( isMobile() ){
      jQuery('div[data-src]').each(function(){
        var imgPath = jQuery(this).attr('data-src');
        var periodIndex = imgPath.indexOf('.');
        var mobileImgPath = imgPath.substr(0, periodIndex) + "_mobile.jpg";
        jQuery(this).attr('data-src',mobileImgPath);
      });
    }
	
	    jQuery('#camera_wrap_1').camera({
	      alignment: 'center',
	      mobileAutoAdvance: true,
	      fx:'simpleFade',
	      minHeight:'200px',
	      height: '400px',
	      playPause:false,
	      loader: 'bar',
	      pagination: true,
	      thumbnails: false,
	      opacityOnGrid: false,
	      imagePath: './img/',
	      hover: true,
	      navigationHover: false,
	      mobileNavHover: false,
	      navigation: true
	    });

      that.picturefill();

      },



      renderFiltersMenu : function(data) {
        console.log('IBMMasters.homepage.renderFiltersMenu')

        var sourceFilters   = $("#filter-menu-template").html();
        var templateFilters = Handlebars.compile(sourceFilters);
        var contextFilters  = data[1]; // nav object in json
        var htmlFilters     = templateFilters(contextFilters);
        $('#filter-menu').append(htmlFilters);
      },

      renderFooter : function(data) {
        console.log('IBMMasters.homepage.renderFooter')

        var sourceNavList   = $("#footer-nav-list").html();
        var templateNavList = Handlebars.compile(sourceNavList);
        var contextNavList  = data[1]; // nav object in json
        var htmlNavList     = templateNavList(contextNavList);
        $('#nav-list').append(htmlNavList);

        var sourceSocialList   = $("#footer-social-list").html();
        var templateSocialList = Handlebars.compile(sourceSocialList);
        var contextLinksList   = data[2]; // links object in json
        var htmlSocialList     = templateSocialList(contextLinksList);
        $('#social-list').append(htmlSocialList);

        var sourceLinksList   = $("#footer-links-list").html();
        var templateLinksList = Handlebars.compile(sourceLinksList);
        //var contextLinksList   = data[2]; // links object in json
        var htmlLinksList     = templateLinksList(contextLinksList);
        $('#links-list').append(htmlLinksList);
      },

      renderTiles: function(data) {
        console.log('IBMMasters.homepage.renderTiles');

        Handlebars.registerHelper('translate', function(string){
          
          if(string === 'cloud'){
            string = IBMMasters.homepage.cloud;
          }else if( string === 'data'){
            string = IBMMasters.homepage.data;
          }else if( string === 'mobile'){
            string = IBMMasters.homepage.mobile;
          }else if( string === 'social'){
            string = IBMMasters.homepage.social;
          }else if( string === 'watson'){
            string = IBMMasters.homepage.watson;
          }else{
            string = string;
          }
          
          return string;
        });

        // clear old tracking waypoints
        $('.row').waypoint('destroy');
        // determine if mobile
        var isMobile = ( $(window).width() <= 580 ) ? true : false;

        var tile, num=1;

        if ( isMobile ) {
          console.log('IBMMasters.homepage.renderTiles-mobile');
          var templateMobile = Handlebars.compile( $('#tile-mobile').html() );
          jQuery.each(data, function(i, val) {
            //console.log('TILE='+i);
            tile = templateMobile(val);
            $('div#column-1').append(tile);
            // add waypoint class for tracking
            $( "div#column-1 .tile" ).last().addClass('row');
          });
        }
        else
        {
          var template = Handlebars.compile( $('#tile').html() );
          jQuery.each(data, function(i, val) {
            //console.log('TILE='+i);
            tile = template(val);
            $('div#column-'+num).append(tile);
            // add waypoint class for tracking
            if(num===1) {
              $( "div#column-1 .tile" ).last().addClass('row');
            }
            num = ( num === 3 ) ?  1 : num+1 ;
          });
        }

        $('.tile').on('click', function(e){
          IBMMasters.homepage.onTileClick(e);
        });

        //----------------------------------------------------------------
        // TRACKING ANALYTICS
        //----------------------------------------------------------------
        var rowCounter = 1;
        $('.row').waypoint({
          triggerOnce: true,
          handler: function(direction) {
            var evname =  'homepage' + '_' + 'row' + '_' + 'scroll' +'_' + rowCounter;
            if (direction==='down'){
              IBMMasters.tracking.trackCustomEvent('homepage', 'row', 'scroll', evname);
              rowCounter +=1;
            }
          }
        });
      },

      filterTiles: function(filter, value) {
        console.log('IBMMasters.homepage.filterTiles');
        console.log('filter: '+filter+' value: '+value);
        // filter json data
        var filteredData = [];
        for (var key in IBMMasters.homepage.json) {
          var obj = IBMMasters.homepage.json[key];
          if (obj[filter] === value) {
            filteredData.push(obj);
          }
        }
        console.log('filteredData',filteredData);
        // clear tiles
        IBMMasters.homepage.clearTiles();
        // render filtered data
        IBMMasters.homepage.renderTiles(filteredData);
      },

      clearTiles: function(){
        $.waypoints('destroy'); // prevents scroll tracking from mis-firing when tiles filtered
        $('div#column-1').html('');
        $('div#column-2').html('');
        $('div#column-3').html('');
      },

      onTileClick: function(e) {
        console.log('IBMMasters.homepage.onTileClick:', e.currentTarget);
        var filterType = $('#filter-menu').data('filtertype');
        console.log( 'filter type='+filterType );
        var id = $(e.currentTarget).data('id');
        console.log( 'id='+id );
        var filter = $(e.currentTarget).data(filterType);
        console.log( 'filter='+filter );
        var url;

        if( typeof filterType === 'undefined'  || filterType === 'none' ) {
          url = './stories/#!story/'+id+'?ref=home';

        } else {
          url = './stories/#!filter/'+filterType+'/'+filter+'/'+id+'?ref=home';
        }

        //----------------------------------------------------------------
        // TRACKING ANALYTICS
        //----------------------------------------------------------------
        var $el       = $(e.currentTarget),
          evgroup   = 'homepage',
          ev        = 'tile',
          evaction  = 'click',
          tileId    = $el.data('id'),
          evname    = evgroup + '_' + ev + '_' + evaction + '_' + tileId;

        IBMMasters.tracking.trackCustomEvent(evgroup, ev, evaction, evname);

        // send them on their way
        window.location = url;
      }
    };

    //------------------------------------------------------------
    // FILTER MENU
    // initialized after json loaded and tiles rendered
    //------------------------------------------------------------
    IBMMasters.namespace('IBMMasters.homepage.filterMenu');
    IBMMasters.homepage.filterMenu = {

      init: function() {
        console.log('IBMMasters.homepage.filterMenu.init');
        $filterMenu = $('#filter-menu');
        dropdown    = $('.dropdown');
        menuItems   = $('.filter-link');
        selected    = $('.selected-filter');
        defaultText = $('.selected-filter').data('default');
        that = this;

        // MS Surface Tablet detection
        console.log('UA ='+navigator.userAgent);
        var UA      = navigator.userAgent;
        //var ARM     = UA.match(/ARM/g);
        var Touch   = UA.match(/Touch/g);
        //var Tablet  = UA.match(/Tablet/g);

        if (Touch !== null){
          console.log('Touch is MS Surface - hide filter menu and ibm connect');
          $('#filter-menu').css('display', 'none' );
          $('.ibm-connect-bar').css('display', 'none' );
          return;
        }

        // If Touch enabled device hide menu and ibm connect
        if ( !( $('html').hasClass('no-touch') ) ){
          console.log('isTouch - hide filter menu and ibm connect');
          $('#filter-menu').css('display', 'none' );
          $('.ibm-connect-bar').css('display', 'none' );
          return;
        }

        IBMMasters.homepage.filterMenu.menuOpen  = 'false';
        this.scrollerInit= 'false';

        selected.text(defaultText);

        this.attachEventHandlers();
        this.setupFilterListToggles();
        // scrollbar created on first mouseover showDropdown()
      },

      attachEventHandlers: function() {
        //console.log('IBMMasters.homepage.filterMenu.attachEventHandlers');

        var filterMenuToggleBtn = $('.selected-filter');

        filterMenuToggleBtn.on('click', function(){
          console.log('');
          console.log('attachEventHandlers() - click', this);
          // if( $filterMenu.hasClass('open-hover') )  $filterMenu.removeClass('open-hover');
          // if( $filterMenu.hasClass('hover') )  $filterMenu.removeClass('hover');

          if(  IBMMasters.homepage.filterMenu.menuOpen === 'false') {
            IBMMasters.homepage.filterMenu.showDropdown();
            $filterMenu.addClass('open');
          }
          else
          {
            IBMMasters.homepage.filterMenu.hideDropdown();
            $filterMenu.removeClass('open');
          }
        });

        /* Mouse Events for arrows
        filterMenuToggleBtn.on('mouseover', function()
        {
          if(  IBMMasters.homepage.filterMenu.menuOpen === 'true') 
          {
            $filterMenu.addClass('open-hover');
          }
          else
          {
            $filterMenu.addClass('hover');
          }
        });
        
        filterMenuToggleBtn.on('mouseleave', function(){
          if(  IBMMasters.homepage.filterMenu.menuOpen === 'true') 
          {
            $filterMenu.removeClass('open-hover');
          }
          else
          {
            $filterMenu.removeClass('hover');
          }
        }); 
        */


        menuItems.on('click', function(e){
          console.log(e.currentTarget);
          // get filter data from item clicked
          var $el         = $(e.currentTarget),
              filterType  = $el.data('filter'),
              key         = $el.data('key'),
              value       = $el.data('value'),
              filterText  = $el.text();

          if(key===''||value===''){
            // 'view all' filter selected - reset and hide menu
            IBMMasters.homepage.filterMenu.setFilterText(defaultText);
            IBMMasters.homepage.filterMenu.hideDropdown();
            // reset to initial state - show all tiles
            IBMMasters.homepage.clearTiles();
            IBMMasters.homepage.renderTiles(IBMMasters.homepage.json);

          } else {
            // set filter and hide menu
            IBMMasters.homepage.filterMenu.setFilterText(filterText);
            IBMMasters.homepage.filterMenu.hideDropdown();
            // call homepage filter function to redraw tiles
            IBMMasters.homepage.filterTiles( key, value );
          }

          // set menu filter type data attribute
          // to retrieve when tile item clicked
          // to use in routing deeplink
          $filterMenu.data('filtertype', filterType);

          console.log("FILTER MENU TYPE="+$filterMenu.data('filtertype'));

          //----------------------------------------------------------------
          // TRACKING ANALYTICS
          //----------------------------------------------------------------
          var evgroup   = 'homepage',
              ev        = 'filter',
              evaction  = 'click',
              filter    = $el.data('value'),
              evname    = evgroup + '_' + ev + '_' + evaction + '_' + filter;

          IBMMasters.tracking.trackCustomEvent(evgroup, ev, evaction, evname);
        });
      },

      setFilterText: function(filterText) {
        selected.text(filterText);
      },

      hideDropdown: function() {
        console.log('hideDropdown');
        if (  IBMMasters.homepage.filterMenu.menuOpen === 'true'){
          console.log('hide dropdown');
          dropdown.hide();
          IBMMasters.homepage.filterMenu.menuOpen = 'false';
        }
      },

      showDropdown: function() {
        if( IBMMasters.homepage.filterMenu.menuOpen === 'true') return;
        console.log('show dropdown');
        dropdown.show();
       // console.log('this.scrollerInit=',this.scrollerInit);
        if (this.scrollerInit==='false') {
          IBMMasters.homepage.filterMenu.createScrollbar();
        } else {
          IBMMasters.homepage.filterMenu.iScroll.scrollTo(0, 0);
          IBMMasters.homepage.filterMenu.resetFilterListTogglesAndSubmenus();
          IBMMasters.homepage.filterMenu.refreshScrollbar();
        }
        IBMMasters.homepage.filterMenu.menuOpen = 'true';
      },

      setupFilterListToggles: function() {
        console.log('setupFilterListToggles');
        var that = this;

        var filterListSubmenuToggleBtns = $('.filter-dropdown-submenu-toggle');
        var submenus = $('.filter-dropdown-submenu');

        // SET FILTER SUBMENU TOGGLE BUTTONS
        filterListSubmenuToggleBtns.on( 'click', function(e) {
          var thisButton = $(e.currentTarget);
          var submenuId  = thisButton.data('submenu');
          if( thisButton.hasClass('open') ) {
            thisButton.removeClass('open');
            $(submenuId).removeClass('open');
          } else {
            thisButton.addClass('open');
            $(submenuId).addClass('open');
          }
          IBMMasters.homepage.filterMenu.refreshScrollbar();
        });
      },

      resetFilterListTogglesAndSubmenus: function() {
        console.log('resetFilterListTogglesAndSubmenus');

        var filterListSubmenuToggleBtns = $('.filter-dropdown-submenu-toggle');
        var submenus = $('.filter-dropdown-submenu');
        // close all
        filterListSubmenuToggleBtns.removeClass('open');
        submenus.removeClass('open');
        // open first ones
        //filterListSubmenuToggleBtns.eq(0).addClass('open');
        //submenus.eq(0).addClass('open');
      },

      setScrollbarHeight: function() {
        console.log('setScrollbarHeight');
        var windowHeight = $(window).height();
        var dropdownHeight;
        var maxHeight = windowHeight-466;

        dropdownHeight = ( windowHeight > 560 ) ? $('.filterScrollee').height() : 60; // MIN HEIGHT 60px;
        if (dropdownHeight > maxHeight) dropdownHeight = maxHeight; // MAX HEIGHT 485px;

        $('.filterScroller').css('height', dropdownHeight);
      },

      createScrollbar: function() {
        console.log('createScrollbar');
        IBMMasters.homepage.filterMenu.setScrollbarHeight();
        // https://github.com/cubiq/iscroll/
        IBMMasters.homepage.filterMenu.iScroll = new IScroll('.filterScroller', {
          mouseWheel: true,
          scrollbars: true
        });
        this.scrollerInit = 'true';
      },

      refreshScrollbar: function() {
        console.log('refreshScrollbar');
        IBMMasters.homepage.filterMenu.setScrollbarHeight();
        IBMMasters.homepage.filterMenu.iScroll.refresh();
      }

    };

    // set it off
    IBMMasters.homepage.init();


})(window.jQuery);
