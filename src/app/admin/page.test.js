import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminPage from './page';

const mockMovies = [
  { id: '1', title: 'Avatar', releaseYear: 2009, rating: 7.9 },
  { id: '2', title: 'The Avengers', releaseYear: 2012, rating: 8.0 },
  { id: '3', title: 'Jurassic World', releaseYear: 2015, rating: 6.9 },
];

jest.mock('./_components/add-movie-form', () => ({ AddMovieForm: () => <button>Add New Movie</button> }));
jest.mock('./_components/logout-button', () => ({ LogoutButton: () => <button>Logout</button> }));
jest.mock('./_components/pagination-controls', () => ({ PaginationControls: () => <div>Pagination</div> }));

jest.mock('./_components/movies-table', () => ({ 
    MoviesTable: ({ movies, onSort }) => (
        <div>
            {}
            <button data-testid="sort-by-rating" onClick={() => onSort('rating', 'asc')}>Sort by Rating Asc</button>
            <button data-testid="sort-by-rating-desc" onClick={() => onSort('rating', 'desc')}>Sort by Rating Desc</button>
            
            <div data-testid="movies-table">
                {movies.map(movie => <div key={movie.id}>{movie.title}</div>)}
            </div>
        </div>
    )
}));


jest.mock('firebase/firestore', () => ({
    getDocs: () => Promise.resolve({
        docs: mockMovies.map(movie => ({
            id: movie.id,
            data: () => movie
        }))
    }),
    collection: jest.fn(),
    query: jest.fn(),
    orderBy: jest.fn(),
}));

describe('AdminPage', () => {

  it('should render and display movies fetched from firestore', async () => {
    render(<AdminPage />);
    expect(await screen.findByText('Avatar')).toBeInTheDocument();
    expect(screen.getByText('The Avengers')).toBeInTheDocument();
    expect(screen.getByText('Jurassic World')).toBeInTheDocument();
  });

  it('should filter movies based on search input', async () => {
    render(<AdminPage />);
    await screen.findByText('Avatar');

    const searchInput = screen.getByPlaceholderText('Search by title...');
    fireEvent.change(searchInput, { target: { value: 'aven' } });

    expect(screen.getByText('The Avengers')).toBeInTheDocument();
    expect(screen.queryByText('Avatar')).not.toBeInTheDocument();
    expect(screen.queryByText('Jurassic World')).not.toBeInTheDocument();
  });


  it('should sort movies when sort button is clicked', async () => {
    
    render(<AdminPage />);
    await screen.findByText('Avatar'); 

    
    const sortButtonAsc = screen.getByTestId('sort-by-rating');
    fireEvent.click(sortButtonAsc);


    await waitFor(() => {
        const movies = screen.getAllByTestId('movies-table')[0].children;
        expect(movies[0].textContent).toBe('Jurassic World');
        expect(movies[1].textContent).toBe('Avatar');
        expect(movies[2].textContent).toBe('The Avengers');
    });

    
    const sortButtonDesc = screen.getByTestId('sort-by-rating-desc');
    fireEvent.click(sortButtonDesc);


    await waitFor(() => {
        const movies = screen.getAllByTestId('movies-table')[0].children;
        expect(movies[0].textContent).toBe('The Avengers');
        expect(movies[1].textContent).toBe('Avatar');
        expect(movies[2].textContent).toBe('Jurassic World');
    });
  });
});