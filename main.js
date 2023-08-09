//Load required packages
const cheerio = require("cheerio");
const Knwl = require("knwl.js");
const prompt = require("prompt-sync")();

const blockedDomains = ["hotmail", "gmail", "outlook", "aol", "proton", "yahoo", "icloud"]; //Array of personal email providers to block

//Promps user to input email and extracts domain name
var inputEmail = prompt("Please enter the email that you would like to find the company of: ");
var indexOfAt = inputEmail.indexOf("@");
var indexOfDomainEnd = inputEmail.indexOf(".", indexOfAt);
var domain = inputEmail.slice(indexOfAt + 1, indexOfDomainEnd);
var domainSite = inputEmail.slice(indexOfAt + 1);

//Verifies that email isn't personal email based on blocked domains
if(blockedDomains.includes(domain))
{
    console.log("Personal email rejected. Please enter a business email.");
    return;
}

console.log("Company not found. Did you type the correct email?");  //Output if email completely unrecognised