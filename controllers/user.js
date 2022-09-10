const User = require('../models/User');
const path = require('path');

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      msg: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401).json({
        success: false,
        msg: 'Invalid credentials',
      });
    }

    const isMatch = await user.matchPassword(password.toString());

    if (!isMatch) {
      res.status(401).json({
        success: false,
        msg: 'Invalid credentials',
      });
    }
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      msg: err.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.find({});
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      msg: err.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      msg: err.message,
    });
  }
};

exports.photoUpload = async (req, res, next) => {
  try {
    if (!req.files) {
      return next(
        res.status(400).json({
          success: false,
          msg: 'Please upload a file',
        })
      );
    }
    const file = req.files.file;
    if (!file.mimetype.startsWith('image')) {
      return next(
        res.status(400).json({
          success: false,
          msg: 'Please upload an image',
        })
      );
    }

    if (file.size > 500000) {
      return next(
        res.status(400).json({
          success: false,
          msg: 'File Size greater than 500Kb',
        })
      );
    }
    file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;
    file.mv(`uploads/public/${file.name}`, async (err) => {
      if (err) {
        console.log(err);
        return next(
          res.status(500).json({
            success: false,
            msg: 'Error in uploading files',
          })
        );
      }

      if (req.user._id.toString() === req.params.id) {
        await User.findByIdAndUpdate(req.params.id, { photo: file.name });
        res.status(200).json({
          success: true,
          data: file.name,
        });
      } else {
        return next(
          res.status(401).json({
            success: false,
            msg: 'Not authorized to view this route',
          })
        );
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      msg: err.message,
    });
  }
};
