// Creating routes for rendering homepage with user/moderator interactions

// TODO: much of this needs to be edited to fit our project

const router = require('express').Router();
const { Moderator, User, UserPost, ModeratorResponse, Comment } = require('../models');
const withAuth = require('../utils/auth');


router.get('/', async (req, res) => {
  try {
    // Get all posts and JOIN with user data
    const userPostData = await UserPost.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: ModeratorResponse,
          // TODO: attributes need to be updated to fit the ModeratorResponse model
          attributes: ['id', 'content', 'post_id', 'user_id', 'date_created'],
          include: {
            model: Moderator,
            attributes: ['name']
          }
        },
        // * I'm not sure if this is the way to include Comments from both Users and Moderators 
        // * For the MVP, it might be best if we just allow Users to Comment
        {
          model: Comment,
          attributes: ['name'],
          include: {
            model: User, 
            attributes: ['name']
          }
        },
        {
          model: Comment,
          attributes: ['name'],
          include: {
            model: Moderator, 
            attributes: ['name']
          }
        }
      ],
    });

    // Serialize data so the template can read it
    const posts = userPostData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      ...posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/project/:id', async (req, res) => {
  try {
    const userPostData = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const project = userPostData.get({ plain: true });

    res.render('project', {
      ...project,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Project }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;
