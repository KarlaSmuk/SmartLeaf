self.addEventListener("push", function (event) {
  let body = "You have a new alert";

  try {
    // JSON payload
    const data = event.data?.json();
    self.registration.showNotification(data?.title || "SmartLeaf Alert", {
      body: data?.body || body,
      icon: "/growth-plant.png",
      badge: "/growth-plant.png",
    });
  } catch {
    // plain text
    const text = event.data?.text();
    self.registration.showNotification("SmartLeaf Alert", {
      body: text || body,
      icon: "/growth-plant.png",
      badge: "/growth-plant.png",
    });
  }
});
