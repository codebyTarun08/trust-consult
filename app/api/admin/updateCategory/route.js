import Category from "@/models/categoryModel";
import databseConnection from "@/lib/dbConfig";
import { NextResponse } from "next/server";

export async function PUT(request) {
  const { id, description } = await request.json();

  try {
    await databseConnection();
    if(!id || !description){
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }
    category.description = description;
    await category.save();

    return NextResponse.json({ message: "Category updated successfully" });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ message: "Error updating category" }, { status: 500 });
  }
}
