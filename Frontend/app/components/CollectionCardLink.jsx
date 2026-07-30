"use client";

export default function CollectionCardLink({ href, className, children }) {
  function handleClick() {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem("sahanvi-nav-click", "1");
    }
  }

  return (
    <a className={className} href={href} onClick={handleClick}>
      {children}
    </a>
  );
}
