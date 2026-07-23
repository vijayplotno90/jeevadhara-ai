// Placeholder catalog for the pre-launch UI. Replace with real `products`
// table rows (db/schema.sql) once Cloud SQL is provisioned and farmers
// start listing. Written fresh for this build -- not sourced from any
// prior project's seed data.
//
// imageUrl: keyword-matched stock photography via LoremFlickr (CC-licensed
// Flickr photos, served by keyword). These are generic, freely-licensed
// images unrelated to any prior project's asset files -- not a copy of
// anything, just a stand-in until real farmer-uploaded photos (via the
// listing agent in app/farmer/list) replace them one listing at a time.

export type MockProduct = {
  id: string;
  name: string;
  category: "produce" | "livestock" | "honey" | "nursery" | "tools" | "vehicles";
  farmerName: string;
  village: string;
  price: number;
  unit: string;
  aiPriced: boolean; // true = price came from the price recommendation agent
  emoji: string;
  imageUrl: string;
};

export const MOCK_PRODUCTS: MockProduct[] = [
  { id: "p1", name: "Sona Masoori Rice", category: "produce", farmerName: "Rajesh Kumar", village: "Solipeta", price: 62, unit: "per kg", aiPriced: true, emoji: "🌾", imageUrl: "https://loremflickr.com/640/480/rice,paddy" },
  { id: "p2", name: "Organic Tomatoes", category: "produce", farmerName: "Lakshmi Devi", village: "Solipeta", price: 34, unit: "per kg", aiPriced: true, emoji: "🍅", imageUrl: "https://loremflickr.com/640/480/tomatoes" },
  { id: "p3", name: "Guntur Dry Red Chilli", category: "produce", farmerName: "Venkat Reddy", village: "Kushaiguda", price: 220, unit: "per kg", aiPriced: false, emoji: "🌶️", imageUrl: "https://loremflickr.com/640/480/redchilli" },
  { id: "p4", name: "Raw Turmeric", category: "produce", farmerName: "Anjali Rao", village: "Nalgonda", price: 48, unit: "per kg", aiPriced: true, emoji: "🫚", imageUrl: "https://loremflickr.com/640/480/turmeric" },
  { id: "p5", name: "Forest Wild Honey", category: "honey", farmerName: "Suresh Naidu", village: "Solipeta", price: 480, unit: "per 500g", aiPriced: true, emoji: "🍯", imageUrl: "https://loremflickr.com/640/480/honeycomb" },
  { id: "p6", name: "Country Eggs", category: "produce", farmerName: "Priya Sharma", village: "Kushaiguda", price: 9, unit: "per egg", aiPriced: false, emoji: "🥚", imageUrl: "https://loremflickr.com/640/480/farmeggs" },
  { id: "p7", name: "Nellore Sheep", category: "livestock", farmerName: "Ramesh Goud", village: "Solipeta", price: 8500, unit: "per head", aiPriced: false, emoji: "🐑", imageUrl: "https://loremflickr.com/640/480/sheep" },
  { id: "p8", name: "Mango Sapling (Banganapalli)", category: "nursery", farmerName: "Jeevadhara Nursery", village: "Solipeta", price: 180, unit: "per sapling", aiPriced: false, emoji: "🌱", imageUrl: "https://loremflickr.com/640/480/mangotree" },
  { id: "p9", name: "Power Tiller (Used, Good Condition)", category: "tools", farmerName: "Kishore Rao", village: "Nalgonda", price: 42000, unit: "flat", aiPriced: false, emoji: "🚜", imageUrl: "https://loremflickr.com/640/480/tractor" },
];

export const CATEGORIES: { value: MockProduct["category"] | "all"; label: string; emoji: string }[] = [
  { value: "all", label: "All", emoji: "🧺" },
  { value: "produce", label: "Fresh Produce", emoji: "🌾" },
  { value: "livestock", label: "Livestock", emoji: "🐄" },
  { value: "honey", label: "Honey", emoji: "🍯" },
  { value: "nursery", label: "Nursery", emoji: "🌱" },
  { value: "tools", label: "Tools", emoji: "🛠️" },
  { value: "vehicles", label: "Vehicles", emoji: "🚗" },
];
