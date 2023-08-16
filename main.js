//Load required packages
const cheerio = require("cheerio");
const Knwl = require("knwl.js");
const prompt = require("prompt-sync")();
const axios = require('axios')

const blockedDomains = ["hotmail", "gmail", "outlook", "aol", "proton", "yahoo", "icloud"]; //Array of personal email providers to block
let knwlInstance = new Knwl('english'); //Initialise Knwl to english language setting

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
    const response = await axios.get("https://www." + domainSite);  //Creates link from domain in email and gets http
    const html = response.data;
    
    //Makes data ready to extract information from
    const $ = cheerio.load(html);
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

    //Get phone numbers from data and remove duplicates
    const scrapedPhones = [...siteText.matchAll(/((\+44\s?)|\(?0\)?)\d\d\d\s?\d\s?\d\d\s?\d\d\d\d/g)];  //Regex to find common phone number formats
    let phones = [];

    for(const phoneElement of scrapedPhones)
    {
      if(!phones.includes(phoneElement[0].replaceAll(" ", "")))   //Removes spaces to reduce duplicate phone numbers with different spacing
      {
        phones.push(phoneElement[0].replaceAll(" ", ""));
      }
    }

    //Get post codes from data and remove duplicates
    const scrapedAddresses = [...siteText.matchAll(/[A-Za-z][A-Za-z]?\d\d?\s\d[A-Za-z][A-Za-z]/g)]; //Regex to find postcodes
    let addresses = [];

    for(const postCodeElement of scrapedAddresses)
    {
      if(!addresses.includes($('p:contains("' + postCodeElement[0] + '")').first().text()))
      {
        addresses.push($('p:contains("' + postCodeElement[0] + '")').first().text());
      }
    }

    //Print all information scraped and notifies if no information was found
    if(emails.length == 0)
    {
      console.log("\nNo emails found\n");
    } else{
      console.log("\nScraped emails:\n" + emails.join().replaceAll(",", "\n"));
    }

    if(phones.length == 0)
    {
      console.log("\nNo phone numbers found\n");
    } else{
      console.log("\nScraped phone numbers:\n" + phones.join().replaceAll(",", "\n"));
    }

    if(addresses.length == 0)
    {
      console.log("\nNo post codes found\n");
    } else{
      console.log("\nScraped addresses:\n" + addresses.join().replaceAll(",", "\n"));
    }
  } catch (err) {
    //Inform users of errors
    console.log("Error encountered while searching for domain. There may have been an error in the email, or the internet connection.");
    console.error(err);
  }
}
// Invoke the above function
scrapeData();


