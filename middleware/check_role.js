const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.loginUser.role;
    if (allowedRoles.includes(userRole)) {
      next();
    } else {
      return res.status(403).json({
        message: "Ooooops! Akses ditolak",
      });
    }
  };
};

module.exports = { checkRole };
