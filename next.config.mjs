/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActions: {
			bodySizeLimit: '10mb',
		},
	},
	serverExternalPackages: ['sequelize'],
};

export default nextConfig;
