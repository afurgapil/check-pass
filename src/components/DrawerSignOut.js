import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUser, setToken } from "../store/slicers/user";
import { useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native";

const DrawerSignOut = (props) => {
  const dispatch = useDispatch();

  const handleSignout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");

      dispatch(setUser(null));
      dispatch(setToken(null));

      props.navigation.navigate("SignIn");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <SafeAreaView className="h-full flex-row items-end">
      <TouchableOpacity onPress={handleSignout}>
        <Icon name="sign-out" size={40} color="black" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
export default DrawerSignOut;
