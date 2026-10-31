import type { AppUser, Tweet } from "../types/models";

export const currentUser: AppUser = {
  uid: "1017261775",
  fullName: "Katerine Pino Zabala",
  username: "Kate0998",
  email: "kpino@tdea.edu.co",
};

const rawUsers: Array<[string, string]> = [
  ["Ana María Gómez", "anamgomez"],
  ["Andrés Felipe Ruiz", "andresruiz"],
  ["Camila Torres", "camitorres"],
  ["Carlos Mejía", "carlosmejia"],
  ["Daniela Ospina", "danispina"],
  ["David Restrepo", "daverestrepo"],
  ["Diana Cardona", "dianacardona"],
  ["Esteban Londoño", "estelondono"],
  ["Felipe Cano", "felipecano"],
  ["Gabriela Muñoz", "gabymunoz"],
  ["Héctor Vélez", "hectorvelez"],
  ["Isabela Arango", "isaarango"],
  ["Juan Pablo Salazar", "jpsalazar"],
  ["Laura Henao", "laurahenao"],
  ["Luis Alberto Zapata", "luiszapata"],
  ["Manuela Jaramillo", "manujaramillo"],
  ["Mateo Giraldo", "mateogiraldo"],
  ["Natalia Betancur", "nataliab"],
  ["Óscar Montoya", "oscarmontoya"],
  ["Paula Echeverri", "paulaecheverri"],
  ["Santiago Duque", "santiduque"],
  ["Sofía Valencia", "sofivalencia"],
  ["Tomás Marín", "tomasmarin"],
  ["Valentina Rojas", "valenrojas"],
  ["Verónica Pineda", "veropineda"],
  ["Yeison Agudelo", "yeisonagudelo"],
];

export const mockUsers: AppUser[] = rawUsers.map(([fullName, username], index) => ({
  uid: `u${index + 1}`,
  fullName,
  username,
  email: `${username}@example.com`,
}));


export const followingUsers: AppUser[] = mockUsers.slice(0, 14);


export const followerUsers: AppUser[] = mockUsers.slice(8, 23);

const sampleBodies = [
  "¡Hola mundo! Este es mi primer tweet.",
  "Hoy aprendí nuevas funcionalidades",
  "He terminado",
  "¿Que te gusta hacer en tus tiempos libres?",
  "¿cual es tu deporte favorito?",
  "mi hobby es leer libros",
  "Soy estudiante de ingeniería de software",
  "Café y código, la mejor combinación.",
];

export const mockTweets: Tweet[] = Array.from({ length: 40 }, (_, index) => {
  const author = index % 3 === 0 ? currentUser : mockUsers[index % mockUsers.length];
  return {
    id: `t${index + 1}`,
    authorUsername: author.username,
    authorFullName: author.fullName,
    body: sampleBodies[index % sampleBodies.length],
    createdAt: new Date(Date.UTC(2026, 9, 1, 8 + index, (index * 7) % 60)).toISOString(),
  };
});

export const getFollowCounts = (username: string) => {
  if (username === currentUser.username) {
    return { followers: followerUsers.length, following: followingUsers.length };
  }
  return { followers: username.length * 3, following: username.length * 2 };
};