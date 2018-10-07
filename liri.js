require("dotenv").config();
let axios = require("axios");
let inquirer = require("inquirer");
let Spotify = require('node-spotify-api');
let spotifyKeys = require("./keys.js");
let fs = require("fs");
let moment = require("moment");

// Inquirer prompt to be presented to the user first
inquirer.prompt([
{
    type: "list",
    name: "interest",
    message: "Hello! I'm Petal. What are you interested in today?",
    choices: ["Band or Artist Tour Dates", "Song Info", "Movie Details", "Nothing in particular. Surprise Me!"]

}

]).then(function(userInterest){  
// Log the users choice to the log.txt file.
    fs.appendFile("log.txt", userInterest.interest + "\n", function(err) {
        if (err) {
          return console.log(err);
        }

        else {
// Call the inputInquirer function with the users choice passed as a param so that the correct that the correct experience is delivered. 
            inputInquirer(userInterest.interest);        
        }
    });

});


function bandInTown(bandorartist) {
    axios.get("https://rest.bandsintown.com/artists/" + bandorartist + "/events?app_id=codingbootcamp")
    .then(function(response) {
// The the users input (bandorartist) coming from the inputInquirerer has a match from the BandsInTown API, print data to the console
        if (response.data.length > 0) {

            for (i = 0; i < response.data.length; i++) {
                console.log("");
                console.log(bandorartist + " will be performing at " + response.data[i].venue.name);
                console.log(response.data[i].venue.city + " " + response.data[i].venue.region + " " + response.data[i].venue.country);
                console.log("Show starts at " + moment(response.data[i].datetime).format("dddd, MMMM Do YYYY, h:mm:ss a"));
                console.log("");
                console.log("= = = = = = = = = = = = = =");
            }
        }
// If the users input coming from teh inputInquirer function has no match, use inquirer again to ask the user if they'd like to try again.
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
// If the user does want to search again make sure that the correct param is passed back into the inputInquirer function.
                        let userInterest = "Band or Artist Tour Dates";
                            inputInquirer(userInterest);
                } 
// If the user doesn't want to search again after a failed attempt, give them a kind goodbye.
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
// If the users song choice has results from the spotify API, print the results to the page
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
// If the users song choice being passed by the inputInquirer function doesn't return any data from the spotify API run another inquirer to ask if they'd like to try again.
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
                    console.log("");
                    console.log("I love this song and think you will too. Check it out!");
                    spotifyThatSong(dataArr[1]);
                }

                else if (dataArr[0] === "Movie Details") {
                    console.log("");
                    console.log("If you're in the mood for a movie, you should check this one out!");
                    omdbThatFilm(dataArr[1]);
                }

                else if (dataArr[0] === "Band or Artist Tour Dates") {
                    console.log("");
                    console.log("Maybe " + dataArr[1] + " will be performing in your town soon?");
                    bandInTown(dataArr[1]);
                }
          });
    }
}
