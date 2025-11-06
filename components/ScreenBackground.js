import React from "react";
import { ImageBackground, StyleSheet } from "react-native";

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
  },
  backgroundImageInner: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
});

export default ScreenBackground;
