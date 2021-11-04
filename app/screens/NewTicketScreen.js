import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
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
import { useNavigation } from "@react-navigation/native";

import AppText from "../components/Text";
import AppButton from "../components/Button";
import colors from "../config/colors";
import defaultStyles from "../config/styles";
import Layout from "../components/Layout.js";
import Screen from "../components/Screen";
import Context from "../auth/context";
import { getStatusList } from "../utility/helpers";
import ActivityIndicator from "../components/ActivityIndicator";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import listingsApi from "../api/listings";

import { Form, FormField, FormPicker as Picker } from "../components/forms";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";

function NewTicketScreen({ navigation, route }) {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const onClick = () => setModalVisible(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [assigneeList, setAssigneeList] = useState();
  const [teamList, setTeamList] = useState();
  const [intentList, setIntentList] = useState();
  const [statusList, setStatusList] = useState();
  const [faqList, setFaqList] = useState([]);
  const [uploaded, setUploaded] = useState(false);
  const richText = useRef();
  const [article, setArticle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { metaData } = useContext(Context);

  // const navigation = useNavigation();

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
            label: d.name,
            value: d.id,
          }))) ||
        [];

      setIntentList(teams);

      const faqs =
        (metaData.faqs &&
          metaData.faqs.map((d) => ({
            label: d.question,
            value: d.id,
          }))) ||
        [];

      setFaqList(faqs);

      setStatusList(getStatusList());
    }
  }, [metaData]);

  const handleSubmit = async (values) => {
    const reqData = {
      title: values.subject,
      requester: {
        name: values.requester_name,
        email: values.requester_email,
      },
      body: article,
      team_id: values.team,
      status: values.status,
      user_id: values.assignee,
      // tags: selectedTags.map((d) => d.name),
      intent: values.intent,
      // attachments,
    };

    try {
      setLoading(true);
      const resp = await listingsApi.ticketCreate(reqData);
      const { ok, status, data } = resp;

      setError(!ok);

      if (!!ok && status === 200) {
        Alert.alert("Ticket Created successful");

        navigation.navigate("Ticket", {
          item: props.item,
        });
        onRetryApi();
      }
      setLoading(true);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
    setLoading(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [8, 4],
      quality: 1,
    });

    // console.log(result);

    if (!result.cancelled) {
      // console.log(result, "result")
      const res = await listingsApi.signedImageUrl({ url: result.uri });
      // console.log("res", res);
      const uploadImage = await axios.put(res.data.url, {
        headers: res.headers,
      });
      // console.log("upload", uploadImage)
      setUploaded(true);
    }
  };

  return (
    <Provider>
      <ActivityIndicator visible={loading} />
      <Layout headerTitle="New Ticket" navigation={navigation} route={route}>
        <ScrollView>
          <Form
            initialValues={{
              teams: null,
            }}
            onSubmit={handleSubmit}>
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View style={styles.container}>
                <View style={styles.innerBox}>
                  <View>
                    <AppText style={styles.inputHeading}>
                      Requester Name
                    </AppText>
                    <View>
                      <FormField
                        placeholderTextColor={
                          defaultStyles.colors.placeholderColor
                        }
                        autoCapitalize="none"
                        autoCorrect={false}
                        name="requested_name"
                        placeholder="Requester Name"
                      />
                    </View>
                  </View>

                  <View>
                    <AppText style={styles.inputHeading}>
                      Requester Name
                    </AppText>
                    <View>
                      <FormField
                        placeholderTextColor={
                          defaultStyles.colors.placeholderColor
                        }
                        autoCapitalize="none"
                        autoCorrect={false}
                        name="requester_email"
                        placeholder="Requester Email"
                      />
                    </View>
                  </View>

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
                  <View>
                    <AppText style={styles.inputHeading}>Intent</AppText>
                    <View style={styles.filterInputView}>
                      <Picker
                        items={intentList}
                        name="intent"
                        placeholder="Intent"
                        style={{ width: "100%" }}
                      />
                    </View>
                  </View>
                  <View>
                    <AppText style={styles.inputHeading}>Tags</AppText>
                    <View>
                      <FormField
                        placeholderTextColor={
                          defaultStyles.colors.placeholderColor
                        }
                        autoCapitalize="none"
                        autoCorrect={false}
                        name="tags"
                        placeholder="Tags"
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
                        style={{ width: "100%" }}
                      />
                    </View>
                  </View>
                  <View>
                    <AppText style={styles.inputHeading}>Assignee</AppText>
                    <View style={styles.filterInputView}>
                      <Picker
                        items={assigneeList}
                        name="team"
                        placeholder="Assignee"
                        style={{ width: "100%" }}
                      />
                    </View>
                  </View>

                  <View>
                    <AppText style={styles.inputHeading}>FAQ</AppText>
                    <View style={styles.filterInputView}>
                      <Picker
                        items={faqList}
                        name="team"
                        placeholder="FAQs"
                        style={{ width: "100%" }}
                      />
                    </View>
                  </View>

                  <View>
                    <AppText style={styles.inputHeading}>Comments</AppText>
                    <View>
                      {/* <FormField
                        placeholderTextColor={
                          defaultStyles.colors.placeholderColor
                        }
                        multiline={true}
                        numberOfLines={4}
                        style={styles.textArea}
                        autoCapitalize="none"
                        autoCorrect={false}
                        name="comment"
                        placeholder="Comments"
                      /> */}
                      <View>
                        <RichEditor
                          disabled={false}
                          containerStyle={{
                            backgroundColor: "black",
                            borderColor: "grey",
                            borderWidth: 1,
                          }}
                          initialHeight={250}
                          ref={richText}
                          style={{ height: 500, backgroundColor: "#F5FCFF" }}
                          placeholder={"Start Writing Here"}
                          onChange={(text) => setArticle(text)}
                        />
                        <RichToolbar editor={richText} />
                      </View>
                    </View>
                  </View>
                  <View>
                    <AppText style={styles.inputHeading}>Status</AppText>
                    <View style={styles.filterInputView}>
                      <Picker
                        items={statusList}
                        name="status"
                        placeholder="Status"
                        style={{ width: "100%" }}
                      />
                    </View>
                  </View>
                  <View style={{ flex: 1, width: 200 }}>
                    <AppButton
                      title="Choose Image"
                      style={{ marignTop: 5, padding: 0, borderRadius: 5 }}
                      onPress={pickImage}
                    />
                    {uploaded && (
                      <AppText style={styles.headingTwo}>
                        Image uploaded
                      </AppText>
                    )}
                  </View>
                  <AppButton
                    title="Create Ticket"
                    style={{ width: "100%" }}
                    onPress={handleSubmit}
                  />
                </View>
              </View>
            )}
          </Form>
        </ScrollView>
      </Layout>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
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
    width: 59.46,
    height: 59.46,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#00000029",
    borderWidth: 0.5,
  },
  boxes: {
    margin: 10,
    marginTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#B5BDCE",
    paddingBottom: 20,
  },
  headingOne: {
    color: "#545454",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  headingTwo: {
    color: "#3A75BA",
    fontSize: 14,
    fontWeight: "normal",
    marginBottom: 5,
  },
  headingThree: {
    color: "#A2AAB7",
    fontSize: 14,
    fontWeight: "normal",
  },
  headingFour: {
    color: "#A2AAB7",
    fontSize: 14,
    fontWeight: "normal",
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
  inputHeading: {
    color: "#748AA1",
    fontSize: 14,
    fontWeight: "normal",
  },
  inputSubHeading: {
    color: "#545454",
    fontSize: 14,
    fontWeight: "normal",
  },
  para: {
    color: "#4D4F5C",
    fontSize: 15,
    marginTop: 15,
  },
  textArea: {
    backgroundColor: "#fff",
    borderRadius: 4,
    borderColor: "#E8E9EC",
    borderWidth: 0.5,
    minHeight: 190,
    padding: 10,
    paddingTop: 10,
    marginVertical: 5,
  },
  button: {
    backgroundColor: "#3A75BA",
    height: 59,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 15,
    marginBottom: 10,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  centeredView: {
    height: "100%",
    marginTop: "auto",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.18)",
    padding: 10,
    paddingTop: 40,
  },
  modalBox: {
    padding: 0,
    marginTop: 10,
  },
  editInput: {
    width: "100%",
    padding: 10,
    borderWidth: 0,
  },
  editInputView: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    marginVertical: 5,
    borderWidth: 0.5,
    borderColor: "#30303033",
    borderRadius: 12,
  },
  editInput: {
    width: "85%",
    padding: 10,
    borderWidth: 0,
  },
  editInputView: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    marginVertical: 5,
    borderWidth: 0.2,
    borderColor: "#30303033",
  },
  filterInputView: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    marginVertical: 10,
    borderWidth: 0.5,
    borderColor: "#30303033",
    borderRadius: 12,
    position: "relative",
    width: "100%",
  },
  filterInputLabel: {
    position: "absolute",
    top: -10,
    left: 4,
  },
});

export default NewTicketScreen;
