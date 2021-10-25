import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

import AppText from "./Text";

function PickerItem({ item, onPress }) {
  return (
    <TouchableOpacity
      style={{ borderBottomWidth: 1, borderBottomColor: "#B5BDCE" }}
      onPress={onPress}>
      <AppText style={styles.text}>{item.label}</AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    padding: 10,
  },
});

export default PickerItem;
