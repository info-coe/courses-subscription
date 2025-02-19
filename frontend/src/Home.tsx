import axios from "axios";
import { useEffect, useState } from "react";

interface Course {
  course_ID: string;
  course_name: string;
  credits : number;
}

export default function Home() {
  const [data, setData] = useState<Course[]>([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_HOST}${import.meta.env.VITE_PORT}/`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Course Name</th>
            <th>Credits</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.course_ID}</td>
                <td>{item.course_name}</td>
                <td>{item.credits}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
