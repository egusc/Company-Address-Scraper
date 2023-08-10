//Load required packages
const cheerio = require("cheerio");
const Knwl = require("knwl.js");
const prompt = require("prompt-sync")();
const https = require('node:https');


const httpdoc = [];     //Array storing HTTP code

//EXAMPLE CODE - TRIES TO GET HTML FROM WEBSITE
//Here is where I encounter 403 errors
https.get('https://www.bbc.co.uk/', (res) => {

  res.on('data', (d) => {
    httpdoc.push(d);
  });
  res.on('end', (d) => {
    console.log(httpdoc.join());
  });
}).on('error', (e) => {
  console.error(e);
}); 


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
