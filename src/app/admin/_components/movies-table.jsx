"use client";

import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteMovie } from "../actions";
import { toast } from "sonner";
import { EditMovieForm } from "./edit-movie-form";
import { MoreHorizontal, Star, Trash2 } from "lucide-react";

export function MoviesTable({ movies }) {
  const handleDelete = async (movieId, movieTitle) => {
    const result = await deleteMovie(movieId);
    if(result.message?.includes("successfully")){
        toast.success(`Movie "${movieTitle}" deleted successfully.`);
    } else {
        toast.error(result.message);
    }
  };

  return (
    <>
      <div className="hidden md:block border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Genres</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movies.map((movie) => (
              <TableRow key={movie.id}>
                <TableCell>
                  <div className="relative h-16 w-11">
                      <Image 
                          src={movie.coverUrl} 
                          alt={movie.title} 
                          fill 
                          className="rounded-sm object-cover"
                      />
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div>{movie.title}</div>
                  <div className="text-sm text-muted-foreground">{movie.releaseYear}</div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {movie.genres.map((genre) => (
                      <Badge key={genre} variant="outline">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span>{movie.rating}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild><EditMovieForm movie={movie} /></DropdownMenuItem>
                          <AlertDialog>
                              <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">Delete</DropdownMenuItem></AlertDialogTrigger>
                              <AlertDialogContent>
                                  <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete "{movie.title}".</AlertDialogDescription></AlertDialogHeader>
                                  <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(movie.id, movie.title)}>Continue</AlertDialogAction></AlertDialogFooter>
                              </AlertDialogContent>
                          </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden grid grid-cols-1 gap-4">
        {movies.map((movie) => (
          <div key={movie.id} className="border rounded-lg p-4 flex gap-4 items-start">
            <div className="relative h-24 w-16 flex-shrink-0">
              <Image 
                src={movie.coverUrl} 
                alt={movie.title} 
                fill 
                className="rounded-sm object-cover"
              />
            </div>
            <div className="flex-grow">
              <p className="font-semibold">{movie.title}</p>
              <p className="text-sm text-muted-foreground">{movie.releaseYear}</p>
              <div className="flex items-center gap-1 mt-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm">{movie.rating}</span>
              </div>
            </div>
            <div className="flex-shrink-0">
               <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild><EditMovieForm movie={movie} /></DropdownMenuItem>
                      <AlertDialog>
                          <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">Delete</DropdownMenuItem></AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete "{movie.title}".</AlertDialogDescription></AlertDialogHeader>
                              <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(movie.id, movie.title)}>Continue</AlertDialogAction></AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}