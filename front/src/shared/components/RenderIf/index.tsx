import React, { PropsWithChildren } from "react";

interface Props {
  isTrue: boolean;
  elseRender?: React.ReactNode;
}

const RenderIf: React.FC<PropsWithChildren<Props>> = ({ children, isTrue, elseRender }) => {
  return isTrue ? <>{children}</> : <>{elseRender}</>;
};

export default RenderIf;
