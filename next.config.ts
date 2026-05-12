import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverComponentsExternalPackages: ["@prisma/client", "bcrypt"]
};

export default nextConfig;
