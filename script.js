var canvas;
var ctx;
var confettiHandler;
//canvas dimensions
var W;
var H;
var mp = Math.round(($(window).width()*$(window).height())/30000); //max particles
var particles = [];

var canvasInit = function(){
    canvas = document.getElementById("confetti");
    ctx = canvas.getContext("2d");
    //canvas dimensions
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
}

$(window).resize(canvasInit).on('scroll',canvasUpdate);
$(document).ready(function () {
    canvasInit();
  
    var colors = [
        "rgba(255, 255, 255, 1)",
        "rgba(255, 255, 255, 1)",
        "rgba(255, 255, 255, 1)",
        "rgba(249, 202, 41, 1)",
        "rgba(249, 202, 41, 1)"
    ];
    for (var i = 0; i < mp; i++) {
        particles.push({
            x: Math.random() * W, //x-coordinate
            y: Math.random() * H, //y-coordinate
            r: randomFromTo(5, 20), //radius
            d: (Math.random() * mp) + 10, //density
            color: colors[Math.floor(Math.random()*colors.length)],
            tilt: Math.floor(Math.random() * 10) - 10,
            tiltAngleIncremental: (Math.random() * 0.07) + .05,
            tiltAngle: 0
        });
    }
    startConfetti();
    
});


function canvasDraw() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < mp; i++) {
        var p = particles[i];
        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;  // Green path
        ctx.moveTo(p.x + p.tilt + (p.r / 4), p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + (p.r / 4));
        ctx.stroke();  // Draw it
    }

}
function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}
var TiltChangeCountdown = 5;
//Function to move the snowflakes
//angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
var angle = 0;
var tiltAngle = 0;
function canvasUpdate() {
    angle += 0.01;
    tiltAngle += 0.1;
    TiltChangeCountdown--;
    for (var i = 0; i < mp; i++) {
        
        var p = particles[i];
        p.tiltAngle += p.tiltAngleIncremental;
        //Updating X and Y coordinates
        //We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
        //Every particle has its own density which can be used to make the downward movement different for each flake
        //Lets make it more random by adding in the radius
        p.y += (Math.cos(angle + p.d) + 1 + p.r / 2) / 2;
        p.x += Math.sin(angle);
        //p.tilt = (Math.cos(p.tiltAngle - (i / 3))) * 15;
        p.tilt = (Math.sin(p.tiltAngle - (i / 3))) * 15;

        //Sending flakes back from the top when it exits
        //Lets make it a bit more organic and let flakes enter from the left and right also.
        if (p.x > W + 5 || p.x < -5 || p.y > H) {
            if (i % 5 > 0 || i % 2 == 0) //66.67% of the flakes
            {
                particles[i] = { x: Math.random() * W, y: -10, r: p.r, d: p.d, color: p.color, tilt: Math.floor(Math.random() * 10) - 10, tiltAngle: p.tiltAngle, tiltAngleIncremental: p.tiltAngleIncremental };
            }
            else {
                //If the flake is exitting from the right
                if (Math.sin(angle) > 0) {
                    //Enter from the left
                    particles[i] = { x: -5, y: Math.random() * H, r: p.r, d: p.d, color: p.color, tilt: Math.floor(Math.random() * 10) - 10, tiltAngleIncremental: p.tiltAngleIncremental };
                }
                else {
                    //Enter from the right
                    particles[i] = { x: W + 5, y: Math.random() * H, r: p.r, d: p.d, color: p.color, tilt: Math.floor(Math.random() * 10) - 10, tiltAngleIncremental: p.tiltAngleIncremental };
                }
            }
        }
    }
}
function startConfetti() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    confettiHandler = setInterval(canvasDraw, 15);
}
function stopConfetti() {
    clearTimeout(confettiHandler);
    if (ctx == undefined) return;
    ctx.clearRect(0, 0, W, H);
}
function continuousConfetti(){
    confettiHandler = setInterval(canvasUpdate,15);
}
//animation loop

var positives = [
  'Hell yeah!',
  'Can\'t wait!',
  'All over it',
  'Couldn\'t keep me away',
  'I thought you\'d never ask',
  'With bells on',
  'I\'m already there!'
];

var negatives = [
  'I\'m washing my hair',
  'Someone made me a better offer',
  'I never really liked you guys',
  'I\'m not missing Casualty',
  'Erm, the rugby world cup is on'
]

var template = '<fieldset id="group{{}}">';
template += '<h2>Guest {{+}}</h2>';
template += '<label for="fullname"><input type="text" name="fullname[{{}}]" placeholder="Name" /></label>';
template += '<p><span>Can you make it to our wedding?</span>';
template += '<label for="rsvpYes{{}}"><input id="rsvpYes{{}}" type="radio" name="rsvp[{{}}]" value="accept" checked>{{pos}}</label>';
template += '<label for="rsvpNo{{}}"><input id="rsvpNo{{}}" type="radio" name="rsvp[{{}}]" value="decline">{{neg}}</label>';
template += '</p>';
if($('html').hasClass('daytime')){
  template += '<p><span>Do you require transport from the ceremony to the reception?</span>';
  template += '<label for="transportYes{{}}"><input id="transportYes{{}}" type="radio" name="transport[{{}}]" value="yes" checked>Yes</label>';
  template += '<label for="transportNo{{}}"><input id="transportNo{{}}" type="radio" name="transport[{{}}]" value="no">No</label>';
  template += '</p>';
}
template += '<p><span>Are you a vegetarian?</span>';
template += '<label for="mealNormal{{}}"><input id="mealNormal{{}}" type="radio" name="meal[{{}}]" value="meat" checked>No</label>';
template += '<label for="mealVeggie{{}}"><input id="mealVeggie{{}}" type="radio" name="meal[{{}}]" value="vegetarian">Yes</label>';
template += '</p>';
template += '<label for="special"><input type="text" name="special[{{}}]" placeholder="Any other special dietary requirements?"/></label>';
template += '<fieldset>';

$(function(){
  $('#groupLength').on('change',function(){
    $('#party').html('');
    var num = parseInt($(this).val());
    for (var i = 0; i < num; i++) {
      tpl = template.replace(/{{}}/g, i)
        .replace(/{{\+}}/g,i+1)
        .replace('{{neg}}', negatives[Math.floor(Math.random()*negatives.length)])
        .replace('{{pos}}', positives[Math.floor(Math.random()*positives.length)]);
      $('#party').append(tpl);
    }
    $('#buttons').show();
    bindForm();
  });

  $("form").submit( function () {    
    $.post(
     $(this).attr('action'),
      $(this).serialize(),
      function(data){
        if(data.success){
          $('form').html('<h1>Thank you for your RSVP!</h1>');
          continuousConfetti();
          setTimeout(stopConfetti,2500);
        }else{
          $('form').append('<div class="error">There was an error with your RSVP, please try again</div>');
        }
      }
    );
    return false;   
  });   
})

function bindForm(){
  $('input[name^="rsvp"]').on('click',function(){
    if($(this).val() == "accept"){
      continuousConfetti();
      setTimeout(stopConfetti,2500);
    }else{

    }
  });

  $('input[name^=meal]').on('click',function(){
    if($('input:checked[value="vegetarian"]').length){
      $('body').addClass('veggie');
    }else{
      $('body').removeClass('veggie');
    }
  })
}
var map, service, infowindow,
places = {
  'asylum' : {
    id : 'ChIJvcQsOA8DdkgRlAwJmEoxyWk',
    zoom :16,
    showing : false
  },
  'lordship' : {
    id :'ChIJ36pinZMDdkgRhI2D1fn6klg',
    zoom : 15,
    showing : false
  },
  'qrp' : {
    id : 'ChIJHz6P8gcDdkgRiNQ-ID0pwT0',
    zoom : 15,
    showing : false
  }
},
markers = {};

function plotMarker(map, key){
  service.getDetails({
    placeId : places[key].id
  },function(place, status){
    markers[key] = new google.maps.Marker({
        map: map,
        position: place.geometry.location
      });
      google.maps.event.addListener(markers[key], 'click', function() {
        if(place.name == "Caroline Gardens") place.name = "Asylum";
        infowindow.setContent(place.name);
        infowindow.open(map, this);
      });
  });
  places[key].showing = true;
}

function hideMarker(key){
  markers[key].setMap(null);
}

function initMap() {
  if($('#ceremony').length){
    ceremonyMap = new google.maps.Map(document.getElementById('ceremony-map'), {
      center: {lat: 51.47671980863, lng: -0.05929553967280121},
      zoom: 15
    });

    service = new google.maps.places.PlacesService(ceremonyMap);
    infowindow = new google.maps.InfoWindow();
    plotMarker(ceremonyMap,'asylum');
  }

  if($('#reception').length){
    receptionMap = new google.maps.Map(document.getElementById('reception-map'), {
      center: {lat: 51.45716851432854, lng: -0.07640088368634501},
      zoom: 15
    });

    if(!service){
      service = new google.maps.places.PlacesService(receptionMap);
      infowindow = new google.maps.InfoWindow();
    }
    
    plotMarker(receptionMap,'lordship');
  }
}

$(function(){
  $('.col--map-icon a').on('click',function(){
    var key = $(this).data('key');
    if(places[key].showing){
      hideMarker(key);
      //initMap();
    }else{
      plotMarker(key,true);
    }
  })
})
var nav = $('nav'),
  sections, navtop, mustard, goop1, goop2, goop3;

var Path = function(id,speed,callback){
  this.distanceInterval = speed;
  this.repeatInterval = 0;
  if(typeof callback == "function"){
    this.callback = callback;
  }else{
    this.callback = function(){};
  }
  this.path = document.querySelector('#'+id);
  this.pathLength = this.path.getTotalLength();
  this.path.style.strokeDasharray = this.pathLength + ' ' + this.pathLength;
  this.path.style.strokeDashoffset = this.pathLength;
  var _self = this;
  window.requestAnimationFrame(this.paint.bind(this));
}

Path.prototype.paint = function(){
  this.path.style.strokeDashoffset = this.pathLength - (this.distanceInterval * this.repeatInterval);
  this.repeatInterval++;
  var _self = this;
  this.callback();
  if(parseFloat(this.path.style.strokeDashoffset) > 0){
    window.requestAnimationFrame(this.paint.bind(this));
  }else{
    window.requestAnimationFrame(function(){
      _self.path.style.strokeDasharray = "none";
    })
  }
}

var animationFinished = function(){
  if(!$('html').hasClass('index')){
    stopConfetti();
    $('head').append('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDSKgITIw4YkFeSZHE2W6nYYGdjAc5RpQw&callback=initMap&libraries=places">')
  }
}

var scroll = function(){
  if(window.scrollY >= navtop){
      nav.addClass('sticky');
  }else{
    nav.removeClass('sticky');
  }

  $.each(sections,function(k,v){
    if(window.scrollY >= (v-80)){
      $('nav a.active').removeClass('active');
      $('nav a[href=#'+k+']').addClass('active');
    }
  })
}

$(window).load(function(){
  mustard = new Path('mustardAnim',20,function(){
      var len = parseInt(this.path.style.strokeDashoffset,10);
      if(len <= 280 && typeof goop1 == "undefined"){
        goop1 = new Path('goop1anim',1);
      }else if(len <= 60 && typeof goop2 == "undefined"){
        goop2 = new Path('goop2anim',3);
      }else if(len <=10 && typeof goop3 == "undefined"){
        goop3 = new Path('goop3anim',2,function(){
          var len = parseInt(this.path.style.strokeDashoffset,10);
          if(len <= 0){
            setTimeout(animationFinished,500);
          }
        });
      }
  });
})

$(function(){
  continuousConfetti();

  navtop = nav.offset().top;
  sections = {};
  $('section').each(function(){
    sections[$(this).attr('id')] = Math.round($(this).position().top);
  })

  scroll();
  $(window).scroll(scroll);

  $("a[href^='#']:not([href='#'])").click(function(evt) {
    evt.preventDefault();
    $('nav').removeClass('show');
    $('html, body').animate({
        scrollTop: $($(this).attr('href')).offset().top
    }, 1000);
  });
  $("a[href='#']").click(function(evt){
    evt.preventDefault();
  });

  $('nav .mobile').on('click',function(e){
    e.preventDefault();
    if(!$('nav').hasClass('sticky')){
      $('html, body').animate({
          scrollTop: $('#rsvp').offset().top
      }, 1000);

      setTimeout(function(){
        $('nav').toggleClass('show');
      },1000)
    }else{
      $('nav').toggleClass('show');
    }
  })

  resize();
  $(window).on('resize',resize);
})

var resize = function(){
  navtop = nav.offset().top;
}
// Utility for creating objects in older browsers
if ( typeof Object.create !== 'function' ) {
  Object.create = function( obj ) {

    function F() {}
    F.prototype = obj;
    return new F();

  };
}

/*!
 * jQuery panelSnap
 * Version 0.14.0
 *
 * Requires:
 * - jQuery 1.7 or higher (no jQuery.migrate needed)
 *
 * https://github.com/guidobouman/jquery-panelsnap
 *
 * Copyright 2013, Guido Bouman
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Date: Wed Feb 13 16:05:00 2013 +0100
 */
(function($, window, document, undefined) {
  'use strict';

  var pluginName = 'panelSnap';
  var storageName = 'plugin_' + pluginName;

  var pluginObject = {

    isMouseDown: false,
    isSnapping: false,
    enabled: true,
    scrollInterval: 0,
    scrollOffset: 0,

    init: function(options, container) {

      var self = this;

      self.container = container;
      self.$container = $(container);

      self.$eventContainer = self.$container;
      self.$snapContainer = self.$container;

      if(self.$container.is('body')) {
        self.$eventContainer = $(document);
        self.$snapContainer = $(document.documentElement);

        var ua = navigator.userAgent;
        if(~ua.indexOf('WebKit')) {
          self.$snapContainer = $('body');
        }
      }

      self.updateScrollInterval();

      self.options = $.extend(true, {}, $.fn.panelSnap.options, options);

      self.bind();

      if(self.options.$menu !== false && $('.active', self.options.$menu).length > 0) {
        $('.active', self.options.$menu).click();
      } else {
        var $target = self.getPanel(':first');
        self.activatePanel($target);
      }

      return self;

    },

    bind: function() {

      var self = this;

      self.bindProxied(self.$eventContainer, 'scrollstop', self.scrollStop);
      self.bindProxied(self.$eventContainer, 'mousewheel', self.mouseWheel);
      self.bindProxied(self.$eventContainer, 'mousedown', self.mouseDown);
      self.bindProxied(self.$eventContainer, 'mouseup', self.mouseUp);

      self.bindProxied($(window), 'resizestop', self.resize);

      if(self.options.$menu) {
        self.bindProxied(self.options.$menu, 'click', self.captureMenuClick, self.options.menuSelector);
      }

      if(self.options.navigation.keys.nextKey || self.options.navigation.keys.prevKey) {
        self.bindProxied($(window), 'keydown', self.keyDown);
      }

      if (self.options.navigation.buttons.$nextButton) {
        self.bindProxied(self.options.navigation.buttons.$nextButton, 'click', self.captureNextClick);
      }

      if (self.options.navigation.buttons.$prevButton) {
        self.bindProxied(self.options.navigation.buttons.$prevButton, 'click', self.capturePrevClick);
      }

    },

    bindProxied: function($element, event, method, selector) {

      var self = this;

      selector = typeof selector === 'string' ? selector : null;

      $element.on(event + self.options.namespace, selector, $.proxy(function(e) {

        return method.call(self, e);

      }, self));

    },

    destroy: function() {

      var self = this;

      // Gotta love namespaced events!
      self.$eventContainer.off(self.options.namespace);

      $(window).off(self.options.namespace);

      if(self.options.$menu !== false) {
        $(self.options.menuSelector, self.options.$menu).off(self.options.namespace);
      }

      self.$container.removeData(storageName);

    },

    scrollStop: function(e) {

      var self = this;

      e.stopPropagation();

      if(self.isMouseDown) {
        return;
      }

      if(self.isSnapping) {
        return;
      }

      self.updateScrollInterval();

      var offset = self.$snapContainer.scrollTop();
      var scrollDifference = offset - self.scrollOffset;
      var maxOffset = self.$container[0].scrollHeight - self.scrollInterval;
      var panelCount = self.getPanel().length - 1;

      var childNumber;
      if(
        self.enabled &&
        scrollDifference < -self.options.directionThreshold &&
        scrollDifference > -self.scrollInterval
      ) {
        childNumber = Math.floor(offset / self.scrollInterval);
      } else if(
        self.enabled &&
        scrollDifference > self.options.directionThreshold &&
        scrollDifference < self.scrollInterval
      ) {
        childNumber = Math.ceil(offset / self.scrollInterval);
      } else {
        childNumber = Math.round(offset / self.scrollInterval);
      }

      childNumber = Math.max(0, Math.min(childNumber, panelCount));

      var $target = self.getPanel(':eq(' + childNumber + ')');

      if(!self.enabled) {
        if(!$target.is(self.getPanel('.active'))) {
          self.activatePanel($target);
        }

        return;
      }

      // To get normal scrolling in panels taller than the viewport,
      // stop if there's no multiple panels in viewport
      if (self.getPanelsInViewport().length < 2)
        return;

      if (offset <= 0 || offset >= maxOffset) {
        // Only activate, prevent stuttering
        self.activatePanel($target);
        // Set scrollOffset to a sane number for next scroll
        self.scrollOffset = offset <= 0 ? 0 : maxOffset;
      } else {
        self.snapToPanel($target);
      }

    },

    getPanelsInViewport: function() {

      var self = this;
      var $window = $(window);

      var viewport = { top: $window.scrollTop() };
      viewport.bottom = viewport.top + $window.height();

      var panels = self.getPanel().filter(function (_, el) {
        var $el = $(el);
        var bounds = $el.offset();
        bounds.bottom = bounds.top + $el.outerHeight();

        return !(viewport.bottom < bounds.top || viewport.top > bounds.bottom);
      });

      return panels;
    },

    mouseWheel: function(e) {

      var self = this;

      // This event only fires when the user actually scrolls with their input device.
      // Be it a trackpad, legacy mouse or anything else.

      if(self.isSnapping) {
        self.scrollOffset = self.$snapContainer.scrollTop();
        self.$container.stop(true);
        self.isSnapping = false;
      }

    },

    mouseDown: function(e) {

      var self = this;

      self.isMouseDown = true;

    },

    mouseUp: function(e) {

      var self = this;

      self.isMouseDown = false;

      if(self.scrollOffset !== self.$snapContainer.scrollTop()) {
        self.scrollStop(e);
      }

    },

    keyDown: function(e) {

      var self = this;

      var nav = self.options.navigation;

      if(!self.enabled) {
        return;
      }

      switch(e.which) {
        case nav.keys.prevKey:
        case nav.keys.nextKey:
          e.preventDefault();
      }

      if (self.isSnapping) {
        return;
      }

      switch(e.which) {
        case nav.keys.prevKey:
          self.snapTo('prev', nav.wrapAround);
          break;
        case nav.keys.nextKey:
          self.snapTo('next', nav.wrapAround);
          break;
      }

    },

    captureNextClick: function(e) {

      var self = this;

      e.preventDefault();

      if (self.isSnapping) {
        return;
      }

      self.snapTo('next', self.options.navigation.wrapAround);

    },

    capturePrevClick: function(e) {

      var self = this;

      e.preventDefault();

      if (self.isSnapping) {
        return;
      }

      self.snapTo('prev', self.options.navigation.wrapAround);

    },

    resize: function(e) {

      var self = this;

      self.updateScrollInterval();

      if(!self.enabled) {
        return;
      }

      var $target = self.getPanel('.active');

      self.snapToPanel($target);

    },

    captureMenuClick: function(e) {

      var self = this;

      var panel = $(e.currentTarget).data('panel');
      var $target = self.getPanel('[data-panel="' + panel + '"]');

      self.snapToPanel($target);

      return false;

    },

    snapToPanel: function($target) {

      var self = this;

      if (!$target.jquery) {
        return;
      }

      self.isSnapping = true;

      self.options.onSnapStart.call(self, $target);
      self.$container.trigger('panelsnap:start', [$target]);

      var scrollTarget = 0;
      if(self.$container.is('body')) {
        scrollTarget = $target.offset().top - self.options.offset;
      } else {
        scrollTarget = self.$snapContainer.scrollTop() + $target.position().top - self.options.offset;
      }

      self.$snapContainer.stop(true).delay(self.options.delay).animate({
        scrollTop: scrollTarget
      }, self.options.slideSpeed, self.options.easing, function() {

        // Set scrollOffset to scrollTop
        // (not to scrollTarget since on iPad those sometimes differ)
        self.scrollOffset = self.$snapContainer.scrollTop();
        self.isSnapping = false;

        // Call callback
        self.options.onSnapFinish.call(self, $target);
        self.$container.trigger('panelsnap:finish', [$target]);

        self.activatePanel($target);
      });

    },

    activatePanel: function($target) {

      var self = this;

      self.getPanel('.active').removeClass('active');
      $target.addClass('active');

      if(self.options.$menu !== false) {
        var activeItemSelector = self.options.menuSelector + '.active';
        $(activeItemSelector, self.options.$menu).removeClass('active');

        var attribute = '[data-panel="' + $target.data('panel') + '"]';
        var itemSelector = self.options.menuSelector + attribute;
        var $itemToActivate = $(itemSelector, self.options.$menu);
        $itemToActivate.addClass('active');
      }

      var nav = self.options.navigation;

      if(!nav.wrapAround) {
        var $panels = self.getPanel();
        var index = $panels.index(self.getPanel('.active'));

        if (nav.buttons.$nextButton !== false ) {
          $target = $panels.eq(index + 1);
          if($target.length < 1) {
            $(nav.buttons.$nextButton).attr('aria-disabled', 'true');
            $(nav.buttons.$nextButton).addClass('disabled');
          } else {
            $(nav.buttons.$nextButton).attr('aria-disabled', 'false');
            $(nav.buttons.$nextButton).removeClass('disabled');
          }
        }

      	if (nav.buttons.$prevButton !== false ) {
          if(index < 1) {
            $(nav.buttons.$prevButton).attr('aria-disabled', 'true');
            $(nav.buttons.$prevButton).addClass('disabled');
          } else {
            $(nav.buttons.$prevButton).attr('aria-disabled', 'false');
            $(nav.buttons.$prevButton).removeClass('disabled');
          }
        }
      }

      self.options.onActivate.call(self, $target);
      self.$container.trigger('panelsnap:activate', [$target]);

    },

    getPanel: function(selector) {

      var self = this;

      if(typeof selector === 'undefined') {
        selector = '';
      }

      return $(self.options.panelSelector + selector, self.$container);

    },

    snapTo: function(target, wrap) {

      var self = this;

      if(typeof wrap !== 'boolean') {
        wrap = true;
      }

      var $panels = self.getPanel();
      var index = $panels.index(self.getPanel('.active'));
      var $target;

      switch(target) {
        case 'prev':

          $target = $panels.eq(index - 1);
          if(index < 1 && !wrap)
          {
            $target = []; // Clear target, because negative indexes wrap automatically
          }
          break;

        case 'next':

          $target = $panels.eq(index + 1);
          if($target.length < 1 && wrap)
          {
            $target = $panels.filter(':first');
          }
          break;

        case 'first':

          $target = $panels.filter(':first');
          break;

        case 'last':

          $target = $panels.filter(':last');
          break;
      }

      if($target.length > 0) {
        self.snapToPanel($target);
      }

    },

    getScrollInterval: function () {

      return this.$container.is('body') ? window.innerHeight : this.$container.height();
    },

    updateScrollInterval: function () {

      this.scrollInterval = this.getScrollInterval();

    },

    enable: function() {

      var self = this;

      // Gather scrollOffset for next scroll
      self.scrollOffset = self.$snapContainer.scrollTop();

      self.enabled = true;

    },

    disable: function() {

      var self = this;

      self.enabled = false;

    },

    toggle: function() {

      var self = this;

      if(self.enabled) {
        self.disable();
      } else {
        self.enable();
      }

    }

  };

  $.fn[pluginName] = function(options) {

    var args = Array.prototype.slice.call(arguments);

    return this.each(function() {

      var pluginInstance = $.data(this, storageName);
      if(typeof options === 'object' || options === 'init' || ! options) {
        if(!pluginInstance) {
          if(options === 'init') {
            options = args[1] || {};
          }

          pluginInstance = Object.create(pluginObject).init(options, this);
          $.data(this, storageName, pluginInstance);
        } else {
          $.error('Plugin is already initialized for this object.');
          return;
        }
      } else if(!pluginInstance) {
        $.error('Plugin is not initialized for this object yet.');
        return;
      } else if(pluginInstance[options]) {
        var method = options;
        options = args.slice(1);
        pluginInstance[method].apply(pluginInstance, options);
      } else {
        $.error('Method ' +  options + ' does not exist on jQuery.panelSnap.');
        return;
      }

    });

  };

  $.fn[pluginName].options = {
    $menu: false,
    menuSelector: 'a',
    panelSelector: '> section',
    namespace: '.panelSnap',
    onSnapStart: function(){},
    onSnapFinish: function(){},
    onActivate: function(){},
    directionThreshold: 50,
    slideSpeed: 200,
    delay: 0,
    easing: 'linear',
    offset: 0,
    navigation: {
      keys: {
        nextKey: false,
        prevKey: false
      },
      buttons: {
        $nextButton: false,
        $prevButton: false
      },
      wrapAround: false
    }
  };

})(jQuery, window, document);

/*!
 * Special flavoured jQuery Mobile scrollstart & scrollstop events.
 * Version 0.1.3
 *
 * Requires:
 * - jQuery 1.7.1 or higher (no jQuery.migrate needed)
 *
 * Copyright 2013, Guido Bouman
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Date: Wed Feb 13 16:05:00 2013 +0100
 */
(function($) {

  // Also handles the scrollstop event
  $.event.special.scrollstart = {

    enabled: true,

    setup: function() {

      var thisObject = this;
      var $this = $(thisObject);
      var scrolling;
      var timer;
      var isTouching;

      $this.data('scrollwatch', true);

      function trigger(event, scrolling) {

        event.type = scrolling ? 'scrollstart' : 'scrollstop';
        $this.trigger(event);

      }

      $this.on('touchstart', function(event) {
        isTouching = true;
      });

      $this.on('touchleave touchcancel touchend', function(event) {
        isTouching = false;
        setTimeout(function () {
          clearTimeout(timer);
        }, 50);
      });

      $this.on('touchmove scroll', function(event) {

        if (isTouching) {
          return;
        }

        if(!$.event.special.scrollstart.enabled) {
          return;
        }

        if(!$.event.special.scrollstart.scrolling) {
          $.event.special.scrollstart.scrolling = true;
          trigger(event, true);
        }

        clearTimeout(timer);
        timer = setTimeout(function() {
          $.event.special.scrollstart.scrolling = false;
          trigger(event, false);
        }, 50);

      });

    }

  };

  // Proxies scrollstart when needed
  $.event.special.scrollstop = {

    setup: function() {

      var thisObject = this;
      var $this = $(thisObject);

      if(!$this.data('scrollwatch')) {
        $(this).on('scrollstart', function(){});
      }

    }

  };

})(jQuery);

/*!
 * Resizestart and resizestop events.
 * Version 0.0.1
 *
 * Requires:
 * - jQuery 1.7.1 or higher (no jQuery.migrate needed)
 *
 * Copyright 2013, Guido Bouman
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Date: Fri Oct 25 15:05:00 2013 +0100
 */
(function($) {

  // Also handles the resizestop event
  $.event.special.resizestart = {

    enabled: true,

    setup: function() {

      var thisObject = this;
      var $this = $(thisObject);
      var resizing;
      var timer;

      $this.data('resizewatch', true);

      function trigger(event, resizing) {

        event.type = resizing ? 'resizestart' : 'resizestop';
        $this.trigger(event);

      }

      $this.on('resize', function(event) {

        if(!$.event.special.resizestart.enabled) {
          return;
        }

        if(!$.event.special.resizestart.resizing) {
          $.event.special.resizestart.resizing = true;
          trigger(event, true);
        }

        clearTimeout(timer);
        timer = setTimeout(function() {
          $.event.special.resizestart.resizing = false;
          trigger(event, false);
        }, 200);

      });

    }

  };

  // Proxies resizestart when needed
  $.event.special.resizestop = {

    setup: function() {

      var thisObject = this;
      var $this = $(thisObject);

      if(!$this.data('resizewatch')) {
        $(this).on('resizestart', function(){});
      }

    }

  };

})(jQuery);

/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 *
 * Requires: 1.2.2+
 */
(function($) {

  var types = ['DOMMouseScroll', 'mousewheel'];

  if ($.event.fixHooks) {
    for ( var i=types.length; i; ) {
      $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
    }
  }

  $.event.special.mousewheel = {
    setup: function() {
      if ( this.addEventListener ) {
        for ( var i=types.length; i; ) {
          this.addEventListener( types[--i], handler, false );
        }
      } else {
        this.onmousewheel = handler;
      }
    },

    teardown: function() {
      if ( this.removeEventListener ) {
        for ( var i=types.length; i; ) {
          this.removeEventListener( types[--i], handler, false );
        }
      } else {
        this.onmousewheel = null;
      }
    }
  };

  $.fn.extend({
    mousewheel: function(fn) {
      return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
    },

    unmousewheel: function(fn) {
      return this.unbind('mousewheel', fn);
    }
  });

  function handler(event) {
    var orgEvent = event || window.event,
        args = [].slice.call( arguments, 1 ),
        delta = 0,
        returnValue = true,
        deltaX = 0,
        deltaY = 0;

    event = $.event.fix(orgEvent);
    event.type = 'mousewheel';

    // Old school scrollwheel delta
    if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
    if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }

    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;

    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
      deltaY = 0;
      deltaX = -1*delta;
    }

    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }

    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);

    return ($.event.dispatch || $.event.handle).apply(this, args);
  }

})(jQuery);

// Sticky Plugin v1.0.3 for jQuery
// =============
// Author: Anthony Garand
// Improvements by German M. Bravo (Kronuz) and Ruud Kamphuis (ruudk)
// Improvements by Leonardo C. Daronco (daronco)
// Created: 02/14/2011
// Date: 07/20/2015
// Website: http://stickyjs.com/
// Description: Makes an element on the page stick on the screen as you scroll
//              It will only set the 'top' and 'position' of your element, you
//              might need to adjust the width in some cases.

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    var slice = Array.prototype.slice; // save ref to original slice()
    var splice = Array.prototype.splice; // save ref to original slice()

  var defaults = {
      topSpacing: 0,
      bottomSpacing: 0,
      className: 'is-sticky',
      wrapperClassName: 'sticky-wrapper',
      center: false,
      getWidthFrom: '',
      widthFromWrapper: true, // works only when .getWidthFrom is empty
      responsiveWidth: false
    },
    $window = $(window),
    $document = $(document),
    sticked = [],
    windowHeight = $window.height(),
    scroller = function() {
      var scrollTop = $window.scrollTop(),
        documentHeight = $document.height(),
        dwh = documentHeight - windowHeight,
        extra = (scrollTop > dwh) ? dwh - scrollTop : 0;

      for (var i = 0, l = sticked.length; i < l; i++) {
        var s = sticked[i],
          elementTop = s.stickyWrapper.offset().top,
          etse = elementTop - s.topSpacing - extra;

	//update height in case of dynamic content
	s.stickyWrapper.css('height', s.stickyElement.outerHeight());

        if (scrollTop <= etse) {
          if (s.currentTop !== null) {
            s.stickyElement
              .css({
                'width': '',
                'position': '',
                'top': ''
              });
            s.stickyElement.parent().removeClass(s.className);
            s.stickyElement.trigger('sticky-end', [s]);
            s.currentTop = null;
          }
        }
        else {
          var newTop = documentHeight - s.stickyElement.outerHeight()
            - s.topSpacing - s.bottomSpacing - scrollTop - extra;
          if (newTop < 0) {
            newTop = newTop + s.topSpacing;
          } else {
            newTop = s.topSpacing;
          }
          if (s.currentTop !== newTop) {
            var newWidth;
            if (s.getWidthFrom) {
                newWidth = $(s.getWidthFrom).width() || null;
            } else if (s.widthFromWrapper) {
                newWidth = s.stickyWrapper.width();
            }
            if (newWidth == null) {
                newWidth = s.stickyElement.width();
            }
            s.stickyElement
              .css('width', newWidth)
              .css('position', 'fixed')
              .css('top', newTop);

            s.stickyElement.parent().addClass(s.className);

            if (s.currentTop === null) {
              s.stickyElement.trigger('sticky-start', [s]);
            } else {
              // sticky is started but it have to be repositioned
              s.stickyElement.trigger('sticky-update', [s]);
            }

            if (s.currentTop === s.topSpacing && s.currentTop > newTop || s.currentTop === null && newTop < s.topSpacing) {
              // just reached bottom || just started to stick but bottom is already reached
              s.stickyElement.trigger('sticky-bottom-reached', [s]);
            } else if(s.currentTop !== null && newTop === s.topSpacing && s.currentTop < newTop) {
              // sticky is started && sticked at topSpacing && overflowing from top just finished
              s.stickyElement.trigger('sticky-bottom-unreached', [s]);
            }

            s.currentTop = newTop;
          }
        }
      }
    },
    resizer = function() {
      windowHeight = $window.height();

      for (var i = 0, l = sticked.length; i < l; i++) {
        var s = sticked[i];
        var newWidth = null;
        if (s.getWidthFrom) {
            if (s.responsiveWidth) {
                newWidth = $(s.getWidthFrom).width();
            }
        } else if(s.widthFromWrapper) {
            newWidth = s.stickyWrapper.width();
        }
        if (newWidth != null) {
            s.stickyElement.css('width', newWidth);
        }
      }
    },
    methods = {
      init: function(options) {
        var o = $.extend({}, defaults, options);
        return this.each(function() {
          var stickyElement = $(this);

          var stickyId = stickyElement.attr('id');
          var stickyHeight = stickyElement.outerHeight();
          var wrapperId = stickyId ? stickyId + '-' + defaults.wrapperClassName : defaults.wrapperClassName;
          var wrapper = $('<div></div>')
            .attr('id', wrapperId)
            .addClass(o.wrapperClassName);

          stickyElement.wrapAll(wrapper);

          var stickyWrapper = stickyElement.parent();

          if (o.center) {
            stickyWrapper.css({width:stickyElement.outerWidth(),marginLeft:"auto",marginRight:"auto"});
          }

          if (stickyElement.css("float") === "right") {
            stickyElement.css({"float":"none"}).parent().css({"float":"right"});
          }

          stickyWrapper.css('height', stickyHeight);

          o.stickyElement = stickyElement;
          o.stickyWrapper = stickyWrapper;
          o.currentTop    = null;

          sticked.push(o);
        });
      },
      update: scroller,
      unstick: function(options) {
        return this.each(function() {
          var that = this;
          var unstickyElement = $(that);

          var removeIdx = -1;
          var i = sticked.length;
          while (i-- > 0) {
            if (sticked[i].stickyElement.get(0) === that) {
                splice.call(sticked,i,1);
                removeIdx = i;
            }
          }
          if(removeIdx !== -1) {
            unstickyElement.unwrap();
            unstickyElement
              .css({
                'width': '',
                'position': '',
                'top': '',
                'float': ''
              })
            ;
          }
        });
      }
    };

  // should be more efficient than using $window.scroll(scroller) and $window.resize(resizer):
  if (window.addEventListener) {
    window.addEventListener('scroll', scroller, false);
    window.addEventListener('resize', resizer, false);
  } else if (window.attachEvent) {
    window.attachEvent('onscroll', scroller);
    window.attachEvent('onresize', resizer);
  }

  $.fn.sticky = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.sticky');
    }
  };

  $.fn.unstick = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method ) {
      return methods.unstick.apply( this, arguments );
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.sticky');
    }
  };
  $(function() {
    setTimeout(scroller, 0);
  });
}));

/* Modernizr 2.8.3 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-fontface-backgroundsize-borderimage-borderradius-boxshadow-flexbox-hsla-multiplebgs-opacity-rgba-textshadow-cssanimations-csscolumns-generatedcontent-cssgradients-cssreflections-csstransforms-csstransforms3d-csstransitions-applicationcache-canvas-canvastext-draganddrop-hashchange-history-audio-video-indexeddb-input-inputtypes-localstorage-postmessage-sessionstorage-websockets-websqldatabase-webworkers-geolocation-inlinesvg-smil-svg-svgclippaths-touch-webgl-shiv-mq-cssclasses-addtest-prefixed-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes-load
 */
;window.Modernizr=function(a,b,c){function D(a){j.cssText=a}function E(a,b){return D(n.join(a+";")+(b||""))}function F(a,b){return typeof a===b}function G(a,b){return!!~(""+a).indexOf(b)}function H(a,b){for(var d in a){var e=a[d];if(!G(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function I(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:F(f,"function")?f.bind(d||b):f}return!1}function J(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+p.join(d+" ")+d).split(" ");return F(b,"string")||F(b,"undefined")?H(e,b):(e=(a+" "+q.join(d+" ")+d).split(" "),I(e,b,c))}function K(){e.input=function(c){for(var d=0,e=c.length;d<e;d++)u[c[d]]=c[d]in k;return u.list&&(u.list=!!b.createElement("datalist")&&!!a.HTMLDataListElement),u}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),e.inputtypes=function(a){for(var d=0,e,f,h,i=a.length;d<i;d++)k.setAttribute("type",f=a[d]),e=k.type!=="text",e&&(k.value=l,k.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(f)&&k.style.WebkitAppearance!==c?(g.appendChild(k),h=b.defaultView,e=h.getComputedStyle&&h.getComputedStyle(k,null).WebkitAppearance!=="textfield"&&k.offsetHeight!==0,g.removeChild(k)):/^(search|tel)$/.test(f)||(/^(url|email)$/.test(f)?e=k.checkValidity&&k.checkValidity()===!1:e=k.value!=l)),t[a[d]]=!!e;return t}("search tel url email datetime date month week time datetime-local number range color".split(" "))}var d="2.8.3",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k=b.createElement("input"),l=":)",m={}.toString,n=" -webkit- -moz- -o- -ms- ".split(" "),o="Webkit Moz O ms",p=o.split(" "),q=o.toLowerCase().split(" "),r={svg:"http://www.w3.org/2000/svg"},s={},t={},u={},v=[],w=v.slice,x,y=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},z=function(b){var c=a.matchMedia||a.msMatchMedia;if(c)return c(b)&&c(b).matches||!1;var d;return y("@media "+b+" { #"+h+" { position: absolute; } }",function(b){d=(a.getComputedStyle?getComputedStyle(b,null):b.currentStyle)["position"]=="absolute"}),d},A=function(){function d(d,e){e=e||b.createElement(a[d]||"div"),d="on"+d;var f=d in e;return f||(e.setAttribute||(e=b.createElement("div")),e.setAttribute&&e.removeAttribute&&(e.setAttribute(d,""),f=F(e[d],"function"),F(e[d],"undefined")||(e[d]=c),e.removeAttribute(d))),e=null,f}var a={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return d}(),B={}.hasOwnProperty,C;!F(B,"undefined")&&!F(B.call,"undefined")?C=function(a,b){return B.call(a,b)}:C=function(a,b){return b in a&&F(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=w.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(w.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(w.call(arguments)))};return e}),s.flexbox=function(){return J("flexWrap")},s.canvas=function(){var a=b.createElement("canvas");return!!a.getContext&&!!a.getContext("2d")},s.canvastext=function(){return!!e.canvas&&!!F(b.createElement("canvas").getContext("2d").fillText,"function")},s.webgl=function(){return!!a.WebGLRenderingContext},s.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:y(["@media (",n.join("touch-enabled),("),h,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c},s.geolocation=function(){return"geolocation"in navigator},s.postmessage=function(){return!!a.postMessage},s.websqldatabase=function(){return!!a.openDatabase},s.indexedDB=function(){return!!J("indexedDB",a)},s.hashchange=function(){return A("hashchange",a)&&(b.documentMode===c||b.documentMode>7)},s.history=function(){return!!a.history&&!!history.pushState},s.draganddrop=function(){var a=b.createElement("div");return"draggable"in a||"ondragstart"in a&&"ondrop"in a},s.websockets=function(){return"WebSocket"in a||"MozWebSocket"in a},s.rgba=function(){return D("background-color:rgba(150,255,150,.5)"),G(j.backgroundColor,"rgba")},s.hsla=function(){return D("background-color:hsla(120,40%,100%,.5)"),G(j.backgroundColor,"rgba")||G(j.backgroundColor,"hsla")},s.multiplebgs=function(){return D("background:url(https://),url(https://),red url(https://)"),/(url\s*\(.*?){3}/.test(j.background)},s.backgroundsize=function(){return J("backgroundSize")},s.borderimage=function(){return J("borderImage")},s.borderradius=function(){return J("borderRadius")},s.boxshadow=function(){return J("boxShadow")},s.textshadow=function(){return b.createElement("div").style.textShadow===""},s.opacity=function(){return E("opacity:.55"),/^0.55$/.test(j.opacity)},s.cssanimations=function(){return J("animationName")},s.csscolumns=function(){return J("columnCount")},s.cssgradients=function(){var a="background-image:",b="gradient(linear,left top,right bottom,from(#9f9),to(white));",c="linear-gradient(left top,#9f9, white);";return D((a+"-webkit- ".split(" ").join(b+a)+n.join(c+a)).slice(0,-a.length)),G(j.backgroundImage,"gradient")},s.cssreflections=function(){return J("boxReflect")},s.csstransforms=function(){return!!J("transform")},s.csstransforms3d=function(){var a=!!J("perspective");return a&&"webkitPerspective"in g.style&&y("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b,c){a=b.offsetLeft===9&&b.offsetHeight===3}),a},s.csstransitions=function(){return J("transition")},s.fontface=function(){var a;return y('@font-face {font-family:"font";src:url("https://")}',function(c,d){var e=b.getElementById("smodernizr"),f=e.sheet||e.styleSheet,g=f?f.cssRules&&f.cssRules[0]?f.cssRules[0].cssText:f.cssText||"":"";a=/src/i.test(g)&&g.indexOf(d.split(" ")[0])===0}),a},s.generatedcontent=function(){var a;return y(["#",h,"{font:0/0 a}#",h,':after{content:"',l,'";visibility:hidden;font:3px/1 a}'].join(""),function(b){a=b.offsetHeight>=3}),a},s.video=function(){var a=b.createElement("video"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),c.h264=a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),c.webm=a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,"")}catch(d){}return c},s.audio=function(){var a=b.createElement("audio"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),c.mp3=a.canPlayType("audio/mpeg;").replace(/^no$/,""),c.wav=a.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),c.m4a=(a.canPlayType("audio/x-m4a;")||a.canPlayType("audio/aac;")).replace(/^no$/,"")}catch(d){}return c},s.localstorage=function(){try{return localStorage.setItem(h,h),localStorage.removeItem(h),!0}catch(a){return!1}},s.sessionstorage=function(){try{return sessionStorage.setItem(h,h),sessionStorage.removeItem(h),!0}catch(a){return!1}},s.webworkers=function(){return!!a.Worker},s.applicationcache=function(){return!!a.applicationCache},s.svg=function(){return!!b.createElementNS&&!!b.createElementNS(r.svg,"svg").createSVGRect},s.inlinesvg=function(){var a=b.createElement("div");return a.innerHTML="<svg/>",(a.firstChild&&a.firstChild.namespaceURI)==r.svg},s.smil=function(){return!!b.createElementNS&&/SVGAnimate/.test(m.call(b.createElementNS(r.svg,"animate")))},s.svgclippaths=function(){return!!b.createElementNS&&/SVGClipPath/.test(m.call(b.createElementNS(r.svg,"clipPath")))};for(var L in s)C(s,L)&&(x=L.toLowerCase(),e[x]=s[L](),v.push((e[x]?"":"no-")+x));return e.input||K(),e.addTest=function(a,b){if(typeof a=="object")for(var d in a)C(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},D(""),i=k=null,function(a,b){function l(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function m(){var a=s.elements;return typeof a=="string"?a.split(" "):a}function n(a){var b=j[a[h]];return b||(b={},i++,a[h]=i,j[i]=b),b}function o(a,c,d){c||(c=b);if(k)return c.createElement(a);d||(d=n(c));var g;return d.cache[a]?g=d.cache[a].cloneNode():f.test(a)?g=(d.cache[a]=d.createElem(a)).cloneNode():g=d.createElem(a),g.canHaveChildren&&!e.test(a)&&!g.tagUrn?d.frag.appendChild(g):g}function p(a,c){a||(a=b);if(k)return a.createDocumentFragment();c=c||n(a);var d=c.frag.cloneNode(),e=0,f=m(),g=f.length;for(;e<g;e++)d.createElement(f[e]);return d}function q(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return s.shivMethods?o(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+m().join().replace(/[\w\-]+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(s,b.frag)}function r(a){a||(a=b);var c=n(a);return s.shivCSS&&!g&&!c.hasCSS&&(c.hasCSS=!!l(a,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),k||q(a,c),a}var c="3.7.0",d=a.html5||{},e=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,f=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,g,h="_html5shiv",i=0,j={},k;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",g="hidden"in a,k=a.childNodes.length==1||function(){b.createElement("a");var a=b.createDocumentFragment();return typeof a.cloneNode=="undefined"||typeof a.createDocumentFragment=="undefined"||typeof a.createElement=="undefined"}()}catch(c){g=!0,k=!0}})();var s={elements:d.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:c,shivCSS:d.shivCSS!==!1,supportsUnknownElements:k,shivMethods:d.shivMethods!==!1,type:"default",shivDocument:r,createElement:o,createDocumentFragment:p};a.html5=s,r(b)}(this,b),e._version=d,e._prefixes=n,e._domPrefixes=q,e._cssomPrefixes=p,e.mq=z,e.hasEvent=A,e.testProp=function(a){return H([a])},e.testAllProps=J,e.testStyles=y,e.prefixed=function(a,b,c){return b?J(a,b,c):J(a,"pfx")},g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+v.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZldHRpLmpzIiwiZm9ybS5qcyIsIm1hcC5qcyIsInBhZ2UuanMiLCJ2ZW5kb3IvanF1ZXJ5LnBhbmVsU25hcC5qcyIsInZlbmRvci9qcXVlcnkuc3RpY2t5LmpzIiwidmVuZG9yL21vZGVybml6ci0yLjguMy5taW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNySEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxNEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY2FudmFzO1xudmFyIGN0eDtcbnZhciBjb25mZXR0aUhhbmRsZXI7XG4vL2NhbnZhcyBkaW1lbnNpb25zXG52YXIgVztcbnZhciBIO1xudmFyIG1wID0gTWF0aC5yb3VuZCgoJCh3aW5kb3cpLndpZHRoKCkqJCh3aW5kb3cpLmhlaWdodCgpKS8zMDAwMCk7IC8vbWF4IHBhcnRpY2xlc1xudmFyIHBhcnRpY2xlcyA9IFtdO1xuXG52YXIgY2FudmFzSW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25mZXR0aVwiKTtcbiAgICBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgIC8vY2FudmFzIGRpbWVuc2lvbnNcbiAgICBXID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgSCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICBjYW52YXMud2lkdGggPSBXO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBIO1xufVxuXG4kKHdpbmRvdykucmVzaXplKGNhbnZhc0luaXQpLm9uKCdzY3JvbGwnLGNhbnZhc1VwZGF0ZSk7XG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgY2FudmFzSW5pdCgpO1xuICBcbiAgICB2YXIgY29sb3JzID0gW1xuICAgICAgICBcInJnYmEoMjU1LCAyNTUsIDI1NSwgMSlcIixcbiAgICAgICAgXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDEpXCIsXG4gICAgICAgIFwicmdiYSgyNTUsIDI1NSwgMjU1LCAxKVwiLFxuICAgICAgICBcInJnYmEoMjQ5LCAyMDIsIDQxLCAxKVwiLFxuICAgICAgICBcInJnYmEoMjQ5LCAyMDIsIDQxLCAxKVwiXG4gICAgXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1wOyBpKyspIHtcbiAgICAgICAgcGFydGljbGVzLnB1c2goe1xuICAgICAgICAgICAgeDogTWF0aC5yYW5kb20oKSAqIFcsIC8veC1jb29yZGluYXRlXG4gICAgICAgICAgICB5OiBNYXRoLnJhbmRvbSgpICogSCwgLy95LWNvb3JkaW5hdGVcbiAgICAgICAgICAgIHI6IHJhbmRvbUZyb21Ubyg1LCAyMCksIC8vcmFkaXVzXG4gICAgICAgICAgICBkOiAoTWF0aC5yYW5kb20oKSAqIG1wKSArIDEwLCAvL2RlbnNpdHlcbiAgICAgICAgICAgIGNvbG9yOiBjb2xvcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKmNvbG9ycy5sZW5ndGgpXSxcbiAgICAgICAgICAgIHRpbHQ6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSAtIDEwLFxuICAgICAgICAgICAgdGlsdEFuZ2xlSW5jcmVtZW50YWw6IChNYXRoLnJhbmRvbSgpICogMC4wNykgKyAuMDUsXG4gICAgICAgICAgICB0aWx0QW5nbGU6IDBcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHN0YXJ0Q29uZmV0dGkoKTtcbiAgICBcbn0pO1xuXG5cbmZ1bmN0aW9uIGNhbnZhc0RyYXcoKSB7XG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBXLCBIKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1wOyBpKyspIHtcbiAgICAgICAgdmFyIHAgPSBwYXJ0aWNsZXNbaV07XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IHAuciAvIDI7XG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHAuY29sb3I7ICAvLyBHcmVlbiBwYXRoXG4gICAgICAgIGN0eC5tb3ZlVG8ocC54ICsgcC50aWx0ICsgKHAuciAvIDQpLCBwLnkpO1xuICAgICAgICBjdHgubGluZVRvKHAueCArIHAudGlsdCwgcC55ICsgcC50aWx0ICsgKHAuciAvIDQpKTtcbiAgICAgICAgY3R4LnN0cm9rZSgpOyAgLy8gRHJhdyBpdFxuICAgIH1cblxufVxuZnVuY3Rpb24gcmFuZG9tRnJvbVRvKGZyb20sIHRvKSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh0byAtIGZyb20gKyAxKSArIGZyb20pO1xufVxudmFyIFRpbHRDaGFuZ2VDb3VudGRvd24gPSA1O1xuLy9GdW5jdGlvbiB0byBtb3ZlIHRoZSBzbm93Zmxha2VzXG4vL2FuZ2xlIHdpbGwgYmUgYW4gb25nb2luZyBpbmNyZW1lbnRhbCBmbGFnLiBTaW4gYW5kIENvcyBmdW5jdGlvbnMgd2lsbCBiZSBhcHBsaWVkIHRvIGl0IHRvIGNyZWF0ZSB2ZXJ0aWNhbCBhbmQgaG9yaXpvbnRhbCBtb3ZlbWVudHMgb2YgdGhlIGZsYWtlc1xudmFyIGFuZ2xlID0gMDtcbnZhciB0aWx0QW5nbGUgPSAwO1xuZnVuY3Rpb24gY2FudmFzVXBkYXRlKCkge1xuICAgIGFuZ2xlICs9IDAuMDE7XG4gICAgdGlsdEFuZ2xlICs9IDAuMTtcbiAgICBUaWx0Q2hhbmdlQ291bnRkb3duLS07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtcDsgaSsrKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgcCA9IHBhcnRpY2xlc1tpXTtcbiAgICAgICAgcC50aWx0QW5nbGUgKz0gcC50aWx0QW5nbGVJbmNyZW1lbnRhbDtcbiAgICAgICAgLy9VcGRhdGluZyBYIGFuZCBZIGNvb3JkaW5hdGVzXG4gICAgICAgIC8vV2Ugd2lsbCBhZGQgMSB0byB0aGUgY29zIGZ1bmN0aW9uIHRvIHByZXZlbnQgbmVnYXRpdmUgdmFsdWVzIHdoaWNoIHdpbGwgbGVhZCBmbGFrZXMgdG8gbW92ZSB1cHdhcmRzXG4gICAgICAgIC8vRXZlcnkgcGFydGljbGUgaGFzIGl0cyBvd24gZGVuc2l0eSB3aGljaCBjYW4gYmUgdXNlZCB0byBtYWtlIHRoZSBkb3dud2FyZCBtb3ZlbWVudCBkaWZmZXJlbnQgZm9yIGVhY2ggZmxha2VcbiAgICAgICAgLy9MZXRzIG1ha2UgaXQgbW9yZSByYW5kb20gYnkgYWRkaW5nIGluIHRoZSByYWRpdXNcbiAgICAgICAgcC55ICs9IChNYXRoLmNvcyhhbmdsZSArIHAuZCkgKyAxICsgcC5yIC8gMikgLyAyO1xuICAgICAgICBwLnggKz0gTWF0aC5zaW4oYW5nbGUpO1xuICAgICAgICAvL3AudGlsdCA9IChNYXRoLmNvcyhwLnRpbHRBbmdsZSAtIChpIC8gMykpKSAqIDE1O1xuICAgICAgICBwLnRpbHQgPSAoTWF0aC5zaW4ocC50aWx0QW5nbGUgLSAoaSAvIDMpKSkgKiAxNTtcblxuICAgICAgICAvL1NlbmRpbmcgZmxha2VzIGJhY2sgZnJvbSB0aGUgdG9wIHdoZW4gaXQgZXhpdHNcbiAgICAgICAgLy9MZXRzIG1ha2UgaXQgYSBiaXQgbW9yZSBvcmdhbmljIGFuZCBsZXQgZmxha2VzIGVudGVyIGZyb20gdGhlIGxlZnQgYW5kIHJpZ2h0IGFsc28uXG4gICAgICAgIGlmIChwLnggPiBXICsgNSB8fCBwLnggPCAtNSB8fCBwLnkgPiBIKSB7XG4gICAgICAgICAgICBpZiAoaSAlIDUgPiAwIHx8IGkgJSAyID09IDApIC8vNjYuNjclIG9mIHRoZSBmbGFrZXNcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwYXJ0aWNsZXNbaV0gPSB7IHg6IE1hdGgucmFuZG9tKCkgKiBXLCB5OiAtMTAsIHI6IHAuciwgZDogcC5kLCBjb2xvcjogcC5jb2xvciwgdGlsdDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApIC0gMTAsIHRpbHRBbmdsZTogcC50aWx0QW5nbGUsIHRpbHRBbmdsZUluY3JlbWVudGFsOiBwLnRpbHRBbmdsZUluY3JlbWVudGFsIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL0lmIHRoZSBmbGFrZSBpcyBleGl0dGluZyBmcm9tIHRoZSByaWdodFxuICAgICAgICAgICAgICAgIGlmIChNYXRoLnNpbihhbmdsZSkgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vRW50ZXIgZnJvbSB0aGUgbGVmdFxuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZXNbaV0gPSB7IHg6IC01LCB5OiBNYXRoLnJhbmRvbSgpICogSCwgcjogcC5yLCBkOiBwLmQsIGNvbG9yOiBwLmNvbG9yLCB0aWx0OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCkgLSAxMCwgdGlsdEFuZ2xlSW5jcmVtZW50YWw6IHAudGlsdEFuZ2xlSW5jcmVtZW50YWwgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vRW50ZXIgZnJvbSB0aGUgcmlnaHRcbiAgICAgICAgICAgICAgICAgICAgcGFydGljbGVzW2ldID0geyB4OiBXICsgNSwgeTogTWF0aC5yYW5kb20oKSAqIEgsIHI6IHAuciwgZDogcC5kLCBjb2xvcjogcC5jb2xvciwgdGlsdDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApIC0gMTAsIHRpbHRBbmdsZUluY3JlbWVudGFsOiBwLnRpbHRBbmdsZUluY3JlbWVudGFsIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gc3RhcnRDb25mZXR0aSgpIHtcbiAgICBXID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgSCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICBjYW52YXMud2lkdGggPSBXO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBIO1xuICAgIGNvbmZldHRpSGFuZGxlciA9IHNldEludGVydmFsKGNhbnZhc0RyYXcsIDE1KTtcbn1cbmZ1bmN0aW9uIHN0b3BDb25mZXR0aSgpIHtcbiAgICBjbGVhclRpbWVvdXQoY29uZmV0dGlIYW5kbGVyKTtcbiAgICBpZiAoY3R4ID09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgVywgSCk7XG59XG5mdW5jdGlvbiBjb250aW51b3VzQ29uZmV0dGkoKXtcbiAgICBjb25mZXR0aUhhbmRsZXIgPSBzZXRJbnRlcnZhbChjYW52YXNVcGRhdGUsMTUpO1xufVxuLy9hbmltYXRpb24gbG9vcFxuIiwidmFyIHBvc2l0aXZlcyA9IFtcbiAgJ0hlbGwgeWVhaCEnLFxuICAnQ2FuXFwndCB3YWl0IScsXG4gICdBbGwgb3ZlciBpdCcsXG4gICdDb3VsZG5cXCd0IGtlZXAgbWUgYXdheScsXG4gICdJIHRob3VnaHQgeW91XFwnZCBuZXZlciBhc2snLFxuICAnV2l0aCBiZWxscyBvbicsXG4gICdJXFwnbSBhbHJlYWR5IHRoZXJlISdcbl07XG5cbnZhciBuZWdhdGl2ZXMgPSBbXG4gICdJXFwnbSB3YXNoaW5nIG15IGhhaXInLFxuICAnU29tZW9uZSBtYWRlIG1lIGEgYmV0dGVyIG9mZmVyJyxcbiAgJ0kgbmV2ZXIgcmVhbGx5IGxpa2VkIHlvdSBndXlzJyxcbiAgJ0lcXCdtIG5vdCBtaXNzaW5nIENhc3VhbHR5JyxcbiAgJ0VybSwgdGhlIHJ1Z2J5IHdvcmxkIGN1cCBpcyBvbidcbl1cblxudmFyIHRlbXBsYXRlID0gJzxmaWVsZHNldCBpZD1cImdyb3Vwe3t9fVwiPic7XG50ZW1wbGF0ZSArPSAnPGgyPkd1ZXN0IHt7K319PC9oMj4nO1xudGVtcGxhdGUgKz0gJzxsYWJlbCBmb3I9XCJmdWxsbmFtZVwiPjxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJmdWxsbmFtZVt7e319XVwiIHBsYWNlaG9sZGVyPVwiTmFtZVwiIC8+PC9sYWJlbD4nO1xudGVtcGxhdGUgKz0gJzxwPjxzcGFuPkNhbiB5b3UgbWFrZSBpdCB0byBvdXIgd2VkZGluZz88L3NwYW4+JztcbnRlbXBsYXRlICs9ICc8bGFiZWwgZm9yPVwicnN2cFllc3t7fX1cIj48aW5wdXQgaWQ9XCJyc3ZwWWVze3t9fVwiIHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJyc3ZwW3t7fX1dXCIgdmFsdWU9XCJhY2NlcHRcIiBjaGVja2VkPnt7cG9zfX08L2xhYmVsPic7XG50ZW1wbGF0ZSArPSAnPGxhYmVsIGZvcj1cInJzdnBOb3t7fX1cIj48aW5wdXQgaWQ9XCJyc3ZwTm97e319XCIgdHlwZT1cInJhZGlvXCIgbmFtZT1cInJzdnBbe3t9fV1cIiB2YWx1ZT1cImRlY2xpbmVcIj57e25lZ319PC9sYWJlbD4nO1xudGVtcGxhdGUgKz0gJzwvcD4nO1xuaWYoJCgnaHRtbCcpLmhhc0NsYXNzKCdkYXl0aW1lJykpe1xuICB0ZW1wbGF0ZSArPSAnPHA+PHNwYW4+RG8geW91IHJlcXVpcmUgdHJhbnNwb3J0IGZyb20gdGhlIGNlcmVtb255IHRvIHRoZSByZWNlcHRpb24/PC9zcGFuPic7XG4gIHRlbXBsYXRlICs9ICc8bGFiZWwgZm9yPVwidHJhbnNwb3J0WWVze3t9fVwiPjxpbnB1dCBpZD1cInRyYW5zcG9ydFllc3t7fX1cIiB0eXBlPVwicmFkaW9cIiBuYW1lPVwidHJhbnNwb3J0W3t7fX1dXCIgdmFsdWU9XCJ5ZXNcIiBjaGVja2VkPlllczwvbGFiZWw+JztcbiAgdGVtcGxhdGUgKz0gJzxsYWJlbCBmb3I9XCJ0cmFuc3BvcnROb3t7fX1cIj48aW5wdXQgaWQ9XCJ0cmFuc3BvcnROb3t7fX1cIiB0eXBlPVwicmFkaW9cIiBuYW1lPVwidHJhbnNwb3J0W3t7fX1dXCIgdmFsdWU9XCJub1wiPk5vPC9sYWJlbD4nO1xuICB0ZW1wbGF0ZSArPSAnPC9wPic7XG59XG50ZW1wbGF0ZSArPSAnPHA+PHNwYW4+QXJlIHlvdSBhIHZlZ2V0YXJpYW4/PC9zcGFuPic7XG50ZW1wbGF0ZSArPSAnPGxhYmVsIGZvcj1cIm1lYWxOb3JtYWx7e319XCI+PGlucHV0IGlkPVwibWVhbE5vcm1hbHt7fX1cIiB0eXBlPVwicmFkaW9cIiBuYW1lPVwibWVhbFt7e319XVwiIHZhbHVlPVwibWVhdFwiIGNoZWNrZWQ+Tm88L2xhYmVsPic7XG50ZW1wbGF0ZSArPSAnPGxhYmVsIGZvcj1cIm1lYWxWZWdnaWV7e319XCI+PGlucHV0IGlkPVwibWVhbFZlZ2dpZXt7fX1cIiB0eXBlPVwicmFkaW9cIiBuYW1lPVwibWVhbFt7e319XVwiIHZhbHVlPVwidmVnZXRhcmlhblwiPlllczwvbGFiZWw+JztcbnRlbXBsYXRlICs9ICc8L3A+JztcbnRlbXBsYXRlICs9ICc8bGFiZWwgZm9yPVwic3BlY2lhbFwiPjxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJzcGVjaWFsW3t7fX1dXCIgcGxhY2Vob2xkZXI9XCJBbnkgb3RoZXIgc3BlY2lhbCBkaWV0YXJ5IHJlcXVpcmVtZW50cz9cIi8+PC9sYWJlbD4nO1xudGVtcGxhdGUgKz0gJzxmaWVsZHNldD4nO1xuXG4kKGZ1bmN0aW9uKCl7XG4gICQoJyNncm91cExlbmd0aCcpLm9uKCdjaGFuZ2UnLGZ1bmN0aW9uKCl7XG4gICAgJCgnI3BhcnR5JykuaHRtbCgnJyk7XG4gICAgdmFyIG51bSA9IHBhcnNlSW50KCQodGhpcykudmFsKCkpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtOyBpKyspIHtcbiAgICAgIHRwbCA9IHRlbXBsYXRlLnJlcGxhY2UoL3t7fX0vZywgaSlcbiAgICAgICAgLnJlcGxhY2UoL3t7XFwrfX0vZyxpKzEpXG4gICAgICAgIC5yZXBsYWNlKCd7e25lZ319JywgbmVnYXRpdmVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSpuZWdhdGl2ZXMubGVuZ3RoKV0pXG4gICAgICAgIC5yZXBsYWNlKCd7e3Bvc319JywgcG9zaXRpdmVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSpwb3NpdGl2ZXMubGVuZ3RoKV0pO1xuICAgICAgJCgnI3BhcnR5JykuYXBwZW5kKHRwbCk7XG4gICAgfVxuICAgICQoJyNidXR0b25zJykuc2hvdygpO1xuICAgIGJpbmRGb3JtKCk7XG4gIH0pO1xuXG4gICQoXCJmb3JtXCIpLnN1Ym1pdCggZnVuY3Rpb24gKCkgeyAgICBcbiAgICAkLnBvc3QoXG4gICAgICQodGhpcykuYXR0cignYWN0aW9uJyksXG4gICAgICAkKHRoaXMpLnNlcmlhbGl6ZSgpLFxuICAgICAgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgIGlmKGRhdGEuc3VjY2Vzcyl7XG4gICAgICAgICAgJCgnZm9ybScpLmh0bWwoJzxoMT5UaGFuayB5b3UgZm9yIHlvdXIgUlNWUCE8L2gxPicpO1xuICAgICAgICAgIGNvbnRpbnVvdXNDb25mZXR0aSgpO1xuICAgICAgICAgIHNldFRpbWVvdXQoc3RvcENvbmZldHRpLDI1MDApO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAkKCdmb3JtJykuYXBwZW5kKCc8ZGl2IGNsYXNzPVwiZXJyb3JcIj5UaGVyZSB3YXMgYW4gZXJyb3Igd2l0aCB5b3VyIFJTVlAsIHBsZWFzZSB0cnkgYWdhaW48L2Rpdj4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG4gICAgcmV0dXJuIGZhbHNlOyAgIFxuICB9KTsgICBcbn0pXG5cbmZ1bmN0aW9uIGJpbmRGb3JtKCl7XG4gICQoJ2lucHV0W25hbWVePVwicnN2cFwiXScpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcbiAgICBpZigkKHRoaXMpLnZhbCgpID09IFwiYWNjZXB0XCIpe1xuICAgICAgY29udGludW91c0NvbmZldHRpKCk7XG4gICAgICBzZXRUaW1lb3V0KHN0b3BDb25mZXR0aSwyNTAwKTtcbiAgICB9ZWxzZXtcblxuICAgIH1cbiAgfSk7XG5cbiAgJCgnaW5wdXRbbmFtZV49bWVhbF0nKS5vbignY2xpY2snLGZ1bmN0aW9uKCl7XG4gICAgaWYoJCgnaW5wdXQ6Y2hlY2tlZFt2YWx1ZT1cInZlZ2V0YXJpYW5cIl0nKS5sZW5ndGgpe1xuICAgICAgJCgnYm9keScpLmFkZENsYXNzKCd2ZWdnaWUnKTtcbiAgICB9ZWxzZXtcbiAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygndmVnZ2llJyk7XG4gICAgfVxuICB9KVxufSIsInZhciBtYXAsIHNlcnZpY2UsIGluZm93aW5kb3csXG5wbGFjZXMgPSB7XG4gICdhc3lsdW0nIDoge1xuICAgIGlkIDogJ0NoSUp2Y1FzT0E4RGRrZ1JsQXdKbUVveHlXaycsXG4gICAgem9vbSA6MTYsXG4gICAgc2hvd2luZyA6IGZhbHNlXG4gIH0sXG4gICdsb3Jkc2hpcCcgOiB7XG4gICAgaWQgOidDaElKMzZwaW5aTURka2dSaEkyRDFmbjZrbGcnLFxuICAgIHpvb20gOiAxNSxcbiAgICBzaG93aW5nIDogZmFsc2VcbiAgfSxcbiAgJ3FycCcgOiB7XG4gICAgaWQgOiAnQ2hJSkh6NlA4Z2NEZGtnUmlOUS1JRDBwd1QwJyxcbiAgICB6b29tIDogMTUsXG4gICAgc2hvd2luZyA6IGZhbHNlXG4gIH1cbn0sXG5tYXJrZXJzID0ge307XG5cbmZ1bmN0aW9uIHBsb3RNYXJrZXIobWFwLCBrZXkpe1xuICBzZXJ2aWNlLmdldERldGFpbHMoe1xuICAgIHBsYWNlSWQgOiBwbGFjZXNba2V5XS5pZFxuICB9LGZ1bmN0aW9uKHBsYWNlLCBzdGF0dXMpe1xuICAgIG1hcmtlcnNba2V5XSA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgcG9zaXRpb246IHBsYWNlLmdlb21ldHJ5LmxvY2F0aW9uXG4gICAgICB9KTtcbiAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlcnNba2V5XSwgJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKHBsYWNlLm5hbWUgPT0gXCJDYXJvbGluZSBHYXJkZW5zXCIpIHBsYWNlLm5hbWUgPSBcIkFzeWx1bVwiO1xuICAgICAgICBpbmZvd2luZG93LnNldENvbnRlbnQocGxhY2UubmFtZSk7XG4gICAgICAgIGluZm93aW5kb3cub3BlbihtYXAsIHRoaXMpO1xuICAgICAgfSk7XG4gIH0pO1xuICBwbGFjZXNba2V5XS5zaG93aW5nID0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gaGlkZU1hcmtlcihrZXkpe1xuICBtYXJrZXJzW2tleV0uc2V0TWFwKG51bGwpO1xufVxuXG5mdW5jdGlvbiBpbml0TWFwKCkge1xuICBpZigkKCcjY2VyZW1vbnknKS5sZW5ndGgpe1xuICAgIGNlcmVtb255TWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2VyZW1vbnktbWFwJyksIHtcbiAgICAgIGNlbnRlcjoge2xhdDogNTEuNDc2NzE5ODA4NjMsIGxuZzogLTAuMDU5Mjk1NTM5NjcyODAxMjF9LFxuICAgICAgem9vbTogMTVcbiAgICB9KTtcblxuICAgIHNlcnZpY2UgPSBuZXcgZ29vZ2xlLm1hcHMucGxhY2VzLlBsYWNlc1NlcnZpY2UoY2VyZW1vbnlNYXApO1xuICAgIGluZm93aW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdygpO1xuICAgIHBsb3RNYXJrZXIoY2VyZW1vbnlNYXAsJ2FzeWx1bScpO1xuICB9XG5cbiAgaWYoJCgnI3JlY2VwdGlvbicpLmxlbmd0aCl7XG4gICAgcmVjZXB0aW9uTWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVjZXB0aW9uLW1hcCcpLCB7XG4gICAgICBjZW50ZXI6IHtsYXQ6IDUxLjQ1NzE2ODUxNDMyODU0LCBsbmc6IC0wLjA3NjQwMDg4MzY4NjM0NTAxfSxcbiAgICAgIHpvb206IDE1XG4gICAgfSk7XG5cbiAgICBpZighc2VydmljZSl7XG4gICAgICBzZXJ2aWNlID0gbmV3IGdvb2dsZS5tYXBzLnBsYWNlcy5QbGFjZXNTZXJ2aWNlKHJlY2VwdGlvbk1hcCk7XG4gICAgICBpbmZvd2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coKTtcbiAgICB9XG4gICAgXG4gICAgcGxvdE1hcmtlcihyZWNlcHRpb25NYXAsJ2xvcmRzaGlwJyk7XG4gIH1cbn1cblxuJChmdW5jdGlvbigpe1xuICAkKCcuY29sLS1tYXAtaWNvbiBhJykub24oJ2NsaWNrJyxmdW5jdGlvbigpe1xuICAgIHZhciBrZXkgPSAkKHRoaXMpLmRhdGEoJ2tleScpO1xuICAgIGlmKHBsYWNlc1trZXldLnNob3dpbmcpe1xuICAgICAgaGlkZU1hcmtlcihrZXkpO1xuICAgICAgLy9pbml0TWFwKCk7XG4gICAgfWVsc2V7XG4gICAgICBwbG90TWFya2VyKGtleSx0cnVlKTtcbiAgICB9XG4gIH0pXG59KSIsInZhciBuYXYgPSAkKCduYXYnKSxcbiAgc2VjdGlvbnMsIG5hdnRvcCwgbXVzdGFyZCwgZ29vcDEsIGdvb3AyLCBnb29wMztcblxudmFyIFBhdGggPSBmdW5jdGlvbihpZCxzcGVlZCxjYWxsYmFjayl7XG4gIHRoaXMuZGlzdGFuY2VJbnRlcnZhbCA9IHNwZWVkO1xuICB0aGlzLnJlcGVhdEludGVydmFsID0gMDtcbiAgaWYodHlwZW9mIGNhbGxiYWNrID09IFwiZnVuY3Rpb25cIil7XG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICB9ZWxzZXtcbiAgICB0aGlzLmNhbGxiYWNrID0gZnVuY3Rpb24oKXt9O1xuICB9XG4gIHRoaXMucGF0aCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnK2lkKTtcbiAgdGhpcy5wYXRoTGVuZ3RoID0gdGhpcy5wYXRoLmdldFRvdGFsTGVuZ3RoKCk7XG4gIHRoaXMucGF0aC5zdHlsZS5zdHJva2VEYXNoYXJyYXkgPSB0aGlzLnBhdGhMZW5ndGggKyAnICcgKyB0aGlzLnBhdGhMZW5ndGg7XG4gIHRoaXMucGF0aC5zdHlsZS5zdHJva2VEYXNob2Zmc2V0ID0gdGhpcy5wYXRoTGVuZ3RoO1xuICB2YXIgX3NlbGYgPSB0aGlzO1xuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucGFpbnQuYmluZCh0aGlzKSk7XG59XG5cblBhdGgucHJvdG90eXBlLnBhaW50ID0gZnVuY3Rpb24oKXtcbiAgdGhpcy5wYXRoLnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSB0aGlzLnBhdGhMZW5ndGggLSAodGhpcy5kaXN0YW5jZUludGVydmFsICogdGhpcy5yZXBlYXRJbnRlcnZhbCk7XG4gIHRoaXMucmVwZWF0SW50ZXJ2YWwrKztcbiAgdmFyIF9zZWxmID0gdGhpcztcbiAgdGhpcy5jYWxsYmFjaygpO1xuICBpZihwYXJzZUZsb2F0KHRoaXMucGF0aC5zdHlsZS5zdHJva2VEYXNob2Zmc2V0KSA+IDApe1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5wYWludC5iaW5kKHRoaXMpKTtcbiAgfWVsc2V7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpe1xuICAgICAgX3NlbGYucGF0aC5zdHlsZS5zdHJva2VEYXNoYXJyYXkgPSBcIm5vbmVcIjtcbiAgICB9KVxuICB9XG59XG5cbnZhciBhbmltYXRpb25GaW5pc2hlZCA9IGZ1bmN0aW9uKCl7XG4gIGlmKCEkKCdodG1sJykuaGFzQ2xhc3MoJ2luZGV4Jykpe1xuICAgIHN0b3BDb25mZXR0aSgpO1xuICAgICQoJ2hlYWQnKS5hcHBlbmQoJzxzY3JpcHQgc3JjPVwiaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2pzP2tleT1BSXphU3lEU0tnSVRJdzRZa0ZlU1pIRTJXNm5ZWUdkakFjNVJwUXcmY2FsbGJhY2s9aW5pdE1hcCZsaWJyYXJpZXM9cGxhY2VzXCI+JylcbiAgfVxufVxuXG52YXIgc2Nyb2xsID0gZnVuY3Rpb24oKXtcbiAgaWYod2luZG93LnNjcm9sbFkgPj0gbmF2dG9wKXtcbiAgICAgIG5hdi5hZGRDbGFzcygnc3RpY2t5Jyk7XG4gIH1lbHNle1xuICAgIG5hdi5yZW1vdmVDbGFzcygnc3RpY2t5Jyk7XG4gIH1cblxuICAkLmVhY2goc2VjdGlvbnMsZnVuY3Rpb24oayx2KXtcbiAgICBpZih3aW5kb3cuc2Nyb2xsWSA+PSAodi04MCkpe1xuICAgICAgJCgnbmF2IGEuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgJCgnbmF2IGFbaHJlZj0jJytrKyddJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH1cbiAgfSlcbn1cblxuJCh3aW5kb3cpLmxvYWQoZnVuY3Rpb24oKXtcbiAgbXVzdGFyZCA9IG5ldyBQYXRoKCdtdXN0YXJkQW5pbScsMjAsZnVuY3Rpb24oKXtcbiAgICAgIHZhciBsZW4gPSBwYXJzZUludCh0aGlzLnBhdGguc3R5bGUuc3Ryb2tlRGFzaG9mZnNldCwxMCk7XG4gICAgICBpZihsZW4gPD0gMjgwICYmIHR5cGVvZiBnb29wMSA9PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgZ29vcDEgPSBuZXcgUGF0aCgnZ29vcDFhbmltJywxKTtcbiAgICAgIH1lbHNlIGlmKGxlbiA8PSA2MCAmJiB0eXBlb2YgZ29vcDIgPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgIGdvb3AyID0gbmV3IFBhdGgoJ2dvb3AyYW5pbScsMyk7XG4gICAgICB9ZWxzZSBpZihsZW4gPD0xMCAmJiB0eXBlb2YgZ29vcDMgPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgIGdvb3AzID0gbmV3IFBhdGgoJ2dvb3AzYW5pbScsMixmdW5jdGlvbigpe1xuICAgICAgICAgIHZhciBsZW4gPSBwYXJzZUludCh0aGlzLnBhdGguc3R5bGUuc3Ryb2tlRGFzaG9mZnNldCwxMCk7XG4gICAgICAgICAgaWYobGVuIDw9IDApe1xuICAgICAgICAgICAgc2V0VGltZW91dChhbmltYXRpb25GaW5pc2hlZCw1MDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gIH0pO1xufSlcblxuJChmdW5jdGlvbigpe1xuICBjb250aW51b3VzQ29uZmV0dGkoKTtcblxuICBuYXZ0b3AgPSBuYXYub2Zmc2V0KCkudG9wO1xuICBzZWN0aW9ucyA9IHt9O1xuICAkKCdzZWN0aW9uJykuZWFjaChmdW5jdGlvbigpe1xuICAgIHNlY3Rpb25zWyQodGhpcykuYXR0cignaWQnKV0gPSBNYXRoLnJvdW5kKCQodGhpcykucG9zaXRpb24oKS50b3ApO1xuICB9KVxuXG4gIHNjcm9sbCgpO1xuICAkKHdpbmRvdykuc2Nyb2xsKHNjcm9sbCk7XG5cbiAgJChcImFbaHJlZl49JyMnXTpub3QoW2hyZWY9JyMnXSlcIikuY2xpY2soZnVuY3Rpb24oZXZ0KSB7XG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgJCgnbmF2JykucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcbiAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XG4gICAgICAgIHNjcm9sbFRvcDogJCgkKHRoaXMpLmF0dHIoJ2hyZWYnKSkub2Zmc2V0KCkudG9wXG4gICAgfSwgMTAwMCk7XG4gIH0pO1xuICAkKFwiYVtocmVmPScjJ11cIikuY2xpY2soZnVuY3Rpb24oZXZ0KXtcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgfSk7XG5cbiAgJCgnbmF2IC5tb2JpbGUnKS5vbignY2xpY2snLGZ1bmN0aW9uKGUpe1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBpZighJCgnbmF2JykuaGFzQ2xhc3MoJ3N0aWNreScpKXtcbiAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcbiAgICAgICAgICBzY3JvbGxUb3A6ICQoJyNyc3ZwJykub2Zmc2V0KCkudG9wXG4gICAgICB9LCAxMDAwKTtcblxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAkKCduYXYnKS50b2dnbGVDbGFzcygnc2hvdycpO1xuICAgICAgfSwxMDAwKVxuICAgIH1lbHNle1xuICAgICAgJCgnbmF2JykudG9nZ2xlQ2xhc3MoJ3Nob3cnKTtcbiAgICB9XG4gIH0pXG5cbiAgcmVzaXplKCk7XG4gICQod2luZG93KS5vbigncmVzaXplJyxyZXNpemUpO1xufSlcblxudmFyIHJlc2l6ZSA9IGZ1bmN0aW9uKCl7XG4gIG5hdnRvcCA9IG5hdi5vZmZzZXQoKS50b3A7XG59IiwiLy8gVXRpbGl0eSBmb3IgY3JlYXRpbmcgb2JqZWN0cyBpbiBvbGRlciBicm93c2Vyc1xuaWYgKCB0eXBlb2YgT2JqZWN0LmNyZWF0ZSAhPT0gJ2Z1bmN0aW9uJyApIHtcbiAgT2JqZWN0LmNyZWF0ZSA9IGZ1bmN0aW9uKCBvYmogKSB7XG5cbiAgICBmdW5jdGlvbiBGKCkge31cbiAgICBGLnByb3RvdHlwZSA9IG9iajtcbiAgICByZXR1cm4gbmV3IEYoKTtcblxuICB9O1xufVxuXG4vKiFcbiAqIGpRdWVyeSBwYW5lbFNuYXBcbiAqIFZlcnNpb24gMC4xNC4wXG4gKlxuICogUmVxdWlyZXM6XG4gKiAtIGpRdWVyeSAxLjcgb3IgaGlnaGVyIChubyBqUXVlcnkubWlncmF0ZSBuZWVkZWQpXG4gKlxuICogaHR0cHM6Ly9naXRodWIuY29tL2d1aWRvYm91bWFuL2pxdWVyeS1wYW5lbHNuYXBcbiAqXG4gKiBDb3B5cmlnaHQgMjAxMywgR3VpZG8gQm91bWFuXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqXG4gKiBEYXRlOiBXZWQgRmViIDEzIDE2OjA1OjAwIDIwMTMgKzAxMDBcbiAqL1xuKGZ1bmN0aW9uKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIHBsdWdpbk5hbWUgPSAncGFuZWxTbmFwJztcbiAgdmFyIHN0b3JhZ2VOYW1lID0gJ3BsdWdpbl8nICsgcGx1Z2luTmFtZTtcblxuICB2YXIgcGx1Z2luT2JqZWN0ID0ge1xuXG4gICAgaXNNb3VzZURvd246IGZhbHNlLFxuICAgIGlzU25hcHBpbmc6IGZhbHNlLFxuICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgc2Nyb2xsSW50ZXJ2YWw6IDAsXG4gICAgc2Nyb2xsT2Zmc2V0OiAwLFxuXG4gICAgaW5pdDogZnVuY3Rpb24ob3B0aW9ucywgY29udGFpbmVyKSB7XG5cbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgc2VsZi5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgICBzZWxmLiRjb250YWluZXIgPSAkKGNvbnRhaW5lcik7XG5cbiAgICAgIHNlbGYuJGV2ZW50Q29udGFpbmVyID0gc2VsZi4kY29udGFpbmVyO1xuICAgICAgc2VsZi4kc25hcENvbnRhaW5lciA9IHNlbGYuJGNvbnRhaW5lcjtcblxuICAgICAgaWYoc2VsZi4kY29udGFpbmVyLmlzKCdib2R5JykpIHtcbiAgICAgICAgc2VsZi4kZXZlbnRDb250YWluZXIgPSAkKGRvY3VtZW50KTtcbiAgICAgICAgc2VsZi4kc25hcENvbnRhaW5lciA9ICQoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcblxuICAgICAgICB2YXIgdWEgPSBuYXZpZ2F0b3IudXNlckFnZW50O1xuICAgICAgICBpZih+dWEuaW5kZXhPZignV2ViS2l0JykpIHtcbiAgICAgICAgICBzZWxmLiRzbmFwQ29udGFpbmVyID0gJCgnYm9keScpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHNlbGYudXBkYXRlU2Nyb2xsSW50ZXJ2YWwoKTtcblxuICAgICAgc2VsZi5vcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sICQuZm4ucGFuZWxTbmFwLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICBzZWxmLmJpbmQoKTtcblxuICAgICAgaWYoc2VsZi5vcHRpb25zLiRtZW51ICE9PSBmYWxzZSAmJiAkKCcuYWN0aXZlJywgc2VsZi5vcHRpb25zLiRtZW51KS5sZW5ndGggPiAwKSB7XG4gICAgICAgICQoJy5hY3RpdmUnLCBzZWxmLm9wdGlvbnMuJG1lbnUpLmNsaWNrKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgJHRhcmdldCA9IHNlbGYuZ2V0UGFuZWwoJzpmaXJzdCcpO1xuICAgICAgICBzZWxmLmFjdGl2YXRlUGFuZWwoJHRhcmdldCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzZWxmO1xuXG4gICAgfSxcblxuICAgIGJpbmQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIHNlbGYuYmluZFByb3hpZWQoc2VsZi4kZXZlbnRDb250YWluZXIsICdzY3JvbGxzdG9wJywgc2VsZi5zY3JvbGxTdG9wKTtcbiAgICAgIHNlbGYuYmluZFByb3hpZWQoc2VsZi4kZXZlbnRDb250YWluZXIsICdtb3VzZXdoZWVsJywgc2VsZi5tb3VzZVdoZWVsKTtcbiAgICAgIHNlbGYuYmluZFByb3hpZWQoc2VsZi4kZXZlbnRDb250YWluZXIsICdtb3VzZWRvd24nLCBzZWxmLm1vdXNlRG93bik7XG4gICAgICBzZWxmLmJpbmRQcm94aWVkKHNlbGYuJGV2ZW50Q29udGFpbmVyLCAnbW91c2V1cCcsIHNlbGYubW91c2VVcCk7XG5cbiAgICAgIHNlbGYuYmluZFByb3hpZWQoJCh3aW5kb3cpLCAncmVzaXplc3RvcCcsIHNlbGYucmVzaXplKTtcblxuICAgICAgaWYoc2VsZi5vcHRpb25zLiRtZW51KSB7XG4gICAgICAgIHNlbGYuYmluZFByb3hpZWQoc2VsZi5vcHRpb25zLiRtZW51LCAnY2xpY2snLCBzZWxmLmNhcHR1cmVNZW51Q2xpY2ssIHNlbGYub3B0aW9ucy5tZW51U2VsZWN0b3IpO1xuICAgICAgfVxuXG4gICAgICBpZihzZWxmLm9wdGlvbnMubmF2aWdhdGlvbi5rZXlzLm5leHRLZXkgfHwgc2VsZi5vcHRpb25zLm5hdmlnYXRpb24ua2V5cy5wcmV2S2V5KSB7XG4gICAgICAgIHNlbGYuYmluZFByb3hpZWQoJCh3aW5kb3cpLCAna2V5ZG93bicsIHNlbGYua2V5RG93bik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZWxmLm9wdGlvbnMubmF2aWdhdGlvbi5idXR0b25zLiRuZXh0QnV0dG9uKSB7XG4gICAgICAgIHNlbGYuYmluZFByb3hpZWQoc2VsZi5vcHRpb25zLm5hdmlnYXRpb24uYnV0dG9ucy4kbmV4dEJ1dHRvbiwgJ2NsaWNrJywgc2VsZi5jYXB0dXJlTmV4dENsaWNrKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNlbGYub3B0aW9ucy5uYXZpZ2F0aW9uLmJ1dHRvbnMuJHByZXZCdXR0b24pIHtcbiAgICAgICAgc2VsZi5iaW5kUHJveGllZChzZWxmLm9wdGlvbnMubmF2aWdhdGlvbi5idXR0b25zLiRwcmV2QnV0dG9uLCAnY2xpY2snLCBzZWxmLmNhcHR1cmVQcmV2Q2xpY2spO1xuICAgICAgfVxuXG4gICAgfSxcblxuICAgIGJpbmRQcm94aWVkOiBmdW5jdGlvbigkZWxlbWVudCwgZXZlbnQsIG1ldGhvZCwgc2VsZWN0b3IpIHtcblxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICBzZWxlY3RvciA9IHR5cGVvZiBzZWxlY3RvciA9PT0gJ3N0cmluZycgPyBzZWxlY3RvciA6IG51bGw7XG5cbiAgICAgICRlbGVtZW50Lm9uKGV2ZW50ICsgc2VsZi5vcHRpb25zLm5hbWVzcGFjZSwgc2VsZWN0b3IsICQucHJveHkoZnVuY3Rpb24oZSkge1xuXG4gICAgICAgIHJldHVybiBtZXRob2QuY2FsbChzZWxmLCBlKTtcblxuICAgICAgfSwgc2VsZikpO1xuXG4gICAgfSxcblxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIC8vIEdvdHRhIGxvdmUgbmFtZXNwYWNlZCBldmVudHMhXG4gICAgICBzZWxmLiRldmVudENvbnRhaW5lci5vZmYoc2VsZi5vcHRpb25zLm5hbWVzcGFjZSk7XG5cbiAgICAgICQod2luZG93KS5vZmYoc2VsZi5vcHRpb25zLm5hbWVzcGFjZSk7XG5cbiAgICAgIGlmKHNlbGYub3B0aW9ucy4kbWVudSAhPT0gZmFsc2UpIHtcbiAgICAgICAgJChzZWxmLm9wdGlvbnMubWVudVNlbGVjdG9yLCBzZWxmLm9wdGlvbnMuJG1lbnUpLm9mZihzZWxmLm9wdGlvbnMubmFtZXNwYWNlKTtcbiAgICAgIH1cblxuICAgICAgc2VsZi4kY29udGFpbmVyLnJlbW92ZURhdGEoc3RvcmFnZU5hbWUpO1xuXG4gICAgfSxcblxuICAgIHNjcm9sbFN0b3A6IGZ1bmN0aW9uKGUpIHtcblxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICBpZihzZWxmLmlzTW91c2VEb3duKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYoc2VsZi5pc1NuYXBwaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2VsZi51cGRhdGVTY3JvbGxJbnRlcnZhbCgpO1xuXG4gICAgICB2YXIgb2Zmc2V0ID0gc2VsZi4kc25hcENvbnRhaW5lci5zY3JvbGxUb3AoKTtcbiAgICAgIHZhciBzY3JvbGxEaWZmZXJlbmNlID0gb2Zmc2V0IC0gc2VsZi5zY3JvbGxPZmZzZXQ7XG4gICAgICB2YXIgbWF4T2Zmc2V0ID0gc2VsZi4kY29udGFpbmVyWzBdLnNjcm9sbEhlaWdodCAtIHNlbGYuc2Nyb2xsSW50ZXJ2YWw7XG4gICAgICB2YXIgcGFuZWxDb3VudCA9IHNlbGYuZ2V0UGFuZWwoKS5sZW5ndGggLSAxO1xuXG4gICAgICB2YXIgY2hpbGROdW1iZXI7XG4gICAgICBpZihcbiAgICAgICAgc2VsZi5lbmFibGVkICYmXG4gICAgICAgIHNjcm9sbERpZmZlcmVuY2UgPCAtc2VsZi5vcHRpb25zLmRpcmVjdGlvblRocmVzaG9sZCAmJlxuICAgICAgICBzY3JvbGxEaWZmZXJlbmNlID4gLXNlbGYuc2Nyb2xsSW50ZXJ2YWxcbiAgICAgICkge1xuICAgICAgICBjaGlsZE51bWJlciA9IE1hdGguZmxvb3Iob2Zmc2V0IC8gc2VsZi5zY3JvbGxJbnRlcnZhbCk7XG4gICAgICB9IGVsc2UgaWYoXG4gICAgICAgIHNlbGYuZW5hYmxlZCAmJlxuICAgICAgICBzY3JvbGxEaWZmZXJlbmNlID4gc2VsZi5vcHRpb25zLmRpcmVjdGlvblRocmVzaG9sZCAmJlxuICAgICAgICBzY3JvbGxEaWZmZXJlbmNlIDwgc2VsZi5zY3JvbGxJbnRlcnZhbFxuICAgICAgKSB7XG4gICAgICAgIGNoaWxkTnVtYmVyID0gTWF0aC5jZWlsKG9mZnNldCAvIHNlbGYuc2Nyb2xsSW50ZXJ2YWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hpbGROdW1iZXIgPSBNYXRoLnJvdW5kKG9mZnNldCAvIHNlbGYuc2Nyb2xsSW50ZXJ2YWwpO1xuICAgICAgfVxuXG4gICAgICBjaGlsZE51bWJlciA9IE1hdGgubWF4KDAsIE1hdGgubWluKGNoaWxkTnVtYmVyLCBwYW5lbENvdW50KSk7XG5cbiAgICAgIHZhciAkdGFyZ2V0ID0gc2VsZi5nZXRQYW5lbCgnOmVxKCcgKyBjaGlsZE51bWJlciArICcpJyk7XG5cbiAgICAgIGlmKCFzZWxmLmVuYWJsZWQpIHtcbiAgICAgICAgaWYoISR0YXJnZXQuaXMoc2VsZi5nZXRQYW5lbCgnLmFjdGl2ZScpKSkge1xuICAgICAgICAgIHNlbGYuYWN0aXZhdGVQYW5lbCgkdGFyZ2V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gVG8gZ2V0IG5vcm1hbCBzY3JvbGxpbmcgaW4gcGFuZWxzIHRhbGxlciB0aGFuIHRoZSB2aWV3cG9ydCxcbiAgICAgIC8vIHN0b3AgaWYgdGhlcmUncyBubyBtdWx0aXBsZSBwYW5lbHMgaW4gdmlld3BvcnRcbiAgICAgIGlmIChzZWxmLmdldFBhbmVsc0luVmlld3BvcnQoKS5sZW5ndGggPCAyKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGlmIChvZmZzZXQgPD0gMCB8fCBvZmZzZXQgPj0gbWF4T2Zmc2V0KSB7XG4gICAgICAgIC8vIE9ubHkgYWN0aXZhdGUsIHByZXZlbnQgc3R1dHRlcmluZ1xuICAgICAgICBzZWxmLmFjdGl2YXRlUGFuZWwoJHRhcmdldCk7XG4gICAgICAgIC8vIFNldCBzY3JvbGxPZmZzZXQgdG8gYSBzYW5lIG51bWJlciBmb3IgbmV4dCBzY3JvbGxcbiAgICAgICAgc2VsZi5zY3JvbGxPZmZzZXQgPSBvZmZzZXQgPD0gMCA/IDAgOiBtYXhPZmZzZXQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLnNuYXBUb1BhbmVsKCR0YXJnZXQpO1xuICAgICAgfVxuXG4gICAgfSxcblxuICAgIGdldFBhbmVsc0luVmlld3BvcnQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICB2YXIgJHdpbmRvdyA9ICQod2luZG93KTtcblxuICAgICAgdmFyIHZpZXdwb3J0ID0geyB0b3A6ICR3aW5kb3cuc2Nyb2xsVG9wKCkgfTtcbiAgICAgIHZpZXdwb3J0LmJvdHRvbSA9IHZpZXdwb3J0LnRvcCArICR3aW5kb3cuaGVpZ2h0KCk7XG5cbiAgICAgIHZhciBwYW5lbHMgPSBzZWxmLmdldFBhbmVsKCkuZmlsdGVyKGZ1bmN0aW9uIChfLCBlbCkge1xuICAgICAgICB2YXIgJGVsID0gJChlbCk7XG4gICAgICAgIHZhciBib3VuZHMgPSAkZWwub2Zmc2V0KCk7XG4gICAgICAgIGJvdW5kcy5ib3R0b20gPSBib3VuZHMudG9wICsgJGVsLm91dGVySGVpZ2h0KCk7XG5cbiAgICAgICAgcmV0dXJuICEodmlld3BvcnQuYm90dG9tIDwgYm91bmRzLnRvcCB8fCB2aWV3cG9ydC50b3AgPiBib3VuZHMuYm90dG9tKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcGFuZWxzO1xuICAgIH0sXG5cbiAgICBtb3VzZVdoZWVsOiBmdW5jdGlvbihlKSB7XG5cbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgLy8gVGhpcyBldmVudCBvbmx5IGZpcmVzIHdoZW4gdGhlIHVzZXIgYWN0dWFsbHkgc2Nyb2xscyB3aXRoIHRoZWlyIGlucHV0IGRldmljZS5cbiAgICAgIC8vIEJlIGl0IGEgdHJhY2twYWQsIGxlZ2FjeSBtb3VzZSBvciBhbnl0aGluZyBlbHNlLlxuXG4gICAgICBpZihzZWxmLmlzU25hcHBpbmcpIHtcbiAgICAgICAgc2VsZi5zY3JvbGxPZmZzZXQgPSBzZWxmLiRzbmFwQ29udGFpbmVyLnNjcm9sbFRvcCgpO1xuICAgICAgICBzZWxmLiRjb250YWluZXIuc3RvcCh0cnVlKTtcbiAgICAgICAgc2VsZi5pc1NuYXBwaW5nID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICB9LFxuXG4gICAgbW91c2VEb3duOiBmdW5jdGlvbihlKSB7XG5cbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgc2VsZi5pc01vdXNlRG93biA9IHRydWU7XG5cbiAgICB9LFxuXG4gICAgbW91c2VVcDogZnVuY3Rpb24oZSkge1xuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIHNlbGYuaXNNb3VzZURvd24gPSBmYWxzZTtcblxuICAgICAgaWYoc2VsZi5zY3JvbGxPZmZzZXQgIT09IHNlbGYuJHNuYXBDb250YWluZXIuc2Nyb2xsVG9wKCkpIHtcbiAgICAgICAgc2VsZi5zY3JvbGxTdG9wKGUpO1xuICAgICAgfVxuXG4gICAgfSxcblxuICAgIGtleURvd246IGZ1bmN0aW9uKGUpIHtcblxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICB2YXIgbmF2ID0gc2VsZi5vcHRpb25zLm5hdmlnYXRpb247XG5cbiAgICAgIGlmKCFzZWxmLmVuYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzd2l0Y2goZS53aGljaCkge1xuICAgICAgICBjYXNlIG5hdi5rZXlzLnByZXZLZXk6XG4gICAgICAgIGNhc2UgbmF2LmtleXMubmV4dEtleTpcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZWxmLmlzU25hcHBpbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzd2l0Y2goZS53aGljaCkge1xuICAgICAgICBjYXNlIG5hdi5rZXlzLnByZXZLZXk6XG4gICAgICAgICAgc2VsZi5zbmFwVG8oJ3ByZXYnLCBuYXYud3JhcEFyb3VuZCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgbmF2LmtleXMubmV4dEtleTpcbiAgICAgICAgICBzZWxmLnNuYXBUbygnbmV4dCcsIG5hdi53cmFwQXJvdW5kKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgIH0sXG5cbiAgICBjYXB0dXJlTmV4dENsaWNrOiBmdW5jdGlvbihlKSB7XG5cbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBpZiAoc2VsZi5pc1NuYXBwaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2VsZi5zbmFwVG8oJ25leHQnLCBzZWxmLm9wdGlvbnMubmF2aWdhdGlvbi53cmFwQXJvdW5kKTtcblxuICAgIH0sXG5cbiAgICBjYXB0dXJlUHJldkNsaWNrOiBmdW5jdGlvbihlKSB7XG5cbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBpZiAoc2VsZi5pc1NuYXBwaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2VsZi5zbmFwVG8oJ3ByZXYnLCBzZWxmLm9wdGlvbnMubmF2aWdhdGlvbi53cmFwQXJvdW5kKTtcblxuICAgIH0sXG5cbiAgICByZXNpemU6IGZ1bmN0aW9uKGUpIHtcblxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICBzZWxmLnVwZGF0ZVNjcm9sbEludGVydmFsKCk7XG5cbiAgICAgIGlmKCFzZWxmLmVuYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgJHRhcmdldCA9IHNlbGYuZ2V0UGFuZWwoJy5hY3RpdmUnKTtcblxuICAgICAgc2VsZi5zbmFwVG9QYW5lbCgkdGFyZ2V0KTtcblxuICAgIH0sXG5cbiAgICBjYXB0dXJlTWVudUNsaWNrOiBmdW5jdGlvbihlKSB7XG5cbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgdmFyIHBhbmVsID0gJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ3BhbmVsJyk7XG4gICAgICB2YXIgJHRhcmdldCA9IHNlbGYuZ2V0UGFuZWwoJ1tkYXRhLXBhbmVsPVwiJyArIHBhbmVsICsgJ1wiXScpO1xuXG4gICAgICBzZWxmLnNuYXBUb1BhbmVsKCR0YXJnZXQpO1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICB9LFxuXG4gICAgc25hcFRvUGFuZWw6IGZ1bmN0aW9uKCR0YXJnZXQpIHtcblxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICBpZiAoISR0YXJnZXQuanF1ZXJ5KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2VsZi5pc1NuYXBwaW5nID0gdHJ1ZTtcblxuICAgICAgc2VsZi5vcHRpb25zLm9uU25hcFN0YXJ0LmNhbGwoc2VsZiwgJHRhcmdldCk7XG4gICAgICBzZWxmLiRjb250YWluZXIudHJpZ2dlcigncGFuZWxzbmFwOnN0YXJ0JywgWyR0YXJnZXRdKTtcblxuICAgICAgdmFyIHNjcm9sbFRhcmdldCA9IDA7XG4gICAgICBpZihzZWxmLiRjb250YWluZXIuaXMoJ2JvZHknKSkge1xuICAgICAgICBzY3JvbGxUYXJnZXQgPSAkdGFyZ2V0Lm9mZnNldCgpLnRvcCAtIHNlbGYub3B0aW9ucy5vZmZzZXQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzY3JvbGxUYXJnZXQgPSBzZWxmLiRzbmFwQ29udGFpbmVyLnNjcm9sbFRvcCgpICsgJHRhcmdldC5wb3NpdGlvbigpLnRvcCAtIHNlbGYub3B0aW9ucy5vZmZzZXQ7XG4gICAgICB9XG5cbiAgICAgIHNlbGYuJHNuYXBDb250YWluZXIuc3RvcCh0cnVlKS5kZWxheShzZWxmLm9wdGlvbnMuZGVsYXkpLmFuaW1hdGUoe1xuICAgICAgICBzY3JvbGxUb3A6IHNjcm9sbFRhcmdldFxuICAgICAgfSwgc2VsZi5vcHRpb25zLnNsaWRlU3BlZWQsIHNlbGYub3B0aW9ucy5lYXNpbmcsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIC8vIFNldCBzY3JvbGxPZmZzZXQgdG8gc2Nyb2xsVG9wXG4gICAgICAgIC8vIChub3QgdG8gc2Nyb2xsVGFyZ2V0IHNpbmNlIG9uIGlQYWQgdGhvc2Ugc29tZXRpbWVzIGRpZmZlcilcbiAgICAgICAgc2VsZi5zY3JvbGxPZmZzZXQgPSBzZWxmLiRzbmFwQ29udGFpbmVyLnNjcm9sbFRvcCgpO1xuICAgICAgICBzZWxmLmlzU25hcHBpbmcgPSBmYWxzZTtcblxuICAgICAgICAvLyBDYWxsIGNhbGxiYWNrXG4gICAgICAgIHNlbGYub3B0aW9ucy5vblNuYXBGaW5pc2guY2FsbChzZWxmLCAkdGFyZ2V0KTtcbiAgICAgICAgc2VsZi4kY29udGFpbmVyLnRyaWdnZXIoJ3BhbmVsc25hcDpmaW5pc2gnLCBbJHRhcmdldF0pO1xuXG4gICAgICAgIHNlbGYuYWN0aXZhdGVQYW5lbCgkdGFyZ2V0KTtcbiAgICAgIH0pO1xuXG4gICAgfSxcblxuICAgIGFjdGl2YXRlUGFuZWw6IGZ1bmN0aW9uKCR0YXJnZXQpIHtcblxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICBzZWxmLmdldFBhbmVsKCcuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgJHRhcmdldC5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgIGlmKHNlbGYub3B0aW9ucy4kbWVudSAhPT0gZmFsc2UpIHtcbiAgICAgICAgdmFyIGFjdGl2ZUl0ZW1TZWxlY3RvciA9IHNlbGYub3B0aW9ucy5tZW51U2VsZWN0b3IgKyAnLmFjdGl2ZSc7XG4gICAgICAgICQoYWN0aXZlSXRlbVNlbGVjdG9yLCBzZWxmLm9wdGlvbnMuJG1lbnUpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICB2YXIgYXR0cmlidXRlID0gJ1tkYXRhLXBhbmVsPVwiJyArICR0YXJnZXQuZGF0YSgncGFuZWwnKSArICdcIl0nO1xuICAgICAgICB2YXIgaXRlbVNlbGVjdG9yID0gc2VsZi5vcHRpb25zLm1lbnVTZWxlY3RvciArIGF0dHJpYnV0ZTtcbiAgICAgICAgdmFyICRpdGVtVG9BY3RpdmF0ZSA9ICQoaXRlbVNlbGVjdG9yLCBzZWxmLm9wdGlvbnMuJG1lbnUpO1xuICAgICAgICAkaXRlbVRvQWN0aXZhdGUuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgfVxuXG4gICAgICB2YXIgbmF2ID0gc2VsZi5vcHRpb25zLm5hdmlnYXRpb247XG5cbiAgICAgIGlmKCFuYXYud3JhcEFyb3VuZCkge1xuICAgICAgICB2YXIgJHBhbmVscyA9IHNlbGYuZ2V0UGFuZWwoKTtcbiAgICAgICAgdmFyIGluZGV4ID0gJHBhbmVscy5pbmRleChzZWxmLmdldFBhbmVsKCcuYWN0aXZlJykpO1xuXG4gICAgICAgIGlmIChuYXYuYnV0dG9ucy4kbmV4dEJ1dHRvbiAhPT0gZmFsc2UgKSB7XG4gICAgICAgICAgJHRhcmdldCA9ICRwYW5lbHMuZXEoaW5kZXggKyAxKTtcbiAgICAgICAgICBpZigkdGFyZ2V0Lmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgICQobmF2LmJ1dHRvbnMuJG5leHRCdXR0b24pLmF0dHIoJ2FyaWEtZGlzYWJsZWQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgJChuYXYuYnV0dG9ucy4kbmV4dEJ1dHRvbikuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQobmF2LmJ1dHRvbnMuJG5leHRCdXR0b24pLmF0dHIoJ2FyaWEtZGlzYWJsZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgICQobmF2LmJ1dHRvbnMuJG5leHRCdXR0b24pLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICBcdGlmIChuYXYuYnV0dG9ucy4kcHJldkJ1dHRvbiAhPT0gZmFsc2UgKSB7XG4gICAgICAgICAgaWYoaW5kZXggPCAxKSB7XG4gICAgICAgICAgICAkKG5hdi5idXR0b25zLiRwcmV2QnV0dG9uKS5hdHRyKCdhcmlhLWRpc2FibGVkJywgJ3RydWUnKTtcbiAgICAgICAgICAgICQobmF2LmJ1dHRvbnMuJHByZXZCdXR0b24pLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKG5hdi5idXR0b25zLiRwcmV2QnV0dG9uKS5hdHRyKCdhcmlhLWRpc2FibGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgICAgICAkKG5hdi5idXR0b25zLiRwcmV2QnV0dG9uKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc2VsZi5vcHRpb25zLm9uQWN0aXZhdGUuY2FsbChzZWxmLCAkdGFyZ2V0KTtcbiAgICAgIHNlbGYuJGNvbnRhaW5lci50cmlnZ2VyKCdwYW5lbHNuYXA6YWN0aXZhdGUnLCBbJHRhcmdldF0pO1xuXG4gICAgfSxcblxuICAgIGdldFBhbmVsOiBmdW5jdGlvbihzZWxlY3Rvcikge1xuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIGlmKHR5cGVvZiBzZWxlY3RvciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgc2VsZWN0b3IgPSAnJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICQoc2VsZi5vcHRpb25zLnBhbmVsU2VsZWN0b3IgKyBzZWxlY3Rvciwgc2VsZi4kY29udGFpbmVyKTtcblxuICAgIH0sXG5cbiAgICBzbmFwVG86IGZ1bmN0aW9uKHRhcmdldCwgd3JhcCkge1xuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIGlmKHR5cGVvZiB3cmFwICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgd3JhcCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHZhciAkcGFuZWxzID0gc2VsZi5nZXRQYW5lbCgpO1xuICAgICAgdmFyIGluZGV4ID0gJHBhbmVscy5pbmRleChzZWxmLmdldFBhbmVsKCcuYWN0aXZlJykpO1xuICAgICAgdmFyICR0YXJnZXQ7XG5cbiAgICAgIHN3aXRjaCh0YXJnZXQpIHtcbiAgICAgICAgY2FzZSAncHJldic6XG5cbiAgICAgICAgICAkdGFyZ2V0ID0gJHBhbmVscy5lcShpbmRleCAtIDEpO1xuICAgICAgICAgIGlmKGluZGV4IDwgMSAmJiAhd3JhcClcbiAgICAgICAgICB7XG4gICAgICAgICAgICAkdGFyZ2V0ID0gW107IC8vIENsZWFyIHRhcmdldCwgYmVjYXVzZSBuZWdhdGl2ZSBpbmRleGVzIHdyYXAgYXV0b21hdGljYWxseVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICduZXh0JzpcblxuICAgICAgICAgICR0YXJnZXQgPSAkcGFuZWxzLmVxKGluZGV4ICsgMSk7XG4gICAgICAgICAgaWYoJHRhcmdldC5sZW5ndGggPCAxICYmIHdyYXApXG4gICAgICAgICAge1xuICAgICAgICAgICAgJHRhcmdldCA9ICRwYW5lbHMuZmlsdGVyKCc6Zmlyc3QnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnZmlyc3QnOlxuXG4gICAgICAgICAgJHRhcmdldCA9ICRwYW5lbHMuZmlsdGVyKCc6Zmlyc3QnKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdsYXN0JzpcblxuICAgICAgICAgICR0YXJnZXQgPSAkcGFuZWxzLmZpbHRlcignOmxhc3QnKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgaWYoJHRhcmdldC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHNlbGYuc25hcFRvUGFuZWwoJHRhcmdldCk7XG4gICAgICB9XG5cbiAgICB9LFxuXG4gICAgZ2V0U2Nyb2xsSW50ZXJ2YWw6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgcmV0dXJuIHRoaXMuJGNvbnRhaW5lci5pcygnYm9keScpID8gd2luZG93LmlubmVySGVpZ2h0IDogdGhpcy4kY29udGFpbmVyLmhlaWdodCgpO1xuICAgIH0sXG5cbiAgICB1cGRhdGVTY3JvbGxJbnRlcnZhbDogZnVuY3Rpb24gKCkge1xuXG4gICAgICB0aGlzLnNjcm9sbEludGVydmFsID0gdGhpcy5nZXRTY3JvbGxJbnRlcnZhbCgpO1xuXG4gICAgfSxcblxuICAgIGVuYWJsZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgLy8gR2F0aGVyIHNjcm9sbE9mZnNldCBmb3IgbmV4dCBzY3JvbGxcbiAgICAgIHNlbGYuc2Nyb2xsT2Zmc2V0ID0gc2VsZi4kc25hcENvbnRhaW5lci5zY3JvbGxUb3AoKTtcblxuICAgICAgc2VsZi5lbmFibGVkID0gdHJ1ZTtcblxuICAgIH0sXG5cbiAgICBkaXNhYmxlOiBmdW5jdGlvbigpIHtcblxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICBzZWxmLmVuYWJsZWQgPSBmYWxzZTtcblxuICAgIH0sXG5cbiAgICB0b2dnbGU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIGlmKHNlbGYuZW5hYmxlZCkge1xuICAgICAgICBzZWxmLmRpc2FibGUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYuZW5hYmxlKCk7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgfTtcblxuICAkLmZuW3BsdWdpbk5hbWVdID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcblxuICAgICAgdmFyIHBsdWdpbkluc3RhbmNlID0gJC5kYXRhKHRoaXMsIHN0b3JhZ2VOYW1lKTtcbiAgICAgIGlmKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyB8fCBvcHRpb25zID09PSAnaW5pdCcgfHwgISBvcHRpb25zKSB7XG4gICAgICAgIGlmKCFwbHVnaW5JbnN0YW5jZSkge1xuICAgICAgICAgIGlmKG9wdGlvbnMgPT09ICdpbml0Jykge1xuICAgICAgICAgICAgb3B0aW9ucyA9IGFyZ3NbMV0gfHwge307XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcGx1Z2luSW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKHBsdWdpbk9iamVjdCkuaW5pdChvcHRpb25zLCB0aGlzKTtcbiAgICAgICAgICAkLmRhdGEodGhpcywgc3RvcmFnZU5hbWUsIHBsdWdpbkluc3RhbmNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkLmVycm9yKCdQbHVnaW4gaXMgYWxyZWFkeSBpbml0aWFsaXplZCBmb3IgdGhpcyBvYmplY3QuJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYoIXBsdWdpbkluc3RhbmNlKSB7XG4gICAgICAgICQuZXJyb3IoJ1BsdWdpbiBpcyBub3QgaW5pdGlhbGl6ZWQgZm9yIHRoaXMgb2JqZWN0IHlldC4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIGlmKHBsdWdpbkluc3RhbmNlW29wdGlvbnNdKSB7XG4gICAgICAgIHZhciBtZXRob2QgPSBvcHRpb25zO1xuICAgICAgICBvcHRpb25zID0gYXJncy5zbGljZSgxKTtcbiAgICAgICAgcGx1Z2luSW5zdGFuY2VbbWV0aG9kXS5hcHBseShwbHVnaW5JbnN0YW5jZSwgb3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkLmVycm9yKCdNZXRob2QgJyArICBvcHRpb25zICsgJyBkb2VzIG5vdCBleGlzdCBvbiBqUXVlcnkucGFuZWxTbmFwLicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICB9KTtcblxuICB9O1xuXG4gICQuZm5bcGx1Z2luTmFtZV0ub3B0aW9ucyA9IHtcbiAgICAkbWVudTogZmFsc2UsXG4gICAgbWVudVNlbGVjdG9yOiAnYScsXG4gICAgcGFuZWxTZWxlY3RvcjogJz4gc2VjdGlvbicsXG4gICAgbmFtZXNwYWNlOiAnLnBhbmVsU25hcCcsXG4gICAgb25TbmFwU3RhcnQ6IGZ1bmN0aW9uKCl7fSxcbiAgICBvblNuYXBGaW5pc2g6IGZ1bmN0aW9uKCl7fSxcbiAgICBvbkFjdGl2YXRlOiBmdW5jdGlvbigpe30sXG4gICAgZGlyZWN0aW9uVGhyZXNob2xkOiA1MCxcbiAgICBzbGlkZVNwZWVkOiAyMDAsXG4gICAgZGVsYXk6IDAsXG4gICAgZWFzaW5nOiAnbGluZWFyJyxcbiAgICBvZmZzZXQ6IDAsXG4gICAgbmF2aWdhdGlvbjoge1xuICAgICAga2V5czoge1xuICAgICAgICBuZXh0S2V5OiBmYWxzZSxcbiAgICAgICAgcHJldktleTogZmFsc2VcbiAgICAgIH0sXG4gICAgICBidXR0b25zOiB7XG4gICAgICAgICRuZXh0QnV0dG9uOiBmYWxzZSxcbiAgICAgICAgJHByZXZCdXR0b246IGZhbHNlXG4gICAgICB9LFxuICAgICAgd3JhcEFyb3VuZDogZmFsc2VcbiAgICB9XG4gIH07XG5cbn0pKGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCk7XG5cbi8qIVxuICogU3BlY2lhbCBmbGF2b3VyZWQgalF1ZXJ5IE1vYmlsZSBzY3JvbGxzdGFydCAmIHNjcm9sbHN0b3AgZXZlbnRzLlxuICogVmVyc2lvbiAwLjEuM1xuICpcbiAqIFJlcXVpcmVzOlxuICogLSBqUXVlcnkgMS43LjEgb3IgaGlnaGVyIChubyBqUXVlcnkubWlncmF0ZSBuZWVkZWQpXG4gKlxuICogQ29weXJpZ2h0IDIwMTMsIEd1aWRvIEJvdW1hblxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKlxuICogRGF0ZTogV2VkIEZlYiAxMyAxNjowNTowMCAyMDEzICswMTAwXG4gKi9cbihmdW5jdGlvbigkKSB7XG5cbiAgLy8gQWxzbyBoYW5kbGVzIHRoZSBzY3JvbGxzdG9wIGV2ZW50XG4gICQuZXZlbnQuc3BlY2lhbC5zY3JvbGxzdGFydCA9IHtcblxuICAgIGVuYWJsZWQ6IHRydWUsXG5cbiAgICBzZXR1cDogZnVuY3Rpb24oKSB7XG5cbiAgICAgIHZhciB0aGlzT2JqZWN0ID0gdGhpcztcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpc09iamVjdCk7XG4gICAgICB2YXIgc2Nyb2xsaW5nO1xuICAgICAgdmFyIHRpbWVyO1xuICAgICAgdmFyIGlzVG91Y2hpbmc7XG5cbiAgICAgICR0aGlzLmRhdGEoJ3Njcm9sbHdhdGNoJywgdHJ1ZSk7XG5cbiAgICAgIGZ1bmN0aW9uIHRyaWdnZXIoZXZlbnQsIHNjcm9sbGluZykge1xuXG4gICAgICAgIGV2ZW50LnR5cGUgPSBzY3JvbGxpbmcgPyAnc2Nyb2xsc3RhcnQnIDogJ3Njcm9sbHN0b3AnO1xuICAgICAgICAkdGhpcy50cmlnZ2VyKGV2ZW50KTtcblxuICAgICAgfVxuXG4gICAgICAkdGhpcy5vbigndG91Y2hzdGFydCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGlzVG91Y2hpbmcgPSB0cnVlO1xuICAgICAgfSk7XG5cbiAgICAgICR0aGlzLm9uKCd0b3VjaGxlYXZlIHRvdWNoY2FuY2VsIHRvdWNoZW5kJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgaXNUb3VjaGluZyA9IGZhbHNlO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICB9LCA1MCk7XG4gICAgICB9KTtcblxuICAgICAgJHRoaXMub24oJ3RvdWNobW92ZSBzY3JvbGwnLCBmdW5jdGlvbihldmVudCkge1xuXG4gICAgICAgIGlmIChpc1RvdWNoaW5nKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoISQuZXZlbnQuc3BlY2lhbC5zY3JvbGxzdGFydC5lbmFibGVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoISQuZXZlbnQuc3BlY2lhbC5zY3JvbGxzdGFydC5zY3JvbGxpbmcpIHtcbiAgICAgICAgICAkLmV2ZW50LnNwZWNpYWwuc2Nyb2xsc3RhcnQuc2Nyb2xsaW5nID0gdHJ1ZTtcbiAgICAgICAgICB0cmlnZ2VyKGV2ZW50LCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgIHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAkLmV2ZW50LnNwZWNpYWwuc2Nyb2xsc3RhcnQuc2Nyb2xsaW5nID0gZmFsc2U7XG4gICAgICAgICAgdHJpZ2dlcihldmVudCwgZmFsc2UpO1xuICAgICAgICB9LCA1MCk7XG5cbiAgICAgIH0pO1xuXG4gICAgfVxuXG4gIH07XG5cbiAgLy8gUHJveGllcyBzY3JvbGxzdGFydCB3aGVuIG5lZWRlZFxuICAkLmV2ZW50LnNwZWNpYWwuc2Nyb2xsc3RvcCA9IHtcblxuICAgIHNldHVwOiBmdW5jdGlvbigpIHtcblxuICAgICAgdmFyIHRoaXNPYmplY3QgPSB0aGlzO1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzT2JqZWN0KTtcblxuICAgICAgaWYoISR0aGlzLmRhdGEoJ3Njcm9sbHdhdGNoJykpIHtcbiAgICAgICAgJCh0aGlzKS5vbignc2Nyb2xsc3RhcnQnLCBmdW5jdGlvbigpe30pO1xuICAgICAgfVxuXG4gICAgfVxuXG4gIH07XG5cbn0pKGpRdWVyeSk7XG5cbi8qIVxuICogUmVzaXplc3RhcnQgYW5kIHJlc2l6ZXN0b3AgZXZlbnRzLlxuICogVmVyc2lvbiAwLjAuMVxuICpcbiAqIFJlcXVpcmVzOlxuICogLSBqUXVlcnkgMS43LjEgb3IgaGlnaGVyIChubyBqUXVlcnkubWlncmF0ZSBuZWVkZWQpXG4gKlxuICogQ29weXJpZ2h0IDIwMTMsIEd1aWRvIEJvdW1hblxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKlxuICogRGF0ZTogRnJpIE9jdCAyNSAxNTowNTowMCAyMDEzICswMTAwXG4gKi9cbihmdW5jdGlvbigkKSB7XG5cbiAgLy8gQWxzbyBoYW5kbGVzIHRoZSByZXNpemVzdG9wIGV2ZW50XG4gICQuZXZlbnQuc3BlY2lhbC5yZXNpemVzdGFydCA9IHtcblxuICAgIGVuYWJsZWQ6IHRydWUsXG5cbiAgICBzZXR1cDogZnVuY3Rpb24oKSB7XG5cbiAgICAgIHZhciB0aGlzT2JqZWN0ID0gdGhpcztcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpc09iamVjdCk7XG4gICAgICB2YXIgcmVzaXppbmc7XG4gICAgICB2YXIgdGltZXI7XG5cbiAgICAgICR0aGlzLmRhdGEoJ3Jlc2l6ZXdhdGNoJywgdHJ1ZSk7XG5cbiAgICAgIGZ1bmN0aW9uIHRyaWdnZXIoZXZlbnQsIHJlc2l6aW5nKSB7XG5cbiAgICAgICAgZXZlbnQudHlwZSA9IHJlc2l6aW5nID8gJ3Jlc2l6ZXN0YXJ0JyA6ICdyZXNpemVzdG9wJztcbiAgICAgICAgJHRoaXMudHJpZ2dlcihldmVudCk7XG5cbiAgICAgIH1cblxuICAgICAgJHRoaXMub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICAgICAgaWYoISQuZXZlbnQuc3BlY2lhbC5yZXNpemVzdGFydC5lbmFibGVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoISQuZXZlbnQuc3BlY2lhbC5yZXNpemVzdGFydC5yZXNpemluZykge1xuICAgICAgICAgICQuZXZlbnQuc3BlY2lhbC5yZXNpemVzdGFydC5yZXNpemluZyA9IHRydWU7XG4gICAgICAgICAgdHJpZ2dlcihldmVudCwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJC5ldmVudC5zcGVjaWFsLnJlc2l6ZXN0YXJ0LnJlc2l6aW5nID0gZmFsc2U7XG4gICAgICAgICAgdHJpZ2dlcihldmVudCwgZmFsc2UpO1xuICAgICAgICB9LCAyMDApO1xuXG4gICAgICB9KTtcblxuICAgIH1cblxuICB9O1xuXG4gIC8vIFByb3hpZXMgcmVzaXplc3RhcnQgd2hlbiBuZWVkZWRcbiAgJC5ldmVudC5zcGVjaWFsLnJlc2l6ZXN0b3AgPSB7XG5cbiAgICBzZXR1cDogZnVuY3Rpb24oKSB7XG5cbiAgICAgIHZhciB0aGlzT2JqZWN0ID0gdGhpcztcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpc09iamVjdCk7XG5cbiAgICAgIGlmKCEkdGhpcy5kYXRhKCdyZXNpemV3YXRjaCcpKSB7XG4gICAgICAgICQodGhpcykub24oJ3Jlc2l6ZXN0YXJ0JywgZnVuY3Rpb24oKXt9KTtcbiAgICAgIH1cblxuICAgIH1cblxuICB9O1xuXG59KShqUXVlcnkpO1xuXG4vKiEgQ29weXJpZ2h0IChjKSAyMDExIEJyYW5kb24gQWFyb24gKGh0dHA6Ly9icmFuZG9uYWFyb24ubmV0KVxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlIChMSUNFTlNFLnR4dCkuXG4gKlxuICogVGhhbmtzIHRvOiBodHRwOi8vYWRvbWFzLm9yZy9qYXZhc2NyaXB0LW1vdXNlLXdoZWVsLyBmb3Igc29tZSBwb2ludGVycy5cbiAqIFRoYW5rcyB0bzogTWF0aGlhcyBCYW5rKGh0dHA6Ly93d3cubWF0aGlhcy1iYW5rLmRlKSBmb3IgYSBzY29wZSBidWcgZml4LlxuICogVGhhbmtzIHRvOiBTZWFtdXMgTGVhaHkgZm9yIGFkZGluZyBkZWx0YVggYW5kIGRlbHRhWVxuICpcbiAqIFZlcnNpb246IDMuMC42XG4gKlxuICogUmVxdWlyZXM6IDEuMi4yK1xuICovXG4oZnVuY3Rpb24oJCkge1xuXG4gIHZhciB0eXBlcyA9IFsnRE9NTW91c2VTY3JvbGwnLCAnbW91c2V3aGVlbCddO1xuXG4gIGlmICgkLmV2ZW50LmZpeEhvb2tzKSB7XG4gICAgZm9yICggdmFyIGk9dHlwZXMubGVuZ3RoOyBpOyApIHtcbiAgICAgICQuZXZlbnQuZml4SG9va3NbIHR5cGVzWy0taV0gXSA9ICQuZXZlbnQubW91c2VIb29rcztcbiAgICB9XG4gIH1cblxuICAkLmV2ZW50LnNwZWNpYWwubW91c2V3aGVlbCA9IHtcbiAgICBzZXR1cDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIHRoaXMuYWRkRXZlbnRMaXN0ZW5lciApIHtcbiAgICAgICAgZm9yICggdmFyIGk9dHlwZXMubGVuZ3RoOyBpOyApIHtcbiAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoIHR5cGVzWy0taV0sIGhhbmRsZXIsIGZhbHNlICk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub25tb3VzZXdoZWVsID0gaGFuZGxlcjtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgdGVhcmRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIgKSB7XG4gICAgICAgIGZvciAoIHZhciBpPXR5cGVzLmxlbmd0aDsgaTsgKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKCB0eXBlc1stLWldLCBoYW5kbGVyLCBmYWxzZSApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9ubW91c2V3aGVlbCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gICQuZm4uZXh0ZW5kKHtcbiAgICBtb3VzZXdoZWVsOiBmdW5jdGlvbihmbikge1xuICAgICAgcmV0dXJuIGZuID8gdGhpcy5iaW5kKCdtb3VzZXdoZWVsJywgZm4pIDogdGhpcy50cmlnZ2VyKCdtb3VzZXdoZWVsJyk7XG4gICAgfSxcblxuICAgIHVubW91c2V3aGVlbDogZnVuY3Rpb24oZm4pIHtcbiAgICAgIHJldHVybiB0aGlzLnVuYmluZCgnbW91c2V3aGVlbCcsIGZuKTtcbiAgICB9XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQpIHtcbiAgICB2YXIgb3JnRXZlbnQgPSBldmVudCB8fCB3aW5kb3cuZXZlbnQsXG4gICAgICAgIGFyZ3MgPSBbXS5zbGljZS5jYWxsKCBhcmd1bWVudHMsIDEgKSxcbiAgICAgICAgZGVsdGEgPSAwLFxuICAgICAgICByZXR1cm5WYWx1ZSA9IHRydWUsXG4gICAgICAgIGRlbHRhWCA9IDAsXG4gICAgICAgIGRlbHRhWSA9IDA7XG5cbiAgICBldmVudCA9ICQuZXZlbnQuZml4KG9yZ0V2ZW50KTtcbiAgICBldmVudC50eXBlID0gJ21vdXNld2hlZWwnO1xuXG4gICAgLy8gT2xkIHNjaG9vbCBzY3JvbGx3aGVlbCBkZWx0YVxuICAgIGlmICggb3JnRXZlbnQud2hlZWxEZWx0YSApIHsgZGVsdGEgPSBvcmdFdmVudC53aGVlbERlbHRhLzEyMDsgfVxuICAgIGlmICggb3JnRXZlbnQuZGV0YWlsICAgICApIHsgZGVsdGEgPSAtb3JnRXZlbnQuZGV0YWlsLzM7IH1cblxuICAgIC8vIE5ldyBzY2hvb2wgbXVsdGlkaW1lbnNpb25hbCBzY3JvbGwgKHRvdWNocGFkcykgZGVsdGFzXG4gICAgZGVsdGFZID0gZGVsdGE7XG5cbiAgICAvLyBHZWNrb1xuICAgIGlmICggb3JnRXZlbnQuYXhpcyAhPT0gdW5kZWZpbmVkICYmIG9yZ0V2ZW50LmF4aXMgPT09IG9yZ0V2ZW50LkhPUklaT05UQUxfQVhJUyApIHtcbiAgICAgIGRlbHRhWSA9IDA7XG4gICAgICBkZWx0YVggPSAtMSpkZWx0YTtcbiAgICB9XG5cbiAgICAvLyBXZWJraXRcbiAgICBpZiAoIG9yZ0V2ZW50LndoZWVsRGVsdGFZICE9PSB1bmRlZmluZWQgKSB7IGRlbHRhWSA9IG9yZ0V2ZW50LndoZWVsRGVsdGFZLzEyMDsgfVxuICAgIGlmICggb3JnRXZlbnQud2hlZWxEZWx0YVggIT09IHVuZGVmaW5lZCApIHsgZGVsdGFYID0gLTEqb3JnRXZlbnQud2hlZWxEZWx0YVgvMTIwOyB9XG5cbiAgICAvLyBBZGQgZXZlbnQgYW5kIGRlbHRhIHRvIHRoZSBmcm9udCBvZiB0aGUgYXJndW1lbnRzXG4gICAgYXJncy51bnNoaWZ0KGV2ZW50LCBkZWx0YSwgZGVsdGFYLCBkZWx0YVkpO1xuXG4gICAgcmV0dXJuICgkLmV2ZW50LmRpc3BhdGNoIHx8ICQuZXZlbnQuaGFuZGxlKS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG59KShqUXVlcnkpO1xuIiwiLy8gU3RpY2t5IFBsdWdpbiB2MS4wLjMgZm9yIGpRdWVyeVxuLy8gPT09PT09PT09PT09PVxuLy8gQXV0aG9yOiBBbnRob255IEdhcmFuZFxuLy8gSW1wcm92ZW1lbnRzIGJ5IEdlcm1hbiBNLiBCcmF2byAoS3JvbnV6KSBhbmQgUnV1ZCBLYW1waHVpcyAocnV1ZGspXG4vLyBJbXByb3ZlbWVudHMgYnkgTGVvbmFyZG8gQy4gRGFyb25jbyAoZGFyb25jbylcbi8vIENyZWF0ZWQ6IDAyLzE0LzIwMTFcbi8vIERhdGU6IDA3LzIwLzIwMTVcbi8vIFdlYnNpdGU6IGh0dHA6Ly9zdGlja3lqcy5jb20vXG4vLyBEZXNjcmlwdGlvbjogTWFrZXMgYW4gZWxlbWVudCBvbiB0aGUgcGFnZSBzdGljayBvbiB0aGUgc2NyZWVuIGFzIHlvdSBzY3JvbGxcbi8vICAgICAgICAgICAgICBJdCB3aWxsIG9ubHkgc2V0IHRoZSAndG9wJyBhbmQgJ3Bvc2l0aW9uJyBvZiB5b3VyIGVsZW1lbnQsIHlvdVxuLy8gICAgICAgICAgICAgIG1pZ2h0IG5lZWQgdG8gYWRqdXN0IHRoZSB3aWR0aCBpbiBzb21lIGNhc2VzLlxuXG4oZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICAgICAgZGVmaW5lKFsnanF1ZXJ5J10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgLy8gTm9kZS9Db21tb25KU1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZSgnanF1ZXJ5JykpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xuICAgICAgICBmYWN0b3J5KGpRdWVyeSk7XG4gICAgfVxufShmdW5jdGlvbiAoJCkge1xuICAgIHZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTsgLy8gc2F2ZSByZWYgdG8gb3JpZ2luYWwgc2xpY2UoKVxuICAgIHZhciBzcGxpY2UgPSBBcnJheS5wcm90b3R5cGUuc3BsaWNlOyAvLyBzYXZlIHJlZiB0byBvcmlnaW5hbCBzbGljZSgpXG5cbiAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgdG9wU3BhY2luZzogMCxcbiAgICAgIGJvdHRvbVNwYWNpbmc6IDAsXG4gICAgICBjbGFzc05hbWU6ICdpcy1zdGlja3knLFxuICAgICAgd3JhcHBlckNsYXNzTmFtZTogJ3N0aWNreS13cmFwcGVyJyxcbiAgICAgIGNlbnRlcjogZmFsc2UsXG4gICAgICBnZXRXaWR0aEZyb206ICcnLFxuICAgICAgd2lkdGhGcm9tV3JhcHBlcjogdHJ1ZSwgLy8gd29ya3Mgb25seSB3aGVuIC5nZXRXaWR0aEZyb20gaXMgZW1wdHlcbiAgICAgIHJlc3BvbnNpdmVXaWR0aDogZmFsc2VcbiAgICB9LFxuICAgICR3aW5kb3cgPSAkKHdpbmRvdyksXG4gICAgJGRvY3VtZW50ID0gJChkb2N1bWVudCksXG4gICAgc3RpY2tlZCA9IFtdLFxuICAgIHdpbmRvd0hlaWdodCA9ICR3aW5kb3cuaGVpZ2h0KCksXG4gICAgc2Nyb2xsZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzY3JvbGxUb3AgPSAkd2luZG93LnNjcm9sbFRvcCgpLFxuICAgICAgICBkb2N1bWVudEhlaWdodCA9ICRkb2N1bWVudC5oZWlnaHQoKSxcbiAgICAgICAgZHdoID0gZG9jdW1lbnRIZWlnaHQgLSB3aW5kb3dIZWlnaHQsXG4gICAgICAgIGV4dHJhID0gKHNjcm9sbFRvcCA+IGR3aCkgPyBkd2ggLSBzY3JvbGxUb3AgOiAwO1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHN0aWNrZWQubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZhciBzID0gc3RpY2tlZFtpXSxcbiAgICAgICAgICBlbGVtZW50VG9wID0gcy5zdGlja3lXcmFwcGVyLm9mZnNldCgpLnRvcCxcbiAgICAgICAgICBldHNlID0gZWxlbWVudFRvcCAtIHMudG9wU3BhY2luZyAtIGV4dHJhO1xuXG5cdC8vdXBkYXRlIGhlaWdodCBpbiBjYXNlIG9mIGR5bmFtaWMgY29udGVudFxuXHRzLnN0aWNreVdyYXBwZXIuY3NzKCdoZWlnaHQnLCBzLnN0aWNreUVsZW1lbnQub3V0ZXJIZWlnaHQoKSk7XG5cbiAgICAgICAgaWYgKHNjcm9sbFRvcCA8PSBldHNlKSB7XG4gICAgICAgICAgaWYgKHMuY3VycmVudFRvcCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcy5zdGlja3lFbGVtZW50XG4gICAgICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgICAgICd3aWR0aCc6ICcnLFxuICAgICAgICAgICAgICAgICdwb3NpdGlvbic6ICcnLFxuICAgICAgICAgICAgICAgICd0b3AnOiAnJ1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHMuc3RpY2t5RWxlbWVudC5wYXJlbnQoKS5yZW1vdmVDbGFzcyhzLmNsYXNzTmFtZSk7XG4gICAgICAgICAgICBzLnN0aWNreUVsZW1lbnQudHJpZ2dlcignc3RpY2t5LWVuZCcsIFtzXSk7XG4gICAgICAgICAgICBzLmN1cnJlbnRUb3AgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB2YXIgbmV3VG9wID0gZG9jdW1lbnRIZWlnaHQgLSBzLnN0aWNreUVsZW1lbnQub3V0ZXJIZWlnaHQoKVxuICAgICAgICAgICAgLSBzLnRvcFNwYWNpbmcgLSBzLmJvdHRvbVNwYWNpbmcgLSBzY3JvbGxUb3AgLSBleHRyYTtcbiAgICAgICAgICBpZiAobmV3VG9wIDwgMCkge1xuICAgICAgICAgICAgbmV3VG9wID0gbmV3VG9wICsgcy50b3BTcGFjaW5nO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdUb3AgPSBzLnRvcFNwYWNpbmc7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzLmN1cnJlbnRUb3AgIT09IG5ld1RvcCkge1xuICAgICAgICAgICAgdmFyIG5ld1dpZHRoO1xuICAgICAgICAgICAgaWYgKHMuZ2V0V2lkdGhGcm9tKSB7XG4gICAgICAgICAgICAgICAgbmV3V2lkdGggPSAkKHMuZ2V0V2lkdGhGcm9tKS53aWR0aCgpIHx8IG51bGw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHMud2lkdGhGcm9tV3JhcHBlcikge1xuICAgICAgICAgICAgICAgIG5ld1dpZHRoID0gcy5zdGlja3lXcmFwcGVyLndpZHRoKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobmV3V2lkdGggPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG5ld1dpZHRoID0gcy5zdGlja3lFbGVtZW50LndpZHRoKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzLnN0aWNreUVsZW1lbnRcbiAgICAgICAgICAgICAgLmNzcygnd2lkdGgnLCBuZXdXaWR0aClcbiAgICAgICAgICAgICAgLmNzcygncG9zaXRpb24nLCAnZml4ZWQnKVxuICAgICAgICAgICAgICAuY3NzKCd0b3AnLCBuZXdUb3ApO1xuXG4gICAgICAgICAgICBzLnN0aWNreUVsZW1lbnQucGFyZW50KCkuYWRkQ2xhc3Mocy5jbGFzc05hbWUpO1xuXG4gICAgICAgICAgICBpZiAocy5jdXJyZW50VG9wID09PSBudWxsKSB7XG4gICAgICAgICAgICAgIHMuc3RpY2t5RWxlbWVudC50cmlnZ2VyKCdzdGlja3ktc3RhcnQnLCBbc10pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gc3RpY2t5IGlzIHN0YXJ0ZWQgYnV0IGl0IGhhdmUgdG8gYmUgcmVwb3NpdGlvbmVkXG4gICAgICAgICAgICAgIHMuc3RpY2t5RWxlbWVudC50cmlnZ2VyKCdzdGlja3ktdXBkYXRlJywgW3NdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHMuY3VycmVudFRvcCA9PT0gcy50b3BTcGFjaW5nICYmIHMuY3VycmVudFRvcCA+IG5ld1RvcCB8fCBzLmN1cnJlbnRUb3AgPT09IG51bGwgJiYgbmV3VG9wIDwgcy50b3BTcGFjaW5nKSB7XG4gICAgICAgICAgICAgIC8vIGp1c3QgcmVhY2hlZCBib3R0b20gfHwganVzdCBzdGFydGVkIHRvIHN0aWNrIGJ1dCBib3R0b20gaXMgYWxyZWFkeSByZWFjaGVkXG4gICAgICAgICAgICAgIHMuc3RpY2t5RWxlbWVudC50cmlnZ2VyKCdzdGlja3ktYm90dG9tLXJlYWNoZWQnLCBbc10pO1xuICAgICAgICAgICAgfSBlbHNlIGlmKHMuY3VycmVudFRvcCAhPT0gbnVsbCAmJiBuZXdUb3AgPT09IHMudG9wU3BhY2luZyAmJiBzLmN1cnJlbnRUb3AgPCBuZXdUb3ApIHtcbiAgICAgICAgICAgICAgLy8gc3RpY2t5IGlzIHN0YXJ0ZWQgJiYgc3RpY2tlZCBhdCB0b3BTcGFjaW5nICYmIG92ZXJmbG93aW5nIGZyb20gdG9wIGp1c3QgZmluaXNoZWRcbiAgICAgICAgICAgICAgcy5zdGlja3lFbGVtZW50LnRyaWdnZXIoJ3N0aWNreS1ib3R0b20tdW5yZWFjaGVkJywgW3NdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcy5jdXJyZW50VG9wID0gbmV3VG9wO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgcmVzaXplciA9IGZ1bmN0aW9uKCkge1xuICAgICAgd2luZG93SGVpZ2h0ID0gJHdpbmRvdy5oZWlnaHQoKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBzdGlja2VkLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICB2YXIgcyA9IHN0aWNrZWRbaV07XG4gICAgICAgIHZhciBuZXdXaWR0aCA9IG51bGw7XG4gICAgICAgIGlmIChzLmdldFdpZHRoRnJvbSkge1xuICAgICAgICAgICAgaWYgKHMucmVzcG9uc2l2ZVdpZHRoKSB7XG4gICAgICAgICAgICAgICAgbmV3V2lkdGggPSAkKHMuZ2V0V2lkdGhGcm9tKS53aWR0aCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYocy53aWR0aEZyb21XcmFwcGVyKSB7XG4gICAgICAgICAgICBuZXdXaWR0aCA9IHMuc3RpY2t5V3JhcHBlci53aWR0aCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuZXdXaWR0aCAhPSBudWxsKSB7XG4gICAgICAgICAgICBzLnN0aWNreUVsZW1lbnQuY3NzKCd3aWR0aCcsIG5ld1dpZHRoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIG8gPSAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBzdGlja3lFbGVtZW50ID0gJCh0aGlzKTtcblxuICAgICAgICAgIHZhciBzdGlja3lJZCA9IHN0aWNreUVsZW1lbnQuYXR0cignaWQnKTtcbiAgICAgICAgICB2YXIgc3RpY2t5SGVpZ2h0ID0gc3RpY2t5RWxlbWVudC5vdXRlckhlaWdodCgpO1xuICAgICAgICAgIHZhciB3cmFwcGVySWQgPSBzdGlja3lJZCA/IHN0aWNreUlkICsgJy0nICsgZGVmYXVsdHMud3JhcHBlckNsYXNzTmFtZSA6IGRlZmF1bHRzLndyYXBwZXJDbGFzc05hbWU7XG4gICAgICAgICAgdmFyIHdyYXBwZXIgPSAkKCc8ZGl2PjwvZGl2PicpXG4gICAgICAgICAgICAuYXR0cignaWQnLCB3cmFwcGVySWQpXG4gICAgICAgICAgICAuYWRkQ2xhc3Moby53cmFwcGVyQ2xhc3NOYW1lKTtcblxuICAgICAgICAgIHN0aWNreUVsZW1lbnQud3JhcEFsbCh3cmFwcGVyKTtcblxuICAgICAgICAgIHZhciBzdGlja3lXcmFwcGVyID0gc3RpY2t5RWxlbWVudC5wYXJlbnQoKTtcblxuICAgICAgICAgIGlmIChvLmNlbnRlcikge1xuICAgICAgICAgICAgc3RpY2t5V3JhcHBlci5jc3Moe3dpZHRoOnN0aWNreUVsZW1lbnQub3V0ZXJXaWR0aCgpLG1hcmdpbkxlZnQ6XCJhdXRvXCIsbWFyZ2luUmlnaHQ6XCJhdXRvXCJ9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc3RpY2t5RWxlbWVudC5jc3MoXCJmbG9hdFwiKSA9PT0gXCJyaWdodFwiKSB7XG4gICAgICAgICAgICBzdGlja3lFbGVtZW50LmNzcyh7XCJmbG9hdFwiOlwibm9uZVwifSkucGFyZW50KCkuY3NzKHtcImZsb2F0XCI6XCJyaWdodFwifSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc3RpY2t5V3JhcHBlci5jc3MoJ2hlaWdodCcsIHN0aWNreUhlaWdodCk7XG5cbiAgICAgICAgICBvLnN0aWNreUVsZW1lbnQgPSBzdGlja3lFbGVtZW50O1xuICAgICAgICAgIG8uc3RpY2t5V3JhcHBlciA9IHN0aWNreVdyYXBwZXI7XG4gICAgICAgICAgby5jdXJyZW50VG9wICAgID0gbnVsbDtcblxuICAgICAgICAgIHN0aWNrZWQucHVzaChvKTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgdXBkYXRlOiBzY3JvbGxlcixcbiAgICAgIHVuc3RpY2s6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgdmFyIHVuc3RpY2t5RWxlbWVudCA9ICQodGhhdCk7XG5cbiAgICAgICAgICB2YXIgcmVtb3ZlSWR4ID0gLTE7XG4gICAgICAgICAgdmFyIGkgPSBzdGlja2VkLmxlbmd0aDtcbiAgICAgICAgICB3aGlsZSAoaS0tID4gMCkge1xuICAgICAgICAgICAgaWYgKHN0aWNrZWRbaV0uc3RpY2t5RWxlbWVudC5nZXQoMCkgPT09IHRoYXQpIHtcbiAgICAgICAgICAgICAgICBzcGxpY2UuY2FsbChzdGlja2VkLGksMSk7XG4gICAgICAgICAgICAgICAgcmVtb3ZlSWR4ID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYocmVtb3ZlSWR4ICE9PSAtMSkge1xuICAgICAgICAgICAgdW5zdGlja3lFbGVtZW50LnVud3JhcCgpO1xuICAgICAgICAgICAgdW5zdGlja3lFbGVtZW50XG4gICAgICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgICAgICd3aWR0aCc6ICcnLFxuICAgICAgICAgICAgICAgICdwb3NpdGlvbic6ICcnLFxuICAgICAgICAgICAgICAgICd0b3AnOiAnJyxcbiAgICAgICAgICAgICAgICAnZmxvYXQnOiAnJ1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAvLyBzaG91bGQgYmUgbW9yZSBlZmZpY2llbnQgdGhhbiB1c2luZyAkd2luZG93LnNjcm9sbChzY3JvbGxlcikgYW5kICR3aW5kb3cucmVzaXplKHJlc2l6ZXIpOlxuICBpZiAod2luZG93LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgc2Nyb2xsZXIsIGZhbHNlKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplciwgZmFsc2UpO1xuICB9IGVsc2UgaWYgKHdpbmRvdy5hdHRhY2hFdmVudCkge1xuICAgIHdpbmRvdy5hdHRhY2hFdmVudCgnb25zY3JvbGwnLCBzY3JvbGxlcik7XG4gICAgd2luZG93LmF0dGFjaEV2ZW50KCdvbnJlc2l6ZScsIHJlc2l6ZXIpO1xuICB9XG5cbiAgJC5mbi5zdGlja3kgPSBmdW5jdGlvbihtZXRob2QpIHtcbiAgICBpZiAobWV0aG9kc1ttZXRob2RdKSB7XG4gICAgICByZXR1cm4gbWV0aG9kc1ttZXRob2RdLmFwcGx5KHRoaXMsIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbWV0aG9kID09PSAnb2JqZWN0JyB8fCAhbWV0aG9kICkge1xuICAgICAgcmV0dXJuIG1ldGhvZHMuaW5pdC5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQuZXJyb3IoJ01ldGhvZCAnICsgbWV0aG9kICsgJyBkb2VzIG5vdCBleGlzdCBvbiBqUXVlcnkuc3RpY2t5Jyk7XG4gICAgfVxuICB9O1xuXG4gICQuZm4udW5zdGljayA9IGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgIGlmIChtZXRob2RzW21ldGhvZF0pIHtcbiAgICAgIHJldHVybiBtZXRob2RzW21ldGhvZF0uYXBwbHkodGhpcywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtZXRob2QgPT09ICdvYmplY3QnIHx8ICFtZXRob2QgKSB7XG4gICAgICByZXR1cm4gbWV0aG9kcy51bnN0aWNrLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJC5lcnJvcignTWV0aG9kICcgKyBtZXRob2QgKyAnIGRvZXMgbm90IGV4aXN0IG9uIGpRdWVyeS5zdGlja3knKTtcbiAgICB9XG4gIH07XG4gICQoZnVuY3Rpb24oKSB7XG4gICAgc2V0VGltZW91dChzY3JvbGxlciwgMCk7XG4gIH0pO1xufSkpO1xuIiwiLyogTW9kZXJuaXpyIDIuOC4zIChDdXN0b20gQnVpbGQpIHwgTUlUICYgQlNEXG4gKiBCdWlsZDogaHR0cDovL21vZGVybml6ci5jb20vZG93bmxvYWQvIy1mb250ZmFjZS1iYWNrZ3JvdW5kc2l6ZS1ib3JkZXJpbWFnZS1ib3JkZXJyYWRpdXMtYm94c2hhZG93LWZsZXhib3gtaHNsYS1tdWx0aXBsZWJncy1vcGFjaXR5LXJnYmEtdGV4dHNoYWRvdy1jc3NhbmltYXRpb25zLWNzc2NvbHVtbnMtZ2VuZXJhdGVkY29udGVudC1jc3NncmFkaWVudHMtY3NzcmVmbGVjdGlvbnMtY3NzdHJhbnNmb3Jtcy1jc3N0cmFuc2Zvcm1zM2QtY3NzdHJhbnNpdGlvbnMtYXBwbGljYXRpb25jYWNoZS1jYW52YXMtY2FudmFzdGV4dC1kcmFnYW5kZHJvcC1oYXNoY2hhbmdlLWhpc3RvcnktYXVkaW8tdmlkZW8taW5kZXhlZGRiLWlucHV0LWlucHV0dHlwZXMtbG9jYWxzdG9yYWdlLXBvc3RtZXNzYWdlLXNlc3Npb25zdG9yYWdlLXdlYnNvY2tldHMtd2Vic3FsZGF0YWJhc2Utd2Vid29ya2Vycy1nZW9sb2NhdGlvbi1pbmxpbmVzdmctc21pbC1zdmctc3ZnY2xpcHBhdGhzLXRvdWNoLXdlYmdsLXNoaXYtbXEtY3NzY2xhc3Nlcy1hZGR0ZXN0LXByZWZpeGVkLXRlc3RzdHlsZXMtdGVzdHByb3AtdGVzdGFsbHByb3BzLWhhc2V2ZW50LXByZWZpeGVzLWRvbXByZWZpeGVzLWxvYWRcbiAqL1xuO3dpbmRvdy5Nb2Rlcm5penI9ZnVuY3Rpb24oYSxiLGMpe2Z1bmN0aW9uIEQoYSl7ai5jc3NUZXh0PWF9ZnVuY3Rpb24gRShhLGIpe3JldHVybiBEKG4uam9pbihhK1wiO1wiKSsoYnx8XCJcIikpfWZ1bmN0aW9uIEYoYSxiKXtyZXR1cm4gdHlwZW9mIGE9PT1ifWZ1bmN0aW9uIEcoYSxiKXtyZXR1cm4hIX4oXCJcIithKS5pbmRleE9mKGIpfWZ1bmN0aW9uIEgoYSxiKXtmb3IodmFyIGQgaW4gYSl7dmFyIGU9YVtkXTtpZighRyhlLFwiLVwiKSYmaltlXSE9PWMpcmV0dXJuIGI9PVwicGZ4XCI/ZTohMH1yZXR1cm4hMX1mdW5jdGlvbiBJKGEsYixkKXtmb3IodmFyIGUgaW4gYSl7dmFyIGY9YlthW2VdXTtpZihmIT09YylyZXR1cm4gZD09PSExP2FbZV06RihmLFwiZnVuY3Rpb25cIik/Zi5iaW5kKGR8fGIpOmZ9cmV0dXJuITF9ZnVuY3Rpb24gSihhLGIsYyl7dmFyIGQ9YS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSthLnNsaWNlKDEpLGU9KGErXCIgXCIrcC5qb2luKGQrXCIgXCIpK2QpLnNwbGl0KFwiIFwiKTtyZXR1cm4gRihiLFwic3RyaW5nXCIpfHxGKGIsXCJ1bmRlZmluZWRcIik/SChlLGIpOihlPShhK1wiIFwiK3Euam9pbihkK1wiIFwiKStkKS5zcGxpdChcIiBcIiksSShlLGIsYykpfWZ1bmN0aW9uIEsoKXtlLmlucHV0PWZ1bmN0aW9uKGMpe2Zvcih2YXIgZD0wLGU9Yy5sZW5ndGg7ZDxlO2QrKyl1W2NbZF1dPWNbZF1pbiBrO3JldHVybiB1Lmxpc3QmJih1Lmxpc3Q9ISFiLmNyZWF0ZUVsZW1lbnQoXCJkYXRhbGlzdFwiKSYmISFhLkhUTUxEYXRhTGlzdEVsZW1lbnQpLHV9KFwiYXV0b2NvbXBsZXRlIGF1dG9mb2N1cyBsaXN0IHBsYWNlaG9sZGVyIG1heCBtaW4gbXVsdGlwbGUgcGF0dGVybiByZXF1aXJlZCBzdGVwXCIuc3BsaXQoXCIgXCIpKSxlLmlucHV0dHlwZXM9ZnVuY3Rpb24oYSl7Zm9yKHZhciBkPTAsZSxmLGgsaT1hLmxlbmd0aDtkPGk7ZCsrKWsuc2V0QXR0cmlidXRlKFwidHlwZVwiLGY9YVtkXSksZT1rLnR5cGUhPT1cInRleHRcIixlJiYoay52YWx1ZT1sLGsuc3R5bGUuY3NzVGV4dD1cInBvc2l0aW9uOmFic29sdXRlO3Zpc2liaWxpdHk6aGlkZGVuO1wiLC9ecmFuZ2UkLy50ZXN0KGYpJiZrLnN0eWxlLldlYmtpdEFwcGVhcmFuY2UhPT1jPyhnLmFwcGVuZENoaWxkKGspLGg9Yi5kZWZhdWx0VmlldyxlPWguZ2V0Q29tcHV0ZWRTdHlsZSYmaC5nZXRDb21wdXRlZFN0eWxlKGssbnVsbCkuV2Via2l0QXBwZWFyYW5jZSE9PVwidGV4dGZpZWxkXCImJmsub2Zmc2V0SGVpZ2h0IT09MCxnLnJlbW92ZUNoaWxkKGspKTovXihzZWFyY2h8dGVsKSQvLnRlc3QoZil8fCgvXih1cmx8ZW1haWwpJC8udGVzdChmKT9lPWsuY2hlY2tWYWxpZGl0eSYmay5jaGVja1ZhbGlkaXR5KCk9PT0hMTplPWsudmFsdWUhPWwpKSx0W2FbZF1dPSEhZTtyZXR1cm4gdH0oXCJzZWFyY2ggdGVsIHVybCBlbWFpbCBkYXRldGltZSBkYXRlIG1vbnRoIHdlZWsgdGltZSBkYXRldGltZS1sb2NhbCBudW1iZXIgcmFuZ2UgY29sb3JcIi5zcGxpdChcIiBcIikpfXZhciBkPVwiMi44LjNcIixlPXt9LGY9ITAsZz1iLmRvY3VtZW50RWxlbWVudCxoPVwibW9kZXJuaXpyXCIsaT1iLmNyZWF0ZUVsZW1lbnQoaCksaj1pLnN0eWxlLGs9Yi5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiksbD1cIjopXCIsbT17fS50b1N0cmluZyxuPVwiIC13ZWJraXQtIC1tb3otIC1vLSAtbXMtIFwiLnNwbGl0KFwiIFwiKSxvPVwiV2Via2l0IE1veiBPIG1zXCIscD1vLnNwbGl0KFwiIFwiKSxxPW8udG9Mb3dlckNhc2UoKS5zcGxpdChcIiBcIikscj17c3ZnOlwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIn0scz17fSx0PXt9LHU9e30sdj1bXSx3PXYuc2xpY2UseCx5PWZ1bmN0aW9uKGEsYyxkLGUpe3ZhciBmLGksaixrLGw9Yi5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLG09Yi5ib2R5LG49bXx8Yi5jcmVhdGVFbGVtZW50KFwiYm9keVwiKTtpZihwYXJzZUludChkLDEwKSl3aGlsZShkLS0paj1iLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksai5pZD1lP2VbZF06aCsoZCsxKSxsLmFwcGVuZENoaWxkKGopO3JldHVybiBmPVtcIiYjMTczO1wiLCc8c3R5bGUgaWQ9XCJzJyxoLCdcIj4nLGEsXCI8L3N0eWxlPlwiXS5qb2luKFwiXCIpLGwuaWQ9aCwobT9sOm4pLmlubmVySFRNTCs9ZixuLmFwcGVuZENoaWxkKGwpLG18fChuLnN0eWxlLmJhY2tncm91bmQ9XCJcIixuLnN0eWxlLm92ZXJmbG93PVwiaGlkZGVuXCIsaz1nLnN0eWxlLm92ZXJmbG93LGcuc3R5bGUub3ZlcmZsb3c9XCJoaWRkZW5cIixnLmFwcGVuZENoaWxkKG4pKSxpPWMobCxhKSxtP2wucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChsKToobi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG4pLGcuc3R5bGUub3ZlcmZsb3c9ayksISFpfSx6PWZ1bmN0aW9uKGIpe3ZhciBjPWEubWF0Y2hNZWRpYXx8YS5tc01hdGNoTWVkaWE7aWYoYylyZXR1cm4gYyhiKSYmYyhiKS5tYXRjaGVzfHwhMTt2YXIgZDtyZXR1cm4geShcIkBtZWRpYSBcIitiK1wiIHsgI1wiK2grXCIgeyBwb3NpdGlvbjogYWJzb2x1dGU7IH0gfVwiLGZ1bmN0aW9uKGIpe2Q9KGEuZ2V0Q29tcHV0ZWRTdHlsZT9nZXRDb21wdXRlZFN0eWxlKGIsbnVsbCk6Yi5jdXJyZW50U3R5bGUpW1wicG9zaXRpb25cIl09PVwiYWJzb2x1dGVcIn0pLGR9LEE9ZnVuY3Rpb24oKXtmdW5jdGlvbiBkKGQsZSl7ZT1lfHxiLmNyZWF0ZUVsZW1lbnQoYVtkXXx8XCJkaXZcIiksZD1cIm9uXCIrZDt2YXIgZj1kIGluIGU7cmV0dXJuIGZ8fChlLnNldEF0dHJpYnV0ZXx8KGU9Yi5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKSxlLnNldEF0dHJpYnV0ZSYmZS5yZW1vdmVBdHRyaWJ1dGUmJihlLnNldEF0dHJpYnV0ZShkLFwiXCIpLGY9RihlW2RdLFwiZnVuY3Rpb25cIiksRihlW2RdLFwidW5kZWZpbmVkXCIpfHwoZVtkXT1jKSxlLnJlbW92ZUF0dHJpYnV0ZShkKSkpLGU9bnVsbCxmfXZhciBhPXtzZWxlY3Q6XCJpbnB1dFwiLGNoYW5nZTpcImlucHV0XCIsc3VibWl0OlwiZm9ybVwiLHJlc2V0OlwiZm9ybVwiLGVycm9yOlwiaW1nXCIsbG9hZDpcImltZ1wiLGFib3J0OlwiaW1nXCJ9O3JldHVybiBkfSgpLEI9e30uaGFzT3duUHJvcGVydHksQzshRihCLFwidW5kZWZpbmVkXCIpJiYhRihCLmNhbGwsXCJ1bmRlZmluZWRcIik/Qz1mdW5jdGlvbihhLGIpe3JldHVybiBCLmNhbGwoYSxiKX06Qz1mdW5jdGlvbihhLGIpe3JldHVybiBiIGluIGEmJkYoYS5jb25zdHJ1Y3Rvci5wcm90b3R5cGVbYl0sXCJ1bmRlZmluZWRcIil9LEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kfHwoRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQ9ZnVuY3Rpb24oYil7dmFyIGM9dGhpcztpZih0eXBlb2YgYyE9XCJmdW5jdGlvblwiKXRocm93IG5ldyBUeXBlRXJyb3I7dmFyIGQ9dy5jYWxsKGFyZ3VtZW50cywxKSxlPWZ1bmN0aW9uKCl7aWYodGhpcyBpbnN0YW5jZW9mIGUpe3ZhciBhPWZ1bmN0aW9uKCl7fTthLnByb3RvdHlwZT1jLnByb3RvdHlwZTt2YXIgZj1uZXcgYSxnPWMuYXBwbHkoZixkLmNvbmNhdCh3LmNhbGwoYXJndW1lbnRzKSkpO3JldHVybiBPYmplY3QoZyk9PT1nP2c6Zn1yZXR1cm4gYy5hcHBseShiLGQuY29uY2F0KHcuY2FsbChhcmd1bWVudHMpKSl9O3JldHVybiBlfSkscy5mbGV4Ym94PWZ1bmN0aW9uKCl7cmV0dXJuIEooXCJmbGV4V3JhcFwiKX0scy5jYW52YXM9ZnVuY3Rpb24oKXt2YXIgYT1iLmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7cmV0dXJuISFhLmdldENvbnRleHQmJiEhYS5nZXRDb250ZXh0KFwiMmRcIil9LHMuY2FudmFzdGV4dD1mdW5jdGlvbigpe3JldHVybiEhZS5jYW52YXMmJiEhRihiLmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIikuZ2V0Q29udGV4dChcIjJkXCIpLmZpbGxUZXh0LFwiZnVuY3Rpb25cIil9LHMud2ViZ2w9ZnVuY3Rpb24oKXtyZXR1cm4hIWEuV2ViR0xSZW5kZXJpbmdDb250ZXh0fSxzLnRvdWNoPWZ1bmN0aW9uKCl7dmFyIGM7cmV0dXJuXCJvbnRvdWNoc3RhcnRcImluIGF8fGEuRG9jdW1lbnRUb3VjaCYmYiBpbnN0YW5jZW9mIERvY3VtZW50VG91Y2g/Yz0hMDp5KFtcIkBtZWRpYSAoXCIsbi5qb2luKFwidG91Y2gtZW5hYmxlZCksKFwiKSxoLFwiKVwiLFwieyNtb2Rlcm5penJ7dG9wOjlweDtwb3NpdGlvbjphYnNvbHV0ZX19XCJdLmpvaW4oXCJcIiksZnVuY3Rpb24oYSl7Yz1hLm9mZnNldFRvcD09PTl9KSxjfSxzLmdlb2xvY2F0aW9uPWZ1bmN0aW9uKCl7cmV0dXJuXCJnZW9sb2NhdGlvblwiaW4gbmF2aWdhdG9yfSxzLnBvc3RtZXNzYWdlPWZ1bmN0aW9uKCl7cmV0dXJuISFhLnBvc3RNZXNzYWdlfSxzLndlYnNxbGRhdGFiYXNlPWZ1bmN0aW9uKCl7cmV0dXJuISFhLm9wZW5EYXRhYmFzZX0scy5pbmRleGVkREI9ZnVuY3Rpb24oKXtyZXR1cm4hIUooXCJpbmRleGVkREJcIixhKX0scy5oYXNoY2hhbmdlPWZ1bmN0aW9uKCl7cmV0dXJuIEEoXCJoYXNoY2hhbmdlXCIsYSkmJihiLmRvY3VtZW50TW9kZT09PWN8fGIuZG9jdW1lbnRNb2RlPjcpfSxzLmhpc3Rvcnk9ZnVuY3Rpb24oKXtyZXR1cm4hIWEuaGlzdG9yeSYmISFoaXN0b3J5LnB1c2hTdGF0ZX0scy5kcmFnYW5kZHJvcD1mdW5jdGlvbigpe3ZhciBhPWIuY3JlYXRlRWxlbWVudChcImRpdlwiKTtyZXR1cm5cImRyYWdnYWJsZVwiaW4gYXx8XCJvbmRyYWdzdGFydFwiaW4gYSYmXCJvbmRyb3BcImluIGF9LHMud2Vic29ja2V0cz1mdW5jdGlvbigpe3JldHVyblwiV2ViU29ja2V0XCJpbiBhfHxcIk1veldlYlNvY2tldFwiaW4gYX0scy5yZ2JhPWZ1bmN0aW9uKCl7cmV0dXJuIEQoXCJiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMTUwLDI1NSwxNTAsLjUpXCIpLEcoai5iYWNrZ3JvdW5kQ29sb3IsXCJyZ2JhXCIpfSxzLmhzbGE9ZnVuY3Rpb24oKXtyZXR1cm4gRChcImJhY2tncm91bmQtY29sb3I6aHNsYSgxMjAsNDAlLDEwMCUsLjUpXCIpLEcoai5iYWNrZ3JvdW5kQ29sb3IsXCJyZ2JhXCIpfHxHKGouYmFja2dyb3VuZENvbG9yLFwiaHNsYVwiKX0scy5tdWx0aXBsZWJncz1mdW5jdGlvbigpe3JldHVybiBEKFwiYmFja2dyb3VuZDp1cmwoaHR0cHM6Ly8pLHVybChodHRwczovLykscmVkIHVybChodHRwczovLylcIiksLyh1cmxcXHMqXFwoLio/KXszfS8udGVzdChqLmJhY2tncm91bmQpfSxzLmJhY2tncm91bmRzaXplPWZ1bmN0aW9uKCl7cmV0dXJuIEooXCJiYWNrZ3JvdW5kU2l6ZVwiKX0scy5ib3JkZXJpbWFnZT1mdW5jdGlvbigpe3JldHVybiBKKFwiYm9yZGVySW1hZ2VcIil9LHMuYm9yZGVycmFkaXVzPWZ1bmN0aW9uKCl7cmV0dXJuIEooXCJib3JkZXJSYWRpdXNcIil9LHMuYm94c2hhZG93PWZ1bmN0aW9uKCl7cmV0dXJuIEooXCJib3hTaGFkb3dcIil9LHMudGV4dHNoYWRvdz1mdW5jdGlvbigpe3JldHVybiBiLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikuc3R5bGUudGV4dFNoYWRvdz09PVwiXCJ9LHMub3BhY2l0eT1mdW5jdGlvbigpe3JldHVybiBFKFwib3BhY2l0eTouNTVcIiksL14wLjU1JC8udGVzdChqLm9wYWNpdHkpfSxzLmNzc2FuaW1hdGlvbnM9ZnVuY3Rpb24oKXtyZXR1cm4gSihcImFuaW1hdGlvbk5hbWVcIil9LHMuY3NzY29sdW1ucz1mdW5jdGlvbigpe3JldHVybiBKKFwiY29sdW1uQ291bnRcIil9LHMuY3NzZ3JhZGllbnRzPWZ1bmN0aW9uKCl7dmFyIGE9XCJiYWNrZ3JvdW5kLWltYWdlOlwiLGI9XCJncmFkaWVudChsaW5lYXIsbGVmdCB0b3AscmlnaHQgYm90dG9tLGZyb20oIzlmOSksdG8od2hpdGUpKTtcIixjPVwibGluZWFyLWdyYWRpZW50KGxlZnQgdG9wLCM5ZjksIHdoaXRlKTtcIjtyZXR1cm4gRCgoYStcIi13ZWJraXQtIFwiLnNwbGl0KFwiIFwiKS5qb2luKGIrYSkrbi5qb2luKGMrYSkpLnNsaWNlKDAsLWEubGVuZ3RoKSksRyhqLmJhY2tncm91bmRJbWFnZSxcImdyYWRpZW50XCIpfSxzLmNzc3JlZmxlY3Rpb25zPWZ1bmN0aW9uKCl7cmV0dXJuIEooXCJib3hSZWZsZWN0XCIpfSxzLmNzc3RyYW5zZm9ybXM9ZnVuY3Rpb24oKXtyZXR1cm4hIUooXCJ0cmFuc2Zvcm1cIil9LHMuY3NzdHJhbnNmb3JtczNkPWZ1bmN0aW9uKCl7dmFyIGE9ISFKKFwicGVyc3BlY3RpdmVcIik7cmV0dXJuIGEmJlwid2Via2l0UGVyc3BlY3RpdmVcImluIGcuc3R5bGUmJnkoXCJAbWVkaWEgKHRyYW5zZm9ybS0zZCksKC13ZWJraXQtdHJhbnNmb3JtLTNkKXsjbW9kZXJuaXpye2xlZnQ6OXB4O3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDozcHg7fX1cIixmdW5jdGlvbihiLGMpe2E9Yi5vZmZzZXRMZWZ0PT09OSYmYi5vZmZzZXRIZWlnaHQ9PT0zfSksYX0scy5jc3N0cmFuc2l0aW9ucz1mdW5jdGlvbigpe3JldHVybiBKKFwidHJhbnNpdGlvblwiKX0scy5mb250ZmFjZT1mdW5jdGlvbigpe3ZhciBhO3JldHVybiB5KCdAZm9udC1mYWNlIHtmb250LWZhbWlseTpcImZvbnRcIjtzcmM6dXJsKFwiaHR0cHM6Ly9cIil9JyxmdW5jdGlvbihjLGQpe3ZhciBlPWIuZ2V0RWxlbWVudEJ5SWQoXCJzbW9kZXJuaXpyXCIpLGY9ZS5zaGVldHx8ZS5zdHlsZVNoZWV0LGc9Zj9mLmNzc1J1bGVzJiZmLmNzc1J1bGVzWzBdP2YuY3NzUnVsZXNbMF0uY3NzVGV4dDpmLmNzc1RleHR8fFwiXCI6XCJcIjthPS9zcmMvaS50ZXN0KGcpJiZnLmluZGV4T2YoZC5zcGxpdChcIiBcIilbMF0pPT09MH0pLGF9LHMuZ2VuZXJhdGVkY29udGVudD1mdW5jdGlvbigpe3ZhciBhO3JldHVybiB5KFtcIiNcIixoLFwie2ZvbnQ6MC8wIGF9I1wiLGgsJzphZnRlcntjb250ZW50OlwiJyxsLCdcIjt2aXNpYmlsaXR5OmhpZGRlbjtmb250OjNweC8xIGF9J10uam9pbihcIlwiKSxmdW5jdGlvbihiKXthPWIub2Zmc2V0SGVpZ2h0Pj0zfSksYX0scy52aWRlbz1mdW5jdGlvbigpe3ZhciBhPWIuY3JlYXRlRWxlbWVudChcInZpZGVvXCIpLGM9ITE7dHJ5e2lmKGM9ISFhLmNhblBsYXlUeXBlKWM9bmV3IEJvb2xlYW4oYyksYy5vZ2c9YS5jYW5QbGF5VHlwZSgndmlkZW8vb2dnOyBjb2RlY3M9XCJ0aGVvcmFcIicpLnJlcGxhY2UoL15ubyQvLFwiXCIpLGMuaDI2ND1hLmNhblBsYXlUeXBlKCd2aWRlby9tcDQ7IGNvZGVjcz1cImF2YzEuNDJFMDFFXCInKS5yZXBsYWNlKC9ebm8kLyxcIlwiKSxjLndlYm09YS5jYW5QbGF5VHlwZSgndmlkZW8vd2VibTsgY29kZWNzPVwidnA4LCB2b3JiaXNcIicpLnJlcGxhY2UoL15ubyQvLFwiXCIpfWNhdGNoKGQpe31yZXR1cm4gY30scy5hdWRpbz1mdW5jdGlvbigpe3ZhciBhPWIuY3JlYXRlRWxlbWVudChcImF1ZGlvXCIpLGM9ITE7dHJ5e2lmKGM9ISFhLmNhblBsYXlUeXBlKWM9bmV3IEJvb2xlYW4oYyksYy5vZ2c9YS5jYW5QbGF5VHlwZSgnYXVkaW8vb2dnOyBjb2RlY3M9XCJ2b3JiaXNcIicpLnJlcGxhY2UoL15ubyQvLFwiXCIpLGMubXAzPWEuY2FuUGxheVR5cGUoXCJhdWRpby9tcGVnO1wiKS5yZXBsYWNlKC9ebm8kLyxcIlwiKSxjLndhdj1hLmNhblBsYXlUeXBlKCdhdWRpby93YXY7IGNvZGVjcz1cIjFcIicpLnJlcGxhY2UoL15ubyQvLFwiXCIpLGMubTRhPShhLmNhblBsYXlUeXBlKFwiYXVkaW8veC1tNGE7XCIpfHxhLmNhblBsYXlUeXBlKFwiYXVkaW8vYWFjO1wiKSkucmVwbGFjZSgvXm5vJC8sXCJcIil9Y2F0Y2goZCl7fXJldHVybiBjfSxzLmxvY2Fsc3RvcmFnZT1mdW5jdGlvbigpe3RyeXtyZXR1cm4gbG9jYWxTdG9yYWdlLnNldEl0ZW0oaCxoKSxsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShoKSwhMH1jYXRjaChhKXtyZXR1cm4hMX19LHMuc2Vzc2lvbnN0b3JhZ2U9ZnVuY3Rpb24oKXt0cnl7cmV0dXJuIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oaCxoKSxzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKGgpLCEwfWNhdGNoKGEpe3JldHVybiExfX0scy53ZWJ3b3JrZXJzPWZ1bmN0aW9uKCl7cmV0dXJuISFhLldvcmtlcn0scy5hcHBsaWNhdGlvbmNhY2hlPWZ1bmN0aW9uKCl7cmV0dXJuISFhLmFwcGxpY2F0aW9uQ2FjaGV9LHMuc3ZnPWZ1bmN0aW9uKCl7cmV0dXJuISFiLmNyZWF0ZUVsZW1lbnROUyYmISFiLmNyZWF0ZUVsZW1lbnROUyhyLnN2ZyxcInN2Z1wiKS5jcmVhdGVTVkdSZWN0fSxzLmlubGluZXN2Zz1mdW5jdGlvbigpe3ZhciBhPWIuY3JlYXRlRWxlbWVudChcImRpdlwiKTtyZXR1cm4gYS5pbm5lckhUTUw9XCI8c3ZnLz5cIiwoYS5maXJzdENoaWxkJiZhLmZpcnN0Q2hpbGQubmFtZXNwYWNlVVJJKT09ci5zdmd9LHMuc21pbD1mdW5jdGlvbigpe3JldHVybiEhYi5jcmVhdGVFbGVtZW50TlMmJi9TVkdBbmltYXRlLy50ZXN0KG0uY2FsbChiLmNyZWF0ZUVsZW1lbnROUyhyLnN2ZyxcImFuaW1hdGVcIikpKX0scy5zdmdjbGlwcGF0aHM9ZnVuY3Rpb24oKXtyZXR1cm4hIWIuY3JlYXRlRWxlbWVudE5TJiYvU1ZHQ2xpcFBhdGgvLnRlc3QobS5jYWxsKGIuY3JlYXRlRWxlbWVudE5TKHIuc3ZnLFwiY2xpcFBhdGhcIikpKX07Zm9yKHZhciBMIGluIHMpQyhzLEwpJiYoeD1MLnRvTG93ZXJDYXNlKCksZVt4XT1zW0xdKCksdi5wdXNoKChlW3hdP1wiXCI6XCJuby1cIikreCkpO3JldHVybiBlLmlucHV0fHxLKCksZS5hZGRUZXN0PWZ1bmN0aW9uKGEsYil7aWYodHlwZW9mIGE9PVwib2JqZWN0XCIpZm9yKHZhciBkIGluIGEpQyhhLGQpJiZlLmFkZFRlc3QoZCxhW2RdKTtlbHNle2E9YS50b0xvd2VyQ2FzZSgpO2lmKGVbYV0hPT1jKXJldHVybiBlO2I9dHlwZW9mIGI9PVwiZnVuY3Rpb25cIj9iKCk6Yix0eXBlb2YgZiE9XCJ1bmRlZmluZWRcIiYmZiYmKGcuY2xhc3NOYW1lKz1cIiBcIisoYj9cIlwiOlwibm8tXCIpK2EpLGVbYV09Yn1yZXR1cm4gZX0sRChcIlwiKSxpPWs9bnVsbCxmdW5jdGlvbihhLGIpe2Z1bmN0aW9uIGwoYSxiKXt2YXIgYz1hLmNyZWF0ZUVsZW1lbnQoXCJwXCIpLGQ9YS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF18fGEuZG9jdW1lbnRFbGVtZW50O3JldHVybiBjLmlubmVySFRNTD1cIng8c3R5bGU+XCIrYitcIjwvc3R5bGU+XCIsZC5pbnNlcnRCZWZvcmUoYy5sYXN0Q2hpbGQsZC5maXJzdENoaWxkKX1mdW5jdGlvbiBtKCl7dmFyIGE9cy5lbGVtZW50cztyZXR1cm4gdHlwZW9mIGE9PVwic3RyaW5nXCI/YS5zcGxpdChcIiBcIik6YX1mdW5jdGlvbiBuKGEpe3ZhciBiPWpbYVtoXV07cmV0dXJuIGJ8fChiPXt9LGkrKyxhW2hdPWksaltpXT1iKSxifWZ1bmN0aW9uIG8oYSxjLGQpe2N8fChjPWIpO2lmKGspcmV0dXJuIGMuY3JlYXRlRWxlbWVudChhKTtkfHwoZD1uKGMpKTt2YXIgZztyZXR1cm4gZC5jYWNoZVthXT9nPWQuY2FjaGVbYV0uY2xvbmVOb2RlKCk6Zi50ZXN0KGEpP2c9KGQuY2FjaGVbYV09ZC5jcmVhdGVFbGVtKGEpKS5jbG9uZU5vZGUoKTpnPWQuY3JlYXRlRWxlbShhKSxnLmNhbkhhdmVDaGlsZHJlbiYmIWUudGVzdChhKSYmIWcudGFnVXJuP2QuZnJhZy5hcHBlbmRDaGlsZChnKTpnfWZ1bmN0aW9uIHAoYSxjKXthfHwoYT1iKTtpZihrKXJldHVybiBhLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtjPWN8fG4oYSk7dmFyIGQ9Yy5mcmFnLmNsb25lTm9kZSgpLGU9MCxmPW0oKSxnPWYubGVuZ3RoO2Zvcig7ZTxnO2UrKylkLmNyZWF0ZUVsZW1lbnQoZltlXSk7cmV0dXJuIGR9ZnVuY3Rpb24gcShhLGIpe2IuY2FjaGV8fChiLmNhY2hlPXt9LGIuY3JlYXRlRWxlbT1hLmNyZWF0ZUVsZW1lbnQsYi5jcmVhdGVGcmFnPWEuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCxiLmZyYWc9Yi5jcmVhdGVGcmFnKCkpLGEuY3JlYXRlRWxlbWVudD1mdW5jdGlvbihjKXtyZXR1cm4gcy5zaGl2TWV0aG9kcz9vKGMsYSxiKTpiLmNyZWF0ZUVsZW0oYyl9LGEuY3JlYXRlRG9jdW1lbnRGcmFnbWVudD1GdW5jdGlvbihcImgsZlwiLFwicmV0dXJuIGZ1bmN0aW9uKCl7dmFyIG49Zi5jbG9uZU5vZGUoKSxjPW4uY3JlYXRlRWxlbWVudDtoLnNoaXZNZXRob2RzJiYoXCIrbSgpLmpvaW4oKS5yZXBsYWNlKC9bXFx3XFwtXSsvZyxmdW5jdGlvbihhKXtyZXR1cm4gYi5jcmVhdGVFbGVtKGEpLGIuZnJhZy5jcmVhdGVFbGVtZW50KGEpLCdjKFwiJythKydcIiknfSkrXCIpO3JldHVybiBufVwiKShzLGIuZnJhZyl9ZnVuY3Rpb24gcihhKXthfHwoYT1iKTt2YXIgYz1uKGEpO3JldHVybiBzLnNoaXZDU1MmJiFnJiYhYy5oYXNDU1MmJihjLmhhc0NTUz0hIWwoYSxcImFydGljbGUsYXNpZGUsZGlhbG9nLGZpZ2NhcHRpb24sZmlndXJlLGZvb3RlcixoZWFkZXIsaGdyb3VwLG1haW4sbmF2LHNlY3Rpb257ZGlzcGxheTpibG9ja31tYXJre2JhY2tncm91bmQ6I0ZGMDtjb2xvcjojMDAwfXRlbXBsYXRle2Rpc3BsYXk6bm9uZX1cIikpLGt8fHEoYSxjKSxhfXZhciBjPVwiMy43LjBcIixkPWEuaHRtbDV8fHt9LGU9L148fF4oPzpidXR0b258bWFwfHNlbGVjdHx0ZXh0YXJlYXxvYmplY3R8aWZyYW1lfG9wdGlvbnxvcHRncm91cCkkL2ksZj0vXig/OmF8Ynxjb2RlfGRpdnxmaWVsZHNldHxoMXxoMnxoM3xoNHxoNXxoNnxpfGxhYmVsfGxpfG9sfHB8cXxzcGFufHN0cm9uZ3xzdHlsZXx0YWJsZXx0Ym9keXx0ZHx0aHx0cnx1bCkkL2ksZyxoPVwiX2h0bWw1c2hpdlwiLGk9MCxqPXt9LGs7KGZ1bmN0aW9uKCl7dHJ5e3ZhciBhPWIuY3JlYXRlRWxlbWVudChcImFcIik7YS5pbm5lckhUTUw9XCI8eHl6PjwveHl6PlwiLGc9XCJoaWRkZW5cImluIGEsaz1hLmNoaWxkTm9kZXMubGVuZ3RoPT0xfHxmdW5jdGlvbigpe2IuY3JlYXRlRWxlbWVudChcImFcIik7dmFyIGE9Yi5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7cmV0dXJuIHR5cGVvZiBhLmNsb25lTm9kZT09XCJ1bmRlZmluZWRcInx8dHlwZW9mIGEuY3JlYXRlRG9jdW1lbnRGcmFnbWVudD09XCJ1bmRlZmluZWRcInx8dHlwZW9mIGEuY3JlYXRlRWxlbWVudD09XCJ1bmRlZmluZWRcIn0oKX1jYXRjaChjKXtnPSEwLGs9ITB9fSkoKTt2YXIgcz17ZWxlbWVudHM6ZC5lbGVtZW50c3x8XCJhYmJyIGFydGljbGUgYXNpZGUgYXVkaW8gYmRpIGNhbnZhcyBkYXRhIGRhdGFsaXN0IGRldGFpbHMgZGlhbG9nIGZpZ2NhcHRpb24gZmlndXJlIGZvb3RlciBoZWFkZXIgaGdyb3VwIG1haW4gbWFyayBtZXRlciBuYXYgb3V0cHV0IHByb2dyZXNzIHNlY3Rpb24gc3VtbWFyeSB0ZW1wbGF0ZSB0aW1lIHZpZGVvXCIsdmVyc2lvbjpjLHNoaXZDU1M6ZC5zaGl2Q1NTIT09ITEsc3VwcG9ydHNVbmtub3duRWxlbWVudHM6ayxzaGl2TWV0aG9kczpkLnNoaXZNZXRob2RzIT09ITEsdHlwZTpcImRlZmF1bHRcIixzaGl2RG9jdW1lbnQ6cixjcmVhdGVFbGVtZW50Om8sY3JlYXRlRG9jdW1lbnRGcmFnbWVudDpwfTthLmh0bWw1PXMscihiKX0odGhpcyxiKSxlLl92ZXJzaW9uPWQsZS5fcHJlZml4ZXM9bixlLl9kb21QcmVmaXhlcz1xLGUuX2Nzc29tUHJlZml4ZXM9cCxlLm1xPXosZS5oYXNFdmVudD1BLGUudGVzdFByb3A9ZnVuY3Rpb24oYSl7cmV0dXJuIEgoW2FdKX0sZS50ZXN0QWxsUHJvcHM9SixlLnRlc3RTdHlsZXM9eSxlLnByZWZpeGVkPWZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gYj9KKGEsYixjKTpKKGEsXCJwZnhcIil9LGcuY2xhc3NOYW1lPWcuY2xhc3NOYW1lLnJlcGxhY2UoLyhefFxccyluby1qcyhcXHN8JCkvLFwiJDEkMlwiKSsoZj9cIiBqcyBcIit2LmpvaW4oXCIgXCIpOlwiXCIpLGV9KHRoaXMsdGhpcy5kb2N1bWVudCksZnVuY3Rpb24oYSxiLGMpe2Z1bmN0aW9uIGQoYSl7cmV0dXJuXCJbb2JqZWN0IEZ1bmN0aW9uXVwiPT1vLmNhbGwoYSl9ZnVuY3Rpb24gZShhKXtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgYX1mdW5jdGlvbiBmKCl7fWZ1bmN0aW9uIGcoYSl7cmV0dXJuIWF8fFwibG9hZGVkXCI9PWF8fFwiY29tcGxldGVcIj09YXx8XCJ1bmluaXRpYWxpemVkXCI9PWF9ZnVuY3Rpb24gaCgpe3ZhciBhPXAuc2hpZnQoKTtxPTEsYT9hLnQ/bShmdW5jdGlvbigpeyhcImNcIj09YS50P0IuaW5qZWN0Q3NzOkIuaW5qZWN0SnMpKGEucywwLGEuYSxhLngsYS5lLDEpfSwwKTooYSgpLGgoKSk6cT0wfWZ1bmN0aW9uIGkoYSxjLGQsZSxmLGksail7ZnVuY3Rpb24gayhiKXtpZighbyYmZyhsLnJlYWR5U3RhdGUpJiYodS5yPW89MSwhcSYmaCgpLGwub25sb2FkPWwub25yZWFkeXN0YXRlY2hhbmdlPW51bGwsYikpe1wiaW1nXCIhPWEmJm0oZnVuY3Rpb24oKXt0LnJlbW92ZUNoaWxkKGwpfSw1MCk7Zm9yKHZhciBkIGluIHlbY10peVtjXS5oYXNPd25Qcm9wZXJ0eShkKSYmeVtjXVtkXS5vbmxvYWQoKX19dmFyIGo9anx8Qi5lcnJvclRpbWVvdXQsbD1iLmNyZWF0ZUVsZW1lbnQoYSksbz0wLHI9MCx1PXt0OmQsczpjLGU6ZixhOmkseDpqfTsxPT09eVtjXSYmKHI9MSx5W2NdPVtdKSxcIm9iamVjdFwiPT1hP2wuZGF0YT1jOihsLnNyYz1jLGwudHlwZT1hKSxsLndpZHRoPWwuaGVpZ2h0PVwiMFwiLGwub25lcnJvcj1sLm9ubG9hZD1sLm9ucmVhZHlzdGF0ZWNoYW5nZT1mdW5jdGlvbigpe2suY2FsbCh0aGlzLHIpfSxwLnNwbGljZShlLDAsdSksXCJpbWdcIiE9YSYmKHJ8fDI9PT15W2NdPyh0Lmluc2VydEJlZm9yZShsLHM/bnVsbDpuKSxtKGssaikpOnlbY10ucHVzaChsKSl9ZnVuY3Rpb24gaihhLGIsYyxkLGYpe3JldHVybiBxPTAsYj1ifHxcImpcIixlKGEpP2koXCJjXCI9PWI/djp1LGEsYix0aGlzLmkrKyxjLGQsZik6KHAuc3BsaWNlKHRoaXMuaSsrLDAsYSksMT09cC5sZW5ndGgmJmgoKSksdGhpc31mdW5jdGlvbiBrKCl7dmFyIGE9QjtyZXR1cm4gYS5sb2FkZXI9e2xvYWQ6aixpOjB9LGF9dmFyIGw9Yi5kb2N1bWVudEVsZW1lbnQsbT1hLnNldFRpbWVvdXQsbj1iLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpWzBdLG89e30udG9TdHJpbmcscD1bXSxxPTAscj1cIk1vekFwcGVhcmFuY2VcImluIGwuc3R5bGUscz1yJiYhIWIuY3JlYXRlUmFuZ2UoKS5jb21wYXJlTm9kZSx0PXM/bDpuLnBhcmVudE5vZGUsbD1hLm9wZXJhJiZcIltvYmplY3QgT3BlcmFdXCI9PW8uY2FsbChhLm9wZXJhKSxsPSEhYi5hdHRhY2hFdmVudCYmIWwsdT1yP1wib2JqZWN0XCI6bD9cInNjcmlwdFwiOlwiaW1nXCIsdj1sP1wic2NyaXB0XCI6dSx3PUFycmF5LmlzQXJyYXl8fGZ1bmN0aW9uKGEpe3JldHVyblwiW29iamVjdCBBcnJheV1cIj09by5jYWxsKGEpfSx4PVtdLHk9e30sej17dGltZW91dDpmdW5jdGlvbihhLGIpe3JldHVybiBiLmxlbmd0aCYmKGEudGltZW91dD1iWzBdKSxhfX0sQSxCO0I9ZnVuY3Rpb24oYSl7ZnVuY3Rpb24gYihhKXt2YXIgYT1hLnNwbGl0KFwiIVwiKSxiPXgubGVuZ3RoLGM9YS5wb3AoKSxkPWEubGVuZ3RoLGM9e3VybDpjLG9yaWdVcmw6YyxwcmVmaXhlczphfSxlLGYsZztmb3IoZj0wO2Y8ZDtmKyspZz1hW2ZdLnNwbGl0KFwiPVwiKSwoZT16W2cuc2hpZnQoKV0pJiYoYz1lKGMsZykpO2ZvcihmPTA7ZjxiO2YrKyljPXhbZl0oYyk7cmV0dXJuIGN9ZnVuY3Rpb24gZyhhLGUsZixnLGgpe3ZhciBpPWIoYSksaj1pLmF1dG9DYWxsYmFjaztpLnVybC5zcGxpdChcIi5cIikucG9wKCkuc3BsaXQoXCI/XCIpLnNoaWZ0KCksaS5ieXBhc3N8fChlJiYoZT1kKGUpP2U6ZVthXXx8ZVtnXXx8ZVthLnNwbGl0KFwiL1wiKS5wb3AoKS5zcGxpdChcIj9cIilbMF1dKSxpLmluc3RlYWQ/aS5pbnN0ZWFkKGEsZSxmLGcsaCk6KHlbaS51cmxdP2kubm9leGVjPSEwOnlbaS51cmxdPTEsZi5sb2FkKGkudXJsLGkuZm9yY2VDU1N8fCFpLmZvcmNlSlMmJlwiY3NzXCI9PWkudXJsLnNwbGl0KFwiLlwiKS5wb3AoKS5zcGxpdChcIj9cIikuc2hpZnQoKT9cImNcIjpjLGkubm9leGVjLGkuYXR0cnMsaS50aW1lb3V0KSwoZChlKXx8ZChqKSkmJmYubG9hZChmdW5jdGlvbigpe2soKSxlJiZlKGkub3JpZ1VybCxoLGcpLGomJmooaS5vcmlnVXJsLGgsZykseVtpLnVybF09Mn0pKSl9ZnVuY3Rpb24gaChhLGIpe2Z1bmN0aW9uIGMoYSxjKXtpZihhKXtpZihlKGEpKWN8fChqPWZ1bmN0aW9uKCl7dmFyIGE9W10uc2xpY2UuY2FsbChhcmd1bWVudHMpO2suYXBwbHkodGhpcyxhKSxsKCl9KSxnKGEsaixiLDAsaCk7ZWxzZSBpZihPYmplY3QoYSk9PT1hKWZvcihuIGluIG09ZnVuY3Rpb24oKXt2YXIgYj0wLGM7Zm9yKGMgaW4gYSlhLmhhc093blByb3BlcnR5KGMpJiZiKys7cmV0dXJuIGJ9KCksYSlhLmhhc093blByb3BlcnR5KG4pJiYoIWMmJiEtLW0mJihkKGopP2o9ZnVuY3Rpb24oKXt2YXIgYT1bXS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7ay5hcHBseSh0aGlzLGEpLGwoKX06altuXT1mdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgYj1bXS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7YSYmYS5hcHBseSh0aGlzLGIpLGwoKX19KGtbbl0pKSxnKGFbbl0saixiLG4saCkpfWVsc2UhYyYmbCgpfXZhciBoPSEhYS50ZXN0LGk9YS5sb2FkfHxhLmJvdGgsaj1hLmNhbGxiYWNrfHxmLGs9aixsPWEuY29tcGxldGV8fGYsbSxuO2MoaD9hLnllcDphLm5vcGUsISFpKSxpJiZjKGkpfXZhciBpLGosbD10aGlzLnllcG5vcGUubG9hZGVyO2lmKGUoYSkpZyhhLDAsbCwwKTtlbHNlIGlmKHcoYSkpZm9yKGk9MDtpPGEubGVuZ3RoO2krKylqPWFbaV0sZShqKT9nKGosMCxsLDApOncoaik/QihqKTpPYmplY3Qoaik9PT1qJiZoKGosbCk7ZWxzZSBPYmplY3QoYSk9PT1hJiZoKGEsbCl9LEIuYWRkUHJlZml4PWZ1bmN0aW9uKGEsYil7elthXT1ifSxCLmFkZEZpbHRlcj1mdW5jdGlvbihhKXt4LnB1c2goYSl9LEIuZXJyb3JUaW1lb3V0PTFlNCxudWxsPT1iLnJlYWR5U3RhdGUmJmIuYWRkRXZlbnRMaXN0ZW5lciYmKGIucmVhZHlTdGF0ZT1cImxvYWRpbmdcIixiLmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsQT1mdW5jdGlvbigpe2IucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixBLDApLGIucmVhZHlTdGF0ZT1cImNvbXBsZXRlXCJ9LDApKSxhLnllcG5vcGU9aygpLGEueWVwbm9wZS5leGVjdXRlU3RhY2s9aCxhLnllcG5vcGUuaW5qZWN0SnM9ZnVuY3Rpb24oYSxjLGQsZSxpLGope3ZhciBrPWIuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKSxsLG8sZT1lfHxCLmVycm9yVGltZW91dDtrLnNyYz1hO2ZvcihvIGluIGQpay5zZXRBdHRyaWJ1dGUobyxkW29dKTtjPWo/aDpjfHxmLGsub25yZWFkeXN0YXRlY2hhbmdlPWsub25sb2FkPWZ1bmN0aW9uKCl7IWwmJmcoay5yZWFkeVN0YXRlKSYmKGw9MSxjKCksay5vbmxvYWQ9ay5vbnJlYWR5c3RhdGVjaGFuZ2U9bnVsbCl9LG0oZnVuY3Rpb24oKXtsfHwobD0xLGMoMSkpfSxlKSxpP2sub25sb2FkKCk6bi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShrLG4pfSxhLnllcG5vcGUuaW5qZWN0Q3NzPWZ1bmN0aW9uKGEsYyxkLGUsZyxpKXt2YXIgZT1iLmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpLGosYz1pP2g6Y3x8ZjtlLmhyZWY9YSxlLnJlbD1cInN0eWxlc2hlZXRcIixlLnR5cGU9XCJ0ZXh0L2Nzc1wiO2ZvcihqIGluIGQpZS5zZXRBdHRyaWJ1dGUoaixkW2pdKTtnfHwobi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlLG4pLG0oYywwKSl9fSh0aGlzLGRvY3VtZW50KSxNb2Rlcm5penIubG9hZD1mdW5jdGlvbigpe3llcG5vcGUuYXBwbHkod2luZG93LFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLDApKX07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=