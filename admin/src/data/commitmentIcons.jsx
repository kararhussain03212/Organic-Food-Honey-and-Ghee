export const ICON_OPTIONS = [
  { key: "check-circle", label: "Check Circle" },
  { key: "shield",       label: "Shield" },
  { key: "house",        label: "House" },
  { key: "leaf",         label: "Leaf" },
  { key: "star",         label: "Star" },
  { key: "heart",        label: "Heart" },
  { key: "droplet",      label: "Droplet" },
  { key: "award",        label: "Award" },
  { key: "check",        label: "Checkmark" },
];

export function CommitmentIcon({ name, size = 24, color = "currentColor" }) {
  const s = { width: size, height: size, flexShrink: 0 };
  const shared = { fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

  switch (name) {
    case "check-circle":
      return (
        <svg viewBox="0 0 24 24" style={s} {...shared}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" style={s} {...shared}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case "house":
      return (
        <svg viewBox="0 0 24 24" style={s} {...shared}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "leaf":
      return (
        <svg viewBox="0 0 24 24" style={s} {...shared}>
          <path d="M17 8C8 10 5.9 16.17 3.82 19.5c.2.6.4 1.2.8 1.5A12 12 0 0 0 22 10C22 10 20 8 17 8z" />
          <path d="M3.82 19.5l5.7-5.7" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 24 24" style={s} {...shared}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 24 24" style={s} {...shared}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case "droplet":
      return (
        <svg viewBox="0 0 24 24" style={s} {...shared}>
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      );
    case "award":
      return (
        <svg viewBox="0 0 24 24" style={s} {...shared}>
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      );
    case "check":
      return (
        <svg viewBox="0 0 24 24" style={s} {...shared} strokeWidth={2.5}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    default:
      return null;
  }
}
