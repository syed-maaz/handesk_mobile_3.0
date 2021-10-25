import React, { useState, useEffect, useContext } from "react";

import {
  // View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  // FlatList,
  SafeAreaView,
  Modal,
} from "react-native";
import dayjs from "dayjs";
import { useFormikContext, Formik } from "formik";

import AppText from "../../components/Text";
import AppButton from "../../components/Button";

import defaultStyles from "../../config/styles";
import Screen from "../../components/Screen";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { Form, FormField, FormPicker as Picker } from "../../components/forms";

import CategoryPickerItem from "../CategoryPickerItem";

import DatePicker from "react-native-datepicker";
import { View, Text, Button } from "native-base";

import { getStatusList } from "../../utility/helpers";

import Context from "../../auth/context";
import { clockRunning } from "react-native-reanimated";

const styles1 = {
  wrapper: {
    flex: 1,
    marginTop: 150,
  },
  submitButton: {
    paddingHorizontal: 10,
    paddingTop: 20,
  },
};
// These Fields will create a login form with three fields

const ticketListFilterModal = ({
  isModalVisible,
  setModalVisible,
  dateRange,
  onSubmitFilter,
}) => {
  const [dates, setDates] = useState(null);
  const [startDate, setStartDate] = useState(dateRange?.startDate);
  const [endDate, setEndDate] = useState(dateRange?.endDate);
  const [displayedDate, setDisplayDate] = useState(dayjs());

  const [isPickerShow, setIsPickerShow] = useState(false);
  const [date, setDate] = useState(new Date(Date.now()));

  const [dateFilterFrom, setDateFilterFrom] = useState(new Date());
  const [dateFilterTo, setDateFilterTo] = useState(new Date());

  const { metaData } = useContext(Context);

  const [assigneeList, setAssigneeList] = useState();
  const [teamList, setTeamList] = useState();
  const [statusList, setStatusList] = useState();

  useEffect(() => {
    if (metaData) {
      const assignee =
        (metaData.users &&
          metaData.users.map((d) => ({
            label: d.name,
            value: d.id,
          }))) ||
        [];

      setAssigneeList(assignee);

      const teams =
        (metaData.teams &&
          metaData.teams.map((d) => ({
            label: d.name,
            value: d.id,
          }))) ||
        [];

      setTeamList(teams);

      setStatusList(getStatusList());
    }
  }, [metaData]);

  const showPicker = () => {
    setIsPickerShow(true);
  };

  const onChange = (event, value) => {
    // console.log(event);
    // console.log(value);
    setDate(value);
    if (Platform.OS === "android") {
      setIsPickerShow(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
      }}>
      <View style={styles.centeredView}>
        <Form
          initialValues={{
            teams: null,
          }}
          onSubmit={(values) => {
            console.log("val", values)
            values['date_from'] = dateFilterFrom
            values['date_to'] = dateFilterTo

            onSubmitFilter(values);
          }}>
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <>
              <ScrollView>
                <Entypo
                  name="squared-cross"
                  size={30}
                  color="#013379"
                  onPress={() => {
                    setModalVisible(!isModalVisible);
                  }}
                  style={{ textAlign: "right" }}
                />
                <View style={styles.filterBox}>
                  <View style={styles.container}>
                    {/* Display the selected date */}

                    {/* Date From */}
                    <View>
                      <AppText style={styles.inputHeading}>Date From</AppText>
                      <View style={styles.filterInputView}>
                        <DatePicker
                          style={{ width: "100%" }}
                          date={dateFilterFrom}
                          mode="date"
                          placeholder="select date"
                          format="YYYY-MM-DD"
                          confirmBtnText="Confirm"
                          cancelBtnText="Cancel"
                          name={'select date'}
                          value={values['select date']}
                          customStyles={{
                            dateIcon: {
                              position: "absolute",
                              left: 0,
                              top: 4,
                              marginLeft: 0,
                            },
                            dateInput: {
                              marginLeft: 36,
                              borderWidth: 0.5,
                              borderColor: "#30303033",
                              borderRadius: 12,
                              backgroundColor: "#FFFFFF",
                            },
                            // ... You can check the source to find the other keys.
                          }}
                          onDateChange={(date) => setDateFilterFrom(date)}
                        />
                      </View>
                    </View>

                    {/* Date To */}
                    <View>
                      <AppText style={styles.inputHeading}>Date To</AppText>
                      <View style={styles.filterInputView}>
                        <DatePicker
                          style={{ width: "100%" }}
                          date={dateFilterTo}
                          mode="date"
                          placeholder="select date"
                          format="YYYY-MM-DD"
                          confirmBtnText="Confirm"
                          cancelBtnText="Cancel"
                          customStyles={{
                            dateIcon: {
                              position: "absolute",
                              left: 0,
                              top: 4,
                              marginLeft: 0,
                            },
                            dateInput: {
                              marginLeft: 36,
                              borderWidth: 0.5,
                              borderColor: "#30303033",
                              borderRadius: 12,
                              backgroundColor: "#FFFFFF",
                            },
                            // ... You can check the source to find the other keys.
                          }}
                          onDateChange={(date) => setDateFilterTo(date)}
                        />
                      </View>
                    </View>

                    {/* Requester Name */}
                    <View>
                      <AppText style={styles.inputHeading}>Requester</AppText>
                      <View>
                        <FormField
                          placeholderTextColor={
                            defaultStyles.colors.placeholderColor
                          }
                          autoCapitalize="none"
                          autoCorrect={false}
                          name="requested_by"
                          placeholder="Search"
                        />
                      </View>
                    </View>

                    {/* Subject */}
                    <View>
                      <AppText style={styles.inputHeading}>Subject</AppText>
                      <View>
                        <FormField
                          placeholderTextColor={
                            defaultStyles.colors.placeholderColor
                          }
                          autoCapitalize="none"
                          autoCorrect={false}
                          name="subject"
                          placeholder="Subject"
                        />
                      </View>
                    </View>

                    {/* Assignee */}
                    <View>
                      <AppText style={styles.inputHeading}>Assignee</AppText>
                      <View style={styles.filterInputView}>
                        <Picker
                          items={assigneeList}
                          name="user_id"
                          placeholder="Assignee"
                          width="100%"
                        />
                      </View>
                    </View>

                    <View>
                      <AppText style={styles.inputHeading}>Teams</AppText>
                      <View style={styles.filterInputView}>
                        <Picker
                          items={teamList}
                          name="team"
                          placeholder="Teams"
                          width="100%"
                        />
                      </View>
                    </View>

                    <View>
                      <AppText style={styles.inputHeading}>Status</AppText>
                      <View style={styles.filterInputView}>
                        <Picker
                          items={statusList}
                          name="status"
                          placeholder="Status"
                          width="100%"
                        />
                      </View>
                    </View>

                    <View>
                      <AppText style={styles.inputHeading}>Solved By</AppText>
                      <View style={styles.filterInputView}>
                        <Picker
                          items={assigneeList}
                          name="solved_by"
                          placeholder="Solved By"
                          width="100%"
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
              <View style={styles.btnGroup}>


                <AppButton
                  title="Filter"
                  style={{ width: "85%" }}
                  onPress={handleSubmit}
                />
                <TouchableOpacity  style={{ width: "15%",marginTop:20}} onPress={() => onSubmitFilter({})} >

                <Entypo name="circle-with-cross" size={50} color="#3d7ab9" />
                </TouchableOpacity>

              </View>
            </>
          )}
        </Form>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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

  innerBox: {
    margin: 0,
    marginTop: 0,
    marginBottom: 10,
  },

  inputBox: {
    // borderBottomWidth: 1,
    // borderBottomColor: "#B5BDCE",
    paddingBottom: 10,
    paddingTop: 10,
  },
  btnGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"space-between"
  },
  inputHeading: {
    color: "#748AA1",
    fontSize: 20,
    fontWeight: "normal",
  },
  inputSubHeading: {
    color: "#545454",
    fontSize: 14,
    fontWeight: "normal",
  },
});

export default ticketListFilterModal;
