
// var keys = require("./keys.js");
// var spotify = new Spotify(keys.spotify);

const result = require("dotenv").config();
const moment = require('moment');

if (result.error) {
  throw result.error
}
console.log(result.parsed)


let args = process.argv.slice(2);


const axios = require("axios");

const query = args[0];
const artist = "ChainSmokers";

console.log(moment().format("YYYY-MM-DDTHH:mm:ss"));
// console.log(moment().format("YYYY-MM-DDTHH:mm:ss").format("MM/DD/YYYY"));

axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
  .then(function (resObj) {
    console.log("Response length:" + resObj.data.length);
    for (let i = 0; i < (resObj.data.length > 3 ? 2 :resObj.data.length) ; i++) {
      let address=[];
      address.push(resObj.data[i].venue.city);
      address.push(resObj.data[i].venue.region);
      address.push(resObj.data[i].venue.country);
      let locObj={};
      locObj.latitude=resObj.data[i].venue.latitude;
      locObj.longitude=resObj.data[i].venue.longitude;
      // console.log(resObj.data[i]);
      console.log(locObj);
      console.log("-------------------------------------------");
      console.log(`* Name of the venue: ${resObj.data[i].venue.name}\n`);
      console.log(`* Venue location: ${address.join()}\n`);
      console.log(`* Date of the Event: ${resObj.data[i].datetime}\n`);
    }
  }).catch(function (errObj) {
    console.log("Error Occured!")
  });

  
  //2019-08-01T19:00:15
  //2019-08-01T08:16:47-07:00

// https://rest.bandsintown.com/artists/Korn/events?app_id=codingbootcamp for an artist and render the following information about each event to the terminal:

//      * Name of the venue

//      * Venue location

//      * Date of the Event (use moment to format this as "MM/DD/YYYY")
   // * `concert-this`

   // * `spotify-this-song`

   // * `movie-this`

   // * `do-what-it-says`


