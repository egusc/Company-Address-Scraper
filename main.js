//Load required packages
const cheerio = require("cheerio");
const Knwl = require("knwl.js");
const prompt = require("prompt-sync")();
const axios = require('axios')



const blockedDomains = ["hotmail", "gmail", "outlook", "aol", "proton", "yahoo", "icloud"]; //Array of personal email providers to block
let knwlInstance = new Knwl('english');

//Promps user to input email and extracts domain name
let inputEmail = prompt("Please enter the email that you would like to find the company of: ");
knwlInstance.init(inputEmail);
if((knwlInstance.get("emails")).length == 0)
{
  console.log("Invalid email entered.")
  return;
}

let indexOfAt = inputEmail.indexOf("@");
let indexOfDomainEnd = inputEmail.indexOf(".", indexOfAt);
let domain = inputEmail.slice(indexOfAt + 1, indexOfDomainEnd);
let domainSite = inputEmail.slice(indexOfAt + 1);

//Verifies that email isn't personal email based on blocked domains
if(blockedDomains.includes(domain))
{
    console.log("Personal email rejected. Please enter a business email.");
    return;
}

//Function to scrape data based on email address
async function scrapeData() {
  try {
    const { data } = await axios.get("https://www." + domainSite);  //Creates link from domain in email and gets http

    //Makes data ready to extract information from
    const $ = cheerio.load(data);
    let siteText = $.text();
    knwlInstance.init(siteText);

    //Gets emails from data and removed duplicates
    let scrapedEmails = knwlInstance.get('emails');
    let emails = [];
    for(const emailElement of scrapedEmails)
    {
      if(!emails.includes(emailElement["address"]))
      {
        emails.push(emailElement["address"]);
      }
    }
    
    //Print all information
    console.log("\nScraped emails:\n" + emails.join().replaceAll(",", "\n"));

  } catch (err) {
    console.error(err); //Informs user of error
  }
}
// Invoke the above function
scrapeData();


