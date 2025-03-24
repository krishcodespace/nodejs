const express = require('express');

const app = express();

app.get('/demo/:id', (req, res) => {
  res.send("this is get send api call")
})

// you also use regex as route
app.get('/*a/' ,(req, res) => {
  res.send({"regexValue":"this is reges example"})
})

app.get('/a+bc+d/' ,(req, res) => {
  res.send({"/a+bc+d/":"this is reges example"})
})

app.get('/ab?d/' ,(req, res) => {
  res.send({"/ab?d":"this is reges example"})
})

app.use("/hello",(req, res) => {
  res.send("you got response from hello route")
});

// how get query from request
app.get('/users', (req, res) => {
  console.log(req.query);
  res.send("show exmpale how we get query form request")
})

// how get params from request
app.get('/users/:id', (req, res) => {
  console.log(req.params);
  res.send("show exmpale how we get params form request")
})

// app.use("/",(req, res) => {
//   res.send("Hello this is my server you have got response from it.")
// });

app.listen(3676, () => {
    console.log('Server run Successfully on 3676')
});

