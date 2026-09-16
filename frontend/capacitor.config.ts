import type {
  CapacitorConfig,
} from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.careerai.app",

  appName: "CareerAI",

  webDir: "dist",

  server: {
    androidScheme: "https",
  },
};

export default config;