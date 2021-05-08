const modAuth = (req, res, next) => {
  // If the user is not logged in, redirect the request to the login route
  if (!req.session.logged_in_moderator) {
    res.redirect('/login');
  } else {
      next();
  }
};

module.exports = modAuth;
