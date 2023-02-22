const express = require("express");
const routes = require("./routes");
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

app.use(require('./routes'));


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SocialNetworkApi', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.set('debug', true);

app.listen(PORT, () => console.log(`Server Running On Port: ${PORT}`));