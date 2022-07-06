import { Card, Badge } from "antd";
import Link from "next/link";

const { Meta } = Card;

const CourseCard = ({ course }) => {
  console.log(course, "asdasda");
  const { name, instructor, price, image, slug, paid, category } = course;
  return (
    <Link href={`/course/${course[0]._id}`}>
      <a  >
        <Card
         
          className="mb-4"
          cover={
            <img
              src={course[0].image ? course[0].image.Location : "null"}
              alt={course[0].name}
              style={{height:"200px",objectFit:"cover"}}
            />
          }
        >
          <h2 className="font-weight-bold">{course[0].name}</h2>
          <p>By {course[0].instructor.name}</p>
          <h4 className="pt-2" >Price : {course[0].paid?course[0].price:"Free"}</h4>
        </Card>
      </a>
    </Link>
  );
};

export default CourseCard;
