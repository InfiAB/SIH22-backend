const express = require("express");
const multer = require('multer');
const mongoose = require('mongoose');
var bodyParser = require("body-parser");
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");


const URI = "mongodb+srv://AnshGupta231001:0CXFL0VVdXdRM7vf@images.xpf71.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(URI, { useNewUrlParser: true });

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/images');
    },

    filename: function (req, file, callback) {
        callback(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
})

const imgSchema = {
    _id: String,
    image: String,
    format: String
};

const Image = mongoose.model("Image", imgSchema);

app
    .route("/main")
    .get((req, res) => {
        res.render("index")
    })
    .post(upload.single('image'), (req, res) => {
        var img = fs.readFileSync(req.file.path);
        var encoded_image = img.toString("base64");
        const newImage = new Image({
            _id: req.body.id,
            image: new Buffer(encoded_image, "base64"),
            format: req.file.mimetype
        });
        newImage.save((err) => {
            if (err) console.log(err);
            else res.send("Success");
        });
    })

app.listen(3000, () => {
    console.log("Server is running");
})

//AnshGupta231001
//0CXFL0VVdXdRM7vf