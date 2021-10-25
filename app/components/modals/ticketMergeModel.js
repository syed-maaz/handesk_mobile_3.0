import React, { useEffect, useState } from "react";

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
} from "react-native";

import { Entypo } from "@expo/vector-icons";

import AppTextInput from "../TextInput";
import AppText from "../Text";
import AppButton from "../Button";

import { Form, FormField, FormPicker as Picker } from "../../components/forms";

import defaultStyles from "../../config/styles";

const MergeTicketModal = ({ isOpen, onSubmit, onClose }) => {
  const [openState, setOpenState] = useState();
  const [ticketId, setTicketId] = useState();

  const [userList, setUserList] = useState();

  useEffect(() => {
    // setTitle(title);
    setOpenState(isOpen);
  }, [isOpen]);

  const handleChange = (e) => setTicketId(e.target.value);

  const closeModal = () => {
    onClose();
    setOpenState(false);
  };

  const handleSubmit = (e) => {
    onSubmit(ticketId);
  };

  return (
    <Modal animationType="slide" visible={isOpen} style={{ height: "50%" }}>
      <Form
        initialValues={{
          ticket_id: null,
        }}
        onSubmit={onSubmit}>
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View style={styles.centeredView}>
            <Entypo
              name="squared-cross"
              size={30}
              color="#013379"
              onPress={onClose}
              style={{ textAlign: "right" }}
            />
            <AppText style={styles.mergeModalHead}>
              Please, enter the ticket number to merge to
            </AppText>
            <View>
              <AppText style={styles.mergeModalLabel}>Ticket</AppText>

              <FormField
                placeholderTextColor={defaultStyles.colors.placeholderColor}
                autoCapitalize="none"
                autoCorrect={false}
                name="ticket_id"
                placeholder="Search"
              />
              <AppButton
                title={"Submit"}
                onPress={handleSubmit}
                style={{ width: "20%", alignSelf: "flex-end" }}
              />
            </View>
          </View>
        )}
      </Form>
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
  mergeModalHead: {
    fontSize: 22,
    fontWeight: "bold",
  },
  mergeModalLabel: { marginTop: 8, fontSize: 16 },
});

export default MergeTicketModal;
