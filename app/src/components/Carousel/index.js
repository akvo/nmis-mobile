import React from 'react';
import { View, ScrollView, Dimensions, Text } from 'react-native';
import { styles } from './styles';
import { Summary } from './Summary';
import { Control } from './Control';

const Carousel = ({ children, control = false }) => {
  const scrollRef = React.useRef(null);
  const [isEndReached, setIsEndReached] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const goToIndex = (idx) => {
    setIndex(idx);
    scrollRef.current.scrollTo({ x: idx * 140, y: 0, animated: true });
  };

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const contentWidth = event.nativeEvent.contentSize.width;
    const containerWidth = Dimensions.get('window').width;

    // Check if the ScrollView has reached the end
    if (contentOffsetX >= contentWidth - containerWidth) {
      setIsEndReached(true);
    } else {
      setIsEndReached(false);
    }
  };

  const handleOnNext = () => {
    if (!isEndReached) {
      goToIndex(index + 1);
    }
  };
  const handleOnPrev = () => {
    if (isEndReached) {
      setIsEndReached(false);
    }

    if (index > 0) {
      goToIndex(index - 1);
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal={true}
        contentContainerStyle={{ ...styles.scrollView }}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={200}
        pagingEnabled
        decelerationRate="fast"
      >
        {children}
      </ScrollView>
      {control && (
        <Control
          prev={handleOnPrev}
          next={handleOnNext}
          index={index}
          isEndReached={isEndReached}
        />
      )}
    </View>
  );
};

Carousel.Summary = Summary;

export default Carousel;
