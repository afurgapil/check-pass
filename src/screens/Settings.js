import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useUser } from "../hooks/useUser";
import { useToken } from "../hooks/useToken";
import { API_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUser, setToken } from "../store/slicers/user";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
const Settings = ({ navigation }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useUser();
  const token = useToken();
  const [userId, setUserId] = useState(null);
  const [cycleDuration, setCycleDuration] = useState("");
  const [newCycle, setNewCycle] = useState("");
  const [nextControl, setNextControl] = useState("");
  const [uiNextControl, setUiNextControl] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState({ showMessage: false, message: "" });
  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    if (user) {
      setUserId(user._id);
    }
  }, [user]);
  useEffect(() => {
    if (userId) {
      fetchCycleDuration();
      fetchNextControl();
    }
  }, [userId]);
  useEffect(() => {
    if (nextControl) {
      fetchRemainingTime();
    }
  }, [nextControl]);
  const openModal = () => {
    setModalVisible(true);
  };
  const navigateToAnotherScreen = (screenName) => {
    navigation.navigate(screenName);
  };
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
  const fetchCycleDuration = async () => {
    try {
      const response = await fetch(`${API_URL}/get-cycle/${userId}`);
      if (response.ok) {
        const fetchedCycleDuration = await response.json();
        setCycleDuration(fetchedCycleDuration);
      } else {
        console.error("Failed to fetch cycle duration");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const fetchNextControl = async () => {
    try {
      const response = await fetch(`${API_URL}/get-nextControl/${userId}`);
      if (response.ok) {
        const fetchedNextControl = await response.json();
        setNextControl(fetchedNextControl);
        setUiNextControl(fetchedNextControl.slice(0, 10));
      } else {
        console.error("Failed to fetch fetchedNextControl ");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const fetchRemainingTime = async () => {
    const initialDate = new Date(nextControl);
    const currentDate = new Date();
    const timeDifference = initialDate - currentDate;
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    const roundedDaysDifference = Math.floor(daysDifference);
    setRemainingTime(roundedDaysDifference);
  };
  const handleSetCycle = async () => {
    try {
      const response = await fetch(`${API_URL}/set-cycle/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newCycle }),
      });

      if (response.ok) {
        fetchCycleDuration();
      } else {
        throwError("Failed to update Cycle Duration!", 3000);
      }
    } catch (error) {
      throwError("Failed to update Cycle Duration!", 3000);
    }
  };

  const handleSetNextControl = async () => {
    const initialDate = new Date(nextControl);
    const newDate = new Date(
      initialDate.getTime() + cycleDuration * 24 * 60 * 60 * 1000
    );

    const currentDate = new Date();
    const minimumDate = new Date(
      initialDate.getTime() - cycleDuration * 24 * 60 * 60 * 1000
    );
    if (currentDate >= minimumDate) {
      try {
        const response = await fetch(`${API_URL}/set-nextControl/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newDate }),
        });

        if (response.ok) {
          fetchNextControl();
          fetchRemainingTime();
        } else {
          throwError("Failed to update Control Date!", 3000);
        }
      } catch (error) {
        throwError("Failed to update Control Date!", 3000);
      }
    } else {
      throwError(
        "There's still time for the next check.Please try later.",
        3000
      );
    }
  };

  const handleSignout = async (navigation) => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");

      dispatch(setUser(null));
      dispatch(setToken(null));
      navigateToAnotherScreen("SignInDrawer");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const deleteUser = async () => {
    try {
      const response = await fetch(`${API_URL}/deleteAcc/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        handleSignout();
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <View className="flex-1 bg-light p-4 justify-start items-start w-auto ">
      {user && (
        <View className="w-full ">
          <View
            id="profile"
            className="flex-col justify-start items-start w-full "
          >
            <Modal
              visible={modalVisible}
              animationType="slide"
              onRequestClose={() => setModalVisible(false)}
              transparent={false}
            >
              <SafeAreaView className="p-4 flex-col flex-1 items-center  bg-light w-auto">
                <Text className=" mt-2 font-bold text-xl text-center">
                  {t("Settings.del1")}
                </Text>
                <Text className="font-bold text-xl text-center">
                  {t("Settings.del2")}
                </Text>
                <View className="flex-col justify-around items-center m-4  w-full">
                  <TouchableOpacity
                    className="bg-green-400 text-white p-1 m-3 rounded w-full  "
                    onPress={() => setModalVisible(false)}
                  >
                    <Text className="text-center font-bold text-xl ">
                      {t("Settings.del3")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-red-400 text-white p-1 m-3 rounded w-full  "
                    onPress={() => deleteUser()}
                  >
                    <Text className="text-center font-bold text-xl ">
                      {t("Settings.del4")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            </Modal>
          </View>
          <View id="duration">
            <Text className="font-bold text-2xl">
              {t("Settings.userCycle", { cycleDuration })}
            </Text>
            <TextInput
              value={newCycle}
              onChangeText={(text) => setNewCycle(text)}
              placeholder="Enter notification duration in days"
              className="border-black border border-1 p-3 rounded mt-2"
            />
            <TouchableOpacity
              className="bg-blue-800 my-8 p-4 rounded-lg"
              onPress={() => {
                if (newCycle !== "") {
                  setNewCycle("");
                  handleSetCycle();
                }
              }}
            >
              <Text className="text-white text-center font-bold ">
                {t("Settings.setCycle")}
              </Text>
            </TouchableOpacity>
          </View>
          <View id="date" className="mt-5 my-2 border-y border-1">
            <Text className="my-1 font-semibold text-xl ">
              {t("Settings.userNextDate")}
              <Text className=" font-normal">{uiNextControl}</Text>
            </Text>
            <Text className="my-1 font-semibold text-xl ">
              {t("Settings.time")}
              <Text className=" font-normal">{remainingTime} Day</Text>
            </Text>
            <TouchableOpacity
              className="bg-green-800 my-8 p-4 rounded-lg"
              onPress={() => {
                handleSetNextControl();
              }}
            >
              <Text className="text-white text-center font-bold ">
                {t("Settings.updateDate")}
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              className="bg-red-600 p-1 rounded w-100 "
              onPress={() => openModal()}
            >
              <Text className="font-bold py-2 text-center text-white ">
                {t("Settings.del4")}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-10 ">
            {error.showMessage && (
              <Text className="bg-red-500 text-black text-xl p-4 mx-4 text-center  ">
                {error.message}
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default Settings;
