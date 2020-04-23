#!/usr/bin/env node

const prompt = require("syncprompt")
const fs = require("fs")

const months = ["January","February","March","April","May","June","July",
"August","September","October","November","December"]
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
"Saturday"]

function getInput(){
    var output = "" 
    do{
        var input = prompt()
        output += input.replace("EOF", "") + "\n"
    } while(!input.includes("EOF"))
    return output
}

function getDateString(){
    var date = new Date()
    var day = String(date.getDate())
    var month = months[date.getMonth()]
    var year = date.getFullYear()
    var dayOfTheWeek = days[date.getDay()]
    var dayEnding
    if(day == "1" || day == "21" ||  day == "31") dayEnding = "st"
    else if(day == "2" || day == "22") dayEnding = "nd"
    else if(day == "3" || day == "23") dayEnding = "rd"
    else dayEnding = "th"
    return `${month} ${day}${dayEnding}, ${year} (${dayOfTheWeek})`
}

if(!fs.existsSync(__dirname + "/file.txt") || process.argv.includes("set")){
    fs.writeFileSync(__dirname + "/file.txt",
    process.cwd() + "/" + prompt("Select file to write to: "))
}

var file = fs.readFileSync(__dirname + "/file.txt", "utf8")
var input = getInput()

var fileContents = fs.readFileSync(file, "utf8")
var date = getDateString()
if(!fileContents.includes(date)){
    fs.appendFileSync(file, `\n\n## ${date}`)
}
fs.appendFileSync(file, "\n" + input)