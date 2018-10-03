require("dotenv").config();
let axios = require("axios");
let inquirer = require("inquirer");
let Spotify = require('node-spotify-api');
let spotifyKeys = require("./keys.js");
let fs = require("fs");

inquirer.prompt([
{
    type: "list",
    name: "interest",
    message: "Hello! I'm Petal. What are you interested in today?",
    choices: ["Band or Artist Tour Dates", "Song Info", "Movie Details", "Just Do something!"]

}

]).then(function(userInterest){  
    
    fs.appendFile("log.txt", userInterest.interest + "\n", function(err) {
        if (err) {
          return console.log(err);
        }

        else {
            inputInquirer(userInterest.interest);        
        }
    });

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
                console.log("= = = = = = = = = = = = = =");
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
                console.log("");
                console.log("Artist: " + response.tracks.items[i].artists[0].name);    
                console.log("Song: " + response.tracks.items[i].name);
                console.log("Album: " + response.tracks.items[i].album.name);    
                console.log("Preview: " + response.tracks.items[i].preview_url);
                console.log("");
                console.log("= = = = = = = = = = = = = =");
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

function omdbThatFilm (movie) {

    axios.get("https://www.omdbapi.com/?t=" + movie + "&apikey=265b0607")
    .then(function(response) {
        
        if (response.data.Title != undefined) {
                console.log("");
                console.log("Title: " + response.data.Title);
                console.log("Year: " + response.data.Year);
                console.log(response.data.Ratings[0].Source + ": " + response.data.Ratings[0].Value);
                console.log(response.data.Ratings[1].Source + ": " + response.data.Ratings[1].Value);
                console.log("Country: " + response.data.Country);
                console.log("Language(s): " + response.data.Language);
                console.log("Plot Summary: " + response.data.Plot);
                console.log("Cast: " + response.data.Actors);
                console.log("= = = = = = = = = = = = = =");
                console.log("");
        }

        else {
            console.log("Sorry, I counldn't find any info on " + movie);

            inquirer.prompt([
                {
                    type: "confirm",
                    name: "tryagain",
                    message: "Try again?",
                }
                    
                ]).then(function(confirmresponse){
                    
                    if (confirmresponse.tryagain === true) {
                        let userInterest = "Movie Details";
                            inputInquirer(userInterest);
                } 
                
                    else {
                        console.log("All good! Come back and see me later if you need anything else.");
                }
                
             });
        }

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
            fs.appendFile("log.txt","Band/Artist: " + bandorartist.inputval + "\n" + "==================" + "\n", function(err) {

                if (err) {
                  return console.log(err);
                }
        
                else {
                    bandInTown(bandorartist.inputval);        
                }
            });    
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
                fs.appendFile("log.txt","Song: " + song.inputval + "\n" + "==================" + "\n", function(err) {
                    
                    if (err) {
                      return console.log(err);
                    }
            
                    else {
                        spotifyThatSong(song.inputval);        
                    }
            });
        });
    }

    else if (userInterest === "Movie Details") {
        inquirer.prompt([
            {
                type: "input",
                name: "inputval",
                message: "What movie are you interested in?",
            }
                
            ]).then(function(movie){

                fs.appendFile("log.txt","Movie: " + movie.inputval + "\n" + "==================" +"\n", function(err) {
                    
                    if (err) {
                      return console.log(err);
                    }
            
                    else {
                        omdbThatFilm(movie.inputval);        
                    }
                });    
            });    
    }

    else {

        fs.readFile("random.txt", "utf8", function(error, data) {

            // If the code experiences any errors it will log the error to the console.
                if (error) {
                return console.log(error);
                }

                let dataArr = data.split(",");
          
                if (dataArr[0] === "Song Info"){
                    spotifyThatSong(dataArr[1]);
                }

                else if (dataArr[0] === "Movie Details") {
                    omdbThatFilm(dataArr[1]);
                }

                else if (dataArr[0] === "Band or Artist Tour Dates") {
                    bandInTown(dataArr[1]);
                }
          });
    }
}

//To-Do List:
    // Implement Moment in the Bands in town function
