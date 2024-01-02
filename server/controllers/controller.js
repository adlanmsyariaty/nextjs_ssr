const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Post } = require("../models");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
// const aws = require("aws-sdk");

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
      const { page, limit } = req.query;
      let filter = {
        where: {
          isActive: true,
        },
        order: [["createdAt", "DESC"]],
      };
      if (page && limit) {
        filter.page = parseInt(page);
        filter.limit = parseInt(limit);
      }
      const posts = await Post.findAndCountAll(filter);

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
          isActive: true,
        },
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
  static async createUploadPresignedUrl(req, res, next) {
    try {
      const accessKeyId = process.env.AWS_ACCESS_KEY;
      const secretAccessKey = process.env.AWS_SECRET_KEY;
      const bucket = process.env.AWS_BUCKET;
      const region = process.env.AWS_REGION;
      const key = new Date().getTime() + ".jpg";
      const client = new S3Client({
        region,
        credentials: {
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey,
        },
      });
      const command = new PutObjectCommand({ Bucket: bucket, Key: key });

      const presignedUrl = await getSignedUrl(client, command, {
        expiresIn: 3600,
      });

      res.status(200).json({
        success: true,
        data: {
          url: presignedUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
