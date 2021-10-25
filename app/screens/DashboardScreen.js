import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import AppText from "../components/Text";
import Button from "../components/Button";
import colors from "../config/colors";
import defaultStyles from "../config/styles";
import Layout from "../components/Layout.js";
import listingsApi from "../api/listings";
import useApi from "../hooks/useApi";
import ActivityIndicator from "../components/ActivityIndicator.js";
import AppButton from "../components/Button";
import useAuth from "../auth/useAuth";
// import { humanizeDurationTime } from "../utility/helpers";

function DashboardScreen({ navigation, route }) {
  const [data, setData] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { logOut } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const getDashboardData = async () => {
    setLoading(true);
    const { ok, status, data } = await listingsApi.getDashboardListings();
    // console.log(data, ok);

    if (!ok || status !== 200) {
      if (data.error === "Unauthenticated.") logOut();
    }

    setError(!ok);

    if (!!ok && status === 200) {
      setData(data.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    let unmounted = false;

    if (!unmounted) {
      getDashboardData();
    }

    return () => {
      unmounted = true;
    };
  }, []);

  const onRefresh = useCallback(() => {
    getDashboardData();
  }, []);

  const onRetryApi = () => {
    getDashboardData();
  };

  return (
    <React.Fragment>
      <ActivityIndicator visible={loading} />
      <Layout headerTitle="Dashboard" navigation={navigation} route={route}>
        {error && (
          <View style={styles.errorContainer}>
            <AppText style={styles.errorText}>
              Couldn't retrieve the listings.
            </AppText>
            <AppButton
              title="Retry"
              style={styles.errorBtn}
              onPress={onRetryApi}
            />
          </View>
        )}
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.container}>
            <AppText style={styles.heading}>Overview</AppText>
            {data && (
              <View style={styles.boxes}>
                <View style={styles.box}>
                  <FontAwesome5
                    name="chart-line"
                    size={24}
                    style={styles.icon}
                    color="#FA87E8"
                  />
                  <View style={styles.right}>
                    <AppText style={styles.number}>
                      {!!data.tickets && data.tickets.solvedToday}
                    </AppText>
                    <AppText style={styles.text}>Solved Tickets Today</AppText>
                  </View>
                </View>
                <View style={styles.box}>
                  <FontAwesome5
                    name="envelope-open-text"
                    size={24}
                    style={styles.icon}
                    color="#FD924E"
                  />

                  <View style={styles.right}>
                    <AppText style={styles.number}>
                      {(!!data.tickets && data.tickets.open) || 0}
                    </AppText>
                    <AppText style={styles.text}>Open Tickets Today</AppText>
                  </View>
                </View>
                <View style={styles.box}>
                  <FontAwesome5
                    name="business-time"
                    size={24}
                    style={styles.icon}
                    color="#18BFC6"
                  />
                  <View style={styles.right}>
                    <AppText style={styles.number}>
                      {/* {(!!data.tickets &&
                        !!data.tickets.avergageTimeSolve &&
                        humanizeDurationTime(
                          data.tickets.avergageTimeSolve.minutes
                        )) ||
                        0} */}
                    </AppText>
                    <AppText style={styles.text}>Avg. Solving Tickets</AppText>
                  </View>
                </View>
                <View style={styles.box}>
                  <FontAwesome5
                    name="user-clock"
                    size={24}
                    style={styles.icon}
                    color="#3E86FB"
                  />

                  <View style={styles.right}>
                    <AppText style={styles.number}>
                      {(!!data.tickets && data.tickets.avg_handling_time) || 0}
                    </AppText>
                    <AppText style={styles.text}>Avg. Handling Time</AppText>
                  </View>
                </View>
                {/*<View style={styles.box}>
                  <Ionicons name="ios-shirt" size={24} style={styles.icon} color="#fc9590" />
                  <View style={styles.right}>
                    <AppText style={styles.number}>2 min</AppText>
                    <AppText style={styles.text}>Handled by SmartDraft</AppText>
                  </View>
                </View>
                <View style={styles.box}>
                  <MaterialCommunityIcons name="stop-circle" size={24} style={styles.icon} color="#FD5147" />
                  <View style={styles.right}>
                    <AppText style={styles.number}>48 min</AppText>
                    <AppText style={styles.text}>Handled Manually</AppText>
                  </View>
                </View>*/}
              </View>
            )}
          </View>
        </ScrollView>
      </Layout>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    color: "#3E75C2",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  boxes: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  box: {
    flexDirection: "row",
    height: 131,
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: "#93939329",
    width: "49%",
    marginBottom: 8,
    justifyContent: "center",
    borderRadius: 10,
  },
  icon: {
    paddingTop: 34,
  },
  right: {
    width: "59%",
    paddingLeft: 10,
    paddingTop: 29,
  },
  number: {
    color: "#545454",
    fontSize: 25,
    fontWeight: "bold",
  },
  text: {
    color: "#545454",
    fontSize: 15,
  },
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
});

export default DashboardScreen;
