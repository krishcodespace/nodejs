const express = require('express');

const app = express();

app.use("/",(req, res) => {
  res.send("Hello this is my server you have got response from it.")
});

app.use("/test/k",(req, res) => {
  res.send("Hello this is my testkkkkkkk you have got response from it.")
});

app.use("/test",(req, res) => {
  res.send("Hello this is my test you have got response from it.")
});

app.listen(3676, () => {
    console.log('Server run Successfully on 3676')
});

