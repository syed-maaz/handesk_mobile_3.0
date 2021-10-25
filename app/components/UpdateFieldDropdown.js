import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Form, FormField, FormPicker as Picker } from "./forms";

const UpdateFieldDropdown = ({
    items: itemList,
    name,
    placeholder,
    selectedItem,
    onSubmit,
    updateButtonTitle
  }) => {
    const initialValues = { name: null };
    console.log(selectedItem);
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
              />
            </View>

            <AppButton
              onPress={handleSubmit}
              title={updateButtonTitle || "Update"}
              color="primary"
              style={styles.updateButton}
            />
          </View>
        )}
      </Form>
    );
  };

export default UpdateFieldDropdown
