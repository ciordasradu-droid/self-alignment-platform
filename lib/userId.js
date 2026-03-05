export function getUserId() {
  if (typeof window === 'undefined') return null

  let userId = localStorage.getItem('user_id')
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
    localStorage.setItem('user_id', userId)
  }
  return userId
}