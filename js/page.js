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