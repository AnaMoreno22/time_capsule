import {
  View,
  TouchableOpacity,
  Switch,
  Text,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import NLWLogo from "../src/assets/nlw.svg";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { Link, useRouter } from "expo-router";
import Icon from "@expo/vector-icons/Feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { api } from "../src/lib/api";
export default function NewMemory() {
  const { bottom, top } = useSafeAreaInsets();
  const [isPublic, setIsPublic] = useState(false);
  const [content, setContent] = useState("");
  const router = useRouter();
  const [file, setFile] = useState<string | null>(null);
  async function handleCreateMemory() {
    const token = await SecureStore.getItemAsync("token");
    let coverUrl = "";
    if (file) {
      const uploadFormData = new FormData();

      uploadFormData.append("file", {
        uri: file,
        name: "image.jpg",
        type: "image/jpg",
      } as any);
      const uploadResponse = await api.post("/upload", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      coverUrl = uploadResponse.data.fileUrl;
    }
    await api.post(
      "/memories",
      {
        content,
        isPublic,
        coverUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    router.push("/memories");
  }

  async function openImagePicker() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      // if (!result.canceled) {
      //   setImage(result.assets[0].uri);
      // }
      // };
      if (result.assets[0]) {
        setFile(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row  items-center justify-between">
        <NLWLogo />
        <Link href="/memories" asChild>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-blue-500">
            <Icon name="arrow-left" size={16} color="#fff" />
          </TouchableOpacity>
        </Link>
      </View>
      <View className="mt-6 space-y-6 ">
        <View className="flex-row items-center gap-2">
          <Switch
            thumbColor={isPublic ? "#0895c9" : "#9e9ea0"}
            trackColor={{ false: "#765577", true: "#172554" }}
            onValueChange={setIsPublic}
            value={isPublic}
          />
          <Text className="font-bofy taxt-base text-gray-400">
            Tornar memória pública
          </Text>
        </View>

        <TouchableOpacity
          onPress={openImagePicker}
          activeOpacity={0.7}
          className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
        >
          {file ? (
            <Image
              alt=""
              source={{ uri: file }}
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <View className="flex-row items-center gap-2">
              <Icon name="image" color={"#fff"} />
              <Text className="font-body text-sm text-gray-400">
                Adicionar uma foto de capa
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TextInput
          multiline
          onChangeText={setContent}
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
          placeholderTextColor="#56565a"
          className="p-0 font-body text-lg text-gray-50"
        />
        <TouchableOpacity
          onPress={() => handleCreateMemory()}
          activeOpacity={0.7}
          className="items-center self-end rounded-full bg-green-600 px-5 py-2"
        >
          <Text className="font-alt text-sm uppercase text-black">Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
