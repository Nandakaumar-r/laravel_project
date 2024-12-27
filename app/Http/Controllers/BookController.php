<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    // Fetch all books
    public function index()
    {
        $books = Book::all();
        return response()->json($books);
    }

    // Store a new book
    public function store(Request $request)
    {
        $book = new Book;
        $book->title = $request->title;
        $book->author = $request->author;
        $book->description = $request->description;
        $book->save();
        return response()->json([
            "message" => "Book Added Successfully."
        ], 201);
    }

    // Show a single book by ID
    public function show($id)
    {
        $book = Book::find($id);
        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }
        return response()->json($book);
    }

    // Update an existing book by ID
    public function update(Request $request, $id)
    {
        $book = Book::find($id);
        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }
        $request->validate([
            'title' => 'string|max:255',
            'author' => 'string|max:255',
            'published_date' => 'date',
        ]);

        $book->update($request->all());
        return response()->json($book);
    }

    // Delete a book by ID
    public function destroy($id)
    {
        $book = Book::find($id);

        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }

        $book->delete();
        return response()->json(['message' => 'Book deleted successfully'], 200);
    }
}
