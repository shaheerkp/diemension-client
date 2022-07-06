import { Avatar, Button, Menu } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { createElement, useEffect, useState } from "react";
import StudentRoute from "../../../components/routes/StudentRoute";
import ReactPlayer from "react-player";
import ReactMarkDown from "react-markdown";
import {
  PlayCircleOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  CheckCircleFilled,
  MinusCircleFilled,
} from "@ant-design/icons";
const { Item } = Menu;
const SingleCourse = () => {
  const [clicked, setClicked] = useState(-1);
  const [collapsed, setCollapsed] = useState(false);
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [updatedState,setUpadtedState]=useState(false)

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) loadCourse();
  }, []);

  useEffect(() => {
    if (course) loadCompletedLessons();
  }, [course]);

  const loadCourse = async () => {
    console.log(slug);
    const { data } = await axios.get(`/api/course/${slug}`);
    console.log(data);
    setCourse(data);
  };

  const loadCompletedLessons = async () => {
    const { data } = await axios.post("/api/list-completed", {
      courseId: course._id,
    });
    console.log("COMPLETED LESSONS=>", data);
    setCompletedLessons(data);
  };

  const markCompleted = async () => {
    const { data } = await axios.post(`/api/mark-completed`, {
      courseId: course._id,
      lessonId: course.lessons[clicked]._id,
    });

    setCompletedLessons([...completedLessons,course.lessons[clicked]._id])
    setUpadtedState(!updatedState)

  };

  const markIncompleted = async () => {
    try {
      const { data } = await axios.post(`/api/list-incompleted`, {
        courseId: course._id,
        lessonId: course.lessons[clicked]._id,
      });
      console.log(data);
      const all = completedLessons;
      const index = all.indexOf(course.lessons[clicked]._id);
      if (index > -1) {
        all.splice(index, 1);
        setCompletedLessons(all);
        setUpadtedState(!updatedState)
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <StudentRoute>
      <div className="row">
        <div className="col-3">
          <Button
            onClick={() => {
              setCollapsed(!collapsed);
            }}
            className="text-primary mt-1 btn-block mb-2"
          >
            {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
          </Button>
          <Menu
            defaultSelectedKeys={[clicked]}
            inlineCollapsed={collapsed}
            style={{ height: "90vh" }}
          >
            {course.lessons ? (
              course.lessons.map((lesson, index) => {
                return (
                  <Item
                    onClick={() => {
                      setClicked(index);
                    }}
                    key={index}
                    icon={<Avatar>{index + 1}</Avatar>}
                  >
                    {lesson.title.substring(0, 30)}{" "}
                    {completedLessons.includes(lesson._id) ? (
                      <CheckCircleFilled
                        className="float-right text-primary ml-2"
                        style={{ marginTop: "13px" }}
                      />
                    ) : (
                      <MinusCircleFilled
                        className="float-right text-danger ml-2"
                        style={{ marginTop: "13px" }}
                      />
                    )}
                  </Item>
                );
              })
            ) : (
              <h2>Empty</h2>
            )}
          </Menu>
        </div>

        <div className="col">
          {clicked != -1 ? (
            <>
              <div className=" mt-3 col alert alert-primary square">
                <b>{course.lessons[clicked].title.substring(0, 30)}</b>
                {completedLessons.includes(course.lessons[clicked]._id) ? (
                  <span
                    className="float-right pointer float-end"
                    onClick={markIncompleted}
                  >
                    Mark as incompleted
                  </span>
                ) : (
                  <span
                    className="float-right pointer float-end"
                    onClick={markCompleted}
                  >
                    Mark as completed
                  </span>
                )}
              </div>
              {course.lessons[clicked].video &&
                course.lessons[clicked].video.Location && (
                  <>
                    <div className="wrapper">
                      <ReactPlayer
                        className="player"
                        url={course.lessons[clicked].video.Location}
                        width={"100%"}
                        height="550px"
                        controls
                      />
                    </div>
                    <ReactMarkDown
                      source={course.lessons[clicked].content}
                      className="single-post"
                    />
                  </>
                )}
            </>
          ) : (
            <div className="d-flex justify-content-center p-5">
              <div className="text-center p-5">
                <PlayCircleOutlined className="text-primary display-1 p-5" />
                <p className="lead">Click on the lesson</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </StudentRoute>
  );
};

export default SingleCourse;
