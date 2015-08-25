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