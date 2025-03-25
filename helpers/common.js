import { Dimensions } from "react-native";

const { width: DeviceWidth, height: DeviceHeight } = Dimensions.get("window");

export const wp = percentage=>{ return DeviceHeight * percentage / 100 };
export const hp = percentage=>{ return DeviceWidth * percentage / 100 };