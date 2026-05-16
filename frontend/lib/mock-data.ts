import { Player, Tournament, Stats } from './types'

export const players: Player[] = [
  {
    id: '1',
    name: 'Martín González',
    elo: 2145,
    rank: 1,
    faculty: 'Ingeniería',
    wins: 45,
    losses: 8,
    draws: 12,
    trend: 'up',
    eloChange: 23
  },
  {
    id: '2',
    name: 'Lucía Fernández',
    elo: 2089,
    rank: 2,
    faculty: 'Ciencias Exactas',
    wins: 38,
    losses: 10,
    draws: 15,
    trend: 'up',
    eloChange: 15
  },
  {
    id: '3',
    name: 'Santiago Rodríguez',
    elo: 2034,
    rank: 3,
    faculty: 'Derecho',
    wins: 35,
    losses: 12,
    draws: 18,
    trend: 'stable',
    eloChange: 0
  },
  {
    id: '4',
    name: 'Valentina López',
    elo: 1987,
    rank: 4,
    faculty: 'Medicina',
    wins: 32,
    losses: 14,
    draws: 10,
    trend: 'down',
    eloChange: -8
  },
  {
    id: '5',
    name: 'Nicolás Martínez',
    elo: 1956,
    rank: 5,
    faculty: 'Economía',
    wins: 30,
    losses: 15,
    draws: 12,
    trend: 'up',
    eloChange: 12
  },
  {
    id: '6',
    name: 'Camila Sánchez',
    elo: 1923,
    rank: 6,
    faculty: 'Arquitectura',
    wins: 28,
    losses: 16,
    draws: 14,
    trend: 'up',
    eloChange: 18
  },
  {
    id: '7',
    name: 'Tomás Herrera',
    elo: 1898,
    rank: 7,
    faculty: 'Filosofía',
    wins: 26,
    losses: 18,
    draws: 11,
    trend: 'down',
    eloChange: -5
  },
  {
    id: '8',
    name: 'Isabella Moreno',
    elo: 1876,
    rank: 8,
    faculty: 'Ciencias Políticas',
    wins: 24,
    losses: 19,
    draws: 13,
    trend: 'stable',
    eloChange: 2
  },
  {
    id: '9',
    name: 'Mateo Díaz',
    elo: 1854,
    rank: 9,
    faculty: 'Ingeniería',
    wins: 23,
    losses: 20,
    draws: 10,
    trend: 'up',
    eloChange: 9
  },
  {
    id: '10',
    name: 'Sofía Castro',
    elo: 1832,
    rank: 10,
    faculty: 'Ciencias Exactas',
    wins: 21,
    losses: 21,
    draws: 15,
    trend: 'down',
    eloChange: -3
  },
  {
    id: '11',
    name: 'Joaquín Ruiz',
    elo: 1815,
    rank: 11,
    faculty: 'Medicina',
    wins: 20,
    losses: 22,
    draws: 12,
    trend: 'stable',
    eloChange: 1
  },
  {
    id: '12',
    name: 'Emma Vargas',
    elo: 1798,
    rank: 12,
    faculty: 'Economía',
    wins: 19,
    losses: 23,
    draws: 14,
    trend: 'up',
    eloChange: 7
  }
]

export const tournaments: Tournament[] = [
  {
    id: '1',
    name: 'Campeonato Apertura 2026',
    type: 'Swiss',
    date: '2026-06-15',
    rounds: 7,
    participants: 32,
    status: 'upcoming'
  },
  {
    id: '2',
    name: 'Torneo Blitz Primavera',
    type: 'Blitz',
    date: '2026-05-20',
    rounds: 9,
    participants: 24,
    status: 'ongoing'
  },
  {
    id: '3',
    name: 'Copa Interfacultades',
    type: 'Knockout',
    date: '2026-04-10',
    rounds: 5,
    participants: 16,
    status: 'completed',
    winner: 'Martín González'
  },
  {
    id: '4',
    name: 'Torneo Rapid de Invierno',
    type: 'Rapid',
    date: '2026-07-08',
    rounds: 6,
    participants: 20,
    status: 'upcoming'
  },
  {
    id: '5',
    name: 'Liga Round Robin Elite',
    type: 'Round Robin',
    date: '2026-03-01',
    rounds: 11,
    participants: 12,
    status: 'completed',
    winner: 'Lucía Fernández'
  }
]

export const stats: Stats = {
  totalPlayers: 156,
  activeTournaments: 3,
  matchesPlayed: 1247,
  highestElo: 2145
}

export const faculties = [
  'Ingeniería',
  'Ciencias Exactas',
  'Derecho',
  'Medicina',
  'Economía',
  'Arquitectura',
  'Filosofía',
  'Ciencias Políticas'
]
