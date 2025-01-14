export const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8)
}

// 验证JSON格式
export const isValidJson = (value: string): boolean => {
  try {
    JSON.parse(value)
    return true
  } catch (e) {
    return false
  }
}
