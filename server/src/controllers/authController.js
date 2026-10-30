import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User, FarmerProfile, AuditLog } from '../models/index.js';
import { config } from '../config/env.js';

const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      preferredLanguage: user.preferredLanguage,
      state: user.state,
      district: user.district,
      village: user.village
    }
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, preferredLanguage, state, district, village, role } = req.body;

    if (!name || !password || !state || !district) {
      return res.status(400).json({
        success: false,
        message: 'Name, password, state, and district are required.'
      });
    }

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Either email or phone number must be provided.'
      });
    }

    // Role safeguard: Prevent self-registering as admin
    const assignedRole = role === 'expert' ? 'expert' : 'farmer';

    // Check duplicate
    if (email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists.'
        });
      }
    }

    if (phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: 'An account with this phone number already exists.'
        });
      }
    }

    const user = await User.create({
      name,
      email: email ? email.toLowerCase() : undefined,
      phone,
      password,
      role: assignedRole,
      preferredLanguage: preferredLanguage || 'en',
      state,
      district,
      village: village || '',
      lastLogin: new Date()
    });

    // Create default FarmerProfile
    await FarmerProfile.create({
      user: user._id,
      farmLocation: `${village ? village + ', ' : ''}${district}, ${state}`,
      preferredLanguage: user.preferredLanguage
    });

    await AuditLog.create({
      user: user._id,
      userName: user.name,
      userRole: user.role,
      action: 'USER_REGISTER',
      ip: req.ip
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or phone

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email/phone and password.'
      });
    }

    const isEmail = identifier.includes('@');
    const query = isEmail ? { email: identifier.toLowerCase() } : { phone: identifier };

    const user = await User.findOne(query).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your phone/email and password.'
      });
    }

    if (!user.active) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your phone/email and password.'
      });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    await AuditLog.create({
      user: user._id,
      userName: user.name,
      userRole: user.role,
      action: 'USER_LOGIN',
      ip: req.ip
    });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const profile = await FarmerProfile.findOne({ user: req.user.id });

    res.status(200).json({
      success: true,
      user,
      profile
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      preferredLanguage,
      state,
      district,
      village,
      farmSize,
      sizeUnit,
      soilType,
      waterSource,
      irrigationType,
      cropsGrown,
      farmingPractices
    } = req.body;

    const user = await User.findById(req.user.id);
    if (name) user.name = name;
    if (preferredLanguage) user.preferredLanguage = preferredLanguage;
    if (state) user.state = state;
    if (district) user.district = district;
    if (village !== undefined) user.village = village;
    await user.save();

    let profile = await FarmerProfile.findOne({ user: req.user.id });
    if (!profile) {
      profile = new FarmerProfile({ user: req.user.id });
    }

    if (farmSize !== undefined) profile.farmSize = farmSize;
    if (sizeUnit) profile.sizeUnit = sizeUnit;
    if (soilType) profile.soilType = soilType;
    if (waterSource) profile.waterSource = waterSource;
    if (irrigationType) profile.irrigationType = irrigationType;
    if (cropsGrown) profile.cropsGrown = cropsGrown;
    if (farmingPractices) profile.farmingPractices = farmingPractices;
    profile.farmLocation = `${user.village ? user.village + ', ' : ''}${user.district}, ${user.state}`;
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user,
      profile
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email or phone number.'
      });
    }

    const isEmail = identifier.includes('@');
    const query = isEmail ? { email: identifier.toLowerCase() } : { phone: identifier };
    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user account found with that identifier.'
      });
    }

    // Generate single-use reset token (expires in 30 minutes)
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    // In production without SMS/Email keys, return the token for demo/testing verification
    res.status(200).json({
      success: true,
      message: 'Password reset token generated. Valid for 30 minutes.',
      resetToken, // Provided for testing and demo environments
      expiresInMinutes: 30
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.'
      });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token.'
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    await AuditLog.create({
      user: user._id,
      userName: user.name,
      userRole: user.role,
      action: 'USER_PASSWORD_RESET',
      ip: req.ip
    });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await FarmerProfile.deleteOne({ user: userId });
    await User.findByIdAndDelete(userId);

    await AuditLog.create({
      userName: req.user.name,
      userRole: req.user.role,
      action: 'USER_DELETE_ACCOUNT',
      ip: req.ip
    });

    res.status(200).json({
      success: true,
      message: 'Account and associated data deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

