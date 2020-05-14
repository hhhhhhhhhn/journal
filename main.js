#!/usr/bin/env node

const fs = require("fs")
const getText = require("./editor")
const readline = require("readline")

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
]
const days = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
]

function prompt(question) {
	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	})
	return new Promise((resolve) => {
		rl.question(question, (answer) => {
			rl.close()
			resolve(answer)
		})
	})
}

function getDateString() {
	var date = new Date()
	var day = String(date.getDate())
	var month = months[date.getMonth()]
	var year = date.getFullYear()
	var dayOfTheWeek = days[date.getDay()]
	var dayEnding
	if (day == "1" || day == "21" || day == "31") dayEnding = "st"
	else if (day == "2" || day == "22") dayEnding = "nd"
	else if (day == "3" || day == "23") dayEnding = "rd"
	else dayEnding = "th"
	return `${month} ${day}${dayEnding}, ${year} (${dayOfTheWeek})`
}

async function main() {
	var journal = process.argv.slice(2).filter((arg) => arg != "set")[0] || ""
	var set = process.argv.includes("set")

	if (!fs.existsSync(__dirname + "/files.json")) {
		fs.writeFileSync(__dirname + "/files.json", "{}")
	}

	var files = require("./files.json")

	if (!files.hasOwnProperty(journal) || set) {
		var file =
			process.cwd() + "/" + (await prompt("Select a file to write to: "))
		files[journal] = file
		fs.writeFileSync(__dirname + "/files.json", JSON.stringify(files))
	} else {
		var file = files[journal]
	}

	var input = await getText()

	var fileContents = fs.readFileSync(file, "utf8")
	var date = getDateString()
	if (!fileContents.includes(date)) {
		fs.appendFileSync(file, `\n\n## ${date}`)
	}
	fs.appendFileSync(file, "\n\n" + input)
	process.exit()
}

main()
