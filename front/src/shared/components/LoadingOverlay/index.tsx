import styled from "@emotion/styled";
import { CircularProgress } from "@mui/material";

const DarkBackground = styled.div`
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  color: #fff;
  flex-direction: column;
  gap: 2rem;
  font-size: 1.5rem;
`;

interface LoadingOverlayProps {
  text?: string;
  isLoading: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ text, isLoading }) => {
  return isLoading ? (
    <DarkBackground>
      <CircularProgress size={75} style={{ color: "#fff" }} />
      {text || "Carregando..."}
    </DarkBackground>
  ) : (
    <></>
  );
};
