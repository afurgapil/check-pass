import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { TouchableOpacity, View, SafeAreaView, ScrollView } from "react-native";
import CountryFlag from "react-native-country-flag";
import { setLanguage } from "../store/slicers/data";
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "react-i18next";
import { useUser } from "../hooks/useUser";
import { API_URL } from "../config";
const flags = [
  { country: "turkish", flag: "tr" },
  { country: "english", flag: "gb" },
  { country: "german", flag: "de" },
  { country: "french", flag: "fr" },
];
const DrawerChangeLang = (props) => {
  const user = useUser();
  const dispatch = useDispatch();
  const selectedLanguage = useLanguage();
  const { i18n } = useTranslation();
  const [userId, setUserId] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  useEffect(() => {
    if (userId) {
      fetchUserLanguage();
    }
  }, [userId]);
  useEffect(() => {
    if (user) {
      setUserId(user._id);
    }
  }, [user]);
  const fetchUserLanguage = async () => {
    try {
      const response = await fetch(`${API_URL}/get-lang/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const language = await response.json();
        dispatch(setLanguage(language));
      } else {
        console.log("ops");
      }
    } catch (error) {
      console.log("ops");
    }
  };
  const handleLanguageChange = (language) => {
    dispatch(setLanguage(language));
    setIsDropdownOpen(false);
    i18n.changeLanguage(language);
    handleUserLanguage(language);
  };

  const handleUserLanguage = async (language) => {
    try {
      const response = await fetch(`${API_URL}/set-lang/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newLang: language }),
      });

      if (response.ok) {
        console.log("Updated Succesfully");
      } else {
        console.log("Can not updated");
      }
    } catch (error) {
      console.log("Can not updated");
    }
  };
  return (
    <SafeAreaView className="w-auto h-full">
      <ScrollView className="flex flex-col">
        {isDropdownOpen && (
          <View className="m-0 p-0 flex flex-col flex-wrap items-center max-w-10">
            {flags
              .filter((lang) => lang.flag !== selectedLanguage)
              .map((lang) => (
                <TouchableOpacity
                  key={lang.flag}
                  onPress={() => handleLanguageChange(lang.flag)}
                  className="my-1 "
                >
                  <CountryFlag isoCode={lang.flag} size={30} />
                </TouchableOpacity>
              ))}
          </View>
        )}

        <TouchableOpacity
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          className="mt-2"
        >
          <CountryFlag isoCode={selectedLanguage} size={30} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
export default DrawerChangeLang;
