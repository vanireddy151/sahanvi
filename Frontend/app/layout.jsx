import "../styles.css";
import "./next.css";

export const metadata = {
  title: "Sahanvi Handloom Sarees",
  description: "Handloom sarees by Sahanvi"
};

export const viewport = {
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
