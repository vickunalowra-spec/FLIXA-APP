
import { Movie, Schedule, Seat } from './types';

export const MOCK_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Amaran',
    description: 'The heroic true story of Major Mukund Varadarajan, an Indian Army officer who displayed extraordinary bravery during a counter-insurgency operation.',
    rating: 9.2,
    image: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcR_2TWA9WZYrHcmi1s0pEYdVUzlySSWDTE-fkS4O8OXuoC5pwkx",
    trailerUrl: 'https://www.youtube.com/embed/hS59T_BvM68',
    genre: ['Action', 'Biopic', 'War'],
    duration: '2h 45m',
    price: 450,
    parkingAvailable: true,
    parkingPrice: 0
  },
  {
    id: '2',
    title: 'Leo',
    description: 'A mild-mannered cafe owner becomes a local hero, but old secrets from a dark past return to haunt him in a violent clash.',
    rating: 8.5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbtgs7t10udqgnSNNwS78LglX0i_6GeH-oMB2LImCSReUe4c_t",
    trailerUrl: 'https://www.youtube.com/embed/Po3jG46ibSg',
    genre: ['Action', 'Crime', 'Thriller'],
    duration: '2h 44m',
    price: 400,
    parkingAvailable: true,
    parkingPrice: 50
  },
  {
    id: '3',
    title: 'Ponniyin Selvan: II',
    description: 'Arulmozhi Varman continues his journey to become Rajaraja I, the greatest ruler of the Chola empire amidst internal conspiracies.',
    rating: 8.4,
    image: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQOBrGunSPLlnt56AOwwklNjWBB8qS8Z1Vv_ReoWDJYhO8-wU0f",
    trailerUrl: 'https://www.youtube.com/embed/B93eA6z4_p0',
    genre: ['Historical', 'Drama', 'Action'],
    duration: '2h 44m',
    price: 350,
    parkingAvailable: true,
    parkingPrice: 0
  },
  {
    id: '4',
    title: 'Vikram',
    description: 'A special agent investigates a string of murders committed by a masked group of serial killers, leading to a massive drug cartel.',
    rating: 8.9,
    image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQePndb2bpcl_w5Gmz1o2HYpcpuAALl_jJ-XvYz-IvbdDUr5K1i",
    trailerUrl: 'https://www.youtube.com/embed/OKBMCL-umJI',
    genre: ['Action', 'Thriller'],
    duration: '2h 55m',
    price: 380,
    parkingAvailable: true,
    parkingPrice: 40
  },
  {
    id: '5',
    title: 'Jailer',
    description: 'A retired jailer goes on a manhunt to find his son’s killers, only to discover a vast underground network of idol smugglers.',
    rating: 8.2,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFEE4JfpYRGUJjdqrr_T4M1w6LrQJ_vWgI8amXlOcMfAdXj9MU",
    trailerUrl: 'https://www.youtube.com/embed/xenOE1T6TI0',
    genre: ['Action', 'Comedy', 'Drama'],
    duration: '2h 48m',
    price: 350,
    parkingAvailable: true,
    parkingPrice: 30
  },
  {
    id: '6',
    title: 'Jai Bhim',
    description: 'A brave lawyer fights for justice when a tribal man is falsely accused of theft and goes missing from police custody.',
    rating: 9.3,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMONpMdJ0vn3QmcF3Tzcw94YT2195wiL1sFy5GfP0ef-A-3TAP",
    trailerUrl: 'https://www.youtube.com/embed/nnXpbTFrqXA',
    genre: ['Legal', 'Drama'],
    duration: '2h 44m',
    price: 250,
    parkingAvailable: true,
    parkingPrice: 0
  },
  {
    id: '7',
    title: 'Viduthalai Part 1',
    description: 'A rookie police officer is torn between his duty and his conscience as his department hunts for a revolutionary leader.',
    rating: 8.6,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlqdg-38QtqEVptkcX0F4EfiinN3bJMjqkOleqM1_KjT3YfsCs",
    trailerUrl: 'https://www.youtube.com/embed/G0M08_SAn3c',
    genre: ['Crime', 'Drama'],
    duration: '2h 30m',
    price: 300,
    parkingAvailable: true,
    parkingPrice: 20
  },
  {
    id: '8',
    title: 'Maanadu',
    description: 'On the day of a public conference, a man and a police officer get stuck in a time loop that revolves around a political assassination.',
    rating: 8.3,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjdHOYg6ptjSiQpMGhPzuVoGuJ2h0G6761G5-2-aSPBU8wVJtr",
    trailerUrl: 'https://www.youtube.com/embed/t9H07ZAgisg',
    genre: ['Sci-Fi', 'Thriller'],
    duration: '2h 27m',
    price: 320,
    parkingAvailable: false,
    parkingPrice: 0
  },
  {
    id: '9',
    title: 'Sarpatta Parambarai',
    description: 'A young man in 1970s Madras finds himself caught in the middle of a rivalry between two boxing clans.',
    rating: 8.7,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgp6ch_2ZHEVC7XqoRullLmsagqu4A1TIuW-0WOFnHIQFfEkhnJNgtgwk8bRPBrGXAhmIQ&s=10",
    trailerUrl: 'https://www.youtube.com/embed/36m7E_M9rsc',
    genre: ['Sports', 'Drama'],
    duration: '2h 53m',
    price: 280,
    parkingAvailable: true,
    parkingPrice: 0
  },
  {
    id: '10',
    title: 'Doctor',
    description: 'A stoic military doctor takes matters into his own hands when a young girl from his fiancee\'s family is kidnapped.',
    rating: 8.1,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt0frOrnLgcANTtvmCGgZ9-hRqNu0JO-7q9-SPgpYjhPWwQu_I0PwVWThhF4G_El-bdxJw&s=10",
    trailerUrl: 'https://www.youtube.com/embed/oQiH_Iw0kDs',
    genre: ['Action', 'Comedy'],
    duration: '2h 28m',
    price: 300,
    parkingAvailable: true,
    parkingPrice: 20
  },
  {
    id: '11',
    title: 'Kaithi',
    description: 'A recently released prisoner on his way to see his daughter must help a group of poisoned police officers survive the night.',
    rating: 8.5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREJKIgZg5fDrV-o-okfgeXBFlTd4jwq1EPV-3LA_z9aH5ZsM_5p9RH0dY6pNNVgeL8Y9gQEQ&s=10",
    trailerUrl: 'https://www.youtube.com/embed/g6Hre0at-6M',
    genre: ['Action', 'Thriller'],
    duration: '2h 25m',
    price: 320,
    parkingAvailable: true,
    parkingPrice: 30
  },
  {
    id: '12',
    title: 'Karnan',
    description: 'A small village youth fights for the rights and dignity of his people against an oppressive system and a brutal police officer.',
    rating: 8.2,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzeQcNash-eRaAjgOYPkVtjgct8gXx4B1D_5-Mf6iFwHRpD3kF52rxebetC8cNHTqv8Xm1&s=10",
    trailerUrl: 'https://www.youtube.com/embed/I06N_7B_qpw',
    genre: ['Action', 'Drama'],
    duration: '2h 38m',
    price: 280,
    parkingAvailable: true,
    parkingPrice: 0
  },
  {
    id: '13',
    title: 'Soorarai Pottru',
    description: 'The story of Nedumaaran Rajangam, a man who dreams of making flying affordable for the common man.',
    rating: 9.1,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOENEB5LVS5n_KsAkQ9tOnnhaCKJugfFWjJmBDHaSJNOyAgyikE1hcb_kkXs4k7zq_q7_f&s=10",
    trailerUrl: 'https://www.youtube.com/embed/fa_DIwRsa9o',
    genre: ['Drama', 'Biopic'],
    duration: '2h 33m',
    price: 350,
    parkingAvailable: true,
    parkingPrice: 0
  },
  {
    id: '14',
    title: 'Vada Chennai',
    description: 'A young carrom player from North Chennai is sucked into a world of local politics and gang wars.',
    rating: 8.6,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOTyTjmSg3RwcwfpYkyANJ4K4Ca3ViHffKDPk-fUzyv0X9ZkbPyncMfux_eP2IxlZRzXKmEA&s=10",
    trailerUrl: 'https://www.youtube.com/embed/I_vN_t9GqH8',
    genre: ['Crime', 'Action'],
    duration: '2h 46m',
    price: 330,
    parkingAvailable: true,
    parkingPrice: 20
  },
  {
    id: '15',
    title: 'Asuran',
    description: 'A father tries to protect his family after his son kills an upper-caste landlord in a fit of rage over land disputes.',
    rating: 8.5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTYMuo3sNkiHRedVvnvD9_3ZSf9pYj_KMC4fmvLHMMFHwDkbT-1C3etZ5NYz3--1oYxxDgaA&s=10",
    trailerUrl: 'https://www.youtube.com/embed/7S8V-S_C7mU',
    genre: ['Action', 'Drama'],
    duration: '2h 21m',
    price: 300,
    parkingAvailable: true,
    parkingPrice: 0
  },
  {
    id: '16',
    title: 'Kanguva',
    description: 'A journey through two timelines where a warrior from the past and a man from the present are connected by a destiny.',
    rating: 7.8,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF0HHYlQNxDdKXSCTVDe8VWkvisAD_6efEH7cPWMcTo-V_VSxT9jYipyPtTeI686mUINc5-w&s=10",
    trailerUrl: 'https://www.youtube.com/embed/6_57vWAnFCo',
    genre: ['Fantasy', 'Action'],
    duration: '2h 34m',
    price: 450,
    parkingAvailable: true,
    parkingPrice: 50
  },
  {
    id: '17',
    title: '96',
    description: 'Two high school sweethearts meet again after 22 years at a school reunion and reminisce about their past.',
    rating: 8.6,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5Q62cqxekAvztiYKRbRJRdRI94lpndixOnR_lzjUjkXtm9EcdMI0k5dhxkm0Xp3by1IKG-Q&s=10",
    trailerUrl: 'https://www.youtube.com/embed/r0synl-lqGA',
    genre: ['Romance', 'Drama'],
    duration: '2h 38m',
    price: 250,
    parkingAvailable: true,
    parkingPrice: 0
  },
  {
    id: '18',
    title: 'Master',
    description: 'An alcoholic professor is sent to a juvenile school, where he clashes with a gangster who uses the children for his criminal activities.',
    rating: 7.9,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRswG6NZHowsW-JNXViNEDWtLlhbU2hezeURZYUP-h_Azckt1z5pLLBcua_SPRUXLCzuDs6Yw&s=10",
    trailerUrl: 'https://www.youtube.com/embed/UTiXQcrLlv4',
    genre: ['Action', 'Thriller'],
    duration: '2h 59m',
    price: 380,
    parkingAvailable: true,
    parkingPrice: 40
  },
  {
    id: '19',
    title: 'Super Deluxe',
    description: 'Four stories intertwine in Chennai involving a transgender woman, a group of teens, a priest, and a couple in trouble.',
    rating: 8.3,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVKUZG3wGdEH8HOWvizhT0lulKxsyTeJi1KMhpnt1fazxJI0A4_04VCMj1P1oSIUn9QwFx&s=10",
    trailerUrl: 'https://www.youtube.com/embed/3-Xq_Zz3nPA',
    genre: ['Drama', 'Thriller'],
    duration: '2h 56m',
    price: 300,
    parkingAvailable: false,
    parkingPrice: 0
  },
  {
    id: '20',
    title: 'Baahubali: The Conclusion',
    description: 'Shiva, the son of Bahubali, learns about his heritage and begins to look for answers in the kingdom of Mahishmati.',
    rating: 8.2,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwAZddfdsmgj84MRQyRDfNxl-swkZRxt2IQX3gnLkzHl3EEzyD3dduWibKdNCCqOTyaL3WIw&s=10",
    trailerUrl: 'https://www.youtube.com/embed/G62HrubdD6o',
    genre: ['Action', 'Fantasy'],
    duration: '2h 47m',
    price: 400,
    parkingAvailable: true,
    parkingPrice: 50
  }
];

export const MOVIE_SCHEDULES: Schedule = {
  morning: ['09:30 AM', '10:45 AM', '11:15 AM'],
  afternoon: ['01:00 PM', '02:30 PM', '03:45 PM'],
  evening: ['05:00 PM', '06:30 PM', '07:45 PM'],
  night: ['09:00 PM', '10:15 PM', '11:30 PM']
};

export const generateSeats = (): Seat[] => {
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const seats: Seat[] = [];
  rows.forEach(row => {
    for (let i = 1; i <= 8; i++) {
      seats.push({
        id: `${row}${i}`,
        row,
        num: i,
        status: Math.random() > 0.8 ? 'booked' : 'available'
      });
    }
  });
  return seats;
};
