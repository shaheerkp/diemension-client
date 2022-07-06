import { List, Avatar } from "antd";
const { Item } = List;

const SingleCourseLessons = ({
  lessons,
  setPreview,
  showModal,
  setShowModal,
}) => {
  console.log(lessons);
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col lesson-list p-3">
            {lessons && <h4>{lessons.length}-lessons</h4>}
            <hr />
            <List
              itemLayout="horizontal"
              dataSource={lessons}
              renderItem={(item, index) => {
                return (
                  <Item>
                    <Item.Meta
                      avatar={<Avatar>{index + 1}</Avatar>}
                      title={item.title}
                    />
                    {item.video && item.video !== null && item.free_preview && (
                      <span
                        className="text-primary pointer "
                        onClick={() => {
                          setPreview(item.video.Location);
                          setShowModal(!showModal);
                        }}
                      >
                        preview{" "}
                      </span>
                    )}
                  </Item>
                );
              }}
            ></List>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleCourseLessons;
