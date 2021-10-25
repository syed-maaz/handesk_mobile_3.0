import React, { useMemo, useState, useEffect } from "react";
import { Text, View, Image } from "react-native";
import {
  createDrawerNavigator,
  DrawerItem,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { useNavigation, DrawerActions } from "@react-navigation/native";

import NewTicketScreen from "../screens/NewTicketScreen";
import TabNavigator from "./TabNavigator";
import useAuth from "../auth/useAuth";

// import Onesignal from "../utility/Onesignal";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const navigation = props.navigation;
  const { logOut } = useAuth();

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ margin: 20, marginTop: 40 }}>
        <View style={{ flexDirection: "column" }}>
          <Image
            source={require("../assets/logo.png")}
            style={{ width: 250, height: 40 }}
          />
        </View>
      </View>
      <DrawerItem
        label="Dashboard"
        onPress={() => navigation.navigate("Dashboard")}
      />
      <DrawerItem
        label="Ticket"
        onPress={() => navigation.navigate("TicketListing")}
      />
      <DrawerItem
        label="New Ticket"
        onPress={() => navigation.navigate("New Ticket")}
      />
      <DrawerItem
        label="Notifications"
        onPress={() => navigation.navigate("Notification")}
      />

      <DrawerItem label="Log Out" onPress={logOut} />
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      contentOptions={{
        activeTintColor: "#000000",
        activeBackgroundColor: "#e6e6e6",
      }}>
      <Drawer.Screen name="Dashboard">
        {(props) => <TabNavigator {...props} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
