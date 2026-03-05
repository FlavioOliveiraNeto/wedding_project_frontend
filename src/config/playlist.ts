export interface Track {
  title: string
  artist: string
  src: string    
  cover?: string
}

export const playlist: Track[] = [
  {
    title: "Forever",
    artist: "Chris Brown",
    src: "https://www.scarybeatz.com/wp-content/uploads/2024/07/Chris_Brown_-_Forever_ScaryBeatz.com.mp3",
  },
  {
    title: "Mirrors",
    artist: "Justin Timberlake",
    src: "/music/mirrors.mp3",
  },
  {
    title: "Ceu e Fé",
    artist: "Exaltassamba",
    src: "/music/exalta.mp3",
  },
  {
    title: "Essência da paixão",
    artist: "Grupo Revelação",
    src: "/music/revela.mp3",
  },
  {
    title: "Fireproof",
    artist: "One Direction",
    src: "/music/one.mp3",
  },
  {
    title: "Accidentally In Love",
    artist: "Shrek",
    src: "/music/shrek.mp3",
  },
]
