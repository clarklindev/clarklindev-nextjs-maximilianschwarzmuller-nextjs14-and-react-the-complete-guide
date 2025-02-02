// export function GET(request) {
//   console.log(request);
//   return new Response("hello");
// }
// export function POST(request){}
// export function PATCH(request){}
// export function PUT(request){}
// export function DELETE(request){}

import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const result =
      await sql`CREATE TABLE Pets ( Name varchar(255), Owner varchar(255) );`;
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
