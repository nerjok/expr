const requireLogin = require('../middlewares/requireLogin');
const mongoose = require('mongoose');
const User = mongoose.model('users');
const pagOptions = {
  page: 1,
  limit: 1,
  customLabels: {
    docs: 'users'
  }
};


module.exports = (app) => {
  app.get('/api/users/:user_id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.user_id)) {
      res.send({error: 'Not valid userID'});
      return;
    }

    const user = await User.findById(req.params.user_id)
    res.send(user)
  });

  app.get('/api/users', async (req, res, next) => {
    const page = req.query.page || 1
    const users = await User.paginate({}, {...pagOptions, page})
    /*
    try {
      //
      await User.paginate({}, {...pagOptions, page}).then(function(result) {
        res.send(result)
        return result;   
    }, function(err) {
      return err;   
  })
      res.send({none: 'none'})
    } catch (err) {
      next(err);
    }
*/
    
    
    res.send(users)
  });

}