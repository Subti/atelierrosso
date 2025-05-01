import React from "react";
import "../css/Menu.css";

const Menu = () => {
  return (
    <div className="menu-page">
      <div className="menu-container">
        {/* Pastries Menu */}
        <div className="menu-section">
          <h1 className="menu-title">
            <span className="line"></span>
            Pastries
            <span className="line"></span>
          </h1>
          <ul>
            <li>
              <span className="item">Plain Croissant</span>
              <span className="price">$3.00</span>
            </li>
            <li>
              <span className="item">Zaatar Croissant</span>
              <span className="price">$4.00</span>
            </li>
            <li>
              <span className="item">Cheese Croissant</span>
              <span className="price">$4.50</span>
            </li>
            <li>
              <span className="item">Chocolatine</span>
              <span className="price">$4.50</span>
            </li>
            <li>
              <span className="item">Almond Croissant</span>
              <span className="price">$4.50</span>
            </li>
            <li>
              <span className="item">Pistachio Croissant</span>
              <span className="price">$4.50</span>
            </li>
            <li>
              <span className="item">Coffee Bun</span>
              <span className="price">$4.50</span>
            </li>
            <li>
              <span className="item">Cinnamon Roll</span>
              <span className="price">$4.50</span>
            </li>
            <li>
              <span className="item">Cookie Croissant</span>
              <span className="price">$4.50</span>
            </li>
            <li>
              <span className="item">Kunafah Croissant</span>
              <span className="price">$8.00</span>
            </li>
          </ul>
        </div>

        {/* Desserts Menu */}
        <div className="menu-section">
          <h1 className="menu-title">
            <span className="line"></span>
            Desserts
            <span className="line"></span>
          </h1>
          <ul>
            <li>
              <span className="item">Donut</span>
              <span className="price">$3.50</span>
            </li>
            <li>
              <span className="item">Muffin</span>
              <span className="price">$5.50</span>
            </li>
            <li>
              <span className="item">Cake Slice</span>
              <span className="price">$5.50</span>
            </li>
            <li>
              <span className="item">Flat Croissant</span>
              <span className="price">$6.25</span>
            </li>
            <li>
              <span className="item">Tiramisu</span>
              <span className="price">$5.50</span>
            </li>
            <li>
              <span className="item">Cannoli</span>
              <span className="price">$4.50</span>
            </li>
            <li>
              <span className="item">Canelé</span>
              <span className="price">$2.00</span>
            </li>
            <li>
              <span className="item">Mini Cannolis (8pc)</span>
              <span className="price">$7.99</span>
            </li>
            <li>
              <span className="item">Assorted Crêpes</span>
              <span className="price">$13.99</span>
            </li>
            <li>
              <span className="item">Assorted Baklava</span>
              <span className="price">$13.99</span>
            </li>
          </ul>
        </div>

        {/* Drinks Menu */}
        <div className="menu-section">
          <h1 className="menu-title">
            <span className="line"></span>
            Drinks
            <span className="line"></span>
          </h1>
          <ul>
            <li>
              <span className="item">Espresso</span>
              <span className="price">$2.00</span>
            </li>
            <li>
              <span className="item">Long Espresso</span>
              <span className="price">$2.00</span>
            </li>
            <li>
              <span className="item">Americano</span>
              <span className="price">$2.00</span>
            </li>
            <li>
              <span className="item">Latte</span>
              <span className="price">$3.00</span>
            </li>
            <li>
              <span className="item">Cappuccino</span>
              <span className="price">$3.00</span>
            </li>
            <li>
              <span className="item">Mochaccino</span>
              <span className="price">$3.00</span>
            </li>
            <li>
              <span className="item">French Vanilla</span>
              <span className="price">$3.00</span>
            </li>
            <li>
              <span className="item">Hot Chocolate</span>
              <span className="price">$3.00</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Menu;