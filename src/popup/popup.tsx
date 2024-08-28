import React from 'react';
import { createRoot } from 'react-dom/client';
import "./popup.css";

const test = <p>Hello World!</p>;

const rootElement = document.createElement('div');
document.body.appendChild(rootElement);

const root = createRoot(rootElement);
root.render(test);

