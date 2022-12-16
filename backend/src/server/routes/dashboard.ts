import express from 'express';
export const dashboardRouter = express.Router();

// dashboard home route
dashboardRouter.get('/*', (req, res) => {
  res.sendStatus(200);
});
