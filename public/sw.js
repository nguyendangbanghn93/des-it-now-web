self.addEventListener("push", function (event) {
  const { image, tag, url, title, body } = event.data.json();
  console.log("🚀 ~ file: sw.js:12 ~ { image, tag, url, title, text: body }:", {
    image,
    tag,
    url,
    title,
    body,
  });

//   const options = {
//     data: { table: "request", id: 10 },
//     url: "https://google.com",
//     body: "Tôi muốn tạo thông báo",
//     actions: [
//       {
//         action: "Detail",
//         title: "View",
//         icon: "https://via.placeholder.com/128/ff0000",
//       },
//     ],
//   };

  //   event.waitUntil(self.registration.showNotification("Thông báo", options));
});

self.addEventListener("notificationclick", function (event) {
  console.log("🚀 ~ file: sw.js:29 ~ event:", "CLISK NÔTI");

  event.notification.close();

  // eslint-disable-next-line no-undef
  event.waitUntil(clients.openWindow(event.notification.data));

  event.waitUntil(
    // eslint-disable-next-line no-undef
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientsArr) => {
        if (clientsArr.length > 0) {
          clientsArr[0].postMessage({
            type: "SHOW_TOAST",
            data: "Thông báo từ Service Worker",
          });
        }
      })
  );
});
