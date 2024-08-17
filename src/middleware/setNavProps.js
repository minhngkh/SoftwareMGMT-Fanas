exports.setCurrentNav = (currentNav) => {
  return (_, res, next) => {
    res.locals.currentNav = currentNav;
    next();
  };
};
