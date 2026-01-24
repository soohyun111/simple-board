import { ClipLoader } from "react-spinners";

export default function LoadingSpinner() {
  return (
    <div style={wrapperStyle}>
      <ClipLoader
        size={60}
        color="#584133"
        loading={true}
      />
    </div>
  );
}

const wrapperStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "70vh",
};
