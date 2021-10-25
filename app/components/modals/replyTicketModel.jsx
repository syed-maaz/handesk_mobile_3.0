import React, { useEffect, useState, useContext, useRef } from "react";

import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  // FlatList,
  SafeAreaView,
  Modal,
  CheckBox,
  Alert,
} from "react-native";

import { Entypo } from "@expo/vector-icons";
import {
  actions,
  getContentCSS,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
// import {launchImageLibrary} from 'react-native-image-picker';
import * as ImagePicker from "expo-image-picker";
import AppTextInput from "../TextInput";
import AppText from "../Text";
import AppButton from "../Button";
import listingsApi from "../../api/listings";
import axios from 'axios'
// import { Form, FormField, FormPicker as Picker } from "../forms";
import Picker from "../Picker";
import Screen from "../Screen";

import defaultStyles from "../../config/styles";
import Context from "../../auth/context";

import styles from "../../assets/styleScript/ticketDetail.style";
import { Checkbox } from "react-native-paper";
import { makeMutable } from "react-native-reanimated";

const ReplyTicketModal = ({
  isOpen,
  onSubmit,
  onClose,
  faqDropdown,
  signDropdown,
}) => {
  const [openState, setOpenState] = useState();
  const [ticketId, setTicketId] = useState();
  const [uploaded, setUploaded] = useState(false);

  const [faqList, setFaqList] = useState();

  const { metaData } = useContext(Context);
  const richText = useRef();
  const [article, setArticle] = useState("");

  const [loading, setLoading] = useState();
  const [isInternal, setInternal] = useState(false);
  const [ticketImage, setTicketImage] = useState("");

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Sorry, we need camera roll permissions to make this work!"
          );
        }
      }
    })();
  }, []);

  useEffect(() => {
    setOpenState(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (metaData) {
      const faqs =
        (metaData.faqs &&
          metaData.faqs.map((d) => ({
            label: d.name,
            value: d.id,
          }))) ||
        [];

      setFaqList(faqs);
    }
  }, [metaData]);

  const handleChange = (e) => setTicketId(e.target.value);
  const closeModal = () => {
    onClose();
  };

  const handleSubmit = (val) => {
    onSubmit({ comment: article });
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
      setTicketImage(result.uri);
      console.log(result, "result")
      const res = await listingsApi.signedImageUrl({ url: result.uri });
      console.log("res", res);
      const uploadImage = await axios.put(res.data.url, { headers: res.headers })
      console.log("upload", uploadImage)
      setUploaded(true)
    }

  };
  // console.log(ticketImage
  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isOpen}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}>
        <View style={styles.centeredView}>
          <Screen>
            <Entypo
              name="squared-cross"
              size={30}
              color="#013379"
              onPress={closeModal}
              style={{ textAlign: "right" }}
            />
            <View style={styles.modalBox}>
              <AppText style={styles.headingOne}>Reply </AppText>

              <ScrollView>
                <View style={styles.innerBox}>
                  <View style={styles.inputBox}>
                    <AppText style={styles.inputHeading}>FAQ Template</AppText>
                    <View style={styles.inputData}>{faqDropdown}</View>
                  </View>
                  {/* <View style={[styles.inputBox, { borderBottomWidth: 0 }]}>
                    <AppText style={styles.inputHeading}>Signature</AppText>
                    <View style={styles.inputData}>{signDropdown}</View>
                  </View> */}
                  {/*  */}

                  {/* <Picker
                      items={teamList}
                      name={"Select"}
                      width="50%"
                      placeholder="Select signature"
                      // onSelectItem={"Select Signature"}
                      selectedItem={() => {
                        if (!!teamList) {
                          return teamList
                            .map((dt) => ({
                              value: dt.id,
                              label: dt.intent,
                            }));
                        }
                        return;
                      }}
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
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}>
                    <AppText style={{ margin: 2 }}>Internal Comment</AppText>
                    {/* <CheckBox
                      value={isInternal}
                      onValueChange={setInternal}
                    /> */}
                    <Checkbox
                    mode="ios"
                      color="#3d7ab9"
                      status={isInternal ? "checked" : "unchecked"}
                      onPress={() => {
                        setInternal(!isInternal);
                      }}
                      style={{borderRadius:5,borderColor:"black",borderWidth:1}}
                    />
                  </View>

                  <View style={{flex:1,width:200}}>
                    <AppButton
                      title="Choose Image"
                      style={{ marignTop: 5, padding: 0, borderRadius: 5 }}
                      onPress={pickImage}
                    />
                   {uploaded  && <AppText style={styles.headingTwo}>Image uploaded</AppText>}
                  </View>
                  <View style={styles.button}>
                    <AppText
                      style={styles.buttonText}
                      onPress={() => {
                        handleSubmit();
                      }}>
                      Send
                    </AppText>
                  </View>
                </View>
              </ScrollView>
            </View>
          </Screen>
        </View>
      </Modal>
    </>
  );
};

export default ReplyTicketModal;
