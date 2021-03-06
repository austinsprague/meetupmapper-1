// *** USER / PROFILE FUNCTIONS *** //
var queries = require('./queries');
var rp = require('request-promise');

var key = '7731a58403d7c1d1d331c3e714c349';
var mapKey = 'pk.eyJ1Ijoic2FuZHlnaWxmaWxsYW4iLCJhIjoiY2luOWg3NGt2MXRqaHR5bHlibWc0c2t1diJ9.yQYGYNLuWKMFPvWoPZAyYg';

// *** MEETUP API FUNCTIONS *** //

function get_events (lat, lon, category) {
  var markers = [];
  var details = [];
  var userLat = '&lat=' + lat;
  var userLon = '&lon=' + lon;
  var userCategory = '&category=' + parseInt(category);
  return rp({ uri: 'https://api.meetup.com/2/open_events?key=' + key + userLat + userLon + userCategory + '&status=upcoming' }).then(function(data) {
    markers = [];
    var eventData = (JSON.parse(data));
    for(var i = 0; i < eventData.results.length; i++) {
      var marker = eventData.results[i];

      if(eventData.results[i].hasOwnProperty('venue')) {
        var date_time = get_date_time(marker);

        var short_desc = '';
        if(marker.description) {
          short_desc = marker.description.substring(0, 250);
        }

        markers.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [marker.venue.lon, marker.venue.lat]
          },
          properties: {
            image: '',
            url: marker.event_url,
            'marker-symbol': 'star',
            'marker-color': '#48d1cc',
            'marker-size': 'large',
            'name': marker.name,
            'rsvp': marker.yes_rsvp_count,
            'startTime': date_time[1],
            'date': date_time[0],
            'description': short_desc
          }
        });

        details.push({
          eventId: marker.id,
          eventName: marker.name,
          eventUrl: marker.event_url,
          fee: marker.fee,
          venueName: marker.venue.name,
          rsvpCount: marker.yes_rsvp_count,
          rsvpLimit: marker.rsvp_limit,
          lat: marker.venue.lat,
          lon: marker.venue.lon,
          venuePhone: marker.venue.phone,
          description: short_desc,
        });
      }
    }
    var markers_details = [markers,details];
    return markers_details;
  });
}

function convert_zip (userZip) {
  return rp({ uri:'https://api.mapbox.com/geocoding/v5/mapbox.places/' + userZip + '.json?country=us&proximity=39.8977%2C%2077.0365&autocomplete=true&access_token=' + mapKey }) .then(function(data) {
    var parseD = (JSON.parse(data));
    var lon = parseD.features[0].center[0];
    var lat = parseD.features[0].center[1];
    var latlong = { lat: lat, lon: lon };
    return latlong;
  });
}

function get_date_time (marker) {
  var date = new Date(marker.time);
  var hours = date.getHours();
  var minutes = date.getMinutes();

  var ampm = hours >=12 ? 'pm' : 'am';
  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getYear();
  var fullDate = month.toString() + '/'+ day.toString();

  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  fullTime = hours + ':' + minutes + " " + ampm;

  return([fullDate, fullTime]);
}

function display_event (eventID) {
  /*
    1. make request to meetup API with event ID
    2. display clipped info on popup

    -- OR --
    1. check db for cached event by ID
    2. if not, pull info from meetup api, cache, and display
    3. otherwise, display info from cache
  */
}

// *** USER FUNCTIONS *** //

function user_rsvp (user, event) {
  /*
    1. get event ID from google maps click
    2. send alongside user access code
    3. return to queryPromise for POST method
  */
}

function user_like_event (user, event) {
  /*
    1. get event ID from google maps click
    2. save in the 'events' table with the correct user ID and update join table
    3. then add event thumbnail to user profile
  */
}

function user_unlike_event (user, event) {
  /*
    1. get event ID from user click event
    2. remove event thumbnail from user profile on site
    3. return event ID to queryPromise in order to remove from database
  */
}

// *** GOOGLEMAPS API FUNCTIONS *** //

function map_add_events (eventArray) {
  /*
    1. Use get_events function to obtain array of events
    2. From array of event objects [ { name: eventName, latitude: eventLat, longitude: eventLong, shortDesc: 'text description of event', thumbUrl: url }], iterate over and add the pins, with the names and the short description and thumbnail
    4. If user is logged in, RSVP and SAVE buttons are loaded
    5. If event timeframe < 24 hours from now, pin is gold
  */
}

module.exports = {
  user_rsvp: user_rsvp,
  user_like_event: user_like_event,
  user_unlike_event: user_unlike_event,
  convert_zip: convert_zip,
  get_events: get_events,
  display_event: display_event,
  map_add_events: map_add_events
}

//there will likely be helper events to join the users / events tables and facilitate data transfer
