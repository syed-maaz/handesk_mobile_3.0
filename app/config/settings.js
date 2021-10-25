import Constants from "expo-constants";

const settings = {
  dev: {
    apiUrl: "https://stage-post.digitaltolk.com",
  },
  staging: {
    apiUrl: "https://stage-post.digitaltolk.com",
  },
  prod: {
    apiUrl: "https://stage-post.digitaltolk.com",
  },
};

const getCurrentSettings = () => {
  console.log(__DEV__);
  if (__DEV__) return settings.dev;
  if (Constants.manifest.releaseChannel === "staging") return settings.staging;
  return settings.prod;
};

export default getCurrentSettings();
