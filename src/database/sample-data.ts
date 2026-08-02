import { BusinessStatus } from '../common/enums/business-status.enum';

/** A 7-element week (Monday..Sunday). `null` marks a closed day. */
type Span = readonly [string, string] | null;
type Week = Span[];

const W = (o: string, c: string, so: string, sc: string): Week => [
  [o, c],
  [o, c],
  [o, c],
  [o, c],
  [o, c],
  [so, sc],
  null,
];
const D = (o: string, c: string): Week => [
  [o, c],
  [o, c],
  [o, c],
  [o, c],
  [o, c],
  [o, c],
  [o, c],
];
const NONSTOP: Week = D('00:00', '23:59');

export interface SeedCategory {
  slug: string;
  name: string;
}

export const SEED_CATEGORIES: SeedCategory[] = [
  { slug: 'crame', name: 'Crame & Vinării' },
  { slug: 'restaurante', name: 'Restaurante' },
  { slug: 'cazare', name: 'Cazare & Pensiuni' },
  { slug: 'ateliere-auto', name: 'Ateliere Auto' },
  { slug: 'beauty', name: 'Beauty & Îngrijire' },
  { slug: 'cafenele', name: 'Cafenele' },
  { slug: 'artizanat', name: 'Artizanat & Meșteșuguri' },
  { slug: 'produse-locale', name: 'Produse Locale' },
  { slug: 'brutarii', name: 'Brutării & Cofetării' },
  { slug: 'farmacii', name: 'Farmacii' },
];

export interface SeedBusiness {
  slug: string;
  name: string;
  description: string;
  categorySlugs: string[];
  status: BusinessStatus;
  contactPhone: string;
  contactEmail: string;
  websiteURL?: string;
  socialLinks?: Record<string, string>;
  location: {
    address: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  hours: Week;
}

export const SEED_BUSINESSES: SeedBusiness[] = [
  {
    slug: 'crama-girboiu',
    name: 'Crama Gîrboiu',
    description:
      'Crama Gîrboiu îmbină tradiția viticolă vranceană cu tehnologia modernă. Oferim tururi ghidate ale beciului, degustări de autor și o selecție de vinuri albe și roșii premiate național.',
    categorySlugs: ['crame', 'produse-locale'],
    status: BusinessStatus.ACTIVE,
    contactPhone: '0237 255 010',
    contactEmail: 'contact@cramagirboiu.ro',
    websiteURL: 'https://www.cramagirboiu.ro',
    socialLinks: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
    },
    location: {
      address: 'Str. Principală 12, Tâmboiești',
      city: 'Tâmboiești',
      latitude: 45.6012,
      longitude: 27.0489,
    },
    hours: W('10:00', '18:00', '10:00', '16:00'),
  },
  {
    slug: 'beciul-domnesc-panciu',
    name: 'Beciul Domnesc Panciu',
    description:
      'Cu o istorie de peste un secol, Beciul Domnesc este renumit pentru spumantele produse prin metoda tradițională. Vizitatorii pot explora galeriile subterane și pot participa la degustări tematice.',
    categorySlugs: ['crame'],
    status: BusinessStatus.ACTIVE,
    contactPhone: '0237 275 100',
    contactEmail: 'vizite@beciuldomnesc.ro',
    websiteURL: 'https://www.beciuldomnesc.ro',
    socialLinks: { facebook: 'https://facebook.com' },
    location: {
      address: 'Str. Viilor 3, Panciu',
      city: 'Panciu',
      latitude: 45.9047,
      longitude: 27.0917,
    },
    hours: W('09:00', '17:00', '10:00', '15:00'),
  },
  {
    slug: 'vincon-vrancea',
    name: 'Vincon Vrancea',
    description:
      'Vincon Vrancea reunește sub același acoperiș sute de hectare de podgorie și un portofoliu impresionant de branduri consacrate. Magazinul de prezentare oferă întreaga gamă la prețuri de producător.',
    categorySlugs: ['crame', 'produse-locale'],
    status: BusinessStatus.ACTIVE,
    contactPhone: '0237 232 700',
    contactEmail: 'shop@vincon.ro',
    websiteURL: 'https://www.vincon.ro',
    socialLinks: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
    },
    location: {
      address: 'Str. Cuza Vodă 56, Focșani',
      city: 'Focșani',
      latitude: 45.7005,
      longitude: 27.1795,
    },
    hours: W('09:00', '18:00', '09:00', '14:00'),
  },
  {
    slug: 'casa-de-vinuri-cotesti',
    name: 'Casa de Vinuri Cotești',
    description:
      'O cramă boutique de familie, axată pe soiuri autohtone precum Fetească Neagră și Băbească. Producție limitată, îmbuteliere manuală și degustări intime pentru grupuri mici.',
    categorySlugs: ['crame'],
    status: BusinessStatus.PENDING,
    contactPhone: '0745 118 220',
    contactEmail: 'salut@vinuricotesti.ro',
    socialLinks: { instagram: 'https://instagram.com' },
    location: {
      address: 'DJ205 km 8, Cotești',
      city: 'Cotești',
      latitude: 45.5561,
      longitude: 27.1339,
    },
    hours: W('11:00', '18:00', '11:00', '17:00'),
  },
  {
    slug: 'restaurant-la-conac',
    name: 'Restaurant La Conac',
    description:
      'La Conac aducem preparate moldovenești gătite cu ingrediente locale de sezon, alături de o carte de vinuri exclusiv vrânceană. Terasă interioară și saloane pentru evenimente private.',
    categorySlugs: ['restaurante'],
    status: BusinessStatus.ACTIVE,
    contactPhone: '0237 610 455',
    contactEmail: 'rezervari@laconac.ro',
    websiteURL: 'https://www.laconac.ro',
    socialLinks: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
    },
    location: {
      address: 'Bd. Unirii 24, Focșani',
      city: 'Focșani',
      latitude: 45.6961,
      longitude: 27.1875,
    },
    hours: D('12:00', '23:00'),
  },
  {
    slug: 'pensiunea-zboina',
    name: 'Pensiunea & Restaurant Zboina',
    description:
      'Pensiunea Zboina oferă camere confortabile, aer curat de munte și o bucătărie bazată pe produse din gospodăria proprie. Punct de plecare ideal pentru drumeții în Tulnici și Lepșa.',
    categorySlugs: ['cazare', 'restaurante'],
    status: BusinessStatus.ACTIVE,
    contactPhone: '0740 552 118',
    contactEmail: 'contact@pensiuneazboina.ro',
    websiteURL: 'https://www.pensiuneazboina.ro',
    socialLinks: { facebook: 'https://facebook.com' },
    location: {
      address: 'Str. Principală 88, Tulnici',
      city: 'Tulnici',
      latitude: 45.8869,
      longitude: 26.6469,
    },
    hours: NONSTOP,
  },
  {
    slug: 'hotel-unirea-focsani',
    name: 'Hotel Unirea',
    description:
      'Situat în piața centrală, Hotel Unirea îmbină confortul modern cu o poziție ideală pentru afaceri și turism. Dispune de restaurant propriu, săli de conferință și parcare privată.',
    categorySlugs: ['cazare'],
    status: BusinessStatus.ACTIVE,
    contactPhone: '0237 615 000',
    contactEmail: 'receptie@hotelunirea.ro',
    websiteURL: 'https://www.hotelunirea.ro',
    socialLinks: { facebook: 'https://facebook.com' },
    location: {
      address: 'Piața Unirii 1, Focșani',
      city: 'Focșani',
      latitude: 45.6949,
      longitude: 27.1841,
    },
    hours: NONSTOP,
  },
  {
    slug: 'pensiunea-poiana-soveja',
    name: 'Pensiunea Poiana Soveja',
    description:
      'O pensiune de familie înconjurată de păduri de brad, cu bucătărie tradițională și activități în aer liber. Ideală pentru un weekend de relaxare departe de agitația orașului.',
    categorySlugs: ['cazare'],
    status: BusinessStatus.ACTIVE,
    contactPhone: '0744 210 909',
    contactEmail: 'rezervari@poianasoveja.ro',
    socialLinks: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
    },
    location: {
      address: 'Sat Dragosloveni, Soveja',
      city: 'Soveja',
      latitude: 46.0333,
      longitude: 26.6167,
    },
    hours: NONSTOP,
  },
  {
    slug: 'salon-elegance',
    name: 'Salon Élégance',
    description:
      'Salon Élégance oferă servicii complete de înfrumusețare într-un ambient elegant și relaxant: coafură, styling, manichiură-pedichiură și tratamente faciale cu produse profesionale.',
    categorySlugs: ['beauty'],
    status: BusinessStatus.ACTIVE,
    contactPhone: '0733 401 550',
    contactEmail: 'programari@salonelegance.ro',
    socialLinks: {
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
    },
    location: {
      address: 'Str. Republicii 18, Focșani',
      city: 'Focșani',
      latitude: 45.6987,
      longitude: 27.1901,
    },
    hours: W('09:00', '19:00', '09:00', '15:00'),
  },
  {
    slug: 'barber-the-gentleman',
    name: 'The Gentleman Barber Shop',
    description:
      'Tunsori clasice și moderne, bărbierit tradițional cu prosop cald și îngrijirea bărbii, într-o atmosferă relaxată, de tip old-school barbershop.',
    categorySlugs: ['beauty'],
    status: BusinessStatus.ACTIVE,
    contactPhone: '0728 990 112',
    contactEmail: 'salut@thegentleman.ro',
    socialLinks: { instagram: 'https://instagram.com' },
    location: {
      address: 'Str. Mare a Unirii 9, Focșani',
      city: 'Focșani',
      latitude: 45.6923,
      longitude: 27.183,
    },
    hours: [
      ['10:00', '20:00'],
      ['10:00', '20:00'],
      ['10:00', '20:00'],
      ['10:00', '20:00'],
      ['10:00', '20:00'],
      ['10:00', '18:00'],
      null,
    ],
  },
  {
    slug: 'auto-service-moldova',
    name: 'Auto Service Moldova',
    description:
      'Atelier auto autorizat cu personal experimentat, oferind reparații mecanice, electrice, diagnoză computerizată și stație ITP. Programări rapide și piese garantate.',
    categorySlugs: ['ateliere-auto'],
    status: BusinessStatus.ACTIVE,
    contactPhone: '0237 623 400',
    contactEmail: 'office@automoldova.ro',
    socialLinks: { facebook: 'https://facebook.com' },
    location: {
      address: 'Calea Moldovei 210, Focșani',
      city: 'Focșani',
      latitude: 45.7042,
      longitude: 27.175,
    },
    hours: W('08:00', '18:00', '08:00', '14:00'),
  },
  {
    slug: 'vulcanizare-adjud',
    name: 'Vulcanizare Non-Stop Adjud',
    description:
      'Servicii de vulcanizare non-stop, hotel de anvelope și asistență rutieră pe DN2/E85. Intervenții rapide pentru șoferii aflați în tranzit prin Adjud.',
    categorySlugs: ['ateliere-auto'],
    status: BusinessStatus.PENDING,
    contactPhone: '0751 330 077',
    contactEmail: 'contact@vulcanizareadjud.ro',
    location: {
      address: 'DN2 km 214, Adjud',
      city: 'Adjud',
      latitude: 46.1006,
      longitude: 27.1739,
    },
    hours: NONSTOP,
  },
  {
    slug: 'cafeneaua-centrala',
    name: 'Cafeneaua Centrală',
    description:
      'O cafenea de specialitate cu boabe prăjite local, limonade artizanale și deserturi făcute în casă. Spațiu prietenos pentru lucru, întâlniri sau o pauză de cafea bună.',
    categorySlugs: ['cafenele'],
    status: BusinessStatus.ACTIVE,
    contactPhone: '0729 145 300',
    contactEmail: 'salut@cafeneauacentrala.ro',
    socialLinks: {
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
    },
    location: {
      address: 'Str. Republicii 5, Focșani',
      city: 'Focșani',
      latitude: 45.6969,
      longitude: 27.1858,
    },
    hours: D('08:00', '22:00'),
  },
  {
    slug: 'atelier-ceramica-vrancea',
    name: 'Atelier Ceramică Vrancea',
    description:
      'Atelier de ceramică unde fiecare piesă este modelată și pictată manual, inspirată din motive tradiționale vrâncene. Organizăm ateliere de olărit pentru copii și adulți.',
    categorySlugs: ['artizanat', 'produse-locale'],
    status: BusinessStatus.ACTIVE,
    contactPhone: '0742 618 004',
    contactEmail: 'atelier@ceramicavrancea.ro',
    socialLinks: { instagram: 'https://instagram.com' },
    location: {
      address: 'Str. Meșterilor 4, Vidra',
      city: 'Vidra',
      latitude: 45.85,
      longitude: 26.9,
    },
    hours: [
      null,
      ['10:00', '18:00'],
      ['10:00', '18:00'],
      ['10:00', '18:00'],
      ['10:00', '18:00'],
      ['10:00', '16:00'],
      ['10:00', '16:00'],
    ],
  },
  {
    slug: 'pravalia-cu-bunatati',
    name: 'Prăvălia cu Bunătăți',
    description:
      'O prăvălie care adună la un loc cele mai bune produse ale gospodarilor vrânceni: miere de salcâm, dulcețuri, brânzeturi de munte, zacuscă și țuică de casă.',
    categorySlugs: ['produse-locale'],
    status: BusinessStatus.ACTIVE,
    contactPhone: '0748 300 210',
    contactEmail: 'comenzi@pravaliabunatati.ro',
    socialLinks: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
    },
    location: {
      address: 'Str. Podgoriei 22, Odobești',
      city: 'Odobești',
      latitude: 45.7614,
      longitude: 27.0653,
    },
    hours: W('08:00', '19:00', '08:00', '15:00'),
  },
  {
    slug: 'brutaria-painea-buna',
    name: 'Brutăria Pâinea Bună',
    description:
      'Brutărie artizanală cu pâine cu maia coaptă zilnic, cozonaci pufoși și produse de patiserie proaspete. Fără aditivi, doar ingrediente naturale și răbdare.',
    categorySlugs: ['brutarii'],
    status: BusinessStatus.ACTIVE,
    contactPhone: '0730 512 118',
    contactEmail: 'salut@paineabuna.ro',
    socialLinks: { instagram: 'https://instagram.com' },
    location: {
      address: 'Str. Bucegi 11, Focșani',
      city: 'Focșani',
      latitude: 45.6995,
      longitude: 27.182,
    },
    hours: D('06:30', '20:00'),
  },
  {
    slug: 'farmacia-sanziana',
    name: 'Farmacia Sânziana',
    description:
      'Farmacie de încredere, cu consiliere farmaceutică, rețete magistrale preparate în laborator propriu și un program prelungit pentru urgențe.',
    categorySlugs: ['farmacii'],
    status: BusinessStatus.PENDING,
    contactPhone: '0237 640 210',
    contactEmail: 'contact@farmaciasanziana.ro',
    location: {
      address: 'Str. Independenței 40, Focșani',
      city: 'Focșani',
      latitude: 45.694,
      longitude: 27.1889,
    },
    hours: W('08:00', '21:00', '09:00', '18:00'),
  },
];
