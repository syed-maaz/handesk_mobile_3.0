import React, { useState, useEffect, useContext, forwardRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Button,
  Text,
  useWindowDimensions,
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
import { Menu, Divider, Provider, IconButton } from "react-native-paper";
import { ColorPicker } from "react-native-color-picker";
import Toast from "react-native-toast-message";
import dateFormat from "dateformat";
import { FlatList } from "react-native-gesture-handler";

import HTML from "react-native-render-html";
import AppText from "../components/Text";
import AppButton from "../components/Button";
import colors from "../config/colors";
import defaultStyles from "../config/styles";
import Layout from "../components/Layout.js";
import Screen from "../components/Screen";
import { Form, FormField, FormPicker as Picker } from "../components/forms";
import PickerItem from "../components/PickerItem";

import listingsApi from "../api/listings";

import Context from "../auth/context";
import ReplyTicketModel from "../components/modals/replyTicketModel";
import ForwardEmailModal from "../components/modals/forwardTicketModel";
import EditModal from "../components/modals/EditModal";

import ActivityIndicator from "../components/ActivityIndicator.js";

import {
  statusName,
  humanizeDurationTime,
  STATUS_RESOLVED,
  STATUS_OPEN,
} from "../utility/helpers";

import styles from "../assets/styleScript/ticketDetail.style";
import EditRequestorModal from "../components/modals/EditRequestorModal";

function TicketDetailScreen({ navigation, route }) {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const onClick = () => setModalVisible(true);
  const window = useWindowDimensions();
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [forwardModalVisible, setForwardModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [colorPickerModal, setColorPickerModal] = useState(false);
  const [EditableField, setEditableField] = useState(false);
  const [dropdownModal, setDropDownModal] = useState(false);
  const [editRequestorModalVisible, setEditRequestorModalVisible] =
    useState(false);

  const [editTeam, setEditTeam] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [editAssign, setEditAssign] = useState(false);
  const [editBookingId, setEditBookingId] = useState(false);
  const [editBookingIssue, setEditBookingIssue] = useState(false);
  const [commentResolvedModal, setCommentResolvedModal] = useState(false);

  const [assigneeList, setAssigneeList] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [intentList, setIntentList] = useState([]);
  const [faqList, setFaqList] = useState([]);

  const [ticketDetail, setTicketDetail] = useState();
  const [loading, setLoading] = useState(false);

  const item = route.params?.item;

  const { metaData } = useContext(Context);
  const comments = ["open", "solved", "Resolved"];

  const [selection, setSelection] = useState(1);

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

      const intents =
        (metaData.intents &&
          metaData.intents.map((d) => ({
            label: d.intent,
            value: d.id,
          }))) ||
        [];

      setIntentList(intents);

      const faqs =
        (metaData.faqs &&
          metaData.faqs.map((d) => ({
            label: d.question,
            value: d.id,
          }))) ||
        [];

      setFaqList(faqs);
    }
  }, [metaData]);

  useEffect(() => {
    if (!!item) {
      fetchTicketDetails(item.id);
    }
  }, [item]);

  const fetchTicketDetails = async (ticketId) => {
    setLoading(true);
    const { ok, status, data } = await listingsApi.getTicketDetails(ticketId);

    if (!ok) {
      if (data === "Invalid token.") logOut();
    }

    if (status === 200) {
      setTicketDetail(data.data);
    }
    setLoading(false);
  };

  const ShowToast = () => {
    Toast.show({
      type: "success",
      text1: "Hello",
      visibilityTime: 4000,
      autoHide: true,
    });
  };

  const items = [{ value: "Data Not Found", label: "Data Not Found " }];

  const UpdateFieldDropdown = ({
    items: itemList,
    name,
    placeholder,
    selectedItem,
    onSubmit,
    updateButtonTitle,
  }) => {
    const initialValues = { name: null };
    return (
      <Form initialValues={initialValues} onSubmit={onSubmit}>
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View style={styles.EditOption}>
            <View style={styles.detailPickerView}>
              <Picker
                items={itemList}
                name={name}
                placeholder={placeholder}
                selectedItem={selectedItem}
                style={styles.picker}
              />
            </View>

            <IconButton
              icon="check"
              color={"#3A75BA"}
              style={styles.updateButton}
              size={18}
              onPress={handleSubmit}
            />
          </View>
        )}
      </Form>
    );
  };

  const updateTicketItem = async (req) => {
    setLoading(true);

    const res = await listingsApi.updateTicketDetail(ticketDetail.id, req);

    if (res.status === 200) {
      await fetchTicketDetails(ticketDetail.id);
      Toast.show({
        type: "success",
        text1: "Successfully Updated The Ticket",
        visibilityTime: 4000,
        autoHide: true,
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Ticket not updated",
        visibilityTime: 4000,
        autoHide: true,
      });
    }

    setLoading(false);
  };

  const mergeTicketsByDate = (comments) => {
    let mergeComments = [];
    let mapComments = [];
    if (comments.length) {
      const lastCommentDate = dateFormat(
        comments[comments.length - 1]?.updated_at.replace(/ /g, "T"),
        "yyyy-mm-dd h:MM"
      );

      const ticketCreatAt = dateFormat(
        ticketDetail?.created_at?.replace(/ /g, "T"),
        "yyyy-mm-dd h:MM"
      );

      if (lastCommentDate === ticketCreatAt) {
        comments.pop();
      }
      mergeComments = Array.from(
        comments
          .reduce(
            (entryMap, e) =>
              entryMap.set(e.created_at, [
                ...(entryMap.get(e.created_at) || []),
                e,
              ]),
            new Map()
          )
          .values()
      );

      mapComments = mergeComments.map((d) => {
        if (d.length > 1) {
          const c = d[0].hasOwnProperty("intent") ? d[0] : d[1];
          // d = { ...d[0], ...d[1] };
          d = c;
        } else {
          d = d[0];
        }
        return d;
      });

      // console.log(mergeComments);
    }
    return mapComments;
  };

  const handleForwardTicket = async (rdata) => {
    const res = await listingsApi.forwardTicket(ticketDetail.id, rdata);

    // const { status } = await request("POST", endPoint, [], rdata);

    if (res.status === 200) {
      Toast.show({
        type: "success",
        text1: `Forwarded email to ${rdata.email}`,
        visibilityTime: 4000,
        autoHide: true,
      });

      setForwardModalVisible(false);
    }
  };

  return (
    <Provider>
      <ActivityIndicator visible={loading} />
      <Layout navigation={navigation} route={route}>
        <>
          {ticketDetail && (
            <View style={styles.container}>
              <View style={styles.boxes}>
                <AppText style={styles.headingOne}>
                  {/* <View style={styles.statusBox}>
                    {/* <AppText style={styles.status}>
                      {/* {statusName(ticketDetail.status)} 
                    </AppText> 
                  </View> */}
                  #{ticketDetail?.id}. {ticketDetail.title}{" "}
                  {EditableField && (
                    <Entypo
                      name="edit"
                      size={16}
                      color="#3A75BA"
                      onPress={() => setEditModalVisible(!editModalVisible)}
                    />
                  )}
                  <Entypo
                    name="forward"
                    size={16}
                    color="#3A75BA"
                    onPress={() => setForwardModalVisible(true)}
                  />
                </AppText>
                <HTML
                  contentWidth={window.width}
                  source={{ html: ticketDetail.title }}
                />
                <AppText style={styles.headingTwo}>
                  {ticketDetail.requester.name}
                </AppText>
                <AppText style={styles.headingThree}>
                  {ticketDetail.requester.email}
                </AppText>
                {EditableField && (
                  <Entypo
                    name="edit"
                    size={16}
                    color="#3A75BA"
                    onPress={() =>
                      setEditRequestorModalVisible(!editRequestorModalVisible)
                    }
                  />
                )}
                <AppText style={styles.headingFour}>
                  {dateFormat(
                    ticketDetail.created_at.replace(/ /g, "T"),
                    "yyyy-mm-dd H:MM"
                  )}
                </AppText>
                {ticketDetail?.avg_time_to_solve?.minutes > 0 && (
                  <View style={{ flexDirection: "row" }}>
                    <AppText>Time to solve ticket </AppText>
                    <AppText>
                      {humanizeDurationTime(
                        ticketDetail?.avg_time_to_solve?.minutes
                      )}
                    </AppText>
                  </View>
                )}
                <View>
                  <View style={styles.btnGroup}>
                    {statusName(ticketDetail.status) !== "Solved" && (
                      <TouchableOpacity
                        style={[styles.btn, { backgroundColor: "#3A75BA" }]}
                        onPress={() =>
                          updateTicketItem({
                            status: STATUS_OPEN,
                          })
                        }>
                        <Text style={[styles.btnText, { color: "white" }]}>
                          Set Solved
                        </Text>
                      </TouchableOpacity>
                    )}
                    {statusName(ticketDetail.status) !== "Open" && (
                      <TouchableOpacity
                        style={[
                          styles.btn,
                          {
                            backgroundColor: "#6B728012",
                          },
                        ]}
                        onPress={() =>
                          updateTicketItem({
                            status: STATUS_RESOLVED,
                          })
                        }>
                        <Text style={[styles.btnText, { color: "black" }]}>
                          Re-open
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
              <ScrollView>
                <View style={styles.innerBox}>
                  <View style={styles.inputBox}>
                    <AppText style={styles.inputHeading}>Team</AppText>
                    <View style={styles.inputData}>
                      {EditableField ? (
                        <UpdateFieldDropdown
                          items={teamList}
                          name="team"
                          placeholder="Teams"
                          selectedItem={{
                            value: ticketDetail.team.id,
                            label: ticketDetail.team.name,
                          }}
                          onSubmit={(values) => {
                            updateTicketItem({
                              team_id: values.team.value,
                            });
                            setEditTeam(!editTeam);
                          }}
                        />
                      ) : (
                        <AppText style={styles.inputSubHeading}>
                          {ticketDetail.team?.name}
                        </AppText>
                      )}
                    </View>
                  </View>

                  <View style={styles.inputBox}>
                    <AppText style={styles.inputHeading}>
                      SmartDraft Intent
                    </AppText>
                    <View style={styles.inputData}>
                      <AppText style={styles.inputSubHeading}>
                        {ticketDetail.smartdraft_intent}
                      </AppText>
                    </View>
                  </View>

                  <View style={styles.inputBox}>
                    <AppText style={styles.inputHeading}>Intent</AppText>
                    <View style={styles.inputData}>
                      {EditableField ? (
                        <UpdateFieldDropdown
                          items={intentList}
                          name="intent"
                          placeholder="Intents"
                          updateButtonTitle="Smart Action"
                          selectedItem={() => {
                            if (!!ticketDetail.intent) {
                              return intentList
                                .find((d) => d.id === ticketDetail.intent)
                                .map((dt) => ({
                                  value: dt.id,
                                  label: dt.intent,
                                }));
                            }
                            return;
                          }}
                          onSubmit={(values) => {
                            // updateTicketItem({
                            //   team_id: values.team.value,
                            // });
                            // setEditTeam(!editTeam);
                          }}
                        />
                      ) : (
                        <AppText style={styles.inputSubHeading}>
                          {ticketDetail.intent || "No Intent Selected"}
                        </AppText>
                      )}
                    </View>
                  </View>

                  <View style={styles.inputBox}>
                    <AppText style={styles.inputHeading}>Tags</AppText>
                    <View style={styles.inputData}>
                      <AppText style={styles.inputSubHeading}></AppText>
                    </View>
                  </View>

                  <View style={styles.inputBox}>
                    <AppText style={styles.inputHeading}>Assignee</AppText>
                    <View style={styles.inputData}>
                      {EditableField ? (
                        <UpdateFieldDropdown
                          items={assigneeList}
                          name="assignee"
                          placeholder="Assignee"
                          selectedItem={() => {
                            if (!!ticketDetail.user_id) {
                              return assigneeList
                                .find((d) => d.id === ticketDetail.user_id)
                                .map((dt) => ({
                                  value: d.id,
                                  label: d.name,
                                }));
                            }
                          }}
                          onSubmit={(values) => {
                            updateTicketItem({
                              user_id: values.assignee.value,
                            });
                            setEditAssign(!editAssign);
                          }}
                        />
                      ) : (
                        <AppText style={styles.inputSubHeading}>
                          {ticketDetail.user_id &&
                            assigneeList.find(
                              (d) => d.value === ticketDetail.user_id
                            ).label}
                        </AppText>
                      )}
                    </View>
                  </View>

                  <View style={styles.inputBox}>
                    <AppText style={styles.inputHeading}>Row Color</AppText>

                    <View style={styles.inputData}>
                      <AppText
                        style={[
                          styles.inputSubHeading,
                          { backgroundColor: ticketDetail?.assigned_row_color },
                        ]}>
                        {ticketDetail?.assigned_row_color}
                      </AppText>
                      {EditableField && (
                        <IconButton
                          icon={() => (
                            <MaterialIcons
                              name="color-lens"
                              size={20}
                              color="#3A75BA"
                            />
                          )}
                          style={styles.updateButton}
                          size={18}
                          onPress={() => {
                            setColorPickerModal(true);
                          }}
                        />
                      )}
                    </View>
                  </View>
                  <View style={styles.inputBox}>
                    <AppText style={styles.inputHeading}>Booking ID</AppText>
                    <View style={styles.inputData}>
                      {EditableField ? (
                        <View style={styles.EditOption}>
                          <TextInput
                            style={styles.EditTextInput}
                            value={"text"}
                          />
                          <IconButton
                            icon="check"
                            color={"#3A75BA"}
                            style={styles.updateButton}
                            size={18}
                            onPress={() => console.log("press")}
                          />
                        </View>
                      ) : (
                        <AppText style={styles.inputSubHeading}></AppText>
                      )}
                    </View>
                  </View>

                  <View style={styles.inputBox}>
                    <AppText style={styles.inputHeading}>Booking Issue</AppText>
                    <View style={styles.inputData}>
                      {EditableField ? (
                        <View style={styles.EditOption}>
                          <TextInput
                            style={styles.EditTextInput}
                            // onChangeText={onChangeText}
                            value={"text"}
                          />
                          <IconButton
                            icon="check"
                            color={"#3A75BA"}
                            style={styles.updateButton}
                            size={18}
                            onPress={() => console.log("press")}
                          />
                        </View>
                      ) : (
                        <AppText style={styles.inputSubHeading}></AppText>
                      )}
                    </View>
                  </View>

                  <View style={{ marginBottom: 5 }}>
                    <View>
                      <AppText style={[styles.para, { fontWeight: "700" }]}>
                        Latest Activities
                      </AppText>

                      <View>
                        <>
                          {ticketDetail &&
                            ticketDetail.comments.length > 0 &&
                            mergeTicketsByDate(ticketDetail.comments)
                              .filter(
                                (d) => d?.created_at !== ticketDetail.created_at
                              )
                              .map((val, ind) => (
                                <View key={val.id} style={styles.activityList}>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      justifyContent: "space-between",
                                    }}>
                                    <AppText style={styles.headingTwo}>
                                      {val.user && val?.user.name}
                                    </AppText>
                                    <AppText style={styles.headingTwo}>
                                      {val?.updated_at}
                                    </AppText>
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      justifyContent: "space-between",
                                    }}>
                                    <AppText style={styles.headingTwo}>
                                      {val.email}
                                    </AppText>
                                  </View>
                                  <View style={{ flexGrow: 1 }}>
                                    <HTML
                                      contentWidth={window.width / 5}
                                      source={{ html: val?.body }}
                                    />
                                    {!val?.body.attachments && (
                                      <View
                                        style={{
                                          flexDirection: "row",
                                          padding: 8,
                                          margin: 5,
                                          borderTopWidth: 1,
                                          borderTopColor: "#6B7280",
                                        }}>
                                        <Entypo
                                          name="attachment"
                                          size={16}
                                          color="#6B7280"
                                        />
                                        <AppText style={styles.headingTwo}>
                                          {
                                            val?.body?.attachments?.[0].path
                                              .value
                                          }
                                        </AppText>
                                      </View>
                                    )}
                                  </View>
                                </View>
                              ))}
                          <View style={styles.activityList}>
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}>
                              <AppText style={styles.headingTwo}>
                                {ticketDetail.requester.name}
                              </AppText>
                              <AppText style={styles.headingTwo}>
                                {ticketDetail.updated_at}
                              </AppText>
                            </View>
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}>
                              <AppText style={styles.headingTwo}>
                                {ticketDetail.requester.email}
                              </AppText>
                            </View>
                            <View>
                              <HTML
                                contentWidth={window.width / 5}
                                source={{ html: ticketDetail?.body }}
                              />
                            </View>
                          </View>
                        </>
                      </View>
                    </View>
                  </View>
                  {/* <View style={styles.inputBox}>

                    <AppText style={styles.inputHeading}>FAQ Template</AppText>

                    <View style={styles.inputData}>
                      <AppText style={styles.inputSubHeading}>
                        Select template
                      </AppText>
                      {EditableField && (
                        <Entypo
                          name="edit"
                          size={16}
                          color="#3A75BA"
                          onPress={() => setDropDownModal(!dropdownModal)}
                        />
                      )}
                    </View>
                  </View>
                  <View style={[styles.inputBox, { borderBottomWidth: 0 }]}>
                    <AppText style={styles.inputHeading}>Signature</AppText>

                    <View style={styles.inputData}>
                      <AppText style={styles.inputSubHeading}>
                        Select signature
                      </AppText>
                      {EditableField && (
                        <Entypo
                          name="edit"
                          size={16}
                          color="#3A75BA"
                          onPress={() => setDropDownModal(!dropdownModal)}
                        />
                      )}
                    </View>
                  </View> */}
                  {/* <View>
                    <TextInput
                      multiline={true}
                      numberOfLines={4}
                      style={styles.textArea}
                      placeholder="Write reply here"
                      placeholderTextColor="#B5BDCE"
                    />
                  </View> */}
                  {/* <View>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        setCommentResolvedModal(true);
                      }}>
                      <AppText style={styles.buttonText}>
                        Comment as Resolved
                      </AppText>
                    </TouchableOpacity>
                    <View style={{ flexDirection: "row", flex: 1, margin: 0 }}>
                      <AppButton
                        style={{ flex: 1, margin: 5, marginTop: 5 }}
                        title="set solved"
                      />

                      <AppButton
                        color="gray"
                        style={{
                          flex: 1,
                          margin: 5,
                          marginTop: 5,
                        }}
                        onPress={ShowToast}
                        title="Reopen"
                      />
                    </View>
                  </View> */}
                </View>
              </ScrollView>
            </View>
          )}
        </>

        <View style={{ position: "absolute", right: 10, bottom: 30 }}>
          <View style={styles.filterIcon}>
            <Entypo
              name="edit"
              size={30}
              color="#3A75BA"
              onPress={() => setEditableField(!EditableField)}
            />
          </View>
          <View style={styles.filterIcon}>
            <Entypo
              name="reply"
              size={30}
              color="#3A75BA"
              onPress={() => setReplyModalVisible(!replyModalVisible)}
            />
          </View>
        </View>

        {/* <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}>
          <View style={styles.centeredView}>
            <Screen>
              <Entypo
                name="squared-cross"
                size={30}
                color="#013379"
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
                style={{ textAlign: "right" }}
              />
              <View style={styles.modalBox}>
                <ScrollView>
                  {/* <View style={styles.boxes}>
                    <View style={styles.editInputView}>
                      <TextInput
                        placeholderTextColor={
                          defaultStyles.colors.placeholderColor
                        }
                        style={styles.editInput}
                        autoCapitalize="none"
                        autoCorrect={false}
                        name="Search"
                        placeholder="Search"
                        width="80%"
                        value="#280444. Re: Meddelande om ändring av bokning (bok.nr 1493722)"
                      />
                    </View>
                    <View style={styles.editInputView}>
                      <TextInput
                        placeholderTextColor={
                          defaultStyles.colors.placeholderColor
                        }
                        style={styles.editInput}
                        autoCapitalize="none"
                        autoCorrect={false}
                        name="Search"
                        placeholder="Search"
                        width="80%"
                        value="Hazratqul Khudojberdi - uzbrystolk@gmail.com"
                      />
                    </View>
                    <View style={styles.editInputView}>
                      <TextInput
                        placeholderTextColor={
                          defaultStyles.colors.placeholderColor
                        }
                        style={styles.editInput}
                        autoCapitalize="none"
                        autoCorrect={false}
                        name="Search"
                        placeholder="Search"
                        width="80%"
                        value="18 May 2021 02:26:05"
                      />
                    </View>
                  </View> 
                  <View style={styles.innerBox}>
                    {/* <View style={styles.inputBox}>
                      <AppText style={styles.inputHeading}>Team</AppText>
                      <AppText style={styles.inputSubHeading}>
                        General Support
                      </AppText>
                    </View>
                    <View style={styles.inputBox}>
                      <AppText style={styles.inputHeading}>
                        SmartDraft Intent
                      </AppText>
                      <AppText style={styles.inputSubHeading}>
                        No intent
                      </AppText>
                    </View>
                    <View style={styles.inputBox}>
                      <AppText style={styles.inputHeading}>Intent</AppText>
                      <AppText style={styles.inputSubHeading}>
                        Search intent
                      </AppText>
                    </View>
                    <View style={styles.inputBox}>
                      <AppText style={styles.inputHeading}>Tags</AppText>
                      <AppText style={styles.inputSubHeading}>Email</AppText>
                    </View>
                    <View style={styles.inputBox}>
                      <AppText style={styles.inputHeading}>Assignee</AppText>
                      <AppText style={styles.inputSubHeading}>Ellyza</AppText>
                    </View>
                    <View style={styles.inputBox}>
                      <AppText style={styles.inputHeading}>Row Color</AppText>
                      <AppText style={styles.inputSubHeading}>Default</AppText>
                    </View>
                    <View style={styles.inputBox}>
                      <AppText style={styles.inputHeading}>Booking ID</AppText>
                      <AppText style={styles.inputSubHeading}>Add</AppText>
                    </View>
                    <View style={styles.inputBox}>
                      <AppText style={styles.inputHeading}>
                        Booking Issue
                      </AppText>
                      <AppText style={styles.inputSubHeading}>Add</AppText>
                    </View>
                    <View style={styles.inputBox}>
                      <AppText style={styles.inputHeading}>User ID</AppText>
                      <AppText style={styles.inputSubHeading}>Add</AppText>
                    </View>
                    <View style={{ marginBottom: 5 }}>
                      <AppText style={styles.para}>Hi Admin,</AppText>
                      <AppText style={styles.para}>
                        Iste minus et. Non necessitatibus ut est est id amet.
                        Officiis sequi dolorum assumenda ipsam magnam cum
                        possimus. Laudantium nulla amet tempore excepturi id
                        expedita dolorum quisquam deserunt. Odit vel sint dolor
                        eos. Ea blanditiis animi. Quibusdam unde unde.
                        Perspiciatis vel pariatur qui. Deleniti omnis est quae.
                        Laboriosam numquam amet aliquid.
                      </AppText>
                      <AppText style={styles.para}>
                        Med vänliga hälsningar Hazratqul Khudojberdi Tolk på
                        Uzbekiska och Ryska Telefontolkningar alltid sker per
                        Hemtelefon: 011 10 39 83
                      </AppText>
                    </View> 
                    <View style={styles.inputBox}>
                      <AppText style={styles.inputHeading}>
                        FAQ Template
                      </AppText>
                      <AppText style={styles.inputSubHeading}>
                        Select template
                      </AppText>
                    </View>
                    <View style={[styles.inputBox, { borderBottomWidth: 0 }]}>
                      <AppText style={styles.inputHeading}>Signature</AppText>
                      <AppText style={styles.inputSubHeading}>
                        Select signature
                      </AppText>
                    </View>
                    <View>
                      <TextInput
                        multiline={true}
                        numberOfLines={4}
                        style={styles.textArea}
                        placeholder="Write reply here"
                        placeholderTextColor="#B5BDCE"
                      />
                    </View>
                    <View style={styles.button}>
                      <AppText style={styles.buttonText}>Send</AppText>
                    </View>
                  </View>
                </ScrollView>
              </View>
            </Screen>
          </View>
        </Modal> */}

        <Modal
          animationType="slide"
          transp
          arent={true}
          visible={colorPickerModal}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}>
          <View style={styles.centeredView}>
            <Screen>
              <Entypo
                name="squared-cross"
                size={30}
                color="#013379"
                onPress={() => {
                  setColorPickerModal(!colorPickerModal);
                }}
                style={{ textAlign: "right" }}
              />
              <ColorPicker
                onColorSelected={(color) => {
                  updateTicketItem({ row_color: color });
                  setColorPickerModal(false);
                }}
                style={{ flex: 1 }}
              />
            </Screen>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          // style={styles.centeredView}
          visible={commentResolvedModal}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}>
          <View style={styles.centeredView}>
            <Screen>
              <Entypo
                name="squared-cross"
                size={30}
                color="#013379"
                onPress={() => {
                  setCommentResolvedModal(!commentResolvedModal);
                }}
                style={{ textAlign: "right" }}
              />
              <View>
                {comments.map((val, ind) => (
                  <TouchableOpacity
                    key={ind}
                    style={{
                      marginHorizontal: 5,
                      marginVertical: 5,
                      borderBottomWidth: 1,
                    }}
                    onPress={() => console.log("val")}>
                    <Text>{val}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Screen>
          </View>
        </Modal>

        <Modal visible={dropdownModal} animationType="slide">
          <Screen>
            <Button title="Close" onPress={() => setDropDownModal(false)} />
            <FlatList
              data={
                items || [{ value: "Data Not Found", label: "Data Not Found " }]
              }
              keyExtractor={(item) => item.value.toString()}
              numColumns={1}
              renderItem={({ item }) => (
                <PickerItem
                  item={item}
                  label={item?.label}
                  onPress={() => {
                    setDropDownModal(false);
                    // onSelectItem(item);
                    // console.log(item);
                  }}
                />
              )}
            />
          </Screen>
        </Modal>
        {ticketDetail && (
          <ReplyTicketModel
            isOpen={replyModalVisible}
            onClose={() => {
              setReplyModalVisible(false);
            }}
            faqDropdown={
              <UpdateFieldDropdown
                items={faqList}
                name="Select Template"
                placeholder="Select Template"
                onSubmit={(values) => {
                  updateTicketItem({
                    team_id: values.team.value,
                  });
                  setEditTeam(!editTeam);
                }}
              />
            }
            signDropdown={
              () => <></>
              // <UpdateFieldDropdown
              //   items={[]}
              //   name="Select Signature"
              //   placeholder="Select Signature"
              //   onSubmit={(values) => {
              //     updateTicketItem({
              //       team_id: values.team.value,
              //     });
              //     setEditTeam(!editTeam);
              //   }}
              // />
            }
            data={ticketDetail}
            onSubmit={(reqObj) => {
              updateTicketItem(reqObj);
              setReplyModalVisible(false);
            }}
          />
        )}
        {ticketDetail && (
          <ForwardEmailModal
            isOpen={forwardModalVisible}
            onClose={() => {
              setForwardModalVisible(false);
            }}
            data={ticketDetail}
            onSubmit={(reqObj) => handleForwardTicket(reqObj)}
          />
        )}
        {ticketDetail && (
          <EditModal
            isOpen={editModalVisible}
            data={ticketDetail}
            onClose={() => {
              setEditModalVisible(false);
            }}
            onSubmit={(reqObj) => {
              updateTicketItem(reqObj);
              setEditModalVisible(false);
            }}
          />
        )}
        {ticketDetail && (
          <EditRequestorModal
            isOpen={editRequestorModalVisible}
            data={ticketDetail?.requester}
            onClose={() => {
              setEditRequestorModalVisible(false);
            }}
            onSubmit={(reqObj) => {
              updateTicketItem(reqObj);
              setEditRequestorModalVisible(false);
            }}
          />
        )}
      </Layout>
    </Provider>
  );
}

export default TicketDetailScreen;
