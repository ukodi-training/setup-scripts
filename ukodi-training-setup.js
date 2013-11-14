var GitHubApi = require("github");

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    timeout: 5000
});

github.authenticate({
	type: "oauth",
	token: token
});

var operation = process.argv[2];
var number = process.argv[3];

if (operation == "delete") {
	deleteTrainingRepo(github, number);
}
if (operation == "create") {
	createTrainingRepo(github, number);
}
if (operation == "milestones") {
	createMilestones(github,number);
}

function createMilestones(github,number) {

	title = "Create visualisation";
	description = "Create map visualisation of global population data";
	var issues = [];
	var parts = {};
	parts.title = "Add map section to web page";
	parts.description = "A <section id='map'></section> needs to be added in the correct place in index.html";
	issues.push(parts);
	var parts = {};
	parts.title = "Add data";
	parts.description = "Add csv data for population to data directory";
	issues.push(parts);
	var parts = {};
	parts.title = "Update configuration file";
	parts.description = "Update configuration file to point to data and correct column";
	issues.push(parts);
	createMilestone(github,number,title,description,issues);
	
	title = "Add Interaction";
	description = "Add Interaction to map.";
	var issues = [];
	var parts = {};
	parts.title = "Add highlights to map";
	parts.description = "When hovering over a country, the map should emboss this country with a thick line to show the selection";
	issues.push(parts);
	var parts = {};
	parts.title = "Display name of country and population";
	parts.description = "When you hover over a country the name and population of the country should be shown somewhere on the page";
	issues.push(parts);
	createMilestone(github,number,title,description,issues);
}

function createIssues(github,number,milestone,issues) {
	for (i=0;i<issues.length;i++) {
		issue = issues[i];
		createIssue(github,number,milestone,issue.title,issue.description);
	}
}

function createMilestone(github,number,title,description,issues) {
	github.issues.createMilestone({
		user: "ukodi-training",
		repo: "ODP-Group" + number.toString(),
		title: title,
		description: description
	},
	function (err, res) {
		if (err) {
			console.log(err);
		} else {
			console.log("Created milestone " + title + " for ODP-Group" + number.toString());
			createIssues(github,number,res.number,issues);
		}
	});
}

function createIssue(github,number,milestone_num,title,description) {
	github.issues.create({
		user: "ukodi-training",
		repo: "ODP-Group" + number.toString(),
		title: title,
		body: description,
		milestone: milestone_num,
		labels: [ "enhancement" ]
	},
	function (err, res) {
		if (err) {
			console.log(err);
		} else {
			console.log("Created issue " + title + " for ODP-Group" + number.toString());
		}
	});
}

function deleteTrainingRepo(github, number) {
	github.repos.delete({
		user: "davetaz",
		repo: "ukodi-training/ODP-Group" + number.toString()
	},
	function (err, res) {
		if (err) {
			console.log(err);
		}
	}
	);
}


function createTrainingRepo(github, number) {
	github.repos.createFromOrg({
		org: "ukodi-training",
		name: "ODP-Group" + number.toString(),
		description: "Github repository for Open Data in Practice. Group " + number.toString(),
		private: false,
		has_issues: true
		},
		function (err, res) {
			if (err) {
				console.log(err);
			}
		}
	);
}
