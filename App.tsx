import 'react-native-gesture-handler';
import { Animated, StyleSheet } from 'react-native';
import sofa_mobly from './src/assets/sofa_mobly.jpeg';
import { GestureHandlerRootView, PinchGestureHandler, State, PanGestureHandler } from 'react-native-gesture-handler';
import React, { useRef, createRef } from 'react';

export default function App() {
  const scale = useRef(new Animated.Value(1)).current;
  let translateX = useRef(new Animated.Value(0)).current;
  let translateY = useRef(new Animated.Value(0)).current;
  const pinchRef = createRef()
  const panRef = createRef()

  const onPinchEvent = Animated.event([{
    nativeEvent: {scale}
  }], {useNativeDriver: true})

  const onPanEvent = Animated.event([{
    nativeEvent: {
      translationX: translateX,
      translationY: translateY
    }
  }], {useNativeDriver: true})

  const handlePinchStateChange = ({nativeEvent}: {nativeEvent: any}) => {
    const nScale = nativeEvent.scale;
    if(nativeEvent.state === State.END){
      if(nScale < 1){
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true 
        }).start()
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true
        }).start();
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true
        }).start();
      }
    }
  }

  return (
    <GestureHandlerRootView style={styles.container} >
      <PanGestureHandler 
        onGestureEvent={onPanEvent} 
        ref={panRef} 
        simultaneousHandlers={[pinchRef]} 
        shouldCancelWhenOutside
        failOffsetX={[-1000, 1000]}
      >
        <Animated.View>
          <PinchGestureHandler 
            onGestureEvent={onPinchEvent} 
            onHandlerStateChange={handlePinchStateChange}
            ref={pinchRef}
            simultaneousHandlers={[panRef]}

          >
              <Animated.Image 
                source={sofa_mobly} 
                style={[{transform: [{ scale }, {translateX}, {translateY}]}]}
                resizeMode="center"
              />
          </PinchGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
