import Category from "@/models/categoryModel";
import databaseConnection from "@/lib/dbConfig";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        databaseConnection();
        const categories = await Category.find({});
        return NextResponse.json({ message:"Categories fetched successfully", categories }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}