import { useEffect } from "react";
import OneSignal from "react-onesignal";

const useOneSignal = () =>
  useEffect(() => {
    OneSignal.init({
      appId: "b6cb022b-e518-4f67-b0ec-37484ff1d7d7",
      allowLocalhostAsSecureOrigin: true,
    });

    OneSignal.registerForPushNotifications();
  }, []);

export default useOneSignal;
