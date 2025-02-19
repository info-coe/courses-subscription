const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("./db");
const {} = require("./queries");
const cors = require("cors");
const app = express();
app.use(cors("*"));
app.use(express.json());

// CORS middleware
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});
app.use(express.json());

let refreshTokens = [];

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});

app.delete("/logout", (req, res) => {
  const tokenToDelete = req.headers["token"];
  refreshTokens = refreshTokens.filter((token) => token !== tokenToDelete);
  res.sendStatus(204);
});

function generateAccessToken({ user }) {
  return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "24h",
  });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // console.log(err);
    if (err) return res.sendStatus(403);
    // console.log(req.user, user);
    req.user = user;
    next();
  });
}

app.get("/",(req,res)=>{
    db.query(`select * from courses`, (err, data) => {
        if(err){
            console.log(err);
            return res.json("Error");
        }
        if(data.length > 0){
            return res.json(data);
        }
        else{
            return res.json("Fail");
        }
    });
});

// db.query(largeinventorycontact, (err)=>{
//     if(err) throw err;
//     console.log(
//       "Database and tables created successfully"
//     );
// });

// app.post("/admin", (req, res) => {
//   const sql = adminLoginQuery;
//   db.query(sql, [req.body.username, req.body.password], (err, data) => {
//     if (err) {
//       return res.json("Error");
//     }
//     if (data.length > 0) {
//       const accessToken = generateAccessToken({ data });
//       // console.log(accessToken)
//       const refreshToken = jwt.sign({ data }, process.env.REFRESH_TOKEN_SECRET);
//       refreshTokens.push(refreshToken);
//       // const token = jwt.sign({data}, secretKey, { expiresIn: '1h' });
//       return res.json({ accessToken, data });
//       // return res.json(data);
//     } else {
//       return res.json("Fail");
//     }
//   });
// });

// app.get("/admin", authenticateToken, (req, res) => {
//   const sql = retrievingAdminQuery;
//   db.query(sql, (err, data) => {
//     if (err) {
//       return res.json("Error");
//     }
//     if (data.length > 0) {
//       return res.json(data);
//     } else {
//       return res.json("Fail");
//     }
//   });
// });

app.listen(process.env.REACT_APP_PORT, () => {
  console.log("listening");
});
