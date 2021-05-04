// this file creates our database 
// this shouldn't be edited too much; only to work well with other seed files 

// Anywhere where it says "Project", we'll likely want to update it to say "Moderator" 
const sequelize = require('../config/connection');
const { User, Moderator, Comment, ModeratorResponse, UserPost, ApprovedUserPost } = require('../models');

const userData = require('./userData.json');
const moderatorData = require('./moderatorData.json');
const commentData = require('./commentData.json');
const moderatorresponseData = require('./moderatorresponseData.json');
const userpostData = require('./userpostData.json');
const approveduserpostData = require('./approveduserpostData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });


  for (const user of userData) {
    await User.create({
      ...user,
    });
  }

  for (const moderator of moderatorData) {
    await Moderator.create({
      ...moderator,
    });
  }

  for (const comment of commentData) {
    await Comment.create({
      ...comment,
    });
  }

  for (const moderatorresponse of moderatorresponseData) {
    await ModeratorResponse.create({
      ...moderatorresponse,
    });
  }

  for (const userpost of userpostData) {
    await UserPost.create({
      ...userpost,
    });
  }

  for (const approveduserpost of approveduserpostData) {
    await ApprovedUserPost.create({
      ...approveduserpost,
    });
  }

  process.exit(0);
};

seedDatabase();
