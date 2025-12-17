import React, { useState, useEffect } from 'react';
import api from './api';
import RecipeDrawer from './RecipieDrawer';
import './RecipieTable.css';

const RecipeTable = () => {
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [total, setTotal] = useState(0);
    
    const [filters, setFilters] = useState({
        title: '',
        cuisine: '',
        rating_gte: '',
        rating_lte: '',
        total_time_lte: '',
        calories_lte: ''
    });

    useEffect(() => {
        fetchRecipes();
    }, [page, pageSize]);

    const fetchRecipes = async () => {
    setLoading(true);
    try {
        const params = {
            page: page,
            size: pageSize
        };
        
        // Check if any filter has a value
        const hasFilters = Object.values(filters).some(v => v !== '');
        
        // Use search endpoint if filters exist, otherwise use basic endpoint
        const endpoint = hasFilters ? '/api/recipies/search' : '/api/recipies';
        
        // Add filters only if using search endpoint
        if (hasFilters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== '') {
                    params[key] = value;
                }
            });
        }
        
        const response = await api.get(endpoint, { params });
        setRecipes(response.data.items);
        setTotal(response.data.total);
        setLoading(false);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        setLoading(false);
    }
};


    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleSearch = () => {
        setPage(1);
        fetchRecipes();
    };

    const handleRowClick = (recipe) => {
        setSelectedRecipe(recipe);
        setIsDrawerOpen(true);
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<span key={i} className="star filled">★</span>);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<span key={i} className="star half">★</span>);
            } else {
                stars.push(<span key={i} className="star empty">☆</span>);
            }
        }
        return <div className="rating-stars">{stars}</div>;
    };

    if (loading && recipes.length === 0) {
        return <div className="loading">Loading recipes...</div>;
    }

    return (
        <div className="recipe-container">
            <h1>Recipe Collection</h1>
            
            {/* Filter Section */}
            <div className="filters">
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={filters.title}
                    onChange={(e) => handleFilterChange('title', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Cuisine..."
                    value={filters.cuisine}
                    onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Min Rating"
                    value={filters.rating_gte}
                    onChange={(e) => handleFilterChange('rating_gte', e.target.value)}
                    min="0"
                    max="5"
                    step="0.1"
                />
                <input
                    type="number"
                    placeholder="Max Time (min)"
                    value={filters.total_time_lte}
                    onChange={(e) => handleFilterChange('total_time_lte', e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Max Calories"
                    value={filters.calories_lte}
                    onChange={(e) => handleFilterChange('calories_lte', e.target.value)}
                />
                <button onClick={handleSearch} className="search-btn">Search</button>
            </div>

            {/* Results Info */}
            <div className="results-info">
                <span>Total Recipes: {total}</span>
                <select 
                    value={pageSize} 
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(1);
                    }}
                >
                    <option value="15">15 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                </select>
            </div>

            {/* Table */}
            {recipes.length === 0 ? (
                <div className="no-results">
                    <h2>Nice to Have</h2>
                    
                </div>
            ) : (
                <table className="recipe-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Cuisine</th>
                            <th>Rating</th>
                            <th>Total Time</th>
                            <th>Serves</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recipes.map((recipe) => (
                            <tr key={recipe.id} onClick={() => handleRowClick(recipe)}>
                                <td className="title-cell" title={recipe.title}>
                                    {recipe.title}
                                </td>
                                <td>{recipe.cuisine}</td>
                                <td>{renderStars(recipe.rating)}</td>
                                <td>{recipe.total_time ? `${recipe.total_time} min` : 'N/A'}</td>
                                <td>{recipe.serves}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Pagination */}
            <div className="pagination">
                <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span>Page {page} of {Math.ceil(total / pageSize)}</span>
                <button 
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= Math.ceil(total / pageSize)}
                >
                    Next
                </button>
            </div>

            {/* Drawer */}
            <RecipeDrawer 
                recipe={selectedRecipe}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </div>
    );
};

export default RecipeTable;
