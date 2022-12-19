import express from 'express';
export const dashboardRouter = express.Router();

// dashboard home route
dashboardRouter.get('/*', (req, res) => {
  console.log('access granted');
  console.log(req.userIdAndEmail);
  res.sendStatus(200);
});
