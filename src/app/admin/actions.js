// "use server";

// import { revalidatePath } from "next/cache";

// import { collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore"; 
// import getFirebaseConfig from "@/firebase/config";
// import { z } from "zod";

// const { db } = getFirebaseConfig();

// const movieSchema = z.object({
//   title: z.string().min(5, "Title must be at least 5 characters"),
//   description: z.string().min(10, "Description is required"),
//   coverUrl: z.string().url("Must be a valid URL"),
//   bannerUrl: z.string().url("Must be a valid URL"),
//   duration: z.coerce.number().gt(0, "Duration must be greater than 0"),
//   rating: z.coerce.number().gte(0).lte(10, "Rating must be between 0 and 10"),
//   releaseYear: z.coerce.number().gt(1800),
//   genres: z.string().min(1, "At least one genre is required"),
// });


// export async function addMovie(prevState, formData) {
//   const validatedFields = movieSchema.safeParse({
//     title: formData.get("title"),
//     description: formData.get("description"),
//     coverUrl: formData.get("coverUrl"),
//     bannerUrl: formData.get("bannerUrl"),
//     duration: formData.get("duration"),
//     rating: formData.get("rating"),
//     releaseYear: formData.get("releaseYear"),
//     genres: formData.get("genres"),
//   });

//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//     };
//   }

//   try {
//     const genresArray = validatedFields.data.genres.split(",").map((g) => g.trim());
//     const movieData = {
//       ...validatedFields.data,
//       genres: genresArray,
//     };

//     await addDoc(collection(db, "movies"), movieData);

//     revalidatePath("/admin");
//     return { message: "Movie added successfully." };
//   } catch (e) {
//     return { message: "Failed to add movie." };
//   }
// }

// export async function deleteMovie(movieId) {
//   try {
//     if (!movieId) throw new Error("Movie ID is required.");
//     await deleteDoc(doc(db, "movies", movieId));

//     revalidatePath("/admin");
//     return { message: "Movie deleted successfully." };
//   } catch (e) {
//     return { message: "Failed to delete movie." };
//   }
// }


// export async function editMovie(prevState, formData) {
//   const movieId = formData.get("movieId");
//   if (!movieId) return { message: "Movie ID is missing." };

//   const validatedFields = movieSchema.safeParse({
//     title: formData.get("title"),
//     description: formData.get("description"),
//     coverUrl: formData.get("coverUrl"),
//     bannerUrl: formData.get("bannerUrl"),
//     duration: formData.get("duration"),
//     rating: formData.get("rating"),
//     releaseYear: formData.get("releaseYear"),
//     genres: formData.get("genres"),
//   });

//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//     };
//   }

//   try {
//     const genresArray = validatedFields.data.genres.split(",").map((g) => g.trim());
//     const movieData = {
//       ...validatedFields.data,
//       genres: genresArray,
//     };

//     const movieRef = doc(db, "movies", movieId);
//     await updateDoc(movieRef, movieData);

//     revalidatePath("/admin");
//     return { message: "Movie updated successfully." };
//   } catch (e) {
//     return { message: "Failed to update movie." };
//   }
// }

"use server";

import { revalidatePath } from "next/cache";
import { collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import getFirebaseConfig from "@/firebase/config";
import { z } from "zod";

const { db } = getFirebaseConfig();

const movieSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description is required"),
  coverUrl: z.string().url("Must be a valid URL"),
  bannerUrl: z.string().url("Must be a valid URL"),
  duration: z.coerce.number().gt(0, "Duration must be greater than 0"),
  rating: z.coerce.number().gte(0).lte(10, "Rating must be between 0 and 10"),
  releaseYear: z.coerce.number().gt(1800),
  genres: z.array(z.string()).min(1, "At least one genre is required"),
});

export async function addMovie(prevState, formData) {
  const validatedFields = movieSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    coverUrl: formData.get("coverUrl"),
    bannerUrl: formData.get("bannerUrl"),
    duration: formData.get("duration"),
    rating: formData.get("rating"),
    releaseYear: formData.get("releaseYear"),
    genres: JSON.parse(formData.get("genres")),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await addDoc(collection(db, "movies"), validatedFields.data);
    revalidatePath("/admin");
    return { message: "Movie added successfully." };
  } catch (e) {
    return { message: "Failed to add movie." };
  }
}

export async function deleteMovie(movieId) {
  try {
    if (!movieId) throw new Error("Movie ID is required.");
    await deleteDoc(doc(db, "movies", movieId));
    revalidatePath("/admin");
    return { message: "Movie deleted successfully." };
  } catch (e) {
    return { message: "Failed to delete movie." };
  }
}

export async function editMovie(prevState, formData) {
  const movieId = formData.get("movieId");
  if (!movieId) return { message: "Movie ID is missing." };

  const validatedFields = movieSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    coverUrl: formData.get("coverUrl"),
    bannerUrl: formData.get("bannerUrl"),
    duration: formData.get("duration"),
    rating: formData.get("rating"),
    releaseYear: formData.get("releaseYear"),
    genres: JSON.parse(formData.get("genres")),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const movieRef = doc(db, "movies", movieId);
    await updateDoc(movieRef, validatedFields.data);
    revalidatePath("/admin");
    return { message: "Movie updated successfully." };
  } catch (e) {
    return { message: "Failed to update movie." };
  }
}