
const Xray = require("x-ray"); //node scraper
const json2csv = require('json2csv'); //converts the scraped data into a CSV file
const request = require('request'); //required to make HTTP call
const fs = require('fs'); //required for creating files and folders
const url = 'http://shirts4mike.com/shirts.php'
const mySelector = '.products li'
const xray =  Xray();

const fields = ['Title', 'Price', 'ImageURL', 'URL', 'Time'] //json2csv options

xray(url, mySelector, [{   
    Title: xray('a@href', 'title'),
    Price: xray('a@href', '.price'),
    ImageURL: 'img@src',
    URL: 'a@href',
    Time: ""
  }])(function (err, shirtData) {
  
    const dir = "./data";

    if (!fs.existsSync(dir)){ //if data folder does not exist
        fs.mkdirSync(dir); //create folder
    }
    
    let today = new Date();
    let todayFormatted = today.toISOString().substr(0,10);
    let timeStamp = new Date().toString();

    console.log(shirtData)
    if (err) {
            // If http:/shirts4mike.com is down, an error message should appear in the console.
            // i.e. "There's been a 404 error. Cannot connect to the http://shirts4mike.com."
        console.error("There's been a 404 error. Cannot connect to http://shirts4mike.com.")
        fs.appendFile('scraper-error.log', timeStamp + ' ' + err.code + '\n', (err) => {
        if (err) throw err
        })
    } else {
        for (let i = 0; i <= 7; i++) {
        shirtData[i].Time = timeStamp;
        }//end for
        let shirtCsv = json2csv({ data: shirtData, fields: fields});
            // Save the info to a CSV file named for date created, e.g. 2017-05-08.csv
            // Info should be in the following order: Title, Price, ImageURL, URL, Time
            // Save CSV file inside 'data' folder
        fs.writeFile( dir + "/" + todayFormatted + '.csv', shirtCsv, function (err) {
        
        if (err) throw err
        console.log ('file saved to ' + todayFormatted + '.csv');
        }); // end writeFile
    }//end else
});//end function

