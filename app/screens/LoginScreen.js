import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Yup from "yup";

import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import colors from "../config/colors";
import AppText from "../components/Text";
import authApi from "../api/auth";
import useAuth from "../auth/useAuth";
import useApi from "../hooks/useApi";
import ActivityIndicator from "../components/ActivityIndicator";

import OneSignal from "../utility/Onesignal";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function LoginScreen() {
  const loginApi = useApi(authApi.login);
  const auth = useAuth();
  const [loginFailed, setLoginFailed] = useState(false);

  const handleSubmit = async ({ email, password }) => {
    const result = await loginApi.request(email, password);
    if (!result.ok) return setLoginFailed(true);
    setLoginFailed(false);
    OneSignal.enabledPush(result.data.user.id, email);
    auth.logIn(result.data);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.mainContainer}>
      <ActivityIndicator visible={loginApi.loading} />
      <View style={styles.container}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <View style={styles.headingBox}>
          <AppText style={styles.heading}>Welcome</AppText>
          <AppText style={styles.subHeading}>to DigitalTalk Handesk</AppText>
        </View>
        <Form
          initialValues={{ email: "", password: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}>
          <>
            <ErrorMessage
              error="Invalid email and/or password."
              visible={loginFailed}
            />
            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              name="email"
              placeholder="Email Address"
              textContentType="emailAddress"
              width="80%"
            />
            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              name="password"
              placeholder="Password"
              secureTextEntry
              textContentType="password"
              width="80%"
            />
            <SubmitButton title="Login" />
            <View style={styles.box}>
              <AppText style={styles.text}>
                By login to our platform, you agree to our{" "}
                <AppText style={styles.boldText}>Terms of Service</AppText> and{" "}
                <AppText style={styles.boldText}>Privacy Policy</AppText>
              </AppText>
            </View>
          </>
        </Form>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F7F9F9",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    marginBottom: 40,
    resizeMode: "stretch",
  },
  forgot: {
    color: colors.primary,
    fontSize: 11,
  },
  enroll: {
    position: "absolute",
    bottom: 40,
    right: 42,
    flex: 1,
    flexDirection: "row",
  },
  headingBox: {
    textAlign: "left",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    width: "85%",
    marginLeft: 40,
    marginBottom: 10,
  },
  heading: {
    fontSize: 22,
    color: "#3E75C2",
    fontWeight: "bold",
  },
  subHeading: {
    fontSize: 12,
    color: "#3E75C2",
    fontWeight: "bold",
  },
  box: {
    width: "50%",
  },
  text: {
    fontSize: 11,
    color: "#545454",
    textAlign: "center",
  },
  boldText: {
    color: "#545454",
    fontSize: 11,
    fontWeight: "bold",
  },
});

export default LoginScreen;
