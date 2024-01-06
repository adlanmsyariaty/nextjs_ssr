const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { Post, User, sequelize } = require("../models");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { comparePasswordWithHash } = require("../helpers/bcrypt");
const { tokenGenerator } = require("../helpers/jwt");
const { generateOtpNumber } = require("../helpers/util");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require("twilio")(accountSid, authToken);

class Controller {
  static async createPost(req, res, next) {
    try {
      const { message, filePath } = req.body;
      const { username } = req.user;

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
  static async register(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { username, password, phoneNumber, imagePath } = req.body;

      // ADD LOGIC TO COVER IF THERE IS EXISTING PHONE NUMBER

      const newUser = await User.create(
        {
          username,
          password,
          phoneNumber,
          imagePath,
          createdBy: "system",
        },
        {
          transaction: t,
        }
      );
      await t.commit();
      res.status(201).json({
        success: true,
        data: newUser,
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  static async login(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { username, password } = req.body;
      if (!username) throw { name: "USERNAME_IS_REQUIRED" };
      if (!password) throw { name: "PASSWORD_IS_REQUIRED" };

      const selectedUser = await User.findOne({
        where: {
          username: username,
          status: "VALIDATED",
        },
        transaction: t,
      });
      if (!selectedUser) {
        throw { name: "INVALID_USER" };
      }

      const passwordCheck = comparePasswordWithHash(
        password,
        selectedUser.password
      );
      if (!passwordCheck) {
        throw { name: "INVALID_USER" };
      }
      const payload = {
        id: selectedUser.id,
        username: selectedUser.username,
        imagePath: selectedUser.imagePath,
      };

      const token = tokenGenerator(payload);
      await t.commit();
      res.status(200).json({
        success: true,
        data: {
          accessToken: token,
        },
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }
  static async sendOtp(req, res, next) {
    try {
      const { phoneNumber } = req.body;
      const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

      const user = await User.findOne({
        where: {
          phoneNumber,
        },
      });
      if (!user) {
        throw { name: "USER_NOT_FOUND" };
      }

      const otp = generateOtpNumber();
      const message = await twilioClient.messages.create({
        body: `Your OTP is ${otp}`,
        from: twilioPhoneNumber,
        to: phoneNumber.replace(/^0/, "+62"),
      });

      await User.update(
        { otp: otp },
        {
          where: {
            id: user.id,
          },
          returning: false,
        }
      );

      res.status(200).json({
        success: true,
        data: {
          sid: message.sid,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  static async verifyOtp(req, res, next) {
    try {
      const { phoneNumber, otp } = req.body;

      const user = await User.findOne({
        where: {
          phoneNumber,
        },
      });
      if (!user) {
        throw { name: "USER_NOT_FOUND" };
      }

      if (user.otp !== otp) {
        throw { name: "INVALID_OTP" };
      }

      await User.update(
        { status: "VALIDATED" },
        {
          where: {
            id: user.id,
          },
          returning: false,
        }
      );

      res.status(200).json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
