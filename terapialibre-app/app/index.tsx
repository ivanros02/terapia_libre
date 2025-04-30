import React, { useRef, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, BackHandler, Alert, Platform } from "react-native";
import { WebView } from "react-native-webview";
import * as Linking from "expo-linking";

const CLIENT_ID_WEB = "TU_CLIENT_ID_WEB_GOOGLE.apps.googleusercontent.com";
const CLIENT_ID_ANDROID = "TU_CLIENT_ID_ANDROID_GOOGLE.apps.googleusercontent.com";

const clientIdToUse = Platform.OS === "android" ? CLIENT_ID_ANDROID : CLIENT_ID_WEB;

// Armas la URL para Google OAuth con el clientId correcto
const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientIdToUse}&redirect_uri=https://terapialibre.com.ar/auth/callback&response_type=token&scope=openid%20email%20profile`;

const WEB_URL = "https://terapialibre.com.ar/";

export default function App() {
    const webviewRef = useRef<any>(null);
    const [canGoBack, setCanGoBack] = useState(false);

    const handleShouldStartLoadWithRequest = (event: any) => {
        const url = event.url;
        console.log("➡️ Intentando cargar URL:", url);

        if (url.includes("accounts.google.com/o/oauth2/v2/auth")) {
            console.log("🛑 Detectado intento de login Google, abriendo manualmente el navegador");

            const clientIdToUse = Platform.OS === "android" ? CLIENT_ID_ANDROID : CLIENT_ID_WEB;

            const loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientIdToUse}&redirect_uri=https://terapialibre.com.ar/auth/callback&response_type=token&scope=openid%20email%20profile`;

            Linking.openURL(loginUrl);

            return false;
        }

        if (url.startsWith(WEB_URL) || url.includes("terapialibre.com.ar")) {
            console.log("✅ Permitido: dentro de terapialibre.com.ar");
            return true;
        }

        if (
            url.includes("mercadopago.com") ||
            url.includes("paypal.com") ||
            url.includes("wa.me") ||
            url.includes("youtube.com") ||
            url.includes("facebook.com")
        ) {
            console.log("🌎 URL externa detectada, abriendo fuera:", url);
            Linking.openURL(url);
            return false;
        }

        console.log("🛑 URL desconocida, permitiendo igual:", url);
        return true;
    };


    const handleDeepLink = (event: Linking.EventType) => {
        const url = event.url;
        console.log("🔗 Deep link detectado:", url);

        if (url.startsWith("terapialibre://dashboard")) {
            console.log("🔄 Redirigiendo a dashboard interno desde deep link...");
            if (webviewRef.current) {
                webviewRef.current.injectJavaScript(`
                    window.location.href = '${WEB_URL}dashboard/usuario';
                    true;
                `);
            }
        }
    };

    useEffect(() => {
        console.log("✅ App iniciada en", Platform.OS);

        const subscription = Linking.addEventListener("url", handleDeepLink);

        const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            if (webviewRef.current && canGoBack) {
                console.log("🔙 Volviendo a la página anterior en WebView...");
                webviewRef.current.goBack();
                return true;
            } else {
                console.log("⚠️ En Home, mostrando alerta para salir...");
                Alert.alert(
                    "Salir de Terapia Libre",
                    "¿Seguro que querés salir?",
                    [
                        { text: "Cancelar", onPress: () => null, style: "cancel" },
                        { text: "Salir", onPress: () => BackHandler.exitApp() },
                    ],
                    { cancelable: false }
                );
                return true;
            }
        });

        (async () => {
            const initialUrl = await Linking.getInitialURL();
            if (initialUrl) {
                console.log("🚀 URL inicial detectada:", initialUrl);
                handleDeepLink({ url: initialUrl });
            }
        })();

        return () => {
            subscription.remove();
            backHandler.remove();
        };
    }, [canGoBack]);

    return (
        <SafeAreaView style={styles.container}>
            <WebView
                ref={webviewRef}
                source={{ uri: WEB_URL }}
                style={{ flex: 1 }}
                javaScriptEnabled
                domStorageEnabled
                javaScriptCanOpenWindowsAutomatically={true}
                startInLoadingState
                onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
                onNavigationStateChange={(navState) => {
                    setCanGoBack(navState.canGoBack);
                    console.log("🌐 Navegación:", navState.url, "Can go back:", navState.canGoBack);
                }}
                originWhitelist={["*"]}
                allowsBackForwardNavigationGestures
                onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.error("❌ WebView error:", nativeEvent);
                }}
                onHttpError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.error("❌ WebView HTTP error:", nativeEvent.statusCode, nativeEvent.description);
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
});
