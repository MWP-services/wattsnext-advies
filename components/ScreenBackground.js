import React from "react";
import { ImageBackground, StyleSheet, Platform } from "react-native";

const ScreenBackground = ({ children, style, imageStyle, ...rest }) => {
  return (
    <ImageBackground
      source={require("../assets/achtergrond.png")}
      style={[styles.backgroundImage, style]}
      imageStyle={[styles.backgroundImageInner, imageStyle]}
      {...rest}
    >
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  backgroundImageInner: {
    resizeMode: Platform.OS === "web" ? "contain" : "cover",
  },
});

export default ScreenBackground;
