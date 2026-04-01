import { createContext, useContext } from "react";

/** When set (e.g. on the stress report page), phenotyping API calls use this student id as participant_id and profile metadata. */
const StressReportStudentContext = createContext({
  studentId: null,
  displayName: null,
  profile: null,
});

export function useStressReportStudent() {
  return useContext(StressReportStudentContext);
}

export { StressReportStudentContext };
