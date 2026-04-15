/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Asegúrate de que esto coincida exactamente con el nombre de tu repositorio
  basePath: '/Turismo-Bogota',
};

export default nextConfig;
