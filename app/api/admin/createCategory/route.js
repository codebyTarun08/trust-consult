import Category from "@/models/categoryModel";
import databaseConnection from "@/lib/dbConfig";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { name, description } = await request.json();

    try {
        databaseConnection();
       // console.log(name, description);
        if(!name || !description){
            return NextResponse.json({ error: "Name and Description are required" }, { status: 400 });
        }
        const newCategory = new Category({
            name,
            description
        });

        await newCategory.save();

        return NextResponse.json({ message: "Category created successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}
