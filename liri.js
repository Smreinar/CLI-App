// Required Install
//(x)Spotify, (x)Axios, (x)OMDB, (x)Bands-In-Town, (x)Moment, (x)DotEnv
require("dotenv").config();
var keys = require("./key.js");
var axios = require("axios");
var fs = require("fs");
var Spotify = require("node-spotify-api");
var bandsintown = require("bandsintown");
var omdb = require("omdb");
var moment = require("moment");
moment().format();



//Client Input Stored in Global Varibles
var action = process.argv[2];
var fundata = process.argv.splice(3).join(" ");

//Logging Client's 2 Inputs

console.log("Action:", action, "Searching...", fundata);


//Setting Key Words For Client Call.
var pick = function(action, fundata){
switch (action) {
    case "concert-this":
        concertSearch(fundata)
        
    break;
    case "spotify-this-song":
        spotifySearch(fundata)
        
    break;
    case "movie-this":
        movieSearch(fundata)
        
    break;
    case "do-what-it-says":
        run()
        split()
    break;

    default: 
    console.log("The 'Action' Commands are: 'spotify-this-song', 'movie-this', 'concert-this' and 'do-what-it-says' ex: 'Action' 'SearchName'");
    
    break;
   
    
}
}
//Concert Search Function Using Axios GET Within
function concertSearch(fundata) {
    
    var uInput = fundata;

    axios.get("htpps://rest.bandsintown.com/artists/" + uInput + "/events?app_id=trilogy").then(function(res){
        
        //varibles storing date/time using moment.js
        var unFormDate = res.data[0].datetime;
        var momentTime = moment(unFormDate).format("| MM/DD/YYYY || h:mm:ss a |");

        //logging Venue-Name, City-Name and Date/Time
        console.log(uInput, "will be playing at:", res.data[0].venue.name);
        console.log("This is located in:", res.data[0].venue.city);
        console.log("The showing's start Date/Time:", momentTime);
        split()
   
    }).catch(function(err){
        
        console.log("Sorry, I couldnt find that..");
    
    });
    
}

//Spotify Search Function Using Axios GET Within 
function spotifySearch(fundata) {
    
  var spotify = new Spotify(keys.spotify);
  
  spotify.search({type: "track", query: fundata, limit: 1}, function(err,data){
      if(err){
          return console.log("Error:", err);
        
      }else{
        
        // console.log(data.tracks)
        console.log("Artist/Band:",data.tracks.items[0].artists[0].name);
        console.log("Album Title:", data.tracks.items[0].album.name);
        console.log("Track Title:", data.tracks.items[0].name);
        console.log("URL Song Preview:", data.tracks.items[0].preview_url);
        split();
      }
  });
}

//OMDB Search Function Using Axios GET Within
function movieSearch(fundata) {
    
    var uInput = fundata;

    axios.get("http://www.omdbapi.com/?t=" + uInput + "&y=&plot=short&apikey=trilogy").then(function(res){
    //res.data.Title/Year/imdbRating/Ratings[1].Value/Country/Language/Plot/Actors
     //console.log(res.data);
        console.log("-Title:", res.data.Title);
        console.log("-Release Date:", res.data.Year);
        console.log("-OMDB's Review Rating:", res.data.imdbRating + "/10");
        console.log("-Rotton Tomatoe's Review Rating:", res.data.Ratings[1].Value);
        console.log("-Language:", res.data.Language);
        console.log("Plot:", res.data.Plot);
        console.log("Actors:", res.data.Actors);
        split()
    });
}

//do-what-it-says Function Using fs Within
function run(fundata){

    fs.readFile("random.txt", "utf8", function(err, data){
        if(err){
            return console.log(err);
        }  
        
        var dataArr = data.split(",");
        // console.log(dataArr[0]);
        // console.log(dataArr[1]);           
        action1 = dataArr[0];
        fundata1 = dataArr[1];
        pick(action1, fundata1);
        
        action2 = dataArr[2];
        fundata2 = dataArr[3];
        pick(action2, fundata2);
        
       //no live concert during test
        action3 = dataArr[4];
        fundata3 = dataArr[5];
        pick(action3, fundata3);
        //^error fundata3 error:404 request fail...
    })

}
pick(action, fundata);

function split(){
    var split = "-----------------------------------------------------------------------------------";
    console.log(split);
}
