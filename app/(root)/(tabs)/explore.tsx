import { Card } from "@/components/Cards";
import Filters from "@/components/Filters";
import NoResult from "@/components/noResult";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import { getProperties } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Explore() {
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const {
    data: properties,
    loading,
    refetch,
  } = useAppwrite({
    fn: getProperties,
    params: {
      filter: params.filter!,
      query: params.query!,
      limit: 20,
    },
    skip: true,
  });

  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
      limit: 20,
    });
  }, [params.filter, params.query]);

  const handleCardPress = (id: string) => {
    // Navigate to the property details page with the selected property's ID
    // You can use a navigation library like React Navigation or Expo Router for this
    // For example, if using Expo Router:
    // router.push(`/property/${id}`);

    router.push(`/properties/${id}`);
  };

  return (
    <SafeAreaView className="bg-white">
      <FlatList
        data={properties}
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(item.$id)} />
        )}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5 "
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator
              className="text-primary mt-5"
              size="large"
              color="#191d31"
            />
          ) : (
            <NoResult />
          )
        }
        ListHeaderComponent={
          <View className="px-5 ">
            <View className="flex flex-row items-center justify-between mt-5">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
              >
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>
              <Text className=" text-base mr-2 text-center font-rubik-medium text-black-300">
                Search For Your Ideal Home
              </Text>
              <Image source={icons.bell} className="w-6 h-6" />
            </View>
            <Search />
            <View className="mt-5">
              <Filters />
              <Text className="text-xl font-rubik-bold text-black-300 mt-5">
                Found {properties?.length}{" "}
                {properties?.length === 1 ? "property" : "properties"}
              </Text>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}
