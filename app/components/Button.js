import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import colors from "../config/colors";
import defaultStyles from '../config/styles';

function AppButton({ title, onPress, color = "primary", style, textColor = "white", fontSize = 14 }) {
  return (
    <TouchableOpacity
      style={[styles.button, style, { backgroundColor: color !== "primary" ? color : colors[color] }]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: textColor, fontSize: fontSize }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '60%',
    backgroundColor: colors.primary,
    borderRadius: 5,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 10,
    borderRadius: 20
  },
  text: {
    color: colors.white,
    textTransform: "none",
    fontWeight: 'bold'
  },
});

export default AppButton;