import { useEffect, useState } from "react";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
  fetch("http://127.0.0.1:8000/shop/notifications/", {
  headers: {
    Authorization: `Token ${token}`,
  },
})
  .then((res) => res.json())
  .then((data) => {setNotifications(data);
    console.log("notification: ",data)
  });
  }, []);

  return (
    <div className="container mt-4">
      <h2>Notifications</h2>

      {notifications.map((notification) => (
        <div key={notification.id} className="card p-3 mb-3">
          <h5>{notification.title}</h5>
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
}

export default Notifications;
