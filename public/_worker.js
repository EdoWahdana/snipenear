console.log("Service Worker Loaded...");

self.addEventListener("push", (e) => {
  const data = e.data.json();
  self.registration.showNotification(
    data.title, // title of the notification
    {
      body: "Your NFT is sniped",
      image:
        "https://pixabay.com/vectors/bell-notification-communication-1096280/",
      icon: "https://pixabay.com/vectors/bell-notification-communication-1096280/", // icon
    }
  );
});
