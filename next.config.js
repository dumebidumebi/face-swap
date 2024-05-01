    /**
 * @type {import('next').NextConfig}
 */
   
  module.exports = {
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
      },
      images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "upcdn.io",
          },
          {
            protocol: "https",
            hostname: "replicate.delivery",
          },
        ],
      },
  }
    