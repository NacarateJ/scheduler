import React, {useState} from "react";

import InterviewerList from "components/InterviewerList";
import Button from "components/Button";



export default function Form({interviewers, onSave, onCancel}) {
  const [student, setStudent] = useState(student || "");
  const [interviewer, setInterviewer] = useState(interviewer || null);

  const reset = () => {
    setStudent("");
    setInterviewer(null);
  }

  const cancel = () => {
    reset();
    onCancel();
  }

   const handleStudentChange = (event) => {
     setStudent(event.target.value);
   };

   const handleInterviewerChange = (selectedInterviewer) => {
     setInterviewer(selectedInterviewer);
   };

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={student}
            onChange={handleStudentChange}
          />
        </form>
        <InterviewerList
          interviewers={interviewers}
          value={interviewer}
          onChange={handleInterviewerChange}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>
            Cancel
          </Button>
          <Button confirm onClick={onSave}>
            Save
          </Button>
        </section>
      </section>
    </main>
  );
};