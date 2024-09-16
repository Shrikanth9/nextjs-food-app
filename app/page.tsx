import Link from "next/link";

export default function Home() {
  return (
     <main>
        <h1 style={{ textAlign: "center", color: "white"}}> Welcome to food app </h1>
        <p><Link href="/meals">Meals</Link></p>
        <p><Link href="/community">Community</Link></p>
        <p><Link href="/meals/share">Share</Link></p>
     </main>
  );
}
