import { useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@sl/components/ui/card";
import { User, AlertTriangle, Phone, FileText } from "lucide-react";
import { StressReportStudentContext } from "../../../context/StressReportStudentContext.jsx";

const defaultPatient = {
  name: "Subject #S032",
  age: 21,
  gender: "Male",
  height: "5'10\"",
  weight: "72 kg",
  bmi: 22.8,
  bmiCategory: "Normal",
  riskStatus: "Moderate",
  medicalHistory: "Mild insomnia, seasonal allergies",
  emergencyContact: "+1 (555) 234-5678",
};

const riskColor: Record<string, string> = {
  Normal: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  Moderate: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  High: "text-red-400 bg-red-400/10 border-red-400/30",
};

export const PatientProfilePanel = () => {
  const { displayName, profile } = useContext(StressReportStudentContext) as {
    displayName?: string | null;
    profile?: any;
  };

  const name = displayName || defaultPatient.name;
  const bmi = profile?.bmi ?? defaultPatient.bmi;
  const bmiCategory = profile?.bmiCategory ?? defaultPatient.bmiCategory;
  const height =
    profile?.heightCm != null ? `${profile.heightCm} cm` : defaultPatient.height;
  const weight =
    profile?.weightKg != null ? `${profile.weightKg} kg` : defaultPatient.weight;
  const riskStatus = defaultPatient.riskStatus;

  return (
  <Card className="border-border bg-card">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base">
        <User className="w-4 h-4 text-primary" />
        Patient Profile
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <DataRow label="Name" value={name} />
        <DataRow label="Age" value={`${defaultPatient.age} yrs`} />
        <DataRow label="Gender" value={defaultPatient.gender} />
        <DataRow label="Height" value={height} />
        <DataRow label="Weight" value={weight} />
        <DataRow label="BMI" value={bmi != null ? `${bmi}` : "—"} />
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">BMI Category:</span>
        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-400/10 text-emerald-400 border border-emerald-400/30">
          {bmiCategory}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-muted-foreground">Risk Status:</span>
        <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${riskColor[riskStatus]}`}>
          {riskStatus}
        </span>
      </div>
      <div className="text-sm space-y-1 pt-1 border-t border-border">
        <div className="flex items-start gap-2">
          <FileText className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
          <span className="text-muted-foreground">{defaultPatient.medicalHistory}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">{defaultPatient.emergencyContact}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);
}

const DataRow = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="text-muted-foreground text-xs">{label}</span>
    <div className="font-semibold code-font text-foreground">{value}</div>
  </div>
);
