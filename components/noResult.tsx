import images from "@/constants/images";
import React from "react";
import { Image, Text, View } from "react-native";

const NoResult = () => {
  return (
    <View className="flex items-center justify-center my-5">
      <Image
        source={images.noResult}
        className="w-11/12 h-80 "
        resizeMode="contain"
      />
      <Text className="text-2xl font-rubik-bold text-black-300 mt-5">
        No Results Found
      </Text>
      <Text className="text-base font-rubik text-black-300 mt-2 mx-5 text-center">
        We couldn't find any properties matching your search criteria. Please
        try adjusting your filters or search terms.
      </Text>
    </View>
  );
};

export default NoResult;
