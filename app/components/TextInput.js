import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import defaultStyles from "../config/styles";

function AppTextInput({ icon, width = "100%", ...otherProps }) {
  return (
    <View style={[styles.container, { width }]}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={defaultStyles.colors.textColor}
          style={styles.icon}
        />
      )}
      <TextInput
        placeholderTextColor={defaultStyles.colors.placeholderColor}
        style={styles.input}
        {...otherProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '85%',
    padding: 13,
    borderWidth: 0,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    flexDirection: "row",
    padding: 2,
    marginVertical: 10,
    borderWidth: 0.5,
    borderColor: '#30303033',
    borderRadius: 12
  },
  icon: {
    padding: 13,
    paddingRight: 0,
    marginRight: 0,
    marginTop: -1
  },
});

export default AppTextInput;
