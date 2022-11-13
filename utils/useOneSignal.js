import { useEffect } from "react";
import OneSignal from "react-onesignal";

const useOneSignal = () =>
  useEffect(() => {
    OneSignal.init({
      appId: "e2b02d45-f15c-4a71-8437-37fa819e1c37",
      allowLocalhostAsSecureOrigin: true,
    });

    OneSignal.registerForPushNotifications();
  }, []);

export default useOneSignal;
