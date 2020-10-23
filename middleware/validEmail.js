module.exports = (req, res, next) => {
  const {username, email, password} = req.body;

  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  if (![username, email, password].every(Boolean)) {
    return res.status(401).json("Missing Credentials");
  } else if (!validEmail(email)) {
    return res.status(401).json("Invalid Email");
  }

  next();
}
