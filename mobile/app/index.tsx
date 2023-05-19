import * as SecureStore from "expo-secure-store";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import NLWLogo from "../src/assets/nlw.svg";

import { styled } from "nativewind";
import React, { useEffect } from "react";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { api } from "../src/lib/api";

const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint:
    "https://github.com/settings/connections/applications/c0141e89cce52501c2e7",
};

export default function App() {
  const router = useRouter();

  const [, response, signInWithGithub] = useAuthRequest(
    {
      clientId: "c0141e89cce52501c2e7",
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        scheme: "nlwspacetime",
      }),
    },
    discovery
  );

  async function handleGithubOAuthCode(code: string) {
    try {
      //   console.log("token");
      // console.log(api);
      const response = await api.post("/register", {
        code,
      });
      console.log(response);
      console.log("aham");
      const { token } = response.data;
      console.log(token);
      await SecureStore.setItemAsync("token", token);

      router.push("/memories");
    } catch (error) {
      console.log("aa");
    }
  }
  useEffect(() => {
    // console.log(makeRedirectUri({ scheme: "nlwspacetime" }));
    if (response?.type === "success") {
      const { code } = response.params;
      console.log(code);
      handleGithubOAuthCode(code);
    }
  }, [response]);

  const StyledNLWLogo = styled(NLWLogo);
  return (
    <View className="flex-1 items-center px-16 py-10">
      <View className="flex-1 items-center justify-center gap-6">
        <StyledNLWLogo />
        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => signInWithGithub()}
          activeOpacity={0.7}
          className="rounded-full bg-green-600 px-5 py-2"
        >
          <Text className="font-alt text-sm uppercase text-black">
            cadastrar lembrança
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-center font-body text-base leading-relaxed  text-gray-200">
        Feito com 💙 no NLW{" "}
      </Text>
    </View>
  );
}
