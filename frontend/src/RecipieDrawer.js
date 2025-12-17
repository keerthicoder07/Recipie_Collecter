import React, { useState } from 'react';
import './RecipieDrawer.css';

const RecipeDrawer = ({ recipe, isOpen, onClose }) => {
    const [showTimeDetails, setShowTimeDetails] = useState(false);

    if (!isOpen || !recipe) return null;

    return (
        <>
            <div className="drawer-overlay" onClick={onClose}></div>
            <div className={`drawer ${isOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <div>
                        <h2>{recipe.title}</h2>
                        <p className="cuisine-badge">{recipe.cuisine}</p>
                    </div>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="drawer-content">
                    {/* Description */}
                    <div className="detail-section">
                        <label>Description:</label>
                        <p>{recipe.description || 'No description available'}</p>
                    </div>

                    {/* Total Time with Expand */}
                    <div className="detail-section">
                        <div className="expandable-header" onClick={() => setShowTimeDetails(!showTimeDetails)}>
                            <label>Total Time: {recipe.total_time ? `${recipe.total_time} min` : 'N/A'}</label>
                            <span className={`expand-icon ${showTimeDetails ? 'open' : ''}`}>▼</span>
                        </div>
                        {showTimeDetails && (
                            <div className="time-details">
                                <p>Cook Time: {recipe.cook_time ? `${recipe.cook_time} min` : 'N/A'}</p>
                                <p>Prep Time: {recipe.prep_time ? `${recipe.prep_time} min` : 'N/A'}</p>
                            </div>
                        )}
                    </div>

                    {/* Nutrition Section */}
                    <div className="detail-section nutrition-section">
                        <h3>Nutrition Information</h3>
                        <table className="nutrition-table">
                            <tbody>
                                <tr>
                                    <td>Calories</td>
                                    <td>{recipe.nutrients?.calories || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td>Carbohydrates</td>
                                    <td>{recipe.nutrients?.carbohydrateContent || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td>Cholesterol</td>
                                    <td>{recipe.nutrients?.cholesterolContent || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td>Fiber</td>
                                    <td>{recipe.nutrients?.fiberContent || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td>Protein</td>
                                    <td>{recipe.nutrients?.proteinContent || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td>Saturated Fat</td>
                                    <td>{recipe.nutrients?.saturatedFatContent || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td>Sodium</td>
                                    <td>{recipe.nutrients?.sodiumContent || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td>Sugar</td>
                                    <td>{recipe.nutrients?.sugarContent || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td>Fat</td>
                                    <td>{recipe.nutrients?.fatContent || 'N/A'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RecipeDrawer;
