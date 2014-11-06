var storeName;
var Notification = require('node-notifier');
var currentPage = "buy";
var navHeight = "69px";
var offScreen = "1000px";
var lastPage = [];
var nw = require('nw.gui');
var win = nw.Window.get();

// Create a tray icon
var tray = new nw.Tray({ title: '', icon: 'assets/images/icon.png' });

// Give it a menu
var menu = new nw.Menu();
menu.append(new nw.MenuItem({ type: 'checkbox', label: 'Pause Store' }));
tray.menu = menu;


$(document).ready(function(){
  $('.input-search').focus();

  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      if ($('.modal-overlay').is(':visible')){
        $('.purchase-item').hide();
        $('.zoom-image').hide();
        $('.modal-overlay').fadeOut('fast');
        return false;
      }      
      if ($('.section-listing-details').is(':visible')){
        $('body').css('overflow','auto');
        $('.section-listing-details').animate({'top': '1000px'}, 300, 'easeInCubic', function(){
          $('.section-listing-details').hide();
        });
      }
    }
  });

  $('.window-minimize').click(function() {
    win.minimize();
  });

  $('.window-maximize').click(function() {
    if (win.isMaximized){
      win.unmaximize();
    }else{
      win.maximize();
    }
  });

  $('.window-close').click(function() {
    win.close();
  });

  // win.on('maximize', function(){
  //     win.isMaximized = true;
  // });

  // win.on('unmaximize', function(){
  //     win.isMaximized = false;
  // });


  $('.modal-container').click(function(e) {
    e.stopPropagation();
  });


  $('.header .navigation li').click(function(){
    if($(this).hasClass('active')){
      return false;
    }

    $('.header .navigation li').removeClass('active');
    $(this).addClass('active');

    switch ($(this).data('tab')) {
      case "sell":
        showSellPage();
        break;
      case "buy":
        showBuyPage();
        break;
      case "cases":
        showCasesPage();
        break;
    }
  });  

  $('.settings-navigation li').click(function(){
    var tab = $(this).data('tab');
    $('.settings-navigation li').removeClass('active');
    $(this).addClass('active');
    hideAllSettings();

    switch (tab){
      case "keys":
        $('.settings-keys').fadeIn();
        break;
      case "communication":
        $('.settings-communications').fadeIn();
        break;
      case "arbiter":
        $('.settings-arbiter').fadeIn();
        break;
      case "notary":
        $('.settings-notary').fadeIn();
        break;
      case "advanced":
        $('.settings-advanced').fadeIn();
        break;
      case "backup":
        $('.settings-backup').fadeIn();
        break;
    }
  });

  $('.notary-navigation li').click(function(){
    var tab = $(this).data('tab');
    $('.notary-navigation li').removeClass('active');
    $(this).addClass('active');

    switch (tab){
      case "notary":
        $('.section-become-notary').hide();
        $('.section-become-notary').fadeIn();
        $('.section-become-notary h1').html('Become a Notary');
        $('.section-become-notary label[for="become-a-arbiter"]').hide();
        $('.section-become-notary label[for="become-a-notary"]').show();
        break;
      case "arbiter":
        $('.section-become-notary').hide();
        $('.section-become-notary').fadeIn();
        $('.section-become-notary h1').html('Become a Arbiter');
        $('.section-become-notary label[for="become-a-arbiter"]').show();
        $('.section-become-notary label[for="become-a-notary"]').hide();
        break;
    }
  });

  $('.sell-navigation li').click(function(){
    var tab = $(this).data('tab');
    $('.sell-navigation li').removeClass('active');
    $(this).addClass('active');
    hideAllSellTabs();

    switch (tab){
      case "store":
        $('.sell-listings').fadeIn();
        break;
      case "orders":
        $('.sell-orders').fadeIn();
        win.setBadgeLabel("");
        break;
      case "settings":
        $('.sell-store-deatils').fadeIn();
        break;
    }
  });

  $('.add-listing').click(function(){
    showAddListing();
  });

  $('.modal-navigation li').click(function(){
    var tab = $(this).data('tab');
    $('.modal-navigation li').removeClass('active');
    $(this).addClass('active');

    switch (tab){
      case "trusted":
        $('.non-trusted-purchase').hide();
        $('.trusted-purchase').fadeIn();
        break;
      case "non-trusted":
        $('.trusted-purchase').hide();
        $('.non-trusted-purchase').fadeIn();
        break;
    }
  });

  $('input.search').keypress(function(event) {
    if(event.which == 13) {
      var phrase = $(this).val();
      showSearchResults(phrase);
    }
  });

  $('.create-store').click(function(event) {
    var notifier = new Notification();
    notifier.notify({
      title: 'Store created',
      message: 'Your store is now open for business, make sure to add listings.'
    });
    storeName = $('#store-setup-name').val();
    $('#store-name').val($('#store-setup-name').val());
    $('#store-handle').val($('#store-setup-handle').val());
    $('#store-description').val($('#store-setup-description').val());
    $('.store-setup').hide();
    $('.store-page').fadeIn();
  });

  $('.approve-disclaimer').click(function(event) {
    $('.store-disclaimer').hide();
    $('.store-setup').fadeIn();
    $('#store-setup-name').focus();
  });

  $('.navigation-with-search img, .back-arrow, .back-home-arrow').click(function(event) {
    $('.header .navigation li').removeClass('active');
    showBuyPage();
  });

  $('.close-overlay').click(function(event) {
    $('.purchase-item').hide();
    $('.zoom-image').hide();
    $('.modal-overlay').fadeOut('fast');
  });

  $('.show-reviews').click(function(event) {
    $('.listing-description').hide();
    $('.listing-reviews').show();
    $('.listing-navigation li').removeClass('active')
    $(this).addClass('active')
  });

  $('.show-description').click(function(event) {
    $('.listing-description').show();
    $('.listing-reviews').hide();
    $('.listing-navigation li').removeClass('active')
    $(this).addClass('active')
  });

  $('.close-settings').click(function(event) {
      $('.settings').attr('src','assets/images/icon-gear.png');
      hideSettingsPage();
  });

  $('.section-listing-details-thumbnail, .section-listing-details-photo').click(function(event) {
    $('.purchase-item').hide();
    $('.modal-overlay').fadeIn('fast')
    $('.zoom-image').show();
    $('.zoom-image div').css('background-image', $(this).css("background-image"));
  });

  $('.select-payment-method').click(function(event) {
    $('.modal-payment-method').hide();
    $('.modal-add-new-address').show();
  });

  $('.modal-add-new-address .button-primary').click(function(event) {
    if ($("[name='payment-type']:checked").attr('id') === 'payment-type-direct'){
      $('.modal-add-new-address').hide();
      $('.modal-direct').show();
    }else{
      $('.modal-add-new-address').hide();
      $('.modal-escrow').show();
    }
  });

  $('.modal-add-new-address .back-a-step').click(function(event) {
    $('.modal-add-new-address').hide();
    $('.modal-payment-method').show();
  });

  $('.modal-overlay').click(function(event) {
        $('.purchase-item').hide();
        $('.zoom-image').hide();
        $('.modal-overlay').fadeOut('fast');
  })

  $('.modal-escrow .button-primary').click(function(event) {
    $('.modal-escrow').hide();
    $('.modal-direct').show();
  })

  $('.modal-direct .back-a-step').click(function(event) {
    $('.modal-direct').hide();
    $('.modal-add-new-address').show();
  });

  $('.close-add-listing').click(function(event) {
      hideAddListing();
  });

  $('.settings').click(function(event) {
    if ($('.section-settings').is(':hidden')){
      $('.settings').attr('src','assets/images/icon-gear-active.png');
      showSettingsPage();
    }else{
      $('.settings').attr('src','assets/images/icon-gear.png');
      hideSettingsPage();
    }
  });

  $('.search-result-listing').click(function(){
    var picture = $(this).find('.picture').css('background-image');
    currentPage = "product";
    setLastPage();
    $('body').css('overflow','hidden');
    $('.section-listing-details').show();
    $('.section-listing-details-photo').css('background-image', picture);
    $('.section-listing-details').animate({'top': navHeight}, 600, 'easeOutExpo', function(){
      // $('.submit-buttons').show();
    });
  });

  $('.close-listing').click(function(){
    $('body').css('overflow','auto');
    $('.section-listing-details').animate({'top': offScreen}, 300, 'easeInCubic', function(){
      $('.section-listing-details').hide();
    });
  });

  $('.close-becoming-notary').click(function(){
    $('body').css('overflow','auto');
    $('.section-information').animate({'top': offScreen}, 300, 'easeInCubic', function(){
      $('.section-information').hide();
    });
  });

  $('.listing-buy').click(function(){
    $('.purchase-item').show();
    $('.modal-overlay').fadeIn('fast');
  });

  $('.update-notary-setting').click(function(event){
    var setting = $('#become-a-notary').val();
    if(setting){
      $('.nav-cases').fadeIn();
      hideAllInformation();
      showCasesPage();

      var notifier = new Notification();
      notifier.notify({
        title: 'Notary settings updated',
        message: 'You can now access cases at any time from the top navigation.'
      });

      setTimeout(function(){
        notifier.notify({
          title: 'New case to review',
          message: 'You have a new case to review, click cases to access it.'
        });

        var id = Math.floor((Math.random() * 100000) + 1);

        $('.section-cases p').hide();
        $('.section-cases .cases-list').show();
        $('.section-cases .cases-list').append('<tr><td>' + id + ' <span class="pill">Pending</span></td><td>Sep 30th, 2014</td><td>e25cbe980574b81d1e647f84f09e15ce6c89fb9e</td><td>38f2294d84c192e606b234739b5004297ccebf76</td><td><a class="show-case-details cursor-pointer" data-id="' + id + '">Details</a></td></tr>')
        // win.setBadgeLabel("1");
      }, 6000);

    }else{
      $('.nav-cases').hide();
    }
  });

  $('.show-notary-overlay').click(function(event){
    event.preventDefault();
    showNotaryPage();
  });

  $('.show-support-overlay').click(function(event){
    event.preventDefault();
    $('.section-information').show();
    $('.section-support').show();
    $('.section-information').animate({'top': navHeight}, 600, 'easeOutExpo', function(){
    });
  });

  $('.show-overlay').click(function(event){
    event.preventDefault();
    $('.section-information').show();
    $('.section-become-arbiter').show();
    $('.section-information').animate({'top': navHeight}, 600, 'easeOutExpo', function(){
    });
  });

  $('.navigation-back').click(function(event){
    stepBack();
  });

  $('.add-listing-create').click(function(event){
    var title = $('#add-listing-title').val();
    var price = $('#add-listing-price').val();
    var now = new Date();
    var id = Math.floor((Math.random() * 100000) + 1);

    $('.sell-listings h1, .sell-listings p').hide();
    $('.sell-listings .listings-grid').append('<div class="position-width-32 position-inline-block position-margin-right-20px"><div class="search-result-listing"><div class="picture" style="background: url(http://lorempixel.com/400/400/abstract/' + Math.floor((Math.random() * 10) + 1) + '/)"></div><div class="details"><div class="position-float-left"><span class="type-color-222222 type-size-15px">' + title + '</span><br /><span class="type-color-959595">By: <a href="">' + storeName +'</a></span></div><div class="position-float-right position-padding-top-10px"><span class="type-color-959595 type-size-16px">&#3647;' + price + '</span></div><div class="position-clear-both"></div></div></div></div>');
    hideAddListing();
    setTimeout(function(){
      var notifier = new Notification();
      notifier.notify({
        title: 'New order',
        message: 'Your just received an order. You can view it by going to Sell > Orders.'
      });
      $('.sell-orders p').hide();
      $('.sell-orders .orders-list').show();
      $('.sell-orders .orders-list').append('<tr><td>' + id + ' <span class="pill">Pending</span></td><td>Sep 30th, 2014</td><td>' + title + '</td><td><a class="show-order-details cursor-pointer" data-id="' + id + '">Details</a></td></tr>');
      $('.sell-orders .orders-list').append('<tr><td>' + id + ' <span class="pill">Pending</span></td><td>Sep 30th, 2014</td><td>' + title + '</td><td><a class="show-order-details cursor-pointer" data-id="' + id + '">Details</a></td></tr>');
      $('.sell-orders .orders-list').append('<tr><td>' + id + ' <span class="pill">Pending</span></td><td>Sep 30th, 2014</td><td>' + title + '</td><td><a class="show-order-details cursor-pointer" data-id="' + id + '">Details</a></td></tr>');
      win.setBadgeLabel("1");
    }, 10000);
  });

  $('.close-purchase-overlay').click(function(event){
    $('.modal-overlay').fadeOut('fast');
  });

  function hideAllSettings(){
    $('.settings-backup').hide();
    $('.settings-store-deatils').hide();
    $('.settings-keys').hide();
    $('.settings-communications').hide();
    $('.settings-arbiter').hide();
    $('.settings-notary').hide();
    $('.settings-advanced').hide();
    $('.settings-arbiter').hide();
  }

  function hideAllSellTabs(){
    $('.sell-listings').hide();
    $('.sell-store-deatils').hide();
    $('.sell-orders').hide();
  }

  function hideAllInformation(){
    $('.section-information').animate({'top': offScreen}, 300, 'easeInCubic', function(){
      $('.section-support').hide();
      $('.section-become-notary').hide();
      $('.section-become-arbiter').hide();
      $('.section-information').hide(); 
    });
  }

  function showSellPage() {
    currentPage = "sell";
    setLastPage();
    hideAllPages();
    $('.section-sell').fadeIn();
  }

  function showCasesPage(){
    $('.header .navigation li').removeClass('active');
    $('.header .navigation .nav-cases').addClass('active');
    currentPage = "cases";
    setLastPage();
    hideAllPages();
    win.setBadgeLabel("");
    $('.section-cases').fadeIn();
  }

  function showBuyPage() {
    currentPage = "buy";
    setLastPage();
    hideAllPages();
    $('input.search').val('');
    $('.section-buy').fadeIn();
    $('.input-search').focus();
  }

  function hideAllPages() {
    hideAllInformation();
    $('.settings').attr('src','assets/images/icon-gear.png'); 
    $('.section-settings').animate({'top': offScreen}, 300, 'easeInCubic', function(){
      $('.section-settings').hide(); 
    });
    $('.section-listing-details').animate({'top': offScreen}, 300, 'easeInCubic', function(){
      $('.section-listing-details').hide();
    });
    $('.section-add-listing').animate({'top': offScreen}, 300, 'easeInCubic', function(){
      $('.section-add-listing').hide();
    });
    $('.section-search-results').hide();
    $('.section-sell').hide();
    $('.section-buy').hide(); 
    $('.section-cases').hide(); 
  }

  function showSearchResults(phrase) {
    currentPage = "search";
    setLastPage();
    hideAllPages();
    $('input.search').val(phrase);
    $('.section-search-results').fadeIn();
  }

  function showSettingsPage(){
    currentPage = "settings";
    setLastPage();
    // $('.navigation li').removeClass('active');
    $('body').css('overflow','hidden');
    $('.section-settings').show(); 
    $('.section-settings').animate({'top': navHeight}, 600, 'easeOutExpo', function(){
    });
  }

  function showNotaryPage() {
    $('body').css('overflow','hidden');
    $('.section-information').show();
    $('.section-become-notary').show();
    $('.section-information').animate({'top': navHeight}, 600, 'easeOutExpo', function(){
    });
  }

  function showAddListing() {
    $('body').css('overflow','hidden');
    $('.section-add-listing').show();
    $('.section-add-listing').animate({'top': navHeight}, 600, 'easeOutExpo', function(){
      $('#add-listing-title').focus();
    });
  }

  function hideSettingsPage(){
    $('body').css('overflow','auto');
    $('.section-settings').animate({'top': offScreen}, 300, 'easeInCubic', function(){
      $('.section-settings').hide(); 
    });
  }

  function hideAddListing(){
    $('body').css('overflow','auto');
    $('.section-add-listing').animate({'top': offScreen}, 300, 'easeInCubic', function(){
      $('.section-add-listing').hide(); 
    });
  }

  function stepBack() {
    if (lastPage[lastPage.length-1] !== ""){
      hideAllPages();

      switch(lastPage[lastPage.length-1]) {
        case "buy":
          showBuyPage();
          break;
        case "sell":
          showSellPage();
          break;
        case "search":
          showSearchResults();
          break;
        case "settings":
          showSettingsPage();
          break;
        case "information":
          showNotaryPage();
          break;
      }
      lastPage.pop();
    }
  }

  function setLastPage() {
    if ($('.section-buy').is(':visible')){
      lastPage.push("buy");
    }else if ($('.section-sell').is(':visible')){
      lastPage.push("sell");
    }else if ($('.section-search-results').is(':visible')){
      lastPage.push("search");
    }else if ($('.section-settings').is(':visible')){
      lastPage.push("settings");
    }else if ($('.section-cases').is(':visible')){
      lastPage.push("cases");
    }else if ($('.section-information').is(':visible')){
      lastPage.push("information");
    }
  }

  $(document).on('click','.close-show-order-details',function(event){
    $('body').css('overflow','auto');
    $('.section-show-order-details').animate({'top': "1000px"}, 300, 'easeInCubic', function(){
      $('.section-show-order-details').hide();
    });  
  });

  $(document).on('click','.close-show-case-details',function(event){
    $('body').css('overflow','auto');
    $('.section-show-case-details').animate({'top': "1000px"}, 300, 'easeInCubic', function(){
      $('.section-show-case-details').hide();
    });  
  });

  $(document).on('click','.show-case-details',function(event){
    event.preventDefault();
    $('body').css('overflow','hidden');
    $('.section-show-case-details').show();
    $('.section-show-case-details .case-number').html($(this).data('id'));
    $('.section-show-case-details').animate({'top': "69px"}, 600, 'easeOutExpo', function(){
    });
  });

  $(document).on('click','.show-order-details',function(event){
    event.preventDefault();
    $('body').css('overflow','hidden');
    $('.section-show-order-details').show();
    $('.section-show-order-details .order-number').html($(this).data('id'));
    $('.section-show-order-details').animate({'top': "69px"}, 600, 'easeOutExpo', function(){
    });
  });

});