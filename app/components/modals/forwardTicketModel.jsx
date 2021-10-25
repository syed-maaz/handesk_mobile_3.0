import React, { useEffect, useState, useContext, useRef } from "react";

import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  //   TextInput,
  // FlatList,
  SafeAreaView,
  Modal,
  CheckBox,
} from "react-native";

import { Entypo } from "@expo/vector-icons";
import {
  actions,
  getContentCSS,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";

import AppTextInput from "../TextInput";
import AppText from "../Text";
import AppButton from "../Button";

import { Form, FormField, FormPicker as Picker } from "../../components/forms";
import Screen from "../Screen";

import defaultStyles from "../../config/styles";
import Context from "../../auth/context";

import styles from "../../assets/styleScript/ticketDetail.style";

const ForwardEmail = ({ isOpen, label, onSubmit, onClose }) => {
  const [openState, setOpenState] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const richText = useRef();
  const [article, setArticle] = useState("");

  useEffect(() => {
    setOpenState(isOpen);
  }, [isOpen]);

  const closeModal = () => {
    onClose();
  };

  const handleSubmit = (e) => {
    // e.preventDefault();
    onSubmit({ name, email, message: article });
  };

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
              <AppText style={styles.headingOne}>Forward </AppText>

              <ScrollView>
                <View style={styles.innerBox}>
                  <View>
                    <AppText style={styles.inputHeading}>Name: </AppText>
                    <View>
                      <AppTextInput
                        onChangeText={(text) => {
                          setName(text);
                        }}
                        value={name}
                      />
                    </View>
                  </View>
                  <View>
                    <AppText style={styles.inputHeading}>Email: </AppText>
                    <View>
                      <AppTextInput
                        onChangeText={(text) => {
                          setEmail(text);
                        }}
                        value={email}
                      />
                    </View>
                  </View>

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

export default ForwardEmail;
