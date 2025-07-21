import MoviesModals from "./_components/movies-modals";

export const metadata = {
  title: "Movie Detail",
};

export default function MovieDetailLayout({ children }) {
  return (
    <>
      <div className="px-8 lg:px-32 py-8 lg:py-32">{children}</div>
      <MoviesModals />
    </>
  );
}
