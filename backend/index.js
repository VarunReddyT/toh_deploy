const express = require('express');
const router = express.Router();
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const multer = require('multer');
const TollPlaza = require('../models/TollPlazaSch');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

// ^ defining port
const port = 4000;

// ^ CORS 
app.use(cors({
  origin: 'https://toh-deploy-front.vercel.app/',
  methods: ['GET', 'POST'],
  credentials: true,
}));

// & MongoDB connection
// console.log(process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URI)
// mongoose.connect('mongodb://127.0.0.1:27017/myFirst')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// ^ Express config for parsing request body as JSON
app.use(express.urlencoded({ extended: true }));  
app.use(router);
// app.use(express.static("build"));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// router.get('/guestDet' ,guestDetails);
// router.post('/guestUp', guestUpload);
// router.get('/checkRecords', tollCheckRecords);
// router.post('/login', tollLogin);
// router.get('/logout', tollLogout);
// router.post('/tollupload', tollUpload);
// router.get('/getIm', tollChRcImages);
// router.get('/stats', statistics);
// router.post('/feedback',feedback);


app.use(cookieParser());

// & Multer config for TollUpload
const TollUp = multer.memoryStorage();
const Tollupload = multer({ storage: TollUp, limits: { fieldSize: 25 * 1024 * 1024 } })

// & JWT
const createToken = (id) => {
    return jwt.sign({ id }, 'TiresOnHighway', { expiresIn: 60 * 60 * 1000 });}

// ! Login Route
app.post('/login', Tollupload.any(), async (req, res) => {
    const { toll, password } = req.body;
    try {
      const user = await TollPlaza.findOne({ username: toll });
      console.log(user);
      if (user) {
        try {
          const passMatch = await bcrypt.compare(password, user.password);
          if (passMatch) {
            console.log("Password Matched");
            try {
              const token = createToken(user._id);
              // console.log(token);
              res.cookie('tollLogin', token, {  maxAge: 60 * 60 * 1000 });
              // sameSite: 'None'  -> for CORS purposes and controlling the cookie to be sent only to the same origin
              // secure : true -> is not recommended for development purposes as we can't access a cookie using document.cookie in the client side 
              // path: '/' -> to make the cookie available to all the routes
              // domain: `http://${req.hostname}:3000`} -> to make the cookie available to all the subdomains
              console.log("Success");
              res.send("Success");
            } catch (err) {
              console.log(err);
            }
          }
          else {
            console.log("Not Allowed");
            res.send("Not Allowed");
          }
        }
        catch (err) {
          console.log(err);
        }
      }
    }
    catch (err) {
      console.log(err);
    }
  });

// ^ Server listening on port 4000
app.listen(port, () => console.log(`Server is listening on port ${port}`));