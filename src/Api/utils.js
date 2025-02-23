import axios from "axios";

export const imageUpload = async (imageData) => {
  const formData = new FormData();
  formData.append("image", imageData);
  const { data } = await axios.post(
    `https:/http://localhost:5000/tasks.imgbb.com/1/upload?key=${
      import.meta.env.VITE_IMGBB_API_KEY
    }`,
    formData
  );
  return data.data.display_url;
};

export const saveUser = async (user) => {
  await axios.post(`${import.meta.env.VITE_API_URL}/users/${user?.email}`, {
    name: user?.displayName,
    image: user?.photoURL,
    email: user?.email,
  });
};
