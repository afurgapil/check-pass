import React, { useState } from "react";
import { View, TextInput, Image, Text, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../store/slicers/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";

const SigninScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const storeJWT = async (user, token) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("token", token);
    } catch (error) {
      console.error("Error storing user:", error);
    }
  };
  const handleSignin = async () => {
    try {
      const response = await fetch(`${API_URL}/user/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const responseData = await response.json();
        dispatch(setUser(responseData.user));
        dispatch(setToken(responseData.token));
        if (rememberMe) {
          storeJWT(responseData.user, responseData.token);
        }
      } else {
        const responseData = await response.json();
        console.error("Login Error:", responseData.error);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  return (
    <View className=" bg-[#fdb97e] flex-1 justify-center items-center -mt-20">
      <View className=" justify-center items-center">
        <Image
          style={{ resizeMode: "contain" }}
          source={require("../assets/logo.png")}
          className="max-w-full"
        ></Image>
        <TextInput
          placeholder={t("SignIn.username")}
          value={username}
          onChangeText={setUsername}
          className="w-80 h-10 border p-2 mb-2"
        />
        <TextInput
          placeholder={t("SignIn.password")}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="w-80 h-10 border p-2 mb-2"
        />
      </View>
      <View className="flex-row justify-around items-start w-full">
        <TouchableOpacity
          onPress={handleSignin}
          className="bg-[#b07846] rounded-xl mb-8"
        >
          <Text className="text-white p-2 font-bold text-xl">
            {t("SignIn.btn")}
          </Text>
        </TouchableOpacity>
        <View className="flex-col justify-center items-center">
          <Text> {t("SignIn.rememberMe")}</Text>
          <Switch
            value={rememberMe}
            onValueChange={() => {
              setRememberMe(!rememberMe);
            }}
            trackColor={{ true: "#b07846" }}
            thumbColor={rememberMe ? "#fff" : "#ddd"}
          />
        </View>
      </View>

      <View className="flex-row justify-center items-center">
        <Text> {t("SignIn.red")}</Text>
        <Text
          className="underline mx-2"
          onPress={() => navigation.navigate("SignUp")}
        >
          {t("SignIn.under")}
        </Text>
      </View>
    </View>
  );
};

export default SigninScreen;
