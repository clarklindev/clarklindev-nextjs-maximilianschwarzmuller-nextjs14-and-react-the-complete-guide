This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Project setup

- `app-router-demo/`
- this project is the pages-router demo
- when running:

```cmd
pnpm create next-app@latest .

What is your project named? .
Would you like to use TypeScript? No
Would you like to use ESLint? Yes
Would you like to use Tailwind CSS? No
Would you like to use `src/` directory? No
Would you like to use App Router? (recommended) YES
Would you like to customize the default import alias (@/_)? No
What import alias would you like configured? @/_
```

- combined demo -> `app-router/app-router-demo/`
-

## mergin 01-getting-started

- this module introduces file based routing using app-router

### app-router

- routes happen inside `app/` folder
- use folders to create route segments
- route pages are named `pages.js`
- use `layout.js` for layouts

## 02-react-refresher

- only README.md for this module

## 03-nextjs-essentials

- use `<Image>` for optimized images

## 03-nextjs-essentials-1-app-router

- reserved filenames:

```
  page.js -> define page content
  layout.js -> wrap around pages
  not-found.js -> not-found fallback page
  error.js -> error fallback page
  loading.js -> Fallback page which is shown whilst sibling or nested pages (or layouts) are fetching data
  route.js -> Allows you to create an API route (i.e., a page which does NOT return JSX code but instead data, e.g., in the JSON format)
```

- introduction to `import Link from 'next/link';` Links
- dynmaic routes: `blog/[slug]/page.js`
- layout.js metadata:

```js
export const metadata = {
  title: "NextJS Course App",
  description: "Your first NextJS app!",
};
```

## 03-nextjs-essentials-2-foodies

- project -> `initdb.js` initializes a `meals.db` database in project root folder.
- NOTE: in initdb.js you are creating a db and populating it with dummyMeals.
- NOTE: each meal has an image, the path is relative to `public/` (but as if it were on root folder)
- to initialize: `pnpm run initdb` command (which is in package.json)
- `lib/meals.js` is the actual db interfacing file -> it uses fs (file system package) to createWriteStream
- creates an array bufferedImage using arrayBuffer(): `const bufferedImage = await meal.image.arrayBuffer();`
- use stream to write the file -> convert the arrayBuffer to regular Buffer
- add image property to meal

```js
const stream = fs.createWriteStream(`public/images/${fileName}`);
```

```js
//lib/meals.js
//..
export async function saveMeal(meal) {
  //create slug
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;

  //1.
  const stream = fs.createWriteStream(`public/images/${fileName}`);

  //2.
  const bufferedImage = await meal.image.arrayBuffer();

  //3.
  //use stream to write the file -> convert the arrayBuffer to regular Buffer
  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error("save failed");
    }
  });

  //4.
  meal.image = `/images/foodies/${fileName}`;

  //5.
  db.prepare(
    `
      INSERT INTO meals 
        (title, summary, instructions, creator, creator_email, image, slug)
      VALUES (
        @title,
        @summary,
        @instructions,
        @creator,
        @creator_email,
        @image,
        @slug
      )
    `
  ).run(meal);
}
```

- uses fs (file system) db stored locally
- `better-sqlite3` to write to sql database
- `import slugify from "slugify";` to create a slug from a string
- `import xss from "xss";` using xss to prevent xss attacks
- note when you are saving a meal -> `createWriteStream()` path includes `public` and the upload image should be stored in the same place as where dummy images are kept `public/images/foodies/${fileName}`
- after share submit, user is redirected (lib/action.js) `redirect("/foodies/meals");`
- note: the path has been adjusted to cater for this demo (combined modules)

## 03-nextjs-essentials-3-foodies-image-storage-using-aws-s3

- delete `/meals.db` to reset db
- `pnpm run initdb` to initialize db tables and dummy data
- NOTE: login to aws console -> project: `clarklindev-nextjs-react-the-complete-guide-03-3-foodies`
- NOTE: although the project can be run locally, the images are fetched from aws. so network connection is required
- uses aws to store images -> `lib/meals.js`
- NOTE: prefix for filename (image path eg. `image: "/images/foodies/tomato-salad.jpg"`) in `initdb.js` should match that of `lib/meals.js` where you set meal.image = `/images/foodies/${fileName}`;
- in lib/meals -> credentials is where the environment variables are used.

```js
const s3 = new S3({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
```

- so the db still uses sql to store data and paths but the physical image is stored in aws s3 bucket the path is what is stored in db.
- aws dependency `@aws-sdk/client-s3` -> `pnpm i @aws-sdk/client-s3`
- next.config.js includes settings for aws
- add environment variables in `.env.local` for aws access keys this will be used later.

```js
//next.config.js
/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "<url>.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
```

- lib/actions.js has `import { revalidatePath } from 'next/cache';` which is called `revalidatePath('/meals');` after saving data
- lib/meals.js has updated to support aws

```js
//lib/meals.js

import { S3 } from "@aws-sdk/client-s3";

const s3 = new S3({
  region: "ap-southeast-1",
});

//...

export async function saveMeal(meal) {
  //create slug
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;

  //local storage
  //storing the image on the local file system
  //1.
  // const stream = fs.createWriteStream(`public/images/${fileName}`);

  // 2.
  // const bufferedImage = await meal.image.arrayBuffer();

  // 3.
  // use stream to write the file -> convert the arrayBuffer to regular Buffer
  // stream.write(Buffer.from(bufferedImage), (error)=>{
  //   if(error){
  //     throw new Error('save failed');
  //   }
  // });

  //aws s3 cloud
  const bufferedImage = await meal.image.arrayBuffer();
  const folder = "images/foodies/";

  s3.putObject({
    Bucket: "clarklindev-nextjs-react-the-complete-guide-03-3-foodies",
    Key: folder + fileName,
    Body: Buffer.from(bufferedImage),
    ContentType: meal.image.type,
  });

  //4.
  meal.image = fileName;

  //5.
  db.prepare(
    `
      INSERT INTO meals 
        (title, summary, instructions, creator, creator_email, image, slug)
      VALUES (
        @title,
        @summary,
        @instructions,
        @creator,
        @creator_email,
        @image,
        @slug
      )
    `
  ).run(meal);
}
```

- `/components/meals/meal-item.js` image url path points to aws url
- `/app/foodies/meals/[slug]/page.js` image url path points to aws url

```js
//...

/* <Image src={image} alt={title} fill /> */

<Image
  src={`https://clarklindev-nextjs-react-the-complete-guide-03-3-foodies.s3.ap-southeast-1.amazonaws.com/${image}`}
  alt={title}
  fill
/>
```

### NOTE

- NOTE: in `lib/meals.js`
  - `const folder = "images/foodies/"`;
  - s3.putObject({Key: folder + fileName}) folder value does not prefix with `/` (this is for aws to create the file)

### NOTE

- NOTE: meal.image = `/images/foodies/${fileName}`; does have prefix with `/`

- this is used in `/components/meals/meal-item.js` and `/app/foodies/meals/[slug]/page.js` for `<Image>` url as it does not end with `/`

### NOTE

- `next.config.js` has commented out code for redirecting as you can use [`middleware.js`](#middleware-to-redirect) for redirecting

```js
/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "clarklindev-nextjs-react-the-complete-guide-03-3-foodies.s3.ap-southeast-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // async redirects() {
  //   return [
  //     // Basic redirect
  //     {
  //       source: "/",
  //       destination: "/foodies",
  //       permanent: false,
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
```

## 04-deep-dive-routing-and-rendering

- this module introduces group routes (sharing layout)
- you create folder with () syntax and it has layout which is shared by the pages within that group
- introduction to api: `app/api`

```js
export function GET(request) {
  console.log(request);
  return new Response("hello");
}
// export function POST(request){}
// export function PATCH(request){}
// export function PUT(request){}
// export function DELETE(request){}
```

- learn to use intercepting routes () with dots `.` inside the round brackets for each level up that it should go to intercept from.
- parallel routes with @ folder name syntax eg. folder `@archive` and `@latest` on same level

```js
export default function ArchiveLayout({ archive, latest }) {
  return (
    <div>
      <h1>News archive</h1>
      <section id="archive-filter">{archive}</section>
      <section id="archive-latest">{latest}</section>
    </div>
  );
}
```

### middleware to redirect

- the use of `middleware.js` to redirect incoming request
- `matcher` allows you to filter Middleware to run on specific paths.
- If request.url is https://example.com/foodies, then `new URL('/home', request.url)` would result in https://example.com/home

```js
//middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  // return NextResponse.redirect();
  return NextResponse.redirect(new URL("/foodies", request.url));
  return NextResponse.next(); //forwards incoming
}

export const config = {
  matcher: "/",
};
```

## 05-deep-dive-data-fetching

- continuation of `04-deep-dive-routing-and-rendering` but adjusted for data-fetching
- note: `backend/` folder initializes db table `\data.db` automatically on start only if it doesnt already exist
- BUT the express server part is not used. we use nextjs `lib/news-sql.js` to directly interact with db (note this is because we are hosting our database)
- AND there is no need to hit the nextjs `api/` to get to endpoint to get data because we can access db via server component directly in `lib/news-sql.js`

- `better-sqlite3` to interface with backend sql db
- `lib/news-sql.js` functions to manipulate db
- `lib/news.js` - dummy data functions

- note: with the like toggle-button, should look like below (pseudo code) and the state check for isLiked is moved from the `<form>` to the `<LikeButton isLiked={post.isLiked}/>` button

```css
.liked.like-button {
  /* styles for elements with both classA and classB */
}
```

```js
import styles from "./styles.module.css";

const MyComponent = () => {
  return (
    <div
      className={
        isLiked
          ? `${classes.liked} ${classes["like-button"]}`
          : `${classes["like-button"]}`
      }
    >
      {/* content */}
    </div>
  );
};
```

### NOTE:
- changed over to neon() databases - postgresql in the cloud
- create a `.env` file and use `.env.template` as guidance for the variables and content to put

