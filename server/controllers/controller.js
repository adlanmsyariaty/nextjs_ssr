const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { Post } = require("../models");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
// const aws = require("aws-sdk");

class Controller {
  static async createPost(req, res, next) {
    try {
      const { username, message, filePath } = req.body;
      const newPost = await Post.create({
        username,
        message,
        imageUrl: filePath,
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

      const accessKeyId = process.env.AWS_ACCESS_KEY;
      const secretAccessKey = process.env.AWS_SECRET_KEY;
      const bucket = process.env.AWS_BUCKET;
      const region = process.env.AWS_REGION;
      const client = new S3Client({
        region,
        credentials: {
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey,
        },
      });

      let postResp = [];
      for (let i = 0; i < posts.rows.length; i++) {
        const element = posts.rows[i];
        if (element.imageUrl) {
          const command = new GetObjectCommand({
            Bucket: bucket,
            Key: element.imageUrl,
          });
          const presignedUrl = await getSignedUrl(client, command, {
            expiresIn: 3600,
          });
          element.imageUrl = presignedUrl;
        }
        postResp.push(element);
      }

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
  static async updatePost(req, res, next) {
    try {
      const postId = req.params.id;
      const { message } = req.body;
      console.log(message);
      const postData = await Post.findOne({
        where: {
          id: postId,
          isActive: true,
        },
      });

      if (!postData) throw { name: "POST_NOT_FOUND" };

      await Post.update(
        { message: message },
        {
          where: {
            id: postId,
          },
          returning: false,
        }
      );
      console.log("postId", postId);
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
      const { fileType } = req.body;
      const accessKeyId = process.env.AWS_ACCESS_KEY;
      const secretAccessKey = process.env.AWS_SECRET_KEY;
      const bucket = process.env.AWS_BUCKET;
      const region = process.env.AWS_REGION;
      const key = new Date().getTime() + "." + fileType.split("/")[1];
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
          filePath: key,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
