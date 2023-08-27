import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUser, setToken } from "./store/slicers/user";
import Home from "./screens/Home";
import Settings from "./screens/Settings";
import SigninScreen from "./screens/SignIn";
import SignupScreen from "./screens/SignUp";
import DrawerChangeLang from "./components/DrawerChangeLanguage";
import DrawerSignOut from "./components/DrawerSignOut";
import { useUser } from "./hooks/useUser";
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
i18n.use(initReactI18next).init({
  resources: {
    gb: {
      translation: require("./locales/gb.json"),
    },
    tr: {
      translation: require("./locales/tr.json"),
    },
    de: {
      translation: require("./locales/de.json"),
    },
    fr: {
      translation: require("./locales/fr.json"),
    },
  },
  fallbackLng: "gb",

  interpolation: {
    escapeValue: false,
  },
});

const Drawer = createDrawerNavigator();

function DrawerComp() {
  const dispatch = useDispatch();
  const user = useUser();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkJWTValidity();
  }, []);

  const checkJWTValidity = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const storedToken = await AsyncStorage.getItem("token");
      if (storedUser && storedToken) {
        dispatch(setUser(JSON.parse(storedUser)));
        dispatch(setToken(storedToken));
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error checking JWT validity:", error);
      console.error("Error details:", error.message);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerTintColor: "black",
        drawerStyle: { backgroundColor: "#b07846" },
        drawerActiveBackgroundColor: "#e09755",
        drawerActiveTintColor: "black",
      }}
    >
      {user ? (
        <>
          <Drawer.Screen
            name={t("Main.home")}
            component={Home}
            options={{
              headerTitle: `${t("Main.home")}`,
              headerBackground: () => (
                <View
                  style={{
                    backgroundColor: "#b07846",
                    flex: 1,
                    color: "white",
                  }}
                />
              ),
            }}
          />
          <Drawer.Screen
            name={t("Main.settings")}
            component={Settings}
            options={{
              headerTitle: `${t("Main.settings")}`,
              headerBackground: () => (
                <View
                  style={{
                    backgroundColor: "#b07846",
                    flex: 1,
                    color: "white",
                  }}
                />
              ),
            }}
          />
        </>
      ) : (
        <>
          <Drawer.Screen
            name="SignIn"
            component={SigninScreen}
            options={{
              headerTitle: `${t("Main.signIn")}`,
              headerTintColor: "transparent",
              headerBackground: () => (
                <View
                  style={{
                    backgroundColor: "#fdb97e",
                    flex: 1,
                    color: "white",
                  }}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="SignUp"
            component={SignupScreen}
            options={{
              headerTitle: `${t("Main.signUp")}`,
              headerTintColor: "transparent",
              headerBackground: () => (
                <View
                  style={{
                    backgroundColor: "#fdb97e",
                    flex: 1,
                    color: "white",
                  }}
                />
              ),
            }}
          />
        </>
      )}
    </Drawer.Navigator>
  );
}

function DrawerContent(props) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <View>
        <DrawerItemList {...props} />
      </View>
      <View className="flex-row justify-between  items-end m-2 min-h-auto">
        <DrawerChangeLang {...props} />
        {/* <DrawerChangeTheme {...props} /> */}
        <DrawerSignOut {...props} />
      </View>
    </DrawerContentScrollView>
  );
}

const Main = () => {
  return (
    <NavigationContainer>
      <DrawerComp />
    </NavigationContainer>
  );
};

export default Main;
