export interface Brand {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Experience {
  title: string;
  text: string;
  badge: string;
  link: string;
  linkLabel: string;
}

export interface Moment {
  title: string;
  text: string;
}

export interface HomePage {
  stats: Stat[];
  experiences: Experience[];
  moments: Moment[];
}

export interface MenuItem {
  name: string;
  description: string;
  price: string;
  portion: string;
  ingredients: string[];
  image: string;
}

export interface MenuCategory {
  name: string;
  description: string;
  items: MenuItem[];
}

export interface Zone {
  title: string;
  text: string;
  meta: string;
}

export interface Pairing {
  title: string;
  text: string;
}

export interface RestaurantPage {
  story: string;
  menuCategories: MenuCategory[];
  zones: Zone[];
  pairings: Pairing[];
}

export interface MenuHighlight {
  badge: string;
  title: string;
  text: string;
  price: string;
  portion: string;
  ingredients: string[];
  image: string;
}

export interface MenuNote {
  badge: string;
  title: string;
  text: string;
  points: string[];
}

export interface MenuPage {
  highlights: MenuHighlight[];
  notes: MenuNote[];
}

export interface EventFormat {
  title: string;
  text: string;
}

export interface EventSpace {
  title: string;
  capacity: string;
  description: string;
  features: string[];
}

export interface EventStep {
  title: string;
  text: string;
}

export interface EventPackage {
  title: string;
  price: string;
  text: string;
}

export interface EventsPage {
  formats: EventFormat[];
  spaces: EventSpace[];
  steps: EventStep[];
  packages: EventPackage[];
}

export interface Suite {
  name: string;
  price: string;
  size: string;
  guests: string;
  highlight: string;
  audiences: string[];
  description: string;
  features: string[];
}

export interface SuiteService {
  title: string;
  text: string;
}

export interface SuiteExperience {
  title: string;
  text: string;
}

export interface SuitesPage {
  suites: Suite[];
  services: SuiteService[];
  experiences: SuiteExperience[];
}

export interface SaunaRitual {
  title: string;
  duration: string;
  price: string;
  description: string;
  includes: string[];
}

export interface SaunaBenefit {
  title: string;
  text: string;
}

export interface SaunaPackage {
  title: string;
  text: string;
}

export interface SaunaPage {
  rituals: SaunaRitual[];
  benefits: SaunaBenefit[];
  packages: SaunaPackage[];
}

export interface HotelHighlight {
  badge: string;
  title: string;
  text: string;
}

export interface HotelDetail {
  title: string;
  value: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HotelPage {
  highlights: HotelHighlight[];
  details: HotelDetail[];
  faq: FaqItem[];
}

export interface ContactAdvantage {
  title: string;
  text: string;
}

export interface ContactHour {
  title: string;
  value: string;
}

export interface ContactPage {
  advantages: ContactAdvantage[];
  hours: ContactHour[];
  faq: FaqItem[];
}

export interface SiteContent {
  brand: Brand;
  home: HomePage;
  restaurant: RestaurantPage;
  menu: MenuPage;
  events: EventsPage;
  suites: SuitesPage;
  sauna: SaunaPage;
  hotel: HotelPage;
  contact: ContactPage;
}

export interface InquiryPayload {
  requestType: string;
  name: string;
  phone: string;
  email?: string;
  guests?: number;
  date?: string;
  space?: string;
  sourcePage?: string;
  message?: string;
}

export interface InquiryRecord {
  id: string;
  createdAt: string;
  requestType: string;
  name: string;
  phone: string;
  email: string;
  guests: number | null;
  date: string;
  space: string;
  sourcePage: string;
  message: string;
}

export interface ApiResponse<T> {
  ok: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}
