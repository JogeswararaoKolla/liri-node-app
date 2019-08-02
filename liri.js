const result = require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);
const moment = require('moment');
const axios = require("axios");
const fs = require("fs");

if (result.error) {
  throw result.error
}

let logargs=process.argv;
let args = process.argv.slice(2);
let  query = args[0];
let search = args[1];
let logData="";

if (!query) {
  console.log("Program requires atleast one of these options:concert-this,spotify-this-song,movie-this,do-what-it-says\nExample: node liri.js do-what-it-says");
}
else {
  const datetime = moment().format("MM/DD/YYYY HH:mm:ss A");
  console.log("------------------------------------------------------------\n");
  console.log("Displays top 2 matching rows!\n");
  console.log(`Current Datetime: ${datetime}\n`);

  logData=`------------------------------------------------------------\nDisplays top 2 matching rows!\nCurrent Datetime: ${datetime}\n------------------------------------------------------------\n`;

  if(query == "concert-this") {
    if(!search){
      search="The Chainsmokers";
      logData= logData + `${query},${search}\n`;
      concertthisfn(search);
    }
    else {
      logData= logData + `${query},${search}\n`;
      concertthisfn(search);
    }
    
  }
  else if (query == "spotify-this-song") {
    if(!search){
      search="The Sign";
      logData= logData + `${query},${search}\n`;
      spotifythissongfn(search);
    } else {
      logData= logData + `${query},${search}\n`;
      spotifythissongfn(search);
    }
    
  }
  else if (query == "movie-this") {
    if(!search){
      search="Mr. Nobody";
      logData= logData + `${query},${search}\n`;
      console.log(`* If you haven't watched "Mr. Nobody," then you should: <http://www.imdb.com/title/tt0485947/>`);
      console.log(`* It's on Netflix\n`);
      moviethisfn(search);
      logData=logData + `------------------------------------------------------------\n* If you haven't watched "Mr. Nobody," then you should: <http://www.imdb.com/title/tt0485947/>\n* It's on Netflix\n`;
    }
    else {
      logData= logData + `${query},${search}\n`;
      moviethisfn(search);
    }
  }
  else if (query == "do-what-it-says") {
    fs.readFile("random.txt","utf8",function(err,data){
      if (err) {
        return console.log(err);
      }
      let dataList=data.split("\n");
      dataList=dataList.filter(element => element.length > 1);
      console.log(dataList);
      for(let i=0;i<dataList.length;i++){
        query=dataList[i].split(",")[0];
        search=dataList[i].split(",")[1];
        if(query == "concert-this") {
          concertthisfn(search);
        }
        else if (query == "spotify-this-song") {
          spotifythissongfn(search);
        }
        else if (query == "movie-this") {
          moviethisfn(search);
        }
        else {
          console.log(`Error at row number: ${i+1}`);
          console.log("Please use any one of these search options : concert-this,spotify-this-song,movie-this");
        }
      }

    });
  }
  else {
    console.log("Please use any one of these search options: concert-this,spotify-this-song,movie-this,do-what-it-says");
  }
}

function spotifythissongfn(search){
  spotify.search({ type: 'track', query: search })
  .then(function (res) {
    for (let j = 0; j < (res.tracks.items.length > 2 ? 2 : res.tracks.items.length ); j++) {
      const artist = [];
      for (let i = 0; i < res.tracks.items[j].artists.length; i++) {
        artist.push(res.tracks.items[j].artists[i].name);
      }
      console.log("------------------------------------------------------------\n");
      console.log(`* Artist(s) : ${artist.join()}\n`);
      console.log(`* The song's name : ${res.tracks.items[0].name}\n`);
      console.log(`* A preview link of the song from Spotify : ${res.tracks.items[0].preview_url}\n`);
      console.log(`* The album that the song is from : ${res.tracks.items[0].album.name}\n`);
      logData=logData + `------------------------------------------------------------\n* Artist(s) : ${artist.join()}\n* The song's name : ${res.tracks.items[0].name}\n* A preview link of the song from Spotify : ${res.tracks.items[0].preview_url}\n* The album that the song is from : ${res.tracks.items[0].album.name}\n`;
      logfn();
    }

  })
  .catch(function (err) {
    console.log(err);
    console.log("Error Occured1");
  });

}

function concertthisfn(search){
  axios.get("https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp")
      .then(function (resObj) {
        for (let i = 0; i < (resObj.data.length > 2 ? 2 : resObj.data.length); i++) {
          let address = [];
          address.push(resObj.data[i].venue.city);
          address.push(resObj.data[i].venue.region);
          address.push(resObj.data[i].venue.country);
          let locObj = {};
          locObj.latitude = resObj.data[i].venue.latitude;
          locObj.longitude = resObj.data[i].venue.longitude;
          console.log("------------------------------------------------------------\n");
          console.log(`* Name of the venue: ${resObj.data[i].venue.name}\n`);
          console.log(`* Venue location: ${address.join()}\n`);
          console.log(`* Date of the Event: ${moment(resObj.data[i].datetime, "YYYY-MM-DDTHH:mm:ss").format("MM/DD/YYYY")}\n`);
          logData=logData + `------------------------------------------------------------\n* Name of the venue: ${resObj.data[i].venue.name}\n* Venue location: ${address.join()}\n* Date of the Event: ${moment(resObj.data[i].datetime, "YYYY-MM-DDTHH:mm:ss").format("MM/DD/YYYY")}\n`;
        }
        logfn();
      }).catch(function (err) {
        console.log(err);
        console.log("Error Occured!")
      });
}

function moviethisfn(search)
{
  axios.get(`http://www.omdbapi.com/?t=${search.split(" ").join('+')}&y=&plot=short&apikey=trilogy`)
  .then(
    function(response) {
      if(response.data.Response=="True"){
        let Rottenrate=response.data.Ratings.find(element => element.Source=="Rotten Tomatoes");
        if(!Rottenrate) {
          Rottenrate={Source:"Rotten Tomatoes",Value:"NA"};
        }
        console.log("------------------------------------------------------------\n");
        console.log(`* Title of the movie. : ${response.data.Title}\n`);
        console.log(`* Year the movie came out. : ${response.data.Year}\n`);
        console.log(`* IMDB Rating of the movie. ${response.data.imdbRating}\n`);
        console.log(`* Rotten Tomatoes Rating of the movie. : ${(typeof(Rottenrate.Value) != "undefined" ? Rottenrate.Value : "NA" )}\n`);
        console.log(`* Country where the movie was produced. : ${response.data.Country}\n`);
        console.log(`* Language of the movie. : ${response.data.Language}\n`);
        console.log(`* Plot of the movie. : ${response.data.Plot}\n`);
        console.log(`* Actors in the movie. : ${response.data.Actors}\n`);
        logData=logData + `------------------------------------------------------------\n* Title of the movie. : ${response.data.Title}\n* Year the movie came out. : ${response.data.Year}\n`
        + `* IMDB Rating of the movie. ${response.data.imdbRating}\n* Rotten Tomatoes Rating of the movie. : ${(typeof(Rottenrate.Value) != "undefined" ? Rottenrate.Value : "NA" )}\n`
        + `* Country where the movie was produced. : ${response.data.Country}\n* Language of the movie. : ${response.data.Language}\n`
        + `* Plot of the movie. : ${response.data.Plot}\n* Actors in the movie. : ${response.data.Actors}\n`;
        logfn();
      }
      else {
        console.log(`No Movie found for : ${search}\n`);
      }
     
    })
    .catch(function(err)
    { console.log(err);
      console.log("Error Occured2");
    });

}

function logfn(){
  fs.appendFile("log.txt", logData, function (err) {
    if (err) {
      return console.log("Error code file log.txt append method\n");
    }
  });
}
