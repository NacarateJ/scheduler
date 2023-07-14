import React from "react";
import InterviewerListItem from "./InterviewerListItem";

import "components/InterviewerList.scss";

export default function InterviewerList({ interviewers, interviewer, setInterviewer }) {
  
  const InterviewerListItems = interviewers.map((interviewerItem) => (
    <InterviewerListItem
      key={interviewerItem.id}
      id={interviewerItem.id}
      name={interviewerItem.name}
      avatar={interviewerItem.avatar}
      selected={interviewerItem.id === interviewer}
      setInterviewer={setInterviewer}
    />
  ));

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{InterviewerListItems}</ul>
    </section>
  );
};