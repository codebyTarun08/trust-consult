import Category from "@/models/categoryModel";
import databaseConnection from "@/lib/dbConfig";
import { NextResponse } from "next/server";

export async function PATCH(request) {
    const { id } = await request.json();
    try {
        databaseConnection();
        const updatedCategory = await Category.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!updatedCategory) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Category deactivated successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to deactivate category" }, { status: 500 });
    }
}
