const { Post } = require("../models");

class Controller {
  static async createPost(req, res, next) {
    try {
      const { username, message } = req.body;
      const newPost = await Post.create({
        username,
        message,
        createdBy: username,
      });
      res.status(201).json({
        success: true,
        data: {
          id: newPost.id,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  static async getAllPost(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const posts = await Post.findAndCountAll({
        where: {
          isActive: true,
        },
        order: [["createdAt", "DESC"]],
        offset: (page - 1) * limit,
        limit,
      });

      let postResp = posts.rows.map((post) => post.dataValues);

      res.status(200).json({
        success: true,
        data: {
          items: postResp,
          page: page,
          totalPage: Math.ceil(posts.count / limit),
          totalItem: posts.count,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  static async deletePost(req, res, next) {
    try {
      const postId = req.params.id;
      const postData = await Post.findOne({
        where: {
          id: postId,
          isActive: true
        }
      });

      if (!postData) throw { name: "POST_NOT_FOUND" };

      await Post.update(
        { isActive: false },
        {
          where: {
            id: postId,
          },
          returning: false,
        }
      );

      res.status(200).json({
        success: true,
        data: {
          id: postId,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
