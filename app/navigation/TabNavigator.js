import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, Entypo, AntDesign } from "@expo/vector-icons";

import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import TicketScreen from "../screens/TicketScreen";
import TicketDetailScreen from "../screens/TicketDetailScreen";
import NewTicketScreen from "../screens/NewTicketScreen";
import Notification from "../screens/Notification";

import { View } from "react-native";

const Tab = createBottomTabNavigator();

const TabNavigator = (props) => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      activeColor="#3A75BA"
      inactiveColor="#CCCCCC"
      activeBackgroundColor="#F7F9F9"
      inactiveBackgroundColor="#F7F9F9"
      style={{ backgroundColor: "#F7F9F9" }}
      tabBarOptions={{
        style: {
          backgroundColor: "#F7F9F9",
          borderTopWidth: 0,
        },
      }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={() => ({
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        })}
      />
      <Tab.Screen
        name="Ticket"
        children={(props) => {
          return <TicketScreen {...props} type="open" />;
        }}
        options={() => ({
          tabBarIcon: ({ color, size }) => (
            <Entypo name="mail" color={color} size={size} />
          ),
        })}
      />
      <Tab.Screen
        name="New Ticket"
        component={NewTicketScreen}
        options={() => ({
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="plussquare" color={color} size={size} />
          ),
        })}
      />
      <Tab.Screen
        name="Notification"
        component={Notification}
        options={() => ({
          tabBarIcon: ({ color, size }) => (
            <Entypo name="bell" color={color} size={size} />
          ),
        })}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
