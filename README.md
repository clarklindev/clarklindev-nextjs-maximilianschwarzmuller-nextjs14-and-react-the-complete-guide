- course: nextjs-maximilianschwarzmuller-nextjs14-and-react-the-complete-guide
  https://www.udemy.com/course/nextjs-react-the-complete-guide/

- NOTE: this is the 2024 next14 update

# Section 01 - getting started (22min)

## 02 What is nextjs?

- framework ontop of reactjs
- FEATURE: nextjs has route setup and handling
- FEATURE: nextjs has form handling
- FEATURE: nextjs has data fetching
- FEATURE: nextjs has authentication

## 03 Key features

- allows fullstack (front + backend)
- file based routing
- server side rendering (nextjs pre-renders on server)

## 04 creating a first nextjs app

- download src: https://github.com/mschwarzmueller/nextjs-complete-guide-course-resources/blob/main/attachments/01-getting-started/starting-project.zip
- install with pnpm (same as npm but shares node package libraries globally for all codebases)

```powershell
//install pnpm on windows -> powershell (admin)
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

or create a new project

- asks questions from cli:

1. typescript? no (course)
2. eslint? yes
3. tailwindcss? no
4. src/ directory? no (course)
5. app router? yes (course)
6. import alias? no (course)

```cmd
npx create-next-app@latest
```

### run project

- see package.json commands

```
pnpm run dev
```

## 05 nextjs vs just react - analyzing the nextjs project

- nextjs -> html page content is rendered on server and sent from server to client
- vanilla react -> single html file with client side js code -> generated and rendered client side

## 06 routing -> editing the starting-project

- nextjs uses the "app" folder for routing

### creating a route

- APP Router -> nextjs uses app/ folder
- CONVENTION: routing is done by creating folders inside app/ AND "page.js"
- inside app/ add a new folder "awesome" (this will be the route) AND new pages are created by naming them "page.js"
- the above can be accessed

```
http://localhost:3000/awesome
```

- page should return jsx of what to render
- need default exports
- When you use export default, it allows Next.js to import the component without specifying the exact name of the import. default exports make it easier for Next.js to work with file-based routing and generate routes automatically.

## 07 page router vs app router (one framework, two approaches)

- page router (older)
- app router (course) -> introduced nextjs 13 -> supports react server components and server actions

---

# Section 02 - OPTIONAL - React refresher (7hrs 41min - lesson 10-89 (lesson 47+ is legacy lessons))

- NOTE TO SELF: DO NOT REDO THESE LESSONS AGAIN -> YOU KNOW IT!!

- source code snapshot -> https://github.com/academind/react-complete-guide-course-resources/tree/main/code/30%20React%20Summary
- for convenience section files: 02-react-refresher/

- react refresher -> going over the basics
- imperative approach -> manipulating dom (step by step)
- declarative approach -> write ui code and blend with js, event listeners, state, and dynamic values
- vite install (install in current folder vite react template):

```cmd
pnpm create vite . --template react
```

## 21. CSS Modules

```css
/* Post.module.css */
.post {
  font-size: 1.5rem;
}
```

- css modules -> filename Post.module.css / import classes from "./Post.module.css"
- access the css: classes used in css can be accessed as properties of imported object ("classes")
  `<div className={classes.post}></div>`

## 25. state

- react components only refresh/reload with state updates eg. const [state, update state function] = useState() hooks
- react components DO NOT UPDATE without state updates
- OPTIMIZATION: when working with state and it depends on previous state, pass to the useState() set function a function that receives previous state (you can name this anything)

```js
function PostList() {
  const [posts, setPosts] = useState([]);

  function addPostHandler(postData) {
    setPosts((existingPosts) => [postData, ...existingPosts]); //optimized way by passing function that receives prev state
  }

  return <>//...</>;
}
```

## 30. react form buttons / 31. handling submit

- by default clicking button submits form
- give button type=""button" so it doesnt trigger form submit or give type="submit" to submit (optional as it will by default submit)
- form should have onSubmit handler that passes event and calls event.preventDefault();

```js
function NewPost({onAddPost, onCancel}){

  const [enteredBody, setEnteredBody] = useState();

  function submitHandler(event){
    event.preventDefault();

    const postData = {
      body: enteredBody
    }
    onAddPost(postData);

    //close modal
    onCancel()
  }

  function bodyChangeHandler(e){
    setEnteredBody(e.target.value);
  }

  return {
    <form onSubmit={submitHandler}>
      <p>
        <label htmlFor="bodyText">Text</label>
        <textarea onChange={bodyChangeHandler}/>
      </p>

      <button type="button">cancel</button>
      <button>submit</button>
    </form>
  }
}
```

## 35. sending a POST HTTP Request

- frontend to backend communication
- use fetch(url, {}) to send and get data
- fetch is not react only feature, it is in all browsers
- second param is a config object.. the body attribute is js that needs to be converted -> JSON.stringify()
- fetch awaits response

```js
function addPostHandler(postData) {
  //submit form
  fetch("http://localhost:8080/posts", {
    method: "POST",
    body: JSON.stringify(postData), //convert to json
    headers: {
      "Content-Type": "application/json",
    },
  });

  setPosts((existingPosts) => [postData, ...existingPosts]); //optimized way by passing function that receives prev state
}
```

## 36. Handling Side effects with useEffect()

- frontend sends a fetch request to /posts on backend which when done returns "posts"

### backend

```js
app.get("/posts", async (req, res) => {
  const storedPosts = await getStoredPosts();
  res.json({ posts: storedPosts });
});
```

- handle feedback from fetch

### frontend ANTIPATTERN... DO NOT DO THIS ON FRONTEND

- ANTIPATTERN -> .then() handling causes infinite loop because updating the state eg. calling setPosts() in the then() causes component to re-render -> which causes fetch to be called again

### UseEffect() -> frontend FIX for handling fetch() request

- FIX: handling should be done with useEffect() as it prevents infinite loop
- when is useEffect() called depends on the array (second prop)
  - always called -> no second prop
  - called at start -> empty array
  - called when dependency changes -> put dependencies in the array...when anything inside array changes, the useEffect is called.
- to call an async function inside the useEffect, define a nested inner async function
- useEffect() should not be async

```js
function PostList() {
  // fetch().then(response=> response.json()).then(data=> {setPosts(data.posts)});
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const response = await fetch("");
      const resData = await response.json();
      setPosts(resData.posts);
    }
    fetchPosts();
  }, [posts]);
}
```

## 38. routing

- react allows you to use your own routing.
- have a look at https://github.com/clarklindev/react-router-6 the code is self explanatory
- react router 6
- routing happens on client side

## 40. layout routes and outlet

- you can make layout routes by adding `<Route>` children to a `<Route>`
- organize routing into its own folder
- you tell react where to render the content of the route in the layout via the `<Outlet/>` from react-router-dom
- Outlet jsx element is a placeholder for where nested route can render their content in the RootLayout

### install latest react router

```cmd
pnpm i react-router-dom
```

```js
//routes/RootLayout.jsx
import {Outlet} from 'react-router-dom';
import MainHeader from '../components/MainHeader';

function RootLayout(){
  return (<>
    <MainHeader/>
    <Outlet/>
  <>);
}

export default RootLayout;

```

- import {RouterProvider, createBrowserRouter, createRoutesFromElements, Route} from 'react-router-dom';
- RouterProvider takes a "router" prop which you provide an route configuration object
- use createBrowserRouter to create a route config object
- then pass it as a value to RouterProvider's router prop

### METHOD A (array) -> createBrowserRouter([]) array method

- createBrowserRouter() takes an array as an value (a list of route definitions)
- a route definition is an object with a path and element that should be rendered when route is active `{path:"/", element:<App/> }`
- can add more routes to array and use layout route with children prop (array)

```js
import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import Posts from './Posts';
import RootLayout from './routes/RootLayout';

//METHOD 1 - normal withoutlayout
const route = createBrowserRouter([
  {path:"/", element:<Posts/> }
]);

//METHOD 2 - can add more routes to array and use layout route
const route = createBrowserRouter([
  {path:"/", element:<RootLayout/>},
  children:[ {path:"/", element:<Posts/>}, {path:"/create-post", element:<NewPost/>} ],
]);

//...
ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={route}/>
)
```

### METHOD B (JSX) -> createBrowserRouter(createRoutesFromElements()) method

- OR you can pass to createBrowserRouter createRoutesFromElements(): `createBrowserRouter(createRoutesFromElements(<Route path='about' element={<About />} />))` and nest jsx of Route elements

```js
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Posts from "./Posts";

const route = createBrowserRouter(
  createRoutesFromElements(<Route path="/" element={<Posts />} />)
); //can add more <Route> components as children of <Route></Route>

//...
ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={route} />
);
```

## 42 linking and navigation

### Link element

- in react, use Link component: `import {Link} from 'react-router-dom';`
- the right element for creating a link: `<a/>` that navigates a url BUT it creates a new request
- Link renders an `<a/>` element but it prevents the browser default of sending a request
- Link has "to" prop instead of "href"
- whereas `<button>` is more for when action occurs within page

```js
//causes new request to be sent to server
<a href="/create-post">new post</a>;

//does not send new request to server
import { Link } from "react-router-dom";
<Link to="/create-post">new post</Link>;
```

### navigation with code (navigate programatically)

- navigating using code
- useNavigate hook: import {useNavigate} from 'react-router-dom';
- can use .. to navigate to parent route

```js
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

function closeHandler() {
  navigate("/");
  navigate(".."); //navigate up one level
}
```

## react-router 6.4: to handle data-fetching and submitting form data

## 43. loader

- instead of using useEffect(), go to route definition... to the route that needs loader for data...
- add loader property, value is a function that will execute whenever the route gets activated (ie. when its about to render the route element)
- convention is to go to the route's component file and add export an extra function: loader
- and instead of putting code in route definition (just import and call it)
- loader() executes client side
- it can/or not return a promise, it will await for data to load first before rendering the route component
- loader should return data that is needed for active route
- then in main route definition file, import the loader: import Posts, {loader} from './Posts';
- give loader an alias if there is more loaders from different routes: postsLoader

### consuming loader() data with useLoaderData hook

- import {useLoaderData} from 'react-router-dom'
- to consume the loader() data for the route component (or any nested component), use the useLoaderData hook
- here PostsList is nested in Posts but we will consume the loader data there...

```js
// Posts.jsx
function Posts() {
  return (
    <>
      <Outlet />
      <main>
        <PostsList />
      </main>
    </>
  );
}
export default Posts;

export async function loader() {
  const response = await fetch("");
  const resData = await response.json();
  return resData;
}
```

- PostsList gets access to loader() data via useLoaderData hook
- removes the need for useEffect inside PostsList

```js
//PostsList.jsx
import { useLoaderData } from "react-router-dom";
function PostsList() {
  //BELOW COMMENTED OUT -> DEPRECATED for useLoaderData()
  // const [posts, setPosts] = useState([]);

  // useEffect(()=>{
  //   async function fetchPosts(){
  //     const response = await fetch('');
  //     const resData = await response.json();
  //     setPosts(resData.posts);
  //   }
  //   fetchPosts();

  // }, [posts]);

  const posts = useLoaderData();
}
```

```js
//main.jsx
import Posts, {loader as postsLoader} from './Posts';

const route = createBrowserRouter([
  {path:"/", element:<RootLayout/>},
  children:[
    {
      path:"/",
      element:<Posts/>,
      // loader: ()=>{},
      loader: postsLoader,
      children:[
        {
          path:"/create-post",
          element:<NewPost/>,
          // action:()=>{}
        }
      ]
    },
  ],
]);
```

## 44. action() functions for handling form submits

- when you have a form on a page, you can handle the submits with action() handlers, you also put the function close into the route component code
- it is triggered when form is submitted
- move the submit request code from submitHandler() to action() handler
- to handle forms with react-router, add "name" attribute to form elements
- by default `<form>` will try submit form data to server BUT...
- to use React router to handle form, use `<Form method="post">` (note Form with capital F) component: import {Form} from 'react-router-dom';
- `<Form method="post">` component will cause react router to call the action() assigned to the route component containing the form
- action(data) receives data argument which can be destructed, data is just a object..has eg. request property containing the "request" object generated by react-router
- the request object has a formData() method which gives access to the data encoded in the form
- formData() yields a promise, so change to use async/await
- to get data from formData -> const postData = Object.fromEntries(formData); //{body:'...', author:'...'}

```js
export async function action({ request }) {
  const formData = await request.formData();
  // formData.get('body') get form data
  const postData = Object.fromEntries(formData); //{body:'...', author:'...'}
  //...
}
```

- react router dom provides redirect() for what happens after form is sent
- redirect() generates a response object, which is then returned by action() function and react-router will check if its a redirect, and if it is, it will go to that route

```js
//NewPost.jsx
import { Form, redirect } from "react-router-dom";

function NewPost() {
  return (
    <>
      <Form method="post">
        <p>
          <label htmlFor="body">Text</label>
          <textarea id="body" name="body" />
        </p>
      </Form>
    </>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  // formData.get('body') get form data
  const postData = Object.fromEntries(formData); //{body:'...', author:'...'}

  //request object
  const response = fetch("http://localhost:8080/posts", {
    method: "POST",
    body: JSON.stringify(postData), //convert to json
    headers: {
      "Content-Type": "application/json",
    },
  });

  return redirect("/"); //return a response object from action
}
```

```js
//main.jsx
import NewPost, {action as newPostAction} from './routes/NewPost';

const route = createBrowserRouter([
  {path:"/", element:<RootLayout/>},
  children:[
    {
      path:"/",
      element:<Posts/>,
      // loader: ()=>{},
      loader: postsLoader,
      children:[
        {
          path:"/create-post",
          element:<NewPost/>,
          // action:()=>{}
          action: newPostAction
        }
      ]
    },
  ],
]);
```

## 45. Dynamic Routes with react-router

- use syntax: `{path:':id'}` in the router config
- note: absolute path has '/' eg. `{path:'/:id'}`
- note: relative path is eg. `{path:':id'}`
- to get the dynamic route id from the router config object, loader() function also receives an object with 'params' attribute which you can destruct to access the dynamic id
- the attribute name is the same as what is defined in the router config object eg. if route object is {path:':id'} then you access params.id

```js
export async function loader({ params }) {
  const response = await fetch("http://localhost:8080/posts/" + params.id);
  const resData = await response.json();
  return resData.posts;
}
```

---

# Section 03 - NextJS essentials - App Router

- lessons 85 -> 133
- 49 lessons
- 4hrs 1min

## NEXT.JS CORE ESSENTIALS

- routing, pages, components
- fetching and sending data
- styling, images, metadata

## 86. starting setup

- project folder-> 03-nextjs-essentials-app-router/

## 87. file based routing + react server components

- app/ folder where you setup pages of website
- page.js reserved filename -> Nextjs ensures its rendered on server (server component)

## 88. Adding another route via the file system

- Important: These filenames are only reserved when creating them inside of the app/

- reserved filenames (1min42sec)

  - page.js -> define page content
  - layout.js -> wrap around pages
  - not-found.js -> not-found fallback page
  - error.js -> error fallback page
  - loading.js -> Fallback page which is shown whilst sibling or nested pages (or layouts) are fetching data
  - route.js -> Allows you to create an API route (i.e., a page which does NOT return JSX code but instead data, e.g., in the JSON format)

- routes are created by adding folders to app/ (with name as anything you want for the route) AND ALSO NEED a page.js
- eg. app/about/page.js
- page.js is just a default exported function
- then you can access the url via http://localhost:3000/about

```js
//AboutPage.jsx
export default function AboutPage() {
  return (
    <main>
      <h1>about us</h1>
    </main>
  );
}
```

## 89. Navigating between pages

### WRONG WAY

- using `<a>` elements causes page reload instead of single page app (SPA) environment where click just updates page with client javascript.

```js
<a></a>
```

### CORRECT WAY

- use `<Link>`
- NOTE: import Link from 'next/link';
- NOTE: NOT import {Link} from 'next/link';
- import Link from 'next/link';
- difference between react-router which uses "to" -> nextjs Link still uses "href" prop

## 90. working with pages and layouts

- a layout defines the "shell" around one or more pages
- its the layout of how the page should be rendered
- every project needs atleast one root layout: app/layout.js
- you can have other layouts inside app/route folders
- layout includes `<html>` and `<body>`
- layout DOES NOT have a `<head>` `but includes and an exported metadata object which includes all content that goes into head.
- children is the content of the page

```js
//app/layout.js
import "./globals.css";

export const metadata = {
  title: "NextJS Course App",
  description: "Your first NextJS app!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

## 91. reserved file names, custom components, & how to organize a nextjs project

- Important: These filenames are only reserved when creating them inside of the app/
- https://nextjs.org/docs/app/api-reference/file-conventions

### import css

```js
import "./global.css";
```

### Favicon

- if you add an image called "icon" to app/ it will use it as an favicon

### components

- convention is to create a components/ folder parrallel to app/
- https://nextjs.org/docs/app/building-your-application/routing/colocation

### import alias

- in nextjs you can target root in your imports to make absolute path
- eg. import @/components/header
- this is configured in jsconfig.json

```js
//jsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## 93. Dynamic Routes -> configuring dynamic routes, using route parameters

- test links: http://localhost:3000/blog and http://localhost:3000/blog/post-1
- nextjs uses square brackets to denote something is dynamic: `[name]` where name is any placeholder
- so it will look like `app/blog/page.js` and `app/blog/[slug]/page.js`
- Nextjs passes a props to page components, and you can destruct this prop to retrieve "params".
- params is an object where every placeholder in a dynamic route ([slug]) will be a key, and the value stored is the actual URL value.
- eg.
  - if dir structure is `app/blog/[slug]/page.js`
  - url to access the page is: `localhost:3000/blog/page-1`
  - params.slug value is "page-1"

### Potential Blockers

- NOTE CORRECT: `import Link from 'next/link';` //no curly braces {} around Link
- NOTE INCORRECT: `import {Link} from 'next/link'`;
- not in correct folder

```js
//app/blog/page.js
import { Link } from "next/link";

export default function BlogPage() {
  return (
    <main>
      <Link href="/blog/post-1">post1</Link>
      <Link href="/blog/post-2">post2</Link>
    </main>
  );
}
```

```js
//app/blog/[slug]/page.js
export default function BlogPostPage({ params }) {
  return (
    <main>
      <h1>blog post</h1>
    </main>
  );
}
```

## 94. Onwards to the Main Project: The Foodies App

- exercise source: [github](https://github.com/mschwarzmueller/nextjs-complete-guide-course-resources/blob/main/attachments/02-nextjs-essentials/foodies-starting-project.zip)
- /03-2-foodies
- note: `meals/share` route has precedence over the dynamic route `/meals/[slug]` even though they both have /meals parent folder

## 95. EXERCISE / 96. EXERCISE SOLUTION

- practice creating of routes / dynamic routes
- run node project at: /03-2-foodies
- exercise todo:

1. create /meals route

- http://localhost:3000/meals

2. create /meals/share route

- http://localhost:3000/meals/share

3. create /community route

- http://localhost:3000/community

4. create a dynamic route

- /meals/[slug]
- dynamic url eg. http://localhost:3000/meals/pasta

## 97. layouts

- layouts wrap other pages
- access the wrapped content via props' children attribute

```js
export default function ExampleLayout({children}){
  return <>
    {children}
  <>
}

```

## 98. adding a custom component

- here we create our own header component with react

### Images

- if you import an image into a file, react auto creates the path
- NextJS you have to access the imported file via .src
- remember when importing if you use the alias @ in the import path (jsconfig.json) it is absolute path from root folder eg. @/assets/logo.png
- NOTE: `<img>` element is standard html here... we will later use NextJs `<Image>` component see lesson 100

```js
//app/components/main-header.js

import Link from "next/link";
import logoImg from "@/assets/logo.png";

export default function MainHeader() {
  return (
    <header>
      <Link href="/">
        <img src={logoImg.src} alt="food" />
        Food logo
      </Link>

      <nav>
        <ul>
          <li>
            <Link href="/meals">Browse Meals</Link>
          </li>
          <li>
            <Link href="/community">Food Community</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
```

```js
import MainHeader from '@components/main-header';

//app/layout.js
export default function ExampleLayout({children}){
  return <>
    <MainHeader/>
    {children}
  <>
}

```

## 99. Styling Nextjs
- options: tailwind or cssmodules
- see lesson ## 21. CSS Modules
- if you name your css .module.css (classes are scoped),
- every class in the css file will be accessible via the import object as a property

```css
/* components/main-header.module.css */
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 1rem;
}
```

```js
import classes from './main-header.module.css';

export default function Test(){
  return (
    <>
      <div className={classes.header}>Hi</div>
    </>
  );
}

```

### 100. Optimizing Images with Nextjs <Image> component
- https://nextjs.org/docs/app/api-reference/components/image
- Nextjs has an Image component which assists with optimizing images
- optimizations: eg. auto lazy loading under-the-hood -> only display image if really visible on page
- note: the Image src prop is assigned the object imported... 
- Image has loading="lazy" automatically added
- width and height is inferred
- srcset attribute added ensuring different sized images are loaded depending on viewport/device
- serve in best image format eg. .webp when using chrome
- priority property -> to tell nextjs to load image as quickly as possible

### Image vs img
- see lesson ## 98. adding a custom component -> Images where an `<img>` element is used
- difference between using img element: using `<img>` you assign src="" the imported object.src 

```js
import Image from 'next/image';
import logoImg from '@assets/logo.png';

// ...
<Image src={logoImg} priority/>    //note: assign the full object imported (and not the .src property (logoImg.src)
```

## 101. using more custom components
- PRACTICE LESSON... (NOTHING NEW)
- here you create a custom components/main-header/main-header-background.js component 
- and refactor some of the css into css module
- in main-header.js: import MainHeaderBackground from "./main-header-background"; 
- main-header-background: return the background svg wrapped in `<div className={classes['header-background']}>`

## 102. populating the starting content
- PRACTICE LESSON... (NOTHING NEW)
- editing app/page.js
- div: creating a image slideshow 
- div: a hero div with some text 
- div: call-to-action with some links 
- add app/page.module.css

## 103. preparing image slideshow
- nextjs working with `<Image>`
- components/images/image-slideshow.js
- components/images/image-slideshow.module.css
- NOTE: image-slideshow is importing with `import x from '@assets/x.jpg';`
- then an image array is created referencing the imports
- image-slideshow then creates Image element for each item in array
- useState to keep track of index in array, 
- useEffect called once that creates const interval = setInterval(()=>{}) 
- setInterval that updates this useState() index calling useState's set method
- the set method has a method that just checks if current index is lower than the array length, if so +1 else set index to 0
- make sure to add cleanup function by return ()=>{//clearInterval(interval)}

### ERROR ERROR ERROR!
- note you get an error from above (react server component error - you're importing a component that needs useState. it only works in a client component, but none of its parents are marked with "use client", so they're Server components by default)

## 104. React Server components vs Client Components
- by default in nextjs all components are server side components (rendered on server)
- you can see the difference by testing if your console.logs show in browser or cmd/terminal (where you run the project)
- SO even tho everything is server components, you can still render it as a client-side components...
- and these need to be client-side components:
  - react hooks are a client-side concept
  - event handlers are client-side concept

### 'use client'
- if you want to build a client-side component have to declare 'use client'; (at top of file): 

```js
'use client'; 
```
## 105. creating NavLink -> using client components efficiently
- /app/community/page.js
- /app/community/page.module.css

### usePathname -> getting active path to set active Link class
- externalize Link to NavLink component so only that part is client-side component...
- NEXTJS usePathname hook
- NOTE: usePathname is a hook (this should ring a bell ...DING!! -> SERVER COMPONENT requires 'use client';)
- NOTE: you want to add 'use client'; as far down the component tree as possible SOLUTION -> create a components/nav-link.js (NavLink)
- getting active path so you can set the class
- use path to test if it startsWith (nested pages) eg '/meals' OR equals string match
- if it does then you know it should be active

```js
//app/components/main-header/main-header.js
import NavLink from './nav-link';

//...
return (<nav>
    <NavLink href="/meals">Browse Meals</NavLink>
    <NavLink href="/community">Community</NavLink>
  </nav>
)
```

```js
//components/main-header/nav-link.js
'use client';

import {usePathname} from 'next/navigation';
import Link from 'next/link';
import classes from './nav-link.module.css';

export default function NavLink({href, children}){
  const path = usePathname();
  return (
    <Link 
      href={href}
      className={path.startsWith(href) ? classes.active : undefined}
    >
      {children}
    </Link>
  );
}
```















---
# Section 04 - Routing and Page Rendering - Deep Dive

# Section 05 - Data Fetching - Deep Dive

# Section 06 - Mutating Data - Deep Dive

# Section 07 - Understanding & Configuring caching

# Section 08 - NextJs app optimizations

# Section 09 - user authentication

# Section 10 - round up and next steps

# Section 11 - Pages & File-based routing

# Section 12 - Project Time: working with file-based routing

# Section 13 - page pre-rendering and data-fetching

# Section 14 - project time: page pre-rendering & data-fetching

# Section 15 - optimizing Next.js apps

//FULL STACK REACT

# Section 16 - adding backend code with API Routes (fullstack react)

# Section 17 - Project time: API Routes

# Section 18 - App-wide state (react context)

# Section 19 - complete app example (build a full blog A-Z)

# Section 20 - Deploying Nextjs apps

# Section 21 - Adding Authentication

# Section 22 - Optional Nextjs Summary

# Section 23 - Course Roundup
