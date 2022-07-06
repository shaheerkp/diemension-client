import axios from "axios";
import { useEffect, useState } from "react";

import CourseCard from "../components/cards/CoursesCard";

function Index({courses}) {
  // const [courses, setCourses] = useState([]);
  // useEffect(() => {
  //   const fetchCourse = async () => {
  //     const { data } = await axios.get("/api/courses");

  //     setCourses(data);
  //   };

  //   fetchCourse();
  // }, []);
 
  return (
    <>
      <div className="jumbotron bg-primary square text-center">
        <h1 style={{ height: "150px" }} className="p-5  text-light">
          <pre>Diemensions</pre>
        </h1>
      </div>
      <div className="container-fluid">
        <div className="row">
          {courses.length!==0&&courses.map((i) =>{
            return (
                <div key={i._id} className="col-md-4">
                  <CourseCard course={[i]}></CourseCard>
                </div>
              )

          })}
        </div> 
      </div>
    </>
  );

  
  
}
export async function  getServerSideProps(){
  const {data} =await axios.get(`${process.env.API}/courses`) 
    console.log(process.env.API);
    return {
      props:{
        courses:data
      }
    }
    
  

}


export default Index;
