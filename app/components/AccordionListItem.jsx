import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    StyleSheet,
    Animated,
    Easing,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const styles = StyleSheet.create({
    bodyBackground: {
        overflow: 'hidden'
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        paddingLeft: 15,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#EFEFEF',
        paddingVertical: 20,
        marginVertical: 5,
        borderRadius: 10,
        backgroundColor: '#eee',
    },
    bodyContainer: {
        padding: 10,
        paddingLeft: 15,
        position: 'absolute',
        bottom: 0,
        marignTop: 100,
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 15,
    },
});

const AccordionListItem = ({ title, children }) => {
    const [open, setOpen] = useState(false);
    const animatedController = useRef(new Animated.Value(0)).current;
    const [bodySectionHeight, setBodySectionHeight] = useState({height: new Animated.Value(0)});
    const opacity = useState(new Animated.Value(0)) [0];

    const bodyHeight = animatedController.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 10000],
    });

    const arrowAngle = animatedController.interpolate({
        inputRange: [0, 1],
        outputRange: ['0rad', `${Math.PI}rad`],
    });

    //fade animation
    const fadeIn = () => {
        if(open) {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false,
                easing: Easing.ease,
            }).start();
        } else{
            Animated.timing(opacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: false,
                easing: Easing.ease,
            }).start();
        }
        setOpen(!open);
    }

    const toggleListItem = () => {
        if (open) {
            Animated.timing(animatedController, {
                duration: 500,
                toValue: 0,
                easing: Easing.bezier(0.4, 0.0, 0.2, 1),
                useNativeDriver: false
            }).start();
        } else {
            Animated.timing(animatedController, {
                duration: 500,
                toValue: 1,
                easing: Easing.bezier(0.4, 0.0, 0.2, 1),
                useNativeDriver: false
            }).start();
        }
        setOpen(!open);
    };

    return (
        <>
            <TouchableWithoutFeedback onPress={() => [toggleListItem(), fadeIn()]}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{title}</Text>
                    <Animated.View style={{ transform: [{ rotateZ: arrowAngle }] }}>
                        <MaterialIcons name="keyboard-arrow-down" size={20} color="black" />
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
            <Animated.View  style={[styles.bodyBackground, { maxHeight: bodyHeight, opacity }]}>
                <View
                    onLayout={event =>
                        setBodySectionHeight(event.nativeEvent.layout.height)
                    }>
                    {children}
                </View>
            </Animated.View>
        </>
    );
};
export default AccordionListItem;


