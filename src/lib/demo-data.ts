// Fictional demo data. Nothing here is a real person or record.

export const church = {
  name: "Grace Community Church",
  short: "Grace",
}

export type Child = {
  id: string
  name: string
  age: number
  className: string
  allergies?: string
}

export type Household = {
  id: string
  name: string
  primary: string
  email: string
  phone: string
  members: number
  status: "Member" | "Visitor" | "Inactive"
  children: Child[]
  authorizedPickup: string[]
  givingYtd: number
  joined: string
}

export const households: Household[] = [
  {
    id: "h1",
    name: "Bekele",
    primary: "Selam Bekele",
    email: "selam.b@example.com",
    phone: "(214) 555-0142",
    members: 4,
    status: "Member",
    children: [
      { id: "c1", name: "Liya Bekele", age: 7, className: "Little Learners", allergies: "Peanuts" },
      { id: "c2", name: "Nati Bekele", age: 10, className: "Junior Readers" },
    ],
    authorizedPickup: ["Selam Bekele", "Dawit Bekele", "Hanna Tesfaye (aunt)"],
    givingYtd: 4820,
    joined: "2019",
  },
  {
    id: "h2",
    name: "Johnson",
    primary: "Marcus Johnson",
    email: "mjohnson@example.com",
    phone: "(972) 555-0187",
    members: 3,
    status: "Member",
    children: [{ id: "c3", name: "Ava Johnson", age: 5, className: "Little Learners", allergies: "Dairy" }],
    authorizedPickup: ["Marcus Johnson", "Tanya Johnson"],
    givingYtd: 3150,
    joined: "2021",
  },
  {
    id: "h3",
    name: "Alemu",
    primary: "Meron Alemu",
    email: "meron.alemu@example.com",
    phone: "(469) 555-0119",
    members: 5,
    status: "Member",
    children: [
      { id: "c4", name: "Yonas Alemu", age: 12, className: "Language & Culture" },
      { id: "c5", name: "Ruth Alemu", age: 8, className: "Junior Readers" },
      { id: "c6", name: "Abel Alemu", age: 6, className: "Little Learners" },
    ],
    authorizedPickup: ["Meron Alemu", "Tesfaye Alemu"],
    givingYtd: 6200,
    joined: "2016",
  },
  {
    id: "h4",
    name: "Garcia",
    primary: "Elena Garcia",
    email: "elena.garcia@example.com",
    phone: "(214) 555-0164",
    members: 2,
    status: "Visitor",
    children: [{ id: "c7", name: "Mateo Garcia", age: 9, className: "Junior Readers" }],
    authorizedPickup: ["Elena Garcia"],
    givingYtd: 120,
    joined: "2026",
  },
  {
    id: "h5",
    name: "Okafor",
    primary: "Chidi Okafor",
    email: "c.okafor@example.com",
    phone: "(817) 555-0133",
    members: 2,
    status: "Member",
    children: [],
    authorizedPickup: [],
    givingYtd: 2400,
    joined: "2022",
  },
  {
    id: "h6",
    name: "Haile",
    primary: "Bethlehem Haile",
    email: "beth.haile@example.com",
    phone: "(972) 555-0150",
    members: 1,
    status: "Inactive",
    children: [],
    authorizedPickup: [],
    givingYtd: 0,
    joined: "2018",
  },
]

export const funds = [
  { id: "general", name: "General Fund", raised: 48250, goal: 60000 },
  { id: "building", name: "Building Fund", raised: 21400, goal: 50000 },
  { id: "missions", name: "Missions", raised: 7850, goal: 10000 },
  { id: "youth", name: "Youth Ministry", raised: 3200, goal: 5000 },
]

export type Gift = {
  id: string
  donor: string
  fund: string
  amount: number
  date: string
  method: "Card" | "Bank" | "Cash"
  recurring: boolean
}

export const recentGifts: Gift[] = [
  { id: "g1", donor: "Meron Alemu", fund: "General Fund", amount: 250, date: "Oct 27", method: "Bank", recurring: true },
  { id: "g2", donor: "Marcus Johnson", fund: "Building Fund", amount: 500, date: "Oct 26", method: "Card", recurring: false },
  { id: "g3", donor: "Selam Bekele", fund: "General Fund", amount: 200, date: "Oct 26", method: "Bank", recurring: true },
  { id: "g4", donor: "Guest", fund: "Missions", amount: 40, date: "Oct 26", method: "Card", recurring: false },
  { id: "g5", donor: "Chidi Okafor", fund: "Youth Ministry", amount: 100, date: "Oct 25", method: "Card", recurring: false },
  { id: "g6", donor: "Elena Garcia", fund: "General Fund", amount: 60, date: "Oct 19", method: "Cash", recurring: false },
]

export const givingByMonth = [
  { month: "May", amount: 9800 },
  { month: "Jun", amount: 10400 },
  { month: "Jul", amount: 8900 },
  { month: "Aug", amount: 11200 },
  { month: "Sep", amount: 12100 },
  { month: "Oct", amount: 13650 },
]

export type ChurchEvent = {
  id: string
  title: string
  date: string
  time: string
  location: string
  price: number
  capacity: number
  registered: number
  waiver: boolean
  category: "Fundraiser" | "Fellowship" | "Youth"
  description: string
}

export const events: ChurchEvent[] = [
  {
    id: "e1",
    title: "Thanksgiving 5K Run & Walk",
    date: "Sat, Nov 21",
    time: "8:00 AM",
    location: "White Rock Lake",
    price: 35,
    capacity: 200,
    registered: 142,
    waiver: true,
    category: "Fundraiser",
    description: "Run or walk to support the Building Fund. T-shirt included with registration.",
  },
  {
    id: "e2",
    title: "Fall Family Picnic",
    date: "Sun, Nov 8",
    time: "1:00 PM",
    location: "Church grounds",
    price: 10,
    capacity: 150,
    registered: 96,
    waiver: false,
    category: "Fellowship",
    description: "Food, games and fellowship after service. Kids under 5 eat free.",
  },
  {
    id: "e3",
    title: "Youth Winter Retreat",
    date: "Dec 28 – 30",
    time: "Departs 9:00 AM",
    location: "Camp Lone Oak",
    price: 180,
    capacity: 40,
    registered: 37,
    waiver: true,
    category: "Youth",
    description: "Three days of worship, teaching and fun for grades 6–12. Parent consent required.",
  },
]

export const academyClasses = [
  { id: "a1", name: "Little Learners", ages: "4–7", teacher: "Mrs. Tigist", day: "Saturdays", enrolled: 18, capacity: 20 },
  { id: "a2", name: "Junior Readers", ages: "8–11", teacher: "Mr. Samuel", day: "Saturdays", enrolled: 22, capacity: 24 },
  { id: "a3", name: "Language & Culture", ages: "12–16", teacher: "Ms. Rahel", day: "Sundays", enrolled: 14, capacity: 20 },
]

export const academyTerm = {
  name: "Spring 2027",
  starts: "Jan 9, 2027",
  ends: "May 22, 2027",
  tuition: 300,
  siblingDiscount: 0.15,
  memberDiscount: 0.1,
}

export function formatCurrency(n: number) {
  const cents = !Number.isInteger(Math.round(n * 100) / 100)
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  })
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
}
