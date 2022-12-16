import express from 'express';
export const dashboardRouter = express.Router();

// dashboard home route
dashboardRouter.get('/*', (req, res) => {
  res.send('success');
  // const authenticatedUserId = localStorage.getItem('authenticatedUserId');
  // const siteBaseUrl = req.protocol + '://' + req.hostname;
  // if (authenticatedUserId) {
  //   const urlToRedirectTo = siteBaseUrl + '/dashboard/' + authenticatedUserId;
  //   res.redirect(urlToRedirectTo);
  // } else {
  //   res.redirect(siteBaseUrl);
  //}
});
