import React from "react";
import { StyleSheet } from "react-native";
import { Header, Left, Body, Right } from "native-base";
import { SimpleLineIcons } from "@expo/vector-icons";

import AppText from "./Text";
import {useNavigation} from '@react-navigation/native';


const HeaderPage = ({ title }) => {
  const navigation = useNavigation();

  return (
    <Header style={styles.header}>
      <Left >
        <SimpleLineIcons
          name="menu"
          size={24}
          color="#3E75C2"
          style={styles.icon}
          onPress={navigation.toggleDrawer}
        />
      </Left>
      <Body>
        <AppText style={styles.text}>{title}</AppText>
      </Body>
      <Right />
    </Header>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 0,
  },
  icon: {
    marginLeft: 10,
  },
  text: {
    color: "#3E75C2",
    fontSize: 22,
    fontWeight: "bold",
  },
});

export default HeaderPage;
