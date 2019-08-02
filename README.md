# liri-node-app
liri-node-app

# Project overview

LIRI is a command line Node app that takes in parameters and returns data from the following APIs: Bandsintown, Spotify and OMDb.

# How it works 

Type into the command line....

node liri.js concert-this "artist/band name here" to return concert information from Bandsintown.

node liri.js spotify-this-song "song name here" to return song information from Spotify. If no song is entered, a hard coded default song will return.

node liri.js movie-this "movie name here" to return movie information from OMDb. If no movie is entered, a hard coded default movie will return.

node liri.js do-what-it-says to return information stored in random.txt it reads all the lines and executes corresponding commands.
it also captures the commands used in append mode to the file log.txt

Example code Execution Demo : 

![](Images/"Screen Shot 2019-08-02 at 2.36.55 AM")
