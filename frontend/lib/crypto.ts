/**
 * 密码加密和安全相关工具函数
 */
import crypto from 'crypto';

/**
 * 使用SHA-256哈希算法对密码进行加密
 * @param password 原始密码
 * @returns 加密后的密码哈希值
 */
export function hashPassword(password: string): string {
  // 创建一个SHA-256哈希对象
  const hash = crypto.createHash('sha256');
  // 更新哈希对象的内容
  hash.update(password);
  // 返回十六进制格式的哈希值
  return hash.digest('hex');
}

/**
 * 生成一个随机的盐值
 * @param length 盐值长度
 * @returns 随机生成的盐值
 */
export function generateSalt(length: number = 16): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * 使用盐值对密码进行加密
 * @param password 原始密码
 * @param salt 盐值
 * @returns 加密后的密码哈希值
 */
export function hashPasswordWithSalt(password: string, salt: string): string {
  // 创建一个SHA-256哈希对象
  const hash = crypto.createHash('sha256');
  // 更新哈希对象的内容（密码+盐值）
  hash.update(password + salt);
  // 返回十六进制格式的哈希值
  return hash.digest('hex');
}
