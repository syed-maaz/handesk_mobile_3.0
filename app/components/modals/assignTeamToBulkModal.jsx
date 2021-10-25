import React, { useEffect, useState, useContext } from "react";

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

import { Form, FormField, FormPicker as Picker } from "../forms";

import defaultStyles from "../../config/styles";
import Context from "../../auth/context";

const MergeTicketModal = ({ isOpen, onSubmit, onClose }) => {
  const [openState, setOpenState] = useState();
  const [ticketId, setTicketId] = useState();

  const [teamList, setTeamList] = useState();

  const { metaData } = useContext(Context);

  useEffect(() => {
    // setTitle(title);
    setOpenState(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (metaData) {
      const teams =
        (metaData.teams &&
          metaData.teams.map((d) => ({
            label: d.name,
            value: d.id,
          }))) ||
        [];

      setTeamList(teams);
    }
  }, [metaData]);

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
          team: null,
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
              Please, select team to assign
            </AppText>
            <View>
              <AppText style={styles.mergeModalLabel}>Teams:</AppText>

              <Picker
                items={teamList}
                name="team"
                placeholder="Teams"
                width="100%"
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
