import { allMenuItems } from "../data/navigation";
export { default } from "../collection/[type]/page";

export function generateStaticParams() {
  return allMenuItems.map((type) => ({ type }));
}
