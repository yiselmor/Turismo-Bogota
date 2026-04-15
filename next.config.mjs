/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Asegúrate de que esto coincida exactamente con el nombre de tu repositorio
  basePath: '/turismo-bogota',
};

export default nextConfig;
