const passport = require("passport");

const loginUser = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("login", { title: "Login",
    error: req.flash("error") || null });
};

const loginPost = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true, // Enable flash messages for failures
});

module.exports = {
  loginPost,
  loginUser,
};
