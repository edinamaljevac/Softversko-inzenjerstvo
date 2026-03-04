export function getMenuItems(role) {
  if (role === "ADMIN") {
    return [
      { name: "Korisnici", path: "admin/users" },
      { name: "Statistika sistema", path: "admin/stats" },
      { name: "Ocene i komentari", path: "admin/ratings" },
    ];
  }

  if (role === "DENTIST") {
    return [
      { name: "Moj profil", path: "profile" },
      { name: "Pacijenti", path: "patients" },
      { name: "Termini", path: "slots" },
      { name: "Usluge", path: "treatments" },
      { name: "Pregledi", path: "appointments" },
      { name: "Ocene i komentari", path: "dentist-ratings" },
      { name: "Statistika", path: "stats" },
    ];
  }

  return [
    { name: "Moj profil", path: "profile" },
    { name: "Slobodni termini", path: "slots" },
    { name: "Moji pregledi", path: "appointments" },
    { name: "Ocene i komentari", path: "ratings" },
  ];
}
