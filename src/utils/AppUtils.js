import { Dimensions, PixelRatio, Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import DeviceInfo from "react-native-device-info";
//
// const getDeviceModel = () => {
//   return DeviceInfo.getModel();
// };
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
export const isSmallDevice = () => {
  return screenWidth <= 375;
};

export const toCamelCaseWithSpace = (str) => {
  return str.replace(/\s(.)/g, function(match, group1) {
    return group1.toUpperCase();
  });
};

export const toCamelCase = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} = Dimensions.get("window");

const iPhoneModels = {
  "iPhone 5s": 320,
  "iPhone 7": 375,
  "iPhone 8": 375,
  "iPhone SE (2nd generation)": 375,
  "iPhone SE (3rd generation)": 375,
  "iPhone X": 375,
  "iPhone XR": 414,
  "iPhone XS": 375,
  "iPhone XS Max": 414,
  "iPhone 11": 414,
  "iPhone 11 Pro": 375,
  "iPhone 11 Pro Max": 414,
  "iPhone 12 mini": 375,
  "iPhone 12": 390,
  "iPhone 12 Pro": 390,
  "iPhone 12 Pro Max": 428,
  "iPhone 13 mini": 375,
  "iPhone 13": 390,
  "iPhone 13 Pro": 390,
  "iPhone 13 Pro Max": 428,
  // Add iPhone 14 and 15 when they are released
  "iPhone 14": 0, // Replace with the actual width when iPhone 14 is released
  "iPhone 15": 0, // Replace with the actual width when iPhone 15 is released
};

function getScale() {
  let scale;
// Get the device model
  const deviceModel = getDeviceModel(); // You need to implement the getDeviceModel() function
  console.log("deviceModel", deviceModel);
  // Check if the device model is in the iPhoneModels object
  if (deviceModel in iPhoneModels) {
    // Use the scale based on the screen width of the device
    scale = SCREEN_WIDTH / iPhoneModels[deviceModel];
  } else {
    scale = SCREEN_WIDTH / 320;
  }
  return scale;
}

export function normalize(size) {
  const newSize = size * getScale();
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

export const calculateAge = (birthdate) => {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

const {
  width,
  height,
} = Dimensions.get("window");

const baseWidth = 375;
const baseHeight = 812;

export const getScaledHeight = (
  dimension,
) => {
  let ratio = 1;
  ratio = height / baseHeight;
  return ratio * dimension;
};

export const scaledFontWidth = (
  dimension,
) => {
  let ratio = width / baseWidth;
  return ratio * dimension;
};
