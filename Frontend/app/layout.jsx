import "../styles.css";
import "./next.css";

export const metadata = {
  title: "Sahanvi Handloom Sarees",
  description: "Handloom sarees by Sahanvi"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
