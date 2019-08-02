const result = require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);
const moment = require('moment');
const axios = require("axios");

if (result.error) {
  throw result.error
}

let args = process.argv.slice(2);

// if (args.length != 1) {
//   console.log("Program requires 2 args example: node liri.js do-what-it-says");
// }
// else {
  console.log(args);
  const query = args[0];
  const search = args[1];
  const datetime = moment().format("MM/DD/YYYY HH:mm:ss A");
  console.log("-------------------------------------------");
  console.log("Displays first 5 matching rows if exists")
  console.log(`Current Datetime: ${datetime}`);

  if (query == "concert-this") {
    axios.get("https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp")
      .then(function (resObj) {
        for (let i = 0; i < (resObj.data.length > 5 ? 5 : resObj.data.length); i++) {
          let address = [];
          address.push(resObj.data[i].venue.city);
          address.push(resObj.data[i].venue.region);
          address.push(resObj.data[i].venue.country);
          let locObj = {};
          locObj.latitude = resObj.data[i].venue.latitude;
          locObj.longitude = resObj.data[i].venue.longitude;
          console.log("-------------------------------------------");
          console.log(`* Name of the venue: ${resObj.data[i].venue.name}\n`);
          console.log(`* Venue location: ${address.join()}\n`);
          console.log(`* Date of the Event: ${moment(resObj.data[i].datetime, "YYYY-MM-DDTHH:mm:ss").format("MM/DD/YYYY")}\n`);
        }
      }).catch(function (errObj) {
        console.log("Error Occured!")
      });
  }
  else if (query == "spotify-this-song") {
    spotify.search({ type: 'track', query: search })
      .then(function (res) {
        for (let j = 0; j < (res.tracks.items.length > 5 ? 5 : res.tracks.items.length ); j++) {
          const artist = [];
          for (let i = 0; i < res.tracks.items[j].artists.length; i++) {
            artist.push(res.tracks.items[j].artists[i].name);
          }
          console.log("-------------------------------------------");
          console.log(`* Artist(s) : ${artist.join()}\n`);
          console.log(`* The song's name : ${res.tracks.items[0].name}\n`);
          console.log(`* A preview link of the song from Spotify : ${res.tracks.items[0].preview_url}\n`);
          console.log(`* The album that the song is from : ${res.tracks.items[0].album.name}\n`);
        }

      })
      .catch(function (err) {
        console.log(err);
      });

  }
  else if (query == "movie-this") {

axios.get(`http://www.omdbapi.com/?t=${search.split(" ").join('+')}&y=&plot=short&apikey=trilogy`)
.then(
  function(response) {
    if(response.data.Response=="True"){
      const Rottenrate=response.data.Ratings.find(element => element.Source=="Rotten Tomatoes");
      console.log(Rottenrate);
      console.log("-------------------------------------------");
      console.log(`* Title of the movie. : ${response.data.Title}`)
      console.log(`* Year the movie came out. : ${response.data.Year}`)
      console.log(`* IMDB Rating of the movie. ${response.data.imdbRating}`)
      console.log(`* Rotten Tomatoes Rating of the movie. : ${Rottenrate.Value}`)
      console.log(`* Country where the movie was produced. : ${response.data.Country}`)
      console.log(`* Language of the movie. : ${response.data.Language}`)
      console.log(`* Plot of the movie. : ${response.data.Plot}`)
      console.log(`* Actors in the movie. : ${response.data.Actors}`)
    }
    else {
      console.log(`No Movie found for : ${search}`);
    }
   
  })
  .catch(function(err)
  {
    console.log("Error Occured2");
  });


  }
  else if (query == "do-what-it-says") {

  }
  else {
    console.log("Please use any one of the search concert-this,spotify-this-song,movie-this,do-what-it-says");
  }
// }



