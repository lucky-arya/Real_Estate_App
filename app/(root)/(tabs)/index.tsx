import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import NoResult from "@/components/noResult";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { getLatestProperties, getProperties } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
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

export default function Index() {
  const { user } = useGlobalContext();
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const { data: LatestProperties, loading: LatestPropertiesLoading } =
    useAppwrite({
      fn: getLatestProperties,
    });

  const {
    data: properties,
    loading,
    refetch,
  } = useAppwrite({
    fn: getProperties,
    params: {
      filter: params.filter!,
      query: params.query!,
      limit: 6,
    },
    skip: true,
  });

  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
      limit: 6,
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
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5 ">
              <View className="flex flex-row items-center">
                <Image
                  source={{ uri: user?.avatar || images.avatar.uri }}
                  className="size-12 rounded-full"
                />

                <View className="flex flex-col items-start ml-2 justify-center">
                  <Text className="text-xs font-rubik text-black-100">
                    Good Morning
                  </Text>
                  <Text className="text-base font-rubik-medium text-black-300 ">
                    {user?.name || "John Doe"}
                  </Text>
                </View>
              </View>
              <Image source={icons.bell} className="size-6" />
            </View>
            <Search />
            <View className="my-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-black-300">
                  Featured
                </Text>
                <TouchableOpacity>
                  <Text className="text-base font-rubik-bold text-primary-300">
                    See All
                  </Text>
                </TouchableOpacity>
              </View>

              {LatestPropertiesLoading ? (
                <ActivityIndicator
                  size="large"
                  color="#191d31"
                  className="text-primary-300"
                />
              ) : !LatestProperties || LatestProperties.length === 0 ? (
                <NoResult />
              ) : (
                <FlatList
                  data={LatestProperties}
                  renderItem={({ item }) => (
                    <FeaturedCard
                      item={item}
                      onPress={() => handleCardPress(item.$id)}
                    />
                  )}
                  keyExtractor={(item) => item.$id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  bounces={false}
                  contentContainerClassName="flex mt-5  gap-5 "
                />
              )}
            </View>
            <View className="flex flex-row items-center justify-between">
              <Text className="text-xl font-rubik-bold text-black-300">
                Our Recommendation
              </Text>
              <TouchableOpacity>
                <Text className="text-base font-rubik-bold text-primary-300">
                  See All
                </Text>
              </TouchableOpacity>
            </View>
            <Filters />
          </View>
        }
      />
    </SafeAreaView>
  );
}
