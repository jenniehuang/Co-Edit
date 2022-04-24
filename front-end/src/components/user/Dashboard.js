import React, { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import { toast } from "react-toastify";
import UserServices from "../../services/user-services";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  const [currentThumbnail, setCurrentThumbnail] = useState(user.image);
  const [uploadedBg, setUploadedBg] = useState(null);
  const [link, setLink] = useState("");
  const [about, setAbout] = useState("");
  const [uploadedThumbnail, setUploadedThumbnail] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        let response = await UserServices.getUserInfo(user.id);
        setLink(response.data.link);
        setAbout(response.data.about);
      } catch (e) {
        console.log(e);
        toast.error("Sorry! Something went wrong.");
      }
    };

    getUserInfo();
  }, []);

  const thumbnailHandler = (e) => {
    if (e.target.files[0]) {
      setCurrentThumbnail(URL.createObjectURL(e.target.files[0]));
      setUploadedThumbnail(e.target.files[0]);
    }
  };

  const backgroundHandler = (e) => {
    if (e.target.files[0]) {
      setUploadedBg(e.target.files[0]);
    }
  };

  const uploadUserData = async (e) => {
    e.preventDefault();
    const thumbnailRef = ref(storage, `images/${user.id}/thumbnail`);
    const backgroundRef = ref(storage, `images/${user.id}/background`);
    let thumbnailURL;
    let backgroundURL;
    try {
      if (uploadedThumbnail) {
        await uploadBytes(thumbnailRef, uploadedThumbnail);
        thumbnailURL = await getDownloadURL(thumbnailRef);
      } else {
        thumbnailURL = user.image;
      }

      if (uploadedBg) {
        await uploadBytes(backgroundRef, uploadedBg);
        backgroundURL = await getDownloadURL(backgroundRef);
      } else {
        backgroundURL = user.background;
      }

      let response = await UserServices.uploadUserData(
        thumbnailURL,
        backgroundURL,
        link,
        about
      );
      if (response.status === 200) {
        const user = JSON.parse(localStorage.getItem("user"));
        user.image = thumbnailURL;
        user.background = backgroundURL;
        localStorage.setItem("user", JSON.stringify(user));
        window.location.reload(false);
        toast.success(`${t("uploadSuccess")}`);
      }
    } catch (e) {
      console.log(e);
      toast.error(e);
    }
  };

  return (
    <div className="p-8 ">
      <div>
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className=" text-3xl font-medium leading-6 text-gray-900">
                Profile
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                This information will be displayed publicly so be careful what
                you share.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Link
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full h-8 rounded-none rounded-r-md sm:text-sm border border-gray-300"
                          onChange={(e) => {
                            setLink(e.target.value);
                          }}
                          value={link}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      About
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="about"
                        name="about"
                        rows="3"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                        onChange={(e) => {
                          setAbout(e.target.value);
                        }}
                        value={about}
                      ></textarea>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Brief description for your profile. URLs are hyperlinked.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Photo
                    </label>
                    <div className="mt-1 flex items-center">
                      <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                        <img src={currentThumbnail} alt="" />
                      </span>
                      <button
                        type="button"
                        className="relative ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <p className="cursor-pointer">{t("thumbnail")}</p>
                        <label className="absolute top-0 right-0 bottom-0 left-0 cursor-pointer">
                          <input
                            className="hidden "
                            type="file"
                            onChange={thumbnailHandler}
                          />
                        </label>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cover photo
                    </label>
                    <div
                      style={{
                        backgroundImage: uploadedBg
                          ? `url(${URL.createObjectURL(uploadedBg)})`
                          : "",
                      }}
                      className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-cover"
                    >
                      <div className="space-y-1 text-center bg-white p-8">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={backgroundHandler}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={uploadUserData}
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
