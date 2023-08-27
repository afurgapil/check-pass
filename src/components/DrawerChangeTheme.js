import React from "react";
import { useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome5";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native";
import { useThema } from "../hooks/useThema";
import { setThema } from "../store/slicers/data";

const DrawerChangeTheme = (props) => {
  const dispatch = useDispatch();
  const theme = useThema();

  const changeTheme = (newTheme) => {
    dispatch(setThema(newTheme));
  };

  return (
    <SafeAreaView className="h-full flex-row items-end">
      {theme === "dark" ? (
        <TouchableOpacity onPress={() => changeTheme("light")}>
          <Icon name="moon" size={40} color="black" />
        </TouchableOpacity>
      ) : theme === "light" ? (
        <TouchableOpacity onPress={() => changeTheme("dark")}>
          <Icon name="sun" size={40} color="black" />
        </TouchableOpacity>
      ) : null}
    </SafeAreaView>
  );
};

export default DrawerChangeTheme;
