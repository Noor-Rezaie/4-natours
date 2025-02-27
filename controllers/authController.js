const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  // IN HERE WE GENERATE THE TOKEN.
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // REMOVE THE PASSWORD FROM OUTPUT.
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  /*const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });*/
  const newUser = await User.create(req.body);

  // IN HERE WE GENERATE THE TOKEN.
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1)check eamil and passwords exist.
  if (!email || !password) {
    return next(new AppError('Please, provide email or password!', 400));
  }

  // 2)Check if userExist && password os correct.
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password!!', 401));
  }
  // console.log(user);

  // 3) if every thing is ok, send the token to client.
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1)
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log(token);
  if (!token) {
    return next(new AppError('you are not longed in, please log in!', 401));
  }

  // 2)verification toekn
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  // 3)check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(
        'The user belong to this token is no longer exist, please make sure to log in again!',
        401
      )
    );
  }

  // 4)check if user changed password after the token was created.
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'The user has changed the password recently pleae, login again!',
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUT.
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array. [admin, lead-guide]
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('you are not allowed to perform this action.', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1)get user based on Posted Eamil.
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('Sorry, there was user with that Email!', 404));
  }

  // 2) genetrate random tokrn
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user 's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )} / api / v1/users/resetPassword/${resetToken}`;

  const message = `Did you Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\n If you did not forget your pasword please ignore this message.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token is Valid for 10 Minutes.',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token was sent to your email please check your email address!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending eamil, please try again later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on token.
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // if token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Sorry, token has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // update changePasswordAt property for the user
  // log the user in, send JWT token.

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1)
  const user = await User.findById(req.user.id).select('+password');

  // 2)
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('your current passowrd is wrong!', 401));
  }

  // 3)
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4)
  createSendToken(user, 200, res);
});
