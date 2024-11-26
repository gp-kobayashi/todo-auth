/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images:{
    domains:['pfeyfjstdqesvztdwvxl.supabase.co']
  }
}

module.exports = nextConfig;