//Load required packages
const cheerio = require("cheerio");
const Knwl = require("knwl.js");
const prompt = require("prompt-sync")();
const axios = require('axios')

//EXAMPLE CODE FOR FETCHING HTML AND EXTRACTING DATA
async function scrapeData() {
    try {
      // Fetch HTML of the page we want to scrape
      const { data } = await axios.get("https://www.khaoscontrol.com/");
      // Load HTML we fetched in the previous line
      const $ = cheerio.load(data);
      // Select all the list items in plainlist class
      let siteText = $.text();
      let knwlInstance = new Knwl('english');
      knwlInstance.init(siteText);
      let emails = knwlInstance.get('places');
      console.log(siteText);
      // Write countries array in countries.json file
    } catch (err) {
      console.error(err);
    }
  }
  // Invoke the above function
scrapeData();

const blockedDomains = ["hotmail", "gmail", "outlook", "aol", "proton", "yahoo", "icloud"]; //Array of personal email providers to block

//Promps user to input email and extracts domain name
let inputEmail = prompt("Please enter the email that you would like to find the company of: ");
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

console.log("Company not found. Did you type the correct email?");  //Output if email completely unrecognised
