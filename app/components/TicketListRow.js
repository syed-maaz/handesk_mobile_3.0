import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import AppText from "./Text";
import { FontAwesome5 } from "@expo/vector-icons";

import dayjs from "dayjs";

export default function TicketListRow({ index, item: d }) {
  const listBoxStyle = () => {
    const styleArray = [styles.innerBox];
    if (index % 2) {
      styleArray.push({ backgroundColor: "#F2F2F2" });
    } else {
    }
    if (d.row_color || d.assigned_row_color) {
      styleArray.push({
        marginVertical: 2,
        borderLeftWidth: 7,
        borderLeftColor: d.row_color || d.assigned_row_color,
      });
    }

    return StyleSheet.flatten(styleArray);
  };

  return (
    <View
      style={
        d?.selected ? [listBoxStyle(), styles.selectedColor] : listBoxStyle()
      }>
      <View style={styles.onLeft}>
        <View style={[styles.onTop]}>
          <View>
            <View style={{ flexDirection: "column" }}>
              <AppText
                style={
                  d?.selected
                    ? [styles.requesterName, { color: "#fff" }]
                    : styles.requesterName
                }>
                {d?.requester?.name}
              </AppText>
              <AppText style={d?.selected && { color: "#fff" }}>
                {d?.requester?.email}
              </AppText>
            </View>
          </View>
          <View>
            <View
              style={{
                alignItems: "flex-end",
              }}>
              <AppText
                style={
                  d?.selected
                    ? [styles.updatedAt, { color: "#fff" }]
                    : styles.updatedAt
                }>
                {dayjs(d.updated_at).format("YY-MM-DD h:MM")}
              </AppText>
            </View>
          </View>
        </View>
        <View style={styles.onMiddle}>
          <View>
            <AppText
              style={
                d?.selected
                  ? [styles.ticketTitle, { color: "#fff" }]
                  : styles.ticketTitle
              }>
              #{d.id}. {d?.title}
            </AppText>
          </View>
        </View>
      </View>
      <View style={styles.onRight}>
        <View style={styles.notificationBox}>
          {d?.comments?.length !== 0 && (
            <AppText style={styles.notification}>{d?.comments?.length}</AppText>
          )}
        </View>
        <View>
          <FontAwesome5
            style={styles.angleRight}
            name="angle-right"
            size={24}
            color="#3E75C1"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  innerBox: {
    backgroundColor: "#fff",
    width: "100%",
    borderBottomColor: "#E3E3E3",
    borderBottomWidth: 0.5,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  onLeft: { flex: 1, flexWrap: "wrap", flexDirection: "row" },
  onTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  requesterName: {
    color: "#545454",
    fontSize: 16,
    fontWeight: "bold",
    width: 250,
  },
  updatedAt: {
    color: "#545454",
    fontSize: 14,
    fontWeight: "normal",
    marginLeft: 15,
    paddingRight: 5,
    justifyContent: "flex-end",
    // textAlign: "right",
    // alignSelf: "flex-end",
  },
  onMiddle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
  },
  ticketTitle: {
    color: "#545454",
    fontSize: 15,
    fontWeight: "normal",
    flex: 1,
    flexWrap: "wrap",
    maxWidth: 350,
  },

  onBottom: {},
  description: {
    color: "#A0A0A0",
    fontSize: 14,
    fontWeight: "normal",
  },
  onRight: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  notification: {
    color: "#545454",
    fontSize: 15,
    fontWeight: "bold",
    paddingLeft: 4,
    paddingRight: 4,
    textAlign: "left",
    alignItems: "flex-end",
  },
  notificationBox: {
    backgroundColor: "#F5F5F5",
    textAlignVertical: "bottom",
    alignItems: "flex-end",
  },
  angleRight: {
    marginTop: 15,
    alignItems: "flex-end",
  },
  selectedColor: {
    backgroundColor: "#3E75C1",
    color: "#ffff",
  },
});
