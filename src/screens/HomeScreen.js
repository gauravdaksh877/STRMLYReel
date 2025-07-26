import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import VideoItem from '../components/VideoItem';

const { height: screenHeight } = Dimensions.get('window');


const SAMPLE_VIDEOS = [
  {
    id: '1',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    title: 'Big Buck Bunny',
    user: 'Blender Foundation',
    likes: 1200,
    description: 'A whimsical animated short film',
  },
  {
    id: '2',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    title: 'Elephants Dream',
    user: 'Orange Studio',
    likes: 850,
    description: 'Surreal animated adventure',
  },
  {
    id: '3',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    title: 'For Bigger Blazes',
    user: 'Google',
    likes: 2300,
    description: 'Epic cinematic experience',
  },
  {
    id: '4',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    title: 'For Bigger Escapes',
    user: 'Google',
    likes: 1890,
    description: 'Adventure awaits',
  },
  {
    id: '5',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    title: 'Sintel',
    user: 'Blender Foundation',
    likes: 3200,
    description: 'Dragon adventure story',
  },
];

const HomeScreen = () => {
  const [videos, setVideos] = useState(SAMPLE_VIDEOS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  const handleLike = (videoId) => {
    setVideos(prevVideos =>
      prevVideos.map(video =>
        video.id === videoId
          ? { ...video, likes: video.likes + 1, isLiked: !video.isLiked }
          : video
      )
    );
  };

  const renderVideoItem = ({ item, index }) => (
    <VideoItem
      video={item}
      isActive={index === currentIndex}
      onLike={handleLike}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
  ref={flatListRef}
  data={videos}
  renderItem={renderVideoItem}
  keyExtractor={(item) => item.id}
  pagingEnabled
  showsVerticalScrollIndicator={false}
  onViewableItemsChanged={onViewableItemsChanged}
  viewabilityConfig={viewabilityConfig}
  getItemLayout={(data, index) => ({
    length: screenHeight,
    offset: screenHeight * index,
    index,
  })}
  snapToInterval={screenHeight} 
  snapToAlignment="start" 
  decelerationRate="fast" 
/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
export default HomeScreen;