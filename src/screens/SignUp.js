import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../config";
import { useTranslation } from "react-i18next";
import { isValidEmail } from "../utils/isValidEmail";

const SignupScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ showMessage: false, message: "" });
  const throwError = (message, duration) => {
    setError({
      showMessage: true,
      message: message,
    });
    setTimeout(() => {
      setError({
        showMessage: false,
        message: "",
      });
    }, duration);
  };
  const handleSignup = async () => {
    if (!isValidEmail(email)) {
      console.error("Invalid email address");
      throwError("Invalid mail adress!", 3000);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
      if (response.ok) {
        setTimeout(() => {
          navigation.navigate("SignIn");
        }, 1000);
      } else {
        const responseData = await response.json();
        console.error("Sign Up Error:", responseData.error);
      }
    } catch (error) {
      console.error(
        "An error occurred during the registration process:",
        error
      );
    }
  };

  return (
    <View className="bg-[#fdb97e] flex-1 justify-center items-center">
      <Image
        style={{ resizeMode: "contain" }}
        source={require("../assets/logo.png")}
        className="max-w-full"
      ></Image>

      <View>
        <TextInput
          placeholder={t("SignUp.username")}
          value={username}
          onChangeText={setUsername}
          className="w-80 h-10 border border-black border-spacing-2 p-2 mb-2"
          placeholderTextColor="black"
        />
        <TextInput
          placeholder={t("SignUp.email")}
          value={email}
          onChangeText={setEmail}
          className="w-80 h-10 border border-black border-spacing-2 p-2 mb-2"
          placeholderTextColor="black"
        />
        <TextInput
          placeholder={t("SignUp.password")}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="w-80 h-10 border border-black border-spacing-2 p-2 mb-2"
          placeholderTextColor="black"
        />
        <TouchableOpacity
          onPress={handleSignup}
          className="bg-dark rounded-xl mb-8  "
        >
          <Text className="text-white p-2 font-bold text-xl text-center">
            {t("SignUp.btn")}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center ">
        <Text className="text-black">{t("SignUp.red")}</Text>
        <Text
          onPress={() => navigation.navigate("SignIn")}
          className="underline mx-2 text-black"
        >
          {t("SignUp.under")}
        </Text>
      </View>
      <View className="mt-10 w-full ">
        {error.showMessage && (
          <Text className="bg-red-600 text-white text-xl p-2 text-center  w-full">
            {error.message}
          </Text>
        )}
      </View>
    </View>
  );
};

export default SignupScreen;
