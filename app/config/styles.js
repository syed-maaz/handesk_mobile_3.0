import { Platform } from "react-native";

import colors from "./colors";

export default {
  colors,
  text: {
    color: colors.textColor,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'Roboto',
  },
  fontFamily: {
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'Roboto',
  }
}