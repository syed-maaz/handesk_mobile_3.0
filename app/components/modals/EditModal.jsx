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

import { Form, FormField, FormPicker as Picker } from "../forms";
import Screen from "../Screen";

import defaultStyles from "../../config/styles";
import Context from "../../auth/context";

import styles from "../../assets/styleScript/ticketDetail.style";

const EditModal = ({ isOpen, label, onSubmit, onClose, data }) => {
  // console.log(data)
  const [openState, setOpenState] = useState("");
  const [title, setTitle] = useState(data?.title || "");

  useEffect(() => {
    setOpenState(isOpen);
  }, [isOpen]);

  const closeModal = () => {
    onClose();
  };

  const handleSubmit = (e) => {
    // e.preventDefault();
    onSubmit({ title });
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
              <AppText style={styles.headingOne}>Edit Ticket Title </AppText>

              <ScrollView>
                <View style={styles.innerBox}>
                  <View>
                    <AppText style={styles.inputHeading}>Title: </AppText>
                    <View>
                      <AppTextInput
                        onChangeText={(text) => {
                          setTitle(text);
                        }}
                        value={title}
                      />
                    </View>
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

export default EditModal;
