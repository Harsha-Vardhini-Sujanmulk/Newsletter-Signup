// js hint ES version - 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const path = require("path");
const https = require("https");
const app = express();

app.use(express.static("Public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname + "/signup.html"));
});
app.post("/", (req, res) => {
	const firstName = req.body.fName;
	const lastName = req.body.lName;
	const email = req.body.email;

	const data = {
		members: [
			{
				email_address: email,
				stauts: "subscribed",
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName,
				},
			},
		],
	};

	const jsonData = JSON.stringify(data);
	const url = "https://us14.api.mailchimp.com/3.0/lists/9d10dac2bd";
	const options = {
		method: "POST",
		auth: "honey: e3ef62f698c54e64c7a37ae6bf6007ff-us14",
	};

	const request = https.request(url, options, (response) => {
		if (response.statusCode === 200) {
			res.sendFile(__dirname + "/success.html");
		} else {
			res.sendFile(__dirname + "/failure.html");
		}
		response.on("data", (data) => {
			console.log(JSON.parse(data));
		});
	});

	request.write(jsonData);
	request.end();
});

app.post("/failure", (req, res) => {
	res.redirect("/");
});
app.listen(process.env.PORT || 3000, () => {
	console.log("Server is running on port 3000");
});

// API KEY 56a085b401e25c2a136a525d7fb7ecc7-us21
// AUIDENCE ID 9d10dac2bd
