import React from "react";

import "components/Appointment/styles.scss";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";


export default function Appointment({time, interview}) {
  // const {student, interviewer} = interview;

  const student = interview && interview.student;
  const interviewer = interview && interview.interviewer;


  return (
  <article className="appointment">
    <Header time={time}/>
    {interview ? <Show student={student} interviewer={interviewer}/> : <Empty/>}
  </article>);
};