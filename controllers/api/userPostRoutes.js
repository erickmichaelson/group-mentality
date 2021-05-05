// routing for users creating posts for moderator review, 
// NO DELETE FOR USER 
// deleting should be controlled by moderator
//* done for now

const router = require('express').Router();
const { UserPost } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await UserPost.create({
      ...req.body,
      userId: req.session.userId,
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

// TODO: this should be something only Moderators can do (withAuth needs to be changed)
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const newPost = await UserPost.destroy({
      where: {
        id: req.params.id,
        userId: req.session.userId,
      },
    });

    if (!newPost) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
