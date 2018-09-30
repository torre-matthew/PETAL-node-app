require("dotenv").config();
let axios = require("axios");
let inquirer = require("inquirer");
let Spotify = require('node-spotify-api');
let spotifyKeys = require("./keys.js");
    console.log(spotifyKeys);
    console.log(spotifyKeys.spotify.id);




inquirer.prompt([
{
    type: "list",
    name: "interest",
    message: "What are you interested in today?",
    choices: ["Band or Artist Tour Dates", "Song Info", "Movie Details", "Just Do something!"]

}

]).then(function(userInterest){   
    inputInquirer(userInterest.interest);
});


function bandInTown(bandorartist) {
    axios.get("https://rest.bandsintown.com/artists/" + bandorartist + "/events?app_id=codingbootcamp")
    .then(function(response) {

        if (response.data.length > 0) {

            for (i = 0; i < response.data.length; i++) {
                console.log("");
                console.log(bandorartist + " will be performing at " + response.data[i].venue.name);
                console.log(response.data[i].venue.city + " " + response.data[i].venue.region + " " + response.data[i].venue.country);
                console.log("Show starts at " + response.data[i].datetime);
                console.log("");
            }
        }

        else {
            console.log("Sorry we couldn't find any shows for " + bandorartist);

            inquirer.prompt([
                {
                    type: "confirm",
                    name: "tryagain",
                    message: "Try again?",
                }
                    
                ]).then(function(confirmresponse){
                    
                    if (confirmresponse.tryagain === true) {
                        let userInterest = "Band or Artist Tour Dates";
                            inputInquirer(userInterest);
                } 
                
                    else {
                        console.log("All good! Come back and see me later if you need anything else.");
                }
                
                }); 

        }
    });
}

function spotifyThatSong (song) {  

 
let spotify = new Spotify({
  id: spotifyKeys.spotify.id,
  secret: spotifyKeys.spotify.secret
});

    spotify.search({ type: 'track', query: song })
    .then(function(response) {
        
        if (response.tracks.items.length > 0) {
            for (let i = 0; i < response.tracks.items.length; i++) {    
                console.log("Artist: " + response.tracks.items[i].artists[0].name);    
                console.log("Song: " + response.tracks.items[i].name);
                console.log("Album: " + response.tracks.items[i].album.name);    
                console.log("Preview: " + response.tracks.items[i].preview_url);
                console.log("===========================================");
            }       
        }

        else {

            console.log("Sorry we couldn't find any results for " + song);

            inquirer.prompt([
                {
                    type: "confirm",
                    name: "tryagain",
                    message: "Try again?",
                }
                    
                ]).then(function(confirmresponse){
                    
                    if (confirmresponse.tryagain === true) {
                        let userInterest = "Song Info";
                            inputInquirer(userInterest);
                } 
                
                    else {
                        console.log("All good! Come back and see me later if you need anything else.");
                }
                
             });
            
        }
    })
    .catch(function(err) {
            console.log(err);
    
    });

}

//Take the users response from the initial inquirer prompt to determine what they are prompted with next
function inputInquirer (userInterest) {
    if (userInterest === "Band or Artist Tour Dates") {
    
    inquirer.prompt([
        {
            type: "input",
            name: "inputval",
            message: "What Artist or Band are you looking for?",
        }
            
        ]).then(function(bandorartist){
                bandInTown(bandorartist.inputval);
        
        }); 

    }

    else if (userInterest === "Song Info") {
        inquirer.prompt([
            {
                type: "input",
                name: "inputval",
                message: "What song are you looking for?",
            }
                
            ]).then(function(song){
                    spotifyThatSong(song.inputval);
            }); 

    }

    else if (userInterest === "Movie Details") {
        console.log("You need to hook up the OMDB portion of this my guy.");

    }

    else {
        console.log("You need to hook up the JUST DO IT portion of this my guy.");
    }
}

//To-Do List:
    // Implement Moment in the Bands in town function
