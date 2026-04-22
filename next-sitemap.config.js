/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://cvmatch-pro.vercel.app',
  generateRobotsTxt: true, // (optional)
  // ...other options
}
