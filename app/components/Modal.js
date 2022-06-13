import React from "react";
import { StyleSheet, Modal, View } from "react-native";

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderWidth: 2,
    
  },
  modalView: {
    marginVertical: 100,
    width:'85%',
    height: '75%',
    backgroundColor:'white',
    borderRadius: 20,
    shadowColor: "gray",
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
});

export default ({ children, visibility }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visibility}>
      <View style={styles.center}>
        <View style={styles.modalView}>{children}</View>
      </View>
    </Modal>
  );
};
