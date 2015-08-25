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