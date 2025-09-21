const express = require('express');
const app = express();
const userModel = require("./models/user")
const bycrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser')
const path = require('path');


app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get("/", (req, res) => {
    res.render("visu");
})


app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/registration", (req, res) => {
    res.render("registration");

})

app.get("/about", (req, res) => {
    res.render("about");
})
app.get("/services", (req, res) => {
    res.render("services");
})
app.get("/services/:place", (req, res) => {
    res.render(`providedServices/rumtekMonastery`);
})

app.get("/services/rumtekMonastery/about", (req, res) => {
    res.render("providedServices/rumtekMonasteryAbout/about");
})
app.get("/services/rumtekMonastery/about/food", (req, res) => {
    res.render("providedServices/rumtekMonasteryAbout/food");
})
app.get("/services/rumtekMonastery/about/guide", (req, res) => {
    res.render("providedServices/rumtekMonasteryAbout/guide");
})
app.get("/services/rumtekMonastery/about/hotel", (req, res) => {
    res.render("providedServices/rumtekMonasteryAbout/hotel");
})

app.get("/home", isLoggedIn, async (req, res) => {
    res.render("home");
})

app.post("/registerUser", async (req, res) => {

    let { email, password, name, country } = req.body

    console.log(req.body)
    let user = await userModel.findOne({ email })
    if (user) return res.status(500).redirect("/login")

    bycrypt.genSalt(10, (err, salt) => {
        bycrypt.hash(password, salt, async (err, hash) => {
            let user = await userModel.create({
                name,
                email,
                country,
                password: hash
            });

            let token = jwt.sign({ email: email, userid: user._id }, "shhh");
            res.cookie("token", token)
            res.redirect("/login")

        })
    })
})

app.post("/login", isLoggedIn, async (req, res) => {
    let { email, password } = req.body

    let user = await userModel.findOne({ email })
    if (!user) return res.status(500).send("something went wrong");

    bycrypt.compare(password, user.password, function (err, result) {
        if (result) {
            let token = jwt.sign({ email: email, userid: user._id }, "shhh");
            res.cookie("token", token)
            res.status(200).redirect("/home")

        } else {
            res.redirect("/registration")
        }


    })
})

app.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.redirect("/login")
})

function isLoggedIn(req, res, next) {
    if (req.cookies.token == "") res.redirect("/login")
    else {
        let data = jwt.verify(req.cookies.token, "shhh")
        req.user = data
        next();
    }
}

app.listen(3000, () => {
    console.log('running')
});
