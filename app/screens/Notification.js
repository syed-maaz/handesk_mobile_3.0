import React, { useState, useEffect, useCallback } from "react";

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



function Notification({ navigation, route }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // const onRefresh = useCallback(() => {
  //   console.log("refresh");
  // }, []);

  const notificationList = [
    {
      notification: "Your Ticket is merge by id: 2424",
      date: "2021-10-12 - 3:00:33PM",
    },
    {
      notification: "New ticket is assign",
      date: "2021-09-12 - 2:00:33PM",
    },
    {
      notification: "Your Ticket is merge by id: 2234",
      date: "2021-04-28 - 1:00:33PM",
    },
    {
      notification: "Your Ticket is Update",
      date: "2021-04-12 - 12:00:33PM",
    },
  ];

  return (
    <Provider>
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
        <View>
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.left}></View>
              <View style={styles.NotificationIcon}>
                <Feather name="bell" size={30} color="#3A75BA" />
                <View style={styles.NotificationBadge}>
                  <AppText
                    style={{ color: "#FFF", fontSize: 12, fontWeight: "bold" }}>
                    {2}
                  </AppText>
                </View>
              </View>
            </View>
          </View>
        </View>

        <SafeAreaView style={styles.containerList}>
          {!!notificationList && notificationList.length > 0 && (
            <FlatList
              data={notificationList}
              renderItem={({ item }) => (
                <TouchableOpacity>
                  <View
                    style={{
                      backgroundColor: "white",
                      margin: 5,
                      marginHorizontal: 10,
                      padding: 10,
                      borderRadius: 4,
                    }}>
                    <AppText style={styles.heading}>
                      {item?.notification}
                    </AppText>
                    <AppText style={styles.date}>{item?.date}</AppText>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              // onRefresh={() => onRefresh()}
              initialNumToRender={5}
              onEndReachedThreshold={0.1}
              // refreshing={loading}
              // onEndReached={() => {
              //   console.log("load more!!");
              // }}
            />
          )}
        </SafeAreaView>
      </Layout>
    </Provider>
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
