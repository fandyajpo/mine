import {View, ScrollView, FlatList, Text, Pressable, Image} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import tw from '../../../lib/tailwind';
import {useEffect, useRef, useCallback, useMemo} from 'react';
import {SheetManager} from 'react-native-actions-sheet';
import {useState} from 'react';
import {Pdf, AddPicture, MenuMedia} from '../../../lib/localSvg';
import {logGer} from '../../../lib/fetchJSON';
import {getSecure} from '../../../lib/storage';
import SafeAreaView from 'react-native-safe-area-view';
import {
  ParamListBase,
  RouteProp,
  useFocusEffect,
  useRoute,
} from '@react-navigation/native';
import {getterGeo} from '../../../lib/axiosConf';
import axios, {CancelTokenSource} from 'axios';
let source: CancelTokenSource = axios.CancelToken.source();

const ListEmptyComponent = (text: string, type: string) => {
  return (
    <View>
      <Text>No Data</Text>
    </View>
  );
};

const ItemImages = ({id, image}: any) => {
  return (
    <View
      key={id}
      style={[
        tw`bg-white overflow-hidden bg-black w-full h-24 flex-row justify-between items-center shadow-md bg-white`,
        {flex: 1},
      ]}>
      {image.length > 0 ? (
        <Pressable
          onPress={() =>
            SheetManager.show('InfoImageSheet', {payload: {url: image}})
          }
          style={[{flex: 1}, tw`w-full h-full`]}>
          <Image
            resizeMode="cover"
            resizeMethod="scale"
            style={[tw`border-2 border-black`, {flex: 1}]}
            source={{
              uri: image || 'no image',
            }}
          />
        </Pressable>
      ) : null}
    </View>
  );
};

const ItemFile = ({id, name, url}: any) => {
  return (
    <View
      key={id}
      style={tw`bg-white mx-1 flex-row justify-center items-center bg-white h-44 w-32 border border-gray-200 shadow-md rounded-xl`}>
      <View style={tw`flex-col items-center h-44 w-full p-1`}>
        <View>
          <Pdf />
        </View>
        <View>
          <Text style={tw`text-gray-600 capitalize text-xs`}>{name}</Text>
        </View>
      </View>
      <Pressable
        style={tw`absolute bottom-2 right-2 bg-white p-1 rounded-md border border-gray-300 shadow-md`}>
        <MenuMedia />
      </Pressable>
    </View>
  );
};

const ImageDocumentScreen = () => {
  const [isFetch, setIsFetch] = useState(false);
  const [currentProject, setCurrentProject] = useState({}) as any;
  const route: RouteProp<ParamListBase, string> = useRoute();

  const {id}: any = route?.params;
  const detail = useMemo(
    () => ({
      interiorImages: currentProject?.interior,
      exteriorImages: currentProject?.exterior,
      floorPlans: currentProject?.floorPlans,
      brochure: currentProject?.brochure,
    }),
    [currentProject],
  );

  const getProject = useCallback(async () => {
    try {
      setIsFetch(true);
      const credentials = await getSecure('token');

      const getter = await getterGeo(`project/${id}`, {
        headers: {
          token: credentials,
        },
        withCredentials: true,
        cancelToken: source.token,
      });

      const {
        data: {data},
      } = getter;

      setCurrentProject(data);
      setIsFetch(false);
    } catch (error: any) {
      setIsFetch(false);
      if (error.message === 'Aborted') {
        logGer('aborted fetch, its not an error bre. | path : Project detail');
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getProject();
    }, []),
  );

  return (
    <SafeAreaView
      style={[
        {
          flex: 1,
        },
        tw`bg-white`,
      ]}>
      <ScrollView>
        <View
          style={tw`flex-row justify-between items-center p-2 border-t border-gray-300`}>
          <Text style={tw`text-gray-600 font-extrabold text-xs px-4 bg-white `}>
            INTERIOR IMAGE
          </Text>
          {detail.interiorImages?.length! < 1 ? (
            <View />
          ) : (
            <Pressable
              onPress={() => SheetManager.show('UploadImageSheet')}
              style={({pressed}) => tw`${pressed ? 'opacity-80' : ''} `}>
              {AddPicture(22, 22)}
            </Pressable>
          )}
        </View>
        <SafeAreaView>
          <FlashList
            key={'INTERIOR'}
            data={detail.interiorImages}
            numColumns={3}
            ListEmptyComponent={ListEmptyComponent(
              `There's no picture uploaded`,
              'image',
            )}
            renderItem={({item, index}) => (
              <ItemImages id={index} image={item} />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </SafeAreaView>
        <View
          style={tw`flex-row justify-between items-center p-2 border-t border-gray-300`}>
          <Text style={tw`text-gray-600 font-extrabold text-xs px-4 bg-white `}>
            EXTERIOR IMAGE
          </Text>
          {detail?.interiorImages?.length! < 1 ? (
            <View />
          ) : (
            <Pressable
              onPress={() => SheetManager.show('UploadImageSheet')}
              style={({pressed}) => tw`${pressed ? 'opacity-80' : ''} `}>
              {AddPicture(22, 22)}
            </Pressable>
          )}
        </View>
        <SafeAreaView>
          <FlashList
            key={'EXTERIOR'}
            numColumns={3}
            data={detail?.exteriorImages}
            ListEmptyComponent={ListEmptyComponent(
              `There's no picture uploaded`,
              'image',
            )}
            renderItem={({item, index}) => (
              <ItemImages id={index} image={item} />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </SafeAreaView>
        <View
          style={tw`flex-row justify-between items-center p-2 border-t border-gray-300`}>
          <Text style={tw`text-gray-600 font-extrabold text-xs px-4 bg-white `}>
            FLOORPLANS
          </Text>
          {detail?.floorPlans?.length! < 1 ? (
            <View />
          ) : (
            <Pressable
              onPress={() => null}
              style={({pressed}) => tw`${pressed ? 'opacity-80' : ''} `}>
              {AddPicture(22, 22)}
            </Pressable>
          )}
        </View>
        <SafeAreaView>
          <FlashList
            key={'FLOORPLAN'}
            contentContainerStyle={tw`p-3`}
            showsHorizontalScrollIndicator={false}
            data={detail?.floorPlans}
            horizontal
            ListEmptyComponent={ListEmptyComponent(
              `There's no file that uploaded`,
              'file',
            )}
            renderItem={({item, index}: any) => (
              <ItemFile
                id={item._id}
                name={item.name}
                type={item.fileType}
                url={item.url}
              />
            )}
            keyExtractor={(item: any) => item._id}
          />
        </SafeAreaView>
        <View
          style={tw`flex-row justify-between items-center p-2 border-t border-gray-300`}>
          <Text style={tw`text-gray-600 font-extrabold text-xs px-4 bg-white `}>
            BROCHURE
          </Text>
          {detail?.floorPlans?.length! < 1 ? (
            <View />
          ) : (
            <Pressable
              onPress={() => null}
              style={({pressed}) => tw`${pressed ? 'opacity-80' : ''} `}>
              {AddPicture(22, 22)}
            </Pressable>
          )}
        </View>
        <SafeAreaView>
          <FlashList
            key={'BROCHURE'}
            contentContainerStyle={tw`p-3`}
            showsHorizontalScrollIndicator={false}
            data={detail?.brochure}
            horizontal
            ListEmptyComponent={ListEmptyComponent(
              `There's no file that uploaded`,
              'file',
            )}
            renderItem={({item, index}: any) => (
              <ItemFile
                id={item._id}
                name={item.name}
                type={item.fileType}
                url={item.url}
              />
            )}
            keyExtractor={(item: any) => item._id}
          />
        </SafeAreaView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ImageDocumentScreen;
