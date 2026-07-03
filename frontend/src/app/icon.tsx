import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 16,
          background: "#6c9c64", // tea color (green)
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#faf8f5", // ivory
          borderRadius: "8px",
          fontWeight: "bold",
          fontFamily: "serif",
        }}
      >
        TY
      </div>
    ),
    {
      ...size,
    }
  );
}
