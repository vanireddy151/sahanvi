export const menus = {
  "Heritage Sarees": ["Kanjivaram Silks", "Pochampally", "Banaras Silks", "Gadwal Pattu", "Mysore Silk", "Paithani Silk", "Paithani Yellow", "Jamdani Silk", "Muga Silk"],
  "Signature Sarees": ["Tussar", "Organza", "Ikkat", "Patola Silk", "Patan Patola", "Chanderi Silk", "Kota Silk"],
  Sarees: ["Linen Silk", "Kora Silk", "Semi Kota", "Soft Silk", "Uppada Silk", "Kalamkari"]
};

export const standaloneMenuItems = ["Sahanvi Vintage", "New Arrivals", "Our Collections"];

export const allMenuItems = [
  ...Object.values(menus).flat(),
  "Sahanvi Vintage"
];
