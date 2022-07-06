import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import ReactPlayer from "react-player";
import { Badge, Modal, Button } from "antd";
import { LoadingOutlined, SafetyOutlined } from "@ant-design/icons";
import PreviewModal from "../../components/modal/PreviewModal";
import SingleCourseLessons from "../../components/cards/SingleCourseLesson";
import { toast } from "react-toastify";
import { Context } from "../../context";
import { loadStripe } from "@stripe/stripe-js";


const SingleCourse = ({ course }) => {
  const [showModel, setShowModel] = useState(false);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState({});

  const {
    state: { user },
  } = useContext(Context);

  useEffect(() => {
    if (user && course) checkEnrollment();
  }, [user, course]);

  const checkEnrollment = async () => {
    const { data } = await axios.get(`/api/check-enrollment/${course._id}`);
    console.log("Check Enrollment", data);
    setEnrolled(data);
  };

  const router = useRouter();
  const { slug } = router.query;
  const {
    name,
    description,
    instructor,
    updateAt,
    lessons,
    image,
    price,
    paid,
    category,
  } = course;

  const handlePaidEnrollment = async () => {
    try {
      setLoading(true);
      if (!user) router.push("/login");

      if (enrolled.status)
        return router.push(`/user/course/${enrolled.course.slug}`);
        const {data} =await axios.post(`/api/paid-enrollment/${course._id}`)
        const stripe=await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)
        stripe.redirectToCheckout({sessionId:data})


    } catch (error) {
        toast.error("stripe Error")
    }
  };

  const handleFreeEnrollment = async (e) => {
    e.preventDefault();

    try {
      if (!user) router.push("/login");

      if (enrolled.status)
        return router.push(`/user/course/${enrolled.course._id}`);

      setLoading(true);
      const { data } = await axios.post(`/api/free-enrollment/${course._id}`);
      toast.success(data.message);
      setLoading(false);
      router.push(`/user/course/${data.course.slug}`);
    } catch (err) {
      toast.error("Enrolment failed,Try agin");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid ">
        <div className="row">
          <div className="jumbotron bg-primary square text-center">
            <div className="row">
              <div className="col-md-6">
                <h1 style={{ height: "150px" }} className=" p-5 text-light">
                  {name}
                </h1>
                <p className="lead">
                  {description && description.substring(0, 160)}...
                </p>
                <p>Created By {instructor.name}</p>
                {/* <p>Last updated {updateAt}</p> */}

                <h4 className="text-light">{paid ? price : "Free"}</h4>
              </div>
              <div className="col-md-4 justify-content-center mt-5">
                {lessons[0].video && lessons[0].video.Location ? (
                  <div
                    onClick={() => {
                      setPreview(lessons[0].video.Location);
                      setShowModel(true);
                    }}
                  >
                    <ReactPlayer
                      className="react-player-div"
                      url={lessons[0].video.Location}
                      light={image.Location}
                      width="100"
                      height="50"
                    />
                  </div>
                ) : (
                  <>
                    <img
                      src={image.Location}
                      alt={name}
                      className="img img-fluid"
                      height={50}
                    />
                  </>
                )}
                {loading ? (
                  <div className="d-flex justify-content-center">
                    <LoadingOutlined />
                  </div>
                ) : (
                  <Button
                    className="mb-3 mt-3"
                    type={"danger"}
                    block
                    shape="round"
                    icon={<SafetyOutlined />}
                    size="large"
                    disabled={loading}
                    onClick={paid ? handlePaidEnrollment : handleFreeEnrollment}
                  >
                    {user
                      ? enrolled.status
                        ? "Go to Course"
                        : "Enroll"
                      : "Login to enroll"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PreviewModal
        showModal={showModel}
        setShowModal={setShowModel}
        preview={preview}
      ></PreviewModal>

      {course.lessons && (
        <SingleCourseLessons
          lessons={course.lessons}
          setPreview={setPreview}
          showModal={showModel}
          setShowModal={setShowModel}
        ></SingleCourseLessons>
      )}
    </>
  );
};

export async function getServerSideProps({ query }) {
  const { data } = await axios.get(`${process.env.API}/course/${query.slug}`);

  return {
    props: {
      course: data,
    },
  };
}

export default SingleCourse;
