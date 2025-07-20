/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'firebasestorage.googleapis.com',
            'm.media-amazon.com',
            'cdn.theatlantic.com',
            'upload.wikimedia.org',
            'static.wikia.nocookie.net',
        ],
    },
};

export default nextConfig;
