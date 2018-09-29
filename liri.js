require("dotenv").config();
let axios = require("axios");


function bandInTown() {
    axios.get("https://rest.bandsintown.com/artists/" + process.argv[3] + "/events?app_id=codingbootcamp").then(
    function(response) {

            for (i = 0; i < 5; i++) {
                console.log("");
                console.log(response.data[i].venue.name);
                console.log(response.data[i].venue.city + " " + response.data[i].venue.region + " " + response.data[i].venue.country);
                console.log(response.data[i].datetime);
                console.log("");
            }

    });
}

if (process.argv[2] === "concert-this") {
    bandInTown();
}

