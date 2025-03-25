const adminAuth = (req, res, next) => {
    const token = "enowifeufisniehfwjzIOE"
    const isAuthenticate = token === "enowifeufisniehfwjzIOE";
    if(isAuthenticate) {
      next();
    } else {
      res.status(404).send("you are not admin");
    }
}

module.exports = adminAuth;