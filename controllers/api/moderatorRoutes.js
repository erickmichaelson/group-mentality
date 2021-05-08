//* done for now  


const router = require('express').Router();
const { Moderator, ApprovedUserPost, UserPost } = require('../../models');
const modAuth = require('../../utils/modAuth');
console.log(modAuth);
const { route } = require('./userRoutes');

// route for '/api/moderator/'
//* this isn't necessary for MVP
// creates new Moderator 
// router.post('/', withAuth, async (req, res) => {
//   try {
//     const newModerator = await Moderator.create({
//       ...req.body,
//       user_id: req.session.user_id,
//     });

//     res.status(200).json(newModerator);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// });

// route for '/api/moderator/:id'
//* not necessary for MVP
// deletes Moderator by id
// router.delete('/:id', withAuth, async (req, res) => {
//   try {
//     const moderatorData = await Moderator.destroy({
//       where: {
//         id: req.params.id,
//         user_id: req.session.user_id,
//       },
//     });

//     if (!moderatorData) {
//       res.status(404).json({ message: 'No moderator found with this id!' });
//       return;
//     }

//     res.status(200).json(moderatorData);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

//* this works!
// routing for creating new ApprovedUserPost
router.post('/', modAuth, async (req, res) => {
  console.log('=====================')
  console.log(req.body);
  try {
    const newApprovedUserPost = await ApprovedUserPost.create({
      postTitle: req.body.postTitle,
      postContent: req.body.postContent,
      responseContent: req.body.responseContent,
      moderatorId: req.session.moderatorId
    });

    res.status(200).json(newApprovedUserPost);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  };
});

//* this works (i think?)
// route for '/api/users/login'
router.post('/login', async (req, res) => {
  try {
    const moderatorData = await Moderator.findOne({ where: { email: req.body.email }});

    if (!moderatorData) {
      res
        .status(400)
        .json({ message: 'Incorrect moderator email or password, please try again.'})
      return;
    };

    const validModeratorPassword = await moderatorData.checkPassword(req.body.password);

    if (!validModeratorPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect moderator email or password, please try again' });
        return;
    }

      req.session.save(() => {
        req.session.moderatorId = moderatorData.id;
        req.session.logged_in = true;
        req.session.logged_in_moderator = true;
        
        res.json({ moderator: moderatorData, message: 'Welcome, moderator. You are now logged in!' });
      });

  } catch (err) {
    res.status(400).json(err);
  }
});

//* this works!
// routing for deleting user posts 
router.delete('/:id', modAuth, async (req, res) => {
  console.log('===========');
  console.log(req);
  try {
    const userPostData = await UserPost.destroy({
      where: {
        id: req.params.id,
        //* i'm not sure if this is correct
        // moderatorId: req.session.moderatorId
      }
    });

    if (!userPostData) {
      res.status(404).json({ message: 'No user post found with this id!' });
      return;
    };

    res.status(200).json(userPostData);
  } catch (err) {
    console.log('======== ERROR ===========');
    console.log(err);
    res.status(500).json(err);
  };
});

// deleting user/response posts on homepage
// not for MVP

// deleting comments
// not for MVP

module.exports = router;
