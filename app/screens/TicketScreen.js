import React, { useState, useEffect, useCallback } from "react";

import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  Modal,
  Alert,
} from "react-native";

import {
  MaterialIcons,
  Feather,
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { Button, Menu, Divider, Provider } from "react-native-paper";
import DatePicker from "react-native-datepicker";

import AppText from "../components/Text";
import colors from "../config/colors";
import defaultStyles from "../config/styles";
import Layout from "../components/Layout.js";
import listingsApi from "../api/listings";
import useApi from "../hooks/useApi";
import ActivityIndicator from "../components/ActivityIndicator.js";
import AppButton from "../components/Button";
import { Form, FormPicker as Picker } from "../components/forms";
import CategoryPickerItem from "../components/CategoryPickerItem";
// import Screen from "../components/Screen";
import TicketListRow from "../components/TicketListRow";

import TicketListFilterModal from "../components/modals/ticketListFilterModal";
import TicketMergeModal from "../components/modals/ticketMergeModel";
import AssignTeamToBulk from "../components/modals/assignTeamToBulkModal";

import { getStatusList } from "../utility/helpers";

import dayjs from "dayjs";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import TicketDetailScreen from "../screens/TicketDetailScreen";

import AuthContext from "../auth/context";

import { set } from "react-native-reanimated";
import AppTextInput from "../components/TextInput";
import AppPicker from "../components/Picker";

import { get } from "react-native/Libraries/Utilities/PixelRatio";

function TicketScreen({ navigation, route, status, type }) {
  const ticketRouteType = route?.params?.item || type || "open";
  // console.log(ticketRouteType);
  const [ticketList, setTicketList] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { logOut } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dateFilter, setDateFilter] = useState(new Date());
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [showResults, setShowResults] = useState(false);

  const [isSelected, setIsSelected] = useState(false);
  const [selectedList, setSelectedList] = useState([]);
  const [mergeModalVisible, setMergeModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [ticketId, setTicketId] = useState();

  const [requestedBy, setRequestedBy] = useState("");

  const [searchCriteria, setSearchCriteria] = useState({});

  const [pageNumber, setPageNumber] = useState(1);
  const [typeOfTicket, setTypeOfTicket] = useState(ticketRouteType);
  const [ticketSortedBy, setTicketSortedBy] = useState({
    sort: "updated_at",
    order: "desc",
  });

  const [dateRange, setDateRange] = useState({
    start: dayjs().subtract(89, "days"),
    end: dayjs(),
  });

  const [numOfFilterActive, setNumOfFilterActive] = useState(0);
  const [totalNumOfTicket, setTotalNumOfTicket] = useState(0);

  useEffect(() => {
    getTicketData(pageNumber > 1);
  }, [pageNumber]);

  useEffect(() => {
    setPageNumber(0);
    onRetryApi();
  }, [typeOfTicket]);

  useEffect(() => {
    getTicketData(false);
  }, [searchCriteria]);

  const onRefresh = useCallback(() => {
    setPageNumber(0);
  }, []);

  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const openFilterModal = () => setFilterModalVisible(true);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const generateUrlParams = () => {
    let param = "?";

    let _pageNumber = pageNumber;
    if (pageNumber === 0) {
      _pageNumber = 1;
      setPageNumber(1);
    }

    param += `page=${_pageNumber}`;

    param += `&${typeOfTicket}=true`;

    param += `&sort=${ticketSortedBy.sort}&order=${ticketSortedBy.order}`;

    // if (!!range) {
    //   param += `&range=${range}`;
    // } else {
    //   param += `&range=created_at,${moment(dateRange.start).format(
    //     "YYYY-MM-DD"
    //   )},${moment(dateRange.end).format("YYYY-MM-DD")}`;
    // }

    if (!!searchCriteria.requested_by) {
      param += `&requested_by=${searchCriteria.requested_by}`;
    }

    if (!!searchCriteria.team) {
      param += `&team=${searchCriteria.team}`;
    }

    if (!!searchCriteria.subject) {
      param += `&search_content=${searchCriteria.subject}`;
    }

    if (!!searchCriteria.user_id) {
      param += `&user_id=${searchCriteria.user_id}`;
    }

    if (searchCriteria.solved_by) {
      param += `&solved_by=${searchCriteria.solved_by}`;
    }

    if (searchCriteria.date_from) {
      if (searchCriteria.date_to) {
        param += `&range=updated_at,${searchCriteria.date_from},${searchCriteria.date_to}`;
        console.log("date", searchCriteria.date_to);
      } else {
        param += `&range=updated_at,${searchCriteria.date_from},${new Date(
          Date.now()
        )}`;
        console.log("dateelse", searchCriteria.date_from);
      }
    }
    // =updated_at,2021-09-08,2021-09-08

    param += `&exclude=comments`;

    param += `&per_page=10`;

    return param;
  };

  const handleSearchTicket = (searchObj) => {
    setFilterModalVisible(false);

    console.log("searchobj", searchObj);

    const _searchCriteria = {};
    let _filterCount = 0;

    if (searchObj.hasOwnProperty("requested_by")) {
      _searchCriteria.requested_by = searchObj.requested_by;
      _filterCount++;
    }

    if (searchObj.hasOwnProperty("subject")) {
      _searchCriteria.subject = searchObj.subject;
      _filterCount++;
    }
    if (searchObj.hasOwnProperty("user_id")) {
      _searchCriteria.user_id = searchObj.user_id.value;
      _filterCount++;
    }

    if (searchObj.hasOwnProperty("team")) {
      _searchCriteria.team = searchObj.team.value;
      _filterCount++;
    }

    if (searchObj.hasOwnProperty("status")) {
      _searchCriteria.status = searchObj.status.value;
      _filterCount++;
      setTypeOfTicket(searchObj.status.value);
    }

    if (searchObj.hasOwnProperty("solved_by")) {
      _searchCriteria.solved_by = searchObj.solved_by.value;
      _filterCount++;
    }

    if (searchObj.hasOwnProperty("date_from")) {
      _searchCriteria.date_from = searchObj.date_from;
      _filterCount++;
    }

    if (searchObj.hasOwnProperty("date_to")) {
      _searchCriteria.date_to = searchObj.date_to;
      _filterCount++;
    }
    console.log("_searchCriteria", _searchCriteria);

    setSearchCriteria(_searchCriteria);
    setNumOfFilterActive(_filterCount);
    // setPageNumber(0);
  };

  const getTicketData = async (mergeList = false) => {
    setLoading(true);
    console.log(generateUrlParams());
    const { ok, status, data } = await listingsApi.getTicketListings(
      generateUrlParams()
    );

    if (!ok) {
      if (data === "Invalid token.") logOut();
    }

    setError(!ok);

    if (!!ok && status === 200) {
      if (!mergeList) {
        setTotalNumOfTicket(data.data.total);
        setTicketList(data.data.data);
      } else {
        setTicketList([...ticketList, ...data.data.data]);
      }
    }

    // setPageNumber(data.data.current_page);

    setLoading(false);
  };

  const onRetryApi = () => {
    getTicketData();
  };

  const onSelectItem = (item) => {
    let selectedData = ticketList.map((i) => {
      if (item.id === i.id) {
        i.selected = !i.selected;
        console.log(i.selected);
      }
      return i;
    });
    const id = item.id;
    setTicketList(selectedData);
    setTicketId((pre) => ({ ...pre, id }));
    console.log(ticketId, "ticket");
    const Isselect = selectedData.find((item) => item.selected === true);

    Isselect !== undefined ? setIsSelected(true) : setIsSelected(false);
  };

  const handleMerge = async ({ ticket_id }) => {
    const selectedTicketIds = ticketList
      .filter((d) => d.selected)
      .map((dl) => dl.id);

    setLoading(true);
    try {
      const { ok, status, data } = await listingsApi.ticketMerge(ticket_id, {
        tickets: selectedTicketIds,
      });

      setError(!ok);

      if (!!ok && status === 200) {
        Alert.alert("Merge tickets successful");
        setMergeModalVisible(false);
        onRetryApi();
      }
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  };

  const handleAssignTeam = async ({ team }) => {
    const reqBody = ticketList
      .filter((d) => d.selected)
      .map((dl) => ({ ticket_id: dl.id, team_id: team.value }));

    setLoading(true);
    try {
      const resp = await listingsApi.ticketAssign({ tickets: reqBody });
      const { ok, status, data } = resp;
      console.log(resp);
      setError(!ok);

      if (!!ok && status === 200) {
        Alert.alert("Assign team successful");
        setUpdateModalVisible(false);
        onRetryApi();
      }
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  };

  const markSolved = async () => {
    const selectedTicketIds = ticketList
      .filter((d) => d.selected)
      .map((dl) => dl.id);

    setLoading(true);
    try {
      const { ok, status, data } = await listingsApi.setTicketSolved({
        tickets: selectedTicketIds,
      });

      setError(!ok);

      if (!!ok && status === 200) {
        Alert.alert("Ticket marked solved");
        onRetryApi();
      }
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  };

  return (
    <Provider>
      <ActivityIndicator visible={loading} />
      <Layout headerTitle="Tickets" navigation={navigation} route={route}>
        {error && (
          <View style={styles.errorContainer}>
            <AppText style={styles.errorText}>
              Couldn't retrieve the listings
            </AppText>
            <AppButton
              title="Retry"
              style={styles.errorBtn}
              onPress={onRetryApi}
            />
          </View>
        )}
        <View>
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.left}>
                <AppText style={styles.heading}>
                  {typeOfTicket} Tickets{" "}
                  {totalNumOfTicket > 0 ? `(${totalNumOfTicket})` : ``}
                </AppText>
                <View>
                  <Menu
                    style={{ marginTop: 45, marginLeft: -50 }}
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={
                      <TouchableOpacity
                        style={styles.downIcon}
                        onPress={openMenu}>
                        <MaterialIcons
                          name="keyboard-arrow-down"
                          size={24}
                          color="#3E75C2"
                        />
                      </TouchableOpacity>
                    }>
                    <Menu.Item onPress={() => {}} title="All Statuses" />
                    {getStatusList().map((d, i) => (
                      <Menu.Item
                        key={i}
                        onPress={(e) => {
                          // console.log(d.value);
                          setTypeOfTicket(d.value);
                        }}
                        title={d.label}
                      />
                    ))}
                  </Menu>
                </View>
              </View>
              <View style={styles.filterIcon}>
                <Feather
                  name="filter"
                  size={24}
                  color="#3A75BA"
                  onPress={openFilterModal}
                />
                <View style={styles.filterBadge}>
                  <AppText
                    style={{ color: "#FFF", fontSize: 12, fontWeight: "bold" }}>
                    {numOfFilterActive}
                  </AppText>
                </View>
              </View>
            </View>
            {!!isSelected && (
              <View style={styles.selectedListButton}>
                <AppButton
                  title="Merge"
                  style={{ width: "30%" }}
                  onPress={() => setMergeModalVisible(true)}
                />
                <AppButton
                  title="Mark solved"
                  style={{ width: "30%" }}
                  onPress={() => markSolved()}
                />
                <AppButton
                  title="Update Team"
                  style={{ width: "30%" }}
                  onPress={() => setUpdateModalVisible(true)}
                />
              </View>
            )}
          </View>
        </View>

        <SafeAreaView style={styles.containerList}>
          {!!ticketList && ticketList.length > 0 && (
            <FlatList
              data={ticketList}
              renderItem={(props) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("TicketDetail", {
                      item: props.item,
                    });
                  }}
                  onLongPress={() => onSelectItem(props.item)}>
                  <TicketListRow {...props} />
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              onRefresh={() => onRefresh()}
              initialNumToRender={5}
              onEndReachedThreshold={0.1}
              refreshing={loading}
              onEndReached={() => {
                setPageNumber(pageNumber + 1);
                // console.log("load more!!");
              }}
            />
          )}
        </SafeAreaView>

        <TicketListFilterModal
          isModalVisible={filterModalVisible}
          setModalVisible={setFilterModalVisible}
          dateRange={dateRange}
          onSubmitFilter={handleSearchTicket}
        />

        <TicketMergeModal
          isOpen={mergeModalVisible}
          onClose={() => {
            setMergeModalVisible(false);
          }}
          onSubmit={handleMerge}
        />

        <AssignTeamToBulk
          isOpen={updateModalVisible}
          onClose={() => {
            setUpdateModalVisible(false);
          }}
          onSubmit={handleAssignTeam}
        />
      </Layout>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding: 20,
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
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 0,
    textTransform: "capitalize",
  },
  downIcon: {
    width: 32,
    height: 32,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    borderColor: "#00000029",
    borderWidth: 0.5,
  },
  filterIcon: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#00000029",
    borderWidth: 0.5,
  },
  boxes: {
    marginTop: 20,
  },
  box: {
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: "#E3E3E3",
    width: "100%",
    flexWrap: "wrap",
    borderBottomWidth: 0,
  },
  innerBox: {
    backgroundColor: "#fff",
    width: "100%",
    borderBottomColor: "#E3E3E3",
    borderBottomWidth: 0.5,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  onLeft: {},
  onTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  headingOne: {
    color: "#545454",
    fontSize: 16,
    fontWeight: "bold",
    maxWidth: 200,
  },
  date: {
    color: "#545454",
    fontSize: 14,
    fontWeight: "normal",
    marginLeft: 15,
    textAlign: "right",
  },
  onMiddle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  headingTwo: {
    color: "#545454",
    fontSize: 15,
    fontWeight: "normal",
    width: "100%",
  },
  notificationBox: {
    backgroundColor: "#F5F5F5",
    padding: 3,
    borderRadius: 3,
    marginLeft: 15,
    paddingLeft: 8,
    paddingRight: 8,
  },
  notification: {
    color: "#545454",
    fontSize: 15,
    fontWeight: "bold",
  },
  onBottom: {},
  description: {
    color: "#A0A0A0",
    fontSize: 14,
    fontWeight: "normal",
  },
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
  filterBox: {
    marginTop: 15,
  },
  filterInput: {
    width: "85%",
    padding: 10,
    borderWidth: 0,
  },
  filterInputView: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    marginVertical: 10,
    borderWidth: 0.5,
    borderColor: "#30303033",
    borderRadius: 12,
    position: "relative",
  },
  filterInputLabel: {
    position: "absolute",
    top: -10,
    left: 4,
  },
  centeredView: {
    height: "100%",
    marginTop: "auto",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.18)",
    padding: 15,
    paddingTop: 40,
  },
  topView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  filterBadge: {
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
  selectedListButton: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  centeredView: {
    height: "100%",
    marginTop: "auto",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.18)",
    padding: 15,
    paddingTop: 40,
  },

  mergeModalHead: {
    fontSize: 22,
    fontWeight: "bold",
  },
  mergeModalLabel: { marginTop: 8, fontSize: 16 },
});

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="TicketListing" component={TicketScreen} />
      <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return <MyStack />;
}

// export default TicketScreen;
