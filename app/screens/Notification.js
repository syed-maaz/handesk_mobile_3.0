import React, { useState, useEffect, useCallback, useContext } from "react";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import axios from "axios";

import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { Provider } from "react-native-paper";

import Layout from "../components/Layout.js";

import ActivityIndicator from "../components/ActivityIndicator.js";
import AppButton from "../components/Button";
import AppText from "../components/Text.js";
import { WebSocketContext } from "../context/websocket";

import { Navigation } from "../screens/TicketScreen";

function Notification({ navigation, route }) {
  const { allTicketActivities, ticketActivities } =
    useContext(WebSocketContext);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ticketActivites, setTicketActivities] = useState([]);

  useEffect(() => {
    console.log("ticket activity", allTicketActivities);
    // if (ticketActivites) {
    //   sendNotification(ticketActivities);
    // }
  }, [allTicketActivities]);

  return (
    <>
      <ActivityIndicator visible={loading} />
      <Layout headerTitle="Notification" navigation={navigation} route={route}>
        {error && (
          <View style={styles.errorContainer}>
            <AppText style={styles.errorText}>
              Couldn't retrieve the Notification
            </AppText>
            <AppButton
              title="Retry"
              style={styles.errorBtn}
              onPress={() => console.log("retry")}
            />
          </View>
        )}

        <SafeAreaView style={styles.containerList}>
          {!!allTicketActivities && allTicketActivities.length > 0 && (
            <FlatList
              data={allTicketActivities}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("TicketDetail", {
                      item: { id: item.id },
                    });
                  }}>
                  <View
                    style={{
                      backgroundColor: "white",
                      margin: 5,
                      marginHorizontal: 10,
                      padding: 10,
                      borderRadius: 4,
                    }}>
                    <AppText style={styles.heading}>
                      # {item.id} is {item?.action.split(".")[1]}
                    </AppText>
                    <AppText style={styles.date}>{item?.updated || ""}</AppText>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              initialNumToRender={5}
              onEndReachedThreshold={0.1}
            />
          )}
        </SafeAreaView>
      </Layout>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
    paddingHorizontal: 20,
    zIndex: 3, // works on ios
    elevation: 3, //works on android
  },
  containerList: {
    marginTop: 10,
    zIndex: 3, // works on ios
    elevation: 3, //works on android
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  heading: {
    color: "#3E75C2",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    textTransform: "capitalize",
  },

  NotificationIcon: {
    width: 59.46,
    height: 59.46,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#00000029",
    borderWidth: 0.5,
  },

  onLeft: {},

  headingOne: {
    color: "#545454",
    fontSize: 16,
    fontWeight: "bold",
    maxWidth: 200,
  },
  date: {
    color: "#545454",
    fontSize: 16,
    fontWeight: "normal",
    marginLeft: 15,
    textAlign: "left",
    marginTop: 5,
  },

  onBottom: {},

  onRight: {},
  errorContainer: {
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  errorText: {
    margin: 0,
  },
  errorBtn: {
    marginTop: 20,
  },

  NotificationBadge: {
    position: "absolute",
    top: 1,
    right: 1,
    minWidth: 20,
    height: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF0000",
    color: "#FFF000",
  },
});

export default Notification;
