/** @type {import('next').NextConfig} */
const nextConfig = {
typescript: {
ignoreBuildErrors: true,
},
images: {
unoptimized: true,
},

experimental: {
turbo: {
resolveAlias: {},
},
},

devIndicators: false,
}

export default nextConfig
