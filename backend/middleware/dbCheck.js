export const checkDbConnection = (req, res, next) => {
  if (!global.dbConnected) {
    return res.status(503).json({
      message: 'Database is offline. Auth, History logs, and saving are unavailable. Please configure MONGO_URI in your backend/.env and restart.',
    });
  }
  next();
};
