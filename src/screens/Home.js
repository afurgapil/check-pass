import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  SafeAreaView,
} from "react-native";
import { API_URL } from "../config";
import { useToken } from "../hooks/useToken";
import { useUser } from "../hooks/useUser";
//icon
import Icon from "react-native-vector-icons/AntDesign";
import { isValidEmail } from "../utils/isValidEmail";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
import { useThema } from "../hooks/useThema";

const Home = ({ navigation }) => {
  const user = useUser();
  const token = useToken();
  const thema = useThema();
  const [passwords, setPasswords] = useState([]);
  const [userId, setUserId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [editEntry, setEditEntry] = useState({
    id: "",
    name: "",
    value: "",
    receivers: [""],
  });
  const [newPasswordName, setNewPasswordName] = useState("");
  const [newPasswordValue, setNewPasswordValue] = useState("");
  const [newPasswordReceivers, setNewPasswordReceivers] = useState([""]);
  const { t } = useTranslation();
  useEffect(() => {
    if (user) {
      setUserId(user._id);
    }
  }, [user]);
  useEffect(() => {
    if (userId) {
      fetchPasswords();
    }
  }, [userId]);
  const openModal = () => {
    setModalVisible(true);
  };
  const handleReceiverChange = (index, value) => {
    const updatedReceivers = [...newPasswordReceivers];
    updatedReceivers[index] = value;
    setNewPasswordReceivers(updatedReceivers);
  };

  const handleRemoveLastReceiver = () => {
    if (newPasswordReceivers.length > 0) {
      const updatedReceivers = newPasswordReceivers.slice(0, -1);
      setNewPasswordReceivers(updatedReceivers);
    }
  };
  const handEditEntryReceiver = () => {
    if (editEntry.receivers.length > 0) {
      const updatedReceivers = editEntry.receivers.slice(0, -1);
      setEditEntry((prevEditEntry) => ({
        ...prevEditEntry,
        receivers: updatedReceivers,
      }));
    }
  };
  const fetchPasswords = async () => {
    try {
      const response = await fetch(`${API_URL}/get/${userId}`, {});

      if (response.ok) {
        const data = await response.json();
        setPasswords(data);
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Failed to fetch passwords:", error);
    }
  };

  const addPassword = async () => {
    try {
      if (!isValidEmail(newPasswordReceivers[0])) {
        console.error("Invalid email address");
        return;
      }
      try {
        const response = await fetch(`${API_URL}/add/${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPasswordName: newPasswordName,
            newPasswordValue: newPasswordValue,
            newPasswordReceivers: newPasswordReceivers,
          }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setNewPasswordName("");
        setNewPasswordValue("");
        setNewPasswordReceivers([""]);
        fetchPasswords();
      } catch (error) {
        console.error("Failed to add password:", error);
      }
    } catch (error) {
      console.error("Failed to add password:", error);
    }
  };
  const updatePassword = async (itemId) => {
    try {
      const response = await fetch(`${API_URL}/set/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: itemId,
          updatedPass: editEntry,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setEditEntry((prevEditEntry) => ({
        ...prevEditEntry,
        id: "",
        name: "",
        value: "",
        receivers: [],
      }));
      fetchPasswords();
    } catch (error) {
      console.error("Failed to update password:", error);
    }
  };
  const deletePassword = async (passId) => {
    try {
      const response = await fetch(`${API_URL}/delete/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pass: passId }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      if (response.ok) {
        fetchPasswords();
        console.log("Updated succesfully");
      }
    } catch (error) {
      console.error("Failed to delete password:", error);
    }
  };
  const PasswordList = ({ passwords, deletePassword }) => (
    <FlatList
      data={passwords}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View className="m-4 p-4 border-b-2  rounded border-dark-300 flex-row items-center justify-between">
          <Text className="font-bold text-2xl">{item.name}</Text>
          <View className="flex-row items-center ">
            <TouchableOpacity
              className="bg-green-600 text-white p-3 mx-1 rounded-full"
              onPress={() => {
                setIsEditVisible(true);
                setEditEntry((prevEditEntry) => ({
                  ...prevEditEntry,
                  id: item._id,
                  name: item.name,
                  value: item.value,
                  receivers: item.receivers,
                }));
              }}
            >
              <Icon name="edit" color="white" size={25}></Icon>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-red-600 text-white p-3 mx-1 rounded-full"
              onPress={() => {
                deletePassword(item._id);
              }}
            >
              <Icon name="delete" color="white" size={25}></Icon>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
  return (
    <SafeAreaView className={`container bg-light flex-1 p-4 relative`}>
      {passwords.length > 0 ? (
        <View>
          <PasswordList
            passwords={passwords}
            deletePassword={deletePassword}
          ></PasswordList>
        </View>
      ) : (
        <View className="flex flex-col justify-center items-center my-5">
          <Text className="text-xl font-bold mb-4">{t("Home.noItem")}</Text>
          <TouchableOpacity
            className="bg-dark p-4  rounded"
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Text className="text-white bold text-2xl underline ">
              {t("Home.addNow")}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View className="absolute right-5 bottom-5">
        <Icon
          name="pluscircle"
          onPress={() => openModal()}
          size={45}
          color="#000000"
          className="bottom-0 right-0 absolute"
        ></Icon>
      </View>
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        transparent={false}
      >
        <SafeAreaView className=" bg-light min-h-screen">
          <ScrollView>
            <View className="p-4 flex-row justify-between items-center ">
              <Text className="text-lg font-semibold ">
                {t("Home.addNewEntry")}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="flex items-center"
              >
                <Icon name="closecircle" size={30} color="#f00"></Icon>
              </TouchableOpacity>
            </View>

            <TextInput
              value={newPasswordName}
              onChangeText={setNewPasswordName}
              placeholder={t("Home.enterName")}
              className="border p-2 m-2 rounded"
            />
            <TextInput
              value={newPasswordValue}
              onChangeText={setNewPasswordValue}
              placeholder={t("Home.enterValue")}
              className="border p-2 m-2 rounded"
            />
            {newPasswordReceivers.map((receiver, index) => (
              <View key={index} className="flex-row items-center">
                <TextInput
                  value={receiver}
                  onChangeText={(value) => handleReceiverChange(index, value)}
                  placeholder={t("Home.enterReceiver")}
                  className="flex-1 border p-2 m-2 rounded"
                />
                {index === newPasswordReceivers.length - 1 &&
                  newPasswordReceivers.length > 1 && (
                    <TouchableOpacity onPress={handleRemoveLastReceiver}>
                      <Icon name="delete" size={30} color="black" />
                    </TouchableOpacity>
                  )}
              </View>
            ))}
            <TouchableOpacity
              onPress={() => {
                setNewPasswordReceivers([...newPasswordReceivers, ""]);
              }}
              className="flex-row border p-2 m-2 rounded"
            >
              <Icon name="plussquareo" size={18} color="gray" />
              <Text style={{ marginLeft: 10, color: "gray" }}>
                {t("Home.addReceiver")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-dark text-white px-4 py-2 rounded"
              onPress={() => {
                addPassword();
                setModalVisible(false);
              }}
            >
              <Text className="text-center text-white font-bold ">
                {t("Home.addEntry")}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
      <Modal
        visible={isEditVisible}
        animationType="slide"
        onRequestClose={() => setIsEditVisible(false)}
        transparent={false}
      >
        <SafeAreaView className=" bg-light min-h-screen">
          <ScrollView>
            <View className="p-4 flex-row justify-between items-center ">
              <Text className="text-lg font-semibold ">{t("Home.edit")}</Text>
              <TouchableOpacity
                onPress={() => setIsEditVisible(false)}
                className="flex items-center"
              >
                <Icon name="closecircle" size={30} color="#f00"></Icon>
              </TouchableOpacity>
            </View>

            <TextInput
              value={editEntry.name}
              onChangeText={(text) =>
                setEditEntry({ ...editEntry, name: text })
              }
              style={{ borderWidth: 1, padding: 8, margin: 8, borderRadius: 8 }}
            />
            <TextInput
              value={editEntry.value}
              onChangeText={(text) =>
                setEditEntry({ ...editEntry, value: text })
              }
              style={{ borderWidth: 1, padding: 8, margin: 8, borderRadius: 8 }}
            />

            {editEntry.receivers.map((receiver, index) => (
              <View key={index} className="flex-row items-center">
                <TextInput
                  value={receiver}
                  onChangeText={(text) => {
                    const updatedReceivers = [...editEntry.receivers];
                    updatedReceivers[index] = text;
                    setEditEntry({ ...editEntry, receivers: updatedReceivers });
                  }}
                  className="flex-1 border p-2 m-2 rounded"
                />
                {editEntry.receivers.length > 0 && (
                  <TouchableOpacity onPress={handEditEntryReceiver}>
                    <Icon name="delete" size={30} color="black" />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            <TouchableOpacity
              onPress={() => {
                setEditEntry({
                  ...editEntry,
                  receivers: [...editEntry.receivers, ""],
                });
              }}
              className="flex-row border p-2 m-2 rounded"
            >
              <Icon name="plussquareo" size={18} color="gray" />
              <Text style={{ marginLeft: 10, color: "gray" }}>
                {t("Home.addReceiver")}
              </Text>
            </TouchableOpacity>
            {editEntry.receivers.length <= 0 && (
              <Text className="bg-red-600 p-2 text-xl text-white text-center ">
                {t("Home.minimum")}
              </Text>
            )}
            {editEntry.receivers.length >= 1 && (
              <TouchableOpacity
                className="bg-dark text-white px-4 py-2 rounded"
                onPress={() => {
                  setIsEditVisible(false);
                  updatePassword(editEntry.id);
                }}
              >
                <Text className="text-center text-white font-bold ">
                  {t("Home.edit")}
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;
