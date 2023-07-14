import React from "react";
import DayListItem from "./DayListItem";

export default function DayList({days, value, onChange}) {
   const dayListItems = days.map((dayItem) => (
     <DayListItem
       key={dayItem.id}
       name={dayItem.name}
       spots={dayItem.spots}
       selected={dayItem.name === value}
       setDay={onChange}
     />
   ));

   return <ul>{dayListItems}</ul>;
};