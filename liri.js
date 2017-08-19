var keys = require('./keys.js');
var Twitter = require('twitter');
var client = new Twitter(keys.twitterKeys);
var request = require('request');
var fs = require('fs');
var path = require('path');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotifyKeys);

function takeCommands(command, song) {
    switch(command){
    case 'my-tweets': 
        var params = {count: 20};
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
          if (!error) {
            tweets.forEach(function(tweet) {
               process.stdout.write(tweet.text+"\n");
            });
          }else {
              console.log("an error has occured");
          }
        });
            break;
    case 'movie-this':
        var search = process.argv[3]? process.argv[3]: 'Mr.Nobody';
        request("http://www.omdbapi.com/?t="+search+"=&plot=short&apikey=40e9cece", function(error, response, body) {
          if (!error && response.statusCode === 200) {
              var movie = JSON.parse(body);
              process.stdout.write(`${movie["Title"]} \n ${movie["Year"]} \n ${movie["Ratings"][0]["Value"]} \n ${movie["Plot"]}  ${movie["Country"]} \n ${movie["Langauge"]}  ${movie["Actors"]} \n http://www.imdb.com/title/${movie["imbdID"]}`)
          }
        });
            break;
    case 'do-what-it-says':
        fs.readFile("random.txt", "utf8", function(e, d) {
            //e stands for error. d stands for data.
            if(!e) {
                var wordArray = d.split(",");
                takeCommands(wordArray[0], wordArray[1]);
            }
        });
            break;
    case 'spotify-this-song': 
            var search = !song? process.argv[3]? process.argv[3]: "The Sign by Ace of Base" : song ;
            spotify.search({ type: 'track', query: search, limit: 1 }, function(err, data) {
              if (err) {
                return console.log('Error occurred: ' + err);
              }
 
            var track = data.tracks.items[0]; 
            process.stdout.write(`${track.artists[0].name} \n ${track.name} \n ${track.uri} \n ${track.album.name}`)
            });
            
            break;
            
    default:
        return null;
    }   
} 
process.argv.forEach(function(each,i){
    if (i == 2) {
        takeCommands(each);    
    }
})


 

