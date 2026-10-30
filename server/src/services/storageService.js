import path from 'path';
import { config } from '../config/env.js';

export const getFileUrl = (file, req) => {
  if (!file) return '';

  // Local storage relative path
  const host = req ? `${req.protocol}://${req.get('host')}` : '';
  return `${host}/uploads/${file.filename}`;
};

