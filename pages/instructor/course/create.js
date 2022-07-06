import axios from "axios";
import { useState } from "react";
import InstructorRoute from "../../../components/routes/InstructorRoute";

import { toast } from "react-toastify";
import { useRouter } from "next/router";
import CourseCreateForm from "../../../components/forms/CourseCreateForm";

const CourseCreate = () => {
  const router = useRouter();
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    uploading: "",
    paid: true,
    loading: false,
  });

  const [preview, setPreview] = useState("");
  const [uploadButtonText, setUploadButtonText] = useState("");
  const [imageDetails, setImageDetails] = useState({});

  const handleChanges = (e) => {
    console.log(e.target.value, "-", e.target.name);
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = async (e) => {
    let file = e.target.files[0];
    setPreview(window.URL.createObjectURL(e.target.files[0]));
    setUploadButtonText(file.name);
    setValues({ ...values, loading: true });

    const formdata = new FormData();
    formdata.append("image", file);

    try {
      let { data } = await axios.post("/api/course/upload-image", formdata, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImageDetails(data);
      console.log("uploaded data", data);
      setValues({ ...values, loading: false });
    } catch (error) {
      console.log(error);
      setValues({ ...values, loading: false });
      // TransformStream("Image upload faild try again")
    }
  };

  const handleImageRemove = async (e) => {
    try {
      setValues({ ...values, loading: true });
      const res = await axios.post("/api/course/remove-image", imageDetails);
      setImageDetails({});
      setPreview("");
      setValues({ ...values, loading: false });
    } catch (error) {
      console.log(error);
      setValues({ ...values, loading: false });
      toast("failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/course", {
        ...values,
        image: imageDetails,
      });
      toast.success("Course added sucessfully");
      router.push("/instructor");
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  return (
    <InstructorRoute>
      <>
        <div className="jumbotron bg-primary square text-center">
          <h1 style={{ height: "150px" }} className="p-5  text-light">
            Create course
          </h1>
        </div>
        <div className="p-3">
          <CourseCreateForm
            handleImage={handleImage}
            handleSubmit={handleSubmit}
            values={values}
            handleChanges={handleChanges}
            setValues={setValues}
            preview={preview}
            uploadButtonText={uploadButtonText}
            handleImageRemove={handleImageRemove}
          />
        </div>
      </>
    </InstructorRoute>
  );
};
export default CourseCreate;
