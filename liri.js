require("dotenv").config();
let axios = require("axios");
let inquirer = require("inquirer");


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
    axios.get("https://rest.bandsintown.com/artists/" + bandorartist + "/events?app_id=codingbootcamp").then(
    function(response) {

            for (i = 0; i < response.data.length; i++) {
                console.log("");
                console.log(response.data[i].venue.name);
                console.log(response.data[i].venue.city + " " + response.data[i].venue.region + " " + response.data[i].venue.country);
                console.log(response.data[i].datetime);
                console.log("");
            }
    });
}

//Take
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
}

