import Link from "next/link";

export default function Home() {

  return (
    <main>
      <ul>
        <li>
          <Link href="/foodies">
            3. nextjs essentials - practicing routing (foodies app with S3
            storage)
          </Link>
        </li>
        <li>
          <Link href="/news/home">
            4-5. deep dive - routing and rendering / data fetching
          </Link>
        </li>
        <li>
          <Link href="/posts">6. deep dive - mutating data</Link>
        </li>
        <li>
          <Link href="/caching">7. caching</Link>
        </li>
        <li>
          {`8. optimising nextjs app - "using 6. deep dive - mutating data"
          project files but with nextjs "Image" component and adding metadata to
          layout`}
        </li>
        <li>
          <Link href="/auth">9. user authentication</Link>
        </li>
      </ul>
    </main>
  );
}
