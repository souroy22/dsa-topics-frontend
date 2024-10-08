import { CSSProperties, FC } from "react";
import { Skeleton } from "@mui/material";

type PropTypes = {
  count?: number;
  height?: number | string;
  width?: number | string;
  variant?: "circular" | "rectangular" | "rounded" | "text";
  style?: CSSProperties;
};

const SkeletonComponent: FC<PropTypes> = ({
  count = 8,
  height = 150,
  width = 250,
  variant = "rectangular",
  style = {},
}) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <Skeleton
          key={i}
          height={height}
          width={width}
          variant={variant}
          sx={style}
        />
      ))}
    </>
  );
};

export default SkeletonComponent;
